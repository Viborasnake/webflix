/**
 * WebFlix pitch sync bus — multi-ubicación
 * ─────────────────────────────────────────────
 * DECK publica estado (slide + timer).
 * NOTAS escuchan; browse libre es local.
 * NOTAS en control envían COMMANDS al deck.
 * CONTROL exclusivo entre notas (claim/release/clear).
 *
 * Transportes (en paralelo):
 *  1) BroadcastChannel + localStorage → misma máquina / pestañas
 *  2) MQTT público (Internet) → ubicaciones distintas  ✅
 *  3) PeerJS (opcional, refuerzo misma red)
 *
 * URL: ?room=CODIGO-UNICO&name=Tami
 * Todos deben usar el MISMO room.
 */
(function (global) {
  const CHANNEL = "webflix-pitch-sync-v3";
  const STORAGE_KEY = "webflix-pitch-state-v3";
  const COMMAND_KEY = "webflix-pitch-cmd-v3";
  const CONTROL_KEY = "webflix-pitch-control-v3";
  /** Room por defecto del equipo (cámbialo si hay interferencia) */
  const DEFAULT_ROOM = "webflix-grupo5-eep";
  const MQTT_CDN = "https://unpkg.com/mqtt@5.10.4/dist/mqtt.min.js";
  const PEER_CDN = "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js";
  const MQTT_URLS = [
    "wss://broker.emqx.io:8084/mqtt",
    "wss://broker.hivemq.com:8884/mqtt",
  ];

  function roomFromUrl() {
    try {
      const q = new URLSearchParams(global.location.search);
      const r = (q.get("room") || DEFAULT_ROOM)
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "");
      return r || DEFAULT_ROOM;
    } catch (_) {
      return DEFAULT_ROOM;
    }
  }

  function peerIdForRoom(room) {
    // PeerJS global: debe ser único
    return "wfxdeck-" + room.replace(/[^a-z0-9]/gi, "").slice(0, 40);
  }

  function topics(room) {
    const base = "webflix/" + room;
    return {
      state: base + "/state",
      cmd: base + "/cmd",
      control: base + "/control",
    };
  }

  function loadScript(src, globalName) {
    if (globalName && global[globalName]) {
      return Promise.resolve(global[globalName]);
    }
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve(globalName ? global[globalName] : true);
      s.onerror = () => reject(new Error("Fail load " + src));
      document.head.appendChild(s);
    });
  }

  function createBus(role) {
    const room = roomFromUrl();
    const T = topics(room);
    const stateListeners = new Set();
    const commandListeners = new Set();
    const controlListeners = new Set();
    let latest = null;
    let latestControl = null;
    let channel = null;
    let mqttClient = null;
    let mqttReady = false;
    let peer = null;
    let peerReady = false;
    /** @type {Set<any>} */
    const peerConns = new Set();
    let status = "init";
    const statusListeners = new Set();
    let lastCmdTs = 0;
    let lastCmdNonce = "";
    let lastControlTs = 0;
    let lastControlNonce = "";
    let lastStateTs = 0;

    function makeNonce() {
      return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
    }

    try {
      channel = new BroadcastChannel(CHANNEL + ":" + room);
    } catch (_) {
      channel = null;
    }

    function setStatus(next) {
      status = next;
      statusListeners.forEach((fn) => {
        try {
          fn(status, { room, role, mqtt: mqttReady, peer: peerReady });
        } catch (_) { /* ignore */ }
      });
    }

    function fanoutPeer(payload) {
      peerConns.forEach((conn) => {
        if (conn.open) {
          try {
            conn.send(payload);
          } catch (_) { /* ignore */ }
        }
      });
    }

    function mqttPublish(topic, payload) {
      if (!mqttClient || !mqttReady) return;
      try {
        mqttClient.publish(topic, JSON.stringify(payload), { qos: 0, retain: topic === T.state });
      } catch (_) { /* ignore */ }
    }

    function emitState(state, meta) {
      if (!state || typeof state.slide !== "number") return;
      if (state.source && state.source !== "deck") return;
      if (state.ts && lastStateTs && state.ts < lastStateTs) return;
      if (state.ts) lastStateTs = state.ts;
      latest = state;
      stateListeners.forEach((fn) => {
        try {
          fn(state, meta || { via: "unknown" });
        } catch (_) { /* ignore */ }
      });
    }

    function emitCommand(cmd, meta) {
      if (!cmd || !cmd.cmd) return;
      if (cmd.room && cmd.room !== room) return;
      if (cmd.ts && lastCmdTs && cmd.ts < lastCmdTs) return;
      if (cmd.ts && cmd.ts === lastCmdTs && cmd.nonce && cmd.nonce === lastCmdNonce) return;
      if (cmd.ts) lastCmdTs = cmd.ts;
      if (cmd.nonce) lastCmdNonce = cmd.nonce;
      commandListeners.forEach((fn) => {
        try {
          fn(cmd, meta || { via: "unknown" });
        } catch (_) { /* ignore */ }
      });
    }

    function emitControl(ctrl, meta) {
      if (!ctrl || !ctrl.action) return;
      if (ctrl.room && ctrl.room !== room) return;
      if (ctrl.ts && lastControlTs && ctrl.ts < lastControlTs) return;
      if (
        ctrl.ts &&
        ctrl.ts === lastControlTs &&
        ctrl.nonce &&
        ctrl.nonce === lastControlNonce
      ) {
        return;
      }
      if (ctrl.ts) lastControlTs = ctrl.ts;
      if (ctrl.nonce) lastControlNonce = ctrl.nonce;
      latestControl = ctrl;
      controlListeners.forEach((fn) => {
        try {
          fn(ctrl, meta || { via: "unknown" });
        } catch (_) { /* ignore */ }
      });
    }

    function handleIncoming(data, via) {
      if (!data || !data.type) return;
      if (data.type === "state") emitState(data, { via });
      if (data.type === "command" && role === "deck") emitCommand(data, { via });
      if (data.type === "control" && role === "notes") emitControl(data, { via });
      // Deck no necesita control UI; reenvía por peer si aplica
      if (data.type === "control" && role === "deck") {
        fanoutPeer(data);
      }
    }

    function readStorage(key) {
      try {
        const raw = localStorage.getItem(key + ":" + room);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (_) {
        return null;
      }
    }

    function writeStorage(key, obj) {
      try {
        localStorage.setItem(key + ":" + room, JSON.stringify(obj));
      } catch (_) { /* private mode */ }
    }

    if (channel) {
      channel.onmessage = (ev) => handleIncoming(ev.data, "broadcast");
    }

    global.addEventListener("storage", (e) => {
      if (!e.newValue) return;
      if (e.key === STORAGE_KEY + ":" + room) {
        try {
          handleIncoming(JSON.parse(e.newValue), "storage");
        } catch (_) { /* ignore */ }
      }
      if (e.key === COMMAND_KEY + ":" + room && role === "deck") {
        try {
          handleIncoming(JSON.parse(e.newValue), "storage");
        } catch (_) { /* ignore */ }
      }
      if (e.key === CONTROL_KEY + ":" + room && role === "notes") {
        try {
          handleIncoming(JSON.parse(e.newValue), "storage");
        } catch (_) { /* ignore */ }
      }
    });

    const boot = readStorage(STORAGE_KEY);
    if (boot) latest = boot;
    const bootCtrl = readStorage(CONTROL_KEY);
    if (bootCtrl) latestControl = bootCtrl;

    function publish(state) {
      if (role !== "deck") return null;
      const payload = {
        ...state,
        type: "state",
        v: 3,
        source: "deck",
        room,
        ts: Date.now(),
      };
      latest = payload;
      lastStateTs = payload.ts;
      writeStorage(STORAGE_KEY, payload);
      if (channel) {
        try {
          channel.postMessage(payload);
        } catch (_) { /* ignore */ }
      }
      mqttPublish(T.state, payload);
      fanoutPeer(payload);
      setStatus(mqttReady ? "online" : peerConns.size ? "live" : "local");
      return payload;
    }

    function sendCommand(cmd, extra) {
      if (role !== "notes") return null;
      const payload = {
        type: "command",
        v: 3,
        source: "notes",
        room,
        cmd,
        ts: Date.now(),
        nonce: makeNonce(),
        ...extra,
      };
      if (channel) {
        try {
          channel.postMessage(payload);
        } catch (_) { /* ignore */ }
      }
      writeStorage(COMMAND_KEY, payload);
      mqttPublish(T.cmd, payload);
      fanoutPeer(payload);
      return payload;
    }

    function sendControl(action, extra) {
      if (role !== "notes") return null;
      const payload = {
        type: "control",
        v: 3,
        source: "notes",
        room,
        action,
        ts: Date.now(),
        nonce: makeNonce(),
        ...extra,
      };
      latestControl = payload;
      lastControlTs = payload.ts;
      lastControlNonce = payload.nonce;
      if (channel) {
        try {
          channel.postMessage(payload);
        } catch (_) { /* ignore */ }
      }
      writeStorage(CONTROL_KEY, payload);
      mqttPublish(T.control, payload);
      fanoutPeer(payload);
      return payload;
    }

    function subscribe(fn) {
      stateListeners.add(fn);
      if (latest) {
        try {
          fn(latest, { via: "bootstrap" });
        } catch (_) { /* ignore */ }
      }
      return () => stateListeners.delete(fn);
    }

    function onCommand(fn) {
      commandListeners.add(fn);
      return () => commandListeners.delete(fn);
    }

    function onControl(fn) {
      controlListeners.add(fn);
      if (latestControl) {
        try {
          fn(latestControl, { via: "bootstrap" });
        } catch (_) { /* ignore */ }
      }
      return () => controlListeners.delete(fn);
    }

    function onStatus(fn) {
      statusListeners.add(fn);
      fn(status, { room, role, mqtt: mqttReady, peer: peerReady });
      return () => statusListeners.delete(fn);
    }

    // ── MQTT (multi-ubicación) ──────────────────────
    async function startMqtt(urlIndex) {
      const idx = urlIndex || 0;
      if (idx >= MQTT_URLS.length) {
        console.warn("[webflix-sync] MQTT no disponible en ningún broker");
        setStatus(latest ? "local" : "wait");
        return;
      }
      try {
        await loadScript(MQTT_CDN, "mqtt");
        const mqtt = global.mqtt;
        if (!mqtt || !mqtt.connect) throw new Error("mqtt missing");

        const clientId =
          "wfx_" +
          role.slice(0, 1) +
          "_" +
          room.slice(0, 12) +
          "_" +
          Math.random().toString(16).slice(2, 8);

        const client = mqtt.connect(MQTT_URLS[idx], {
          clientId,
          clean: true,
          reconnectPeriod: 2500,
          connectTimeout: 12000,
          protocolVersion: 4,
        });

        mqttClient = client;

        client.on("connect", () => {
          mqttReady = true;
          console.info("[webflix-sync] MQTT online", MQTT_URLS[idx], "room=", room);
          // Suscripciones por rol
          if (role === "deck") {
            client.subscribe(T.cmd, { qos: 0 });
            client.subscribe(T.control, { qos: 0 });
          } else {
            client.subscribe(T.state, { qos: 0 });
            client.subscribe(T.control, { qos: 0 });
          }
          // Deck: re-publicar estado actual con retain para late joiners
          if (role === "deck" && latest) {
            mqttPublish(T.state, latest);
          }
          // Notes: pedir nada; state retained llega solo
          setStatus("online");
        });

        client.on("message", (topic, buf) => {
          try {
            const data = JSON.parse(String(buf));
            handleIncoming(data, "mqtt");
          } catch (_) { /* ignore */ }
        });

        client.on("reconnect", () => {
          mqttReady = false;
          setStatus("reconnect");
        });

        client.on("close", () => {
          mqttReady = false;
          setStatus(latest ? "local" : "wait");
        });

        client.on("error", (err) => {
          console.warn("[webflix-sync] MQTT error", err && err.message);
          try {
            client.end(true);
          } catch (_) { /* ignore */ }
          mqttClient = null;
          mqttReady = false;
          // Probar siguiente broker
          startMqtt(idx + 1);
        });
      } catch (e) {
        console.warn("[webflix-sync] MQTT load fail", e);
        startMqtt(idx + 1);
      }
    }

    // ── PeerJS (refuerzo) ───────────────────────────
    function wirePeerConn(conn) {
      peerConns.add(conn);
      conn.on("data", (data) => {
        if (!data) return;
        if (data.type === "state" && role === "notes") {
          emitState(data, { via: "peer" });
        }
        if (data.type === "command" && role === "deck") {
          emitCommand(data, { via: "peer" });
        }
        if (data.type === "control") {
          if (role === "deck") {
            peerConns.forEach((c) => {
              if (c !== conn && c.open) {
                try {
                  c.send(data);
                } catch (_) { /* ignore */ }
              }
            });
          }
          if (role === "notes") emitControl(data, { via: "peer" });
        }
        if (data.type === "hello" && role === "deck") {
          if (latest) {
            try {
              conn.send(latest);
            } catch (_) { /* ignore */ }
          }
        }
      });
      conn.on("close", () => peerConns.delete(conn));
      conn.on("error", () => peerConns.delete(conn));
      if (role === "deck" && latest && conn.open) {
        try {
          conn.send(latest);
        } catch (_) { /* ignore */ }
      }
      peerReady = true;
    }

    async function startPeer() {
      try {
        await loadScript(PEER_CDN, "Peer");
        const Peer = global.Peer;
        if (role === "deck") {
          peer = new Peer(peerIdForRoom(room), { debug: 0 });
          peer.on("open", () => {
            peerReady = true;
          });
          peer.on("connection", (conn) => {
            conn.on("open", () => wirePeerConn(conn));
          });
          peer.on("error", (err) => {
            console.warn("[webflix-sync] peer deck:", err && err.type);
          });
        } else {
          peer = new Peer({ debug: 0 });
          peer.on("open", () => {
            peerReady = true;
            const conn = peer.connect(peerIdForRoom(room), { reliable: true });
            conn.on("open", () => {
              wirePeerConn(conn);
              try {
                conn.send({ type: "hello", role: "notes" });
              } catch (_) { /* ignore */ }
            });
          });
          peer.on("error", () => { /* silent */ });
          setInterval(() => {
            if (!peerReady || peerConns.size > 0) return;
            try {
              const conn = peer.connect(peerIdForRoom(room), { reliable: true });
              conn.on("open", () => wirePeerConn(conn));
            } catch (_) { /* ignore */ }
          }, 5000);
        }
      } catch (_) { /* ignore */ }
    }

    startMqtt(0);
    startPeer();
    setStatus(latest ? "local" : "wait");

    return {
      role,
      room,
      publish,
      sendCommand,
      sendControl,
      subscribe,
      onCommand,
      onControl,
      onStatus,
      getLatest: () => latest,
      getLatestControl: () => latestControl,
      getStatus: () => status,
      isOnline: () => mqttReady,
    };
  }

  global.WebflixSync = {
    createBus,
    roomFromUrl,
    DEFAULT_ROOM,
    STORAGE_KEY,
    CHANNEL,
  };
})(typeof window !== "undefined" ? window : globalThis);
