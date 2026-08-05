/**
 * WebFlix pitch sync bus
 * ─────────────────────────────────────────────
 * DECK publica estado en vivo (slide + timer).
 * NOTAS escuchan estado; browse libre es local.
 * NOTAS en modo control envían COMMANDS al deck.
 * CONTROL exclusivo: claim/release entre notas;
 * el deck reenvía claims a todos los peers.
 *
 * Transportes:
 *  1) BroadcastChannel + localStorage
 *  2) PeerJS (opcional, multi-dispositivo)
 */
(function (global) {
  const CHANNEL = "webflix-pitch-sync-v2";
  const STORAGE_KEY = "webflix-pitch-state-v2";
  const COMMAND_KEY = "webflix-pitch-cmd-v2";
  const CONTROL_KEY = "webflix-pitch-control-v2";
  const DEFAULT_ROOM = "webflix-g5";
  const PEER_CDN = "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js";

  function roomFromUrl() {
    try {
      const q = new URLSearchParams(global.location.search);
      const r = (q.get("room") || DEFAULT_ROOM).toLowerCase().replace(/[^a-z0-9-]/g, "");
      return r || DEFAULT_ROOM;
    } catch (_) {
      return DEFAULT_ROOM;
    }
  }

  function peerIdForRoom(room) {
    return "wfxdeck-" + room;
  }

  function loadPeerScript() {
    if (global.Peer) return Promise.resolve(global.Peer);
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = PEER_CDN;
      s.async = true;
      s.onload = () => resolve(global.Peer);
      s.onerror = () => reject(new Error("PeerJS CDN failed"));
      document.head.appendChild(s);
    });
  }

  function createBus(role) {
    const room = roomFromUrl();
    const stateListeners = new Set();
    const commandListeners = new Set();
    const controlListeners = new Set();
    let latest = null;
    let latestControl = null;
    let channel = null;
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

    function makeNonce() {
      return (
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2, 9)
      );
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
          fn(status, { room, role });
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

    function emitState(state, meta) {
      if (!state || typeof state.slide !== "number") return;
      if (state.source && state.source !== "deck") return;
      if (latest && state.ts && latest.ts && state.ts < latest.ts) return;
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
      // Dedupe BC+Peer: mismo ts se ignora; reloj desfasado solo si es claramente viejo
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
      // claims: aceptar el más reciente
      if (ctrl.ts && lastControlTs && ctrl.ts < lastControlTs) return;
      if (ctrl.ts && ctrl.ts === lastControlTs && ctrl.nonce && ctrl.nonce === lastControlNonce) {
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

    function readStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY + ":" + room);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (_) {
        return null;
      }
    }

    function writeStorage(state) {
      try {
        localStorage.setItem(STORAGE_KEY + ":" + room, JSON.stringify(state));
      } catch (_) { /* private mode */ }
    }

    function readControlStorage() {
      try {
        const raw = localStorage.getItem(CONTROL_KEY + ":" + room);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (_) {
        return null;
      }
    }

    if (channel) {
      channel.onmessage = (ev) => {
        const data = ev.data;
        if (!data) return;
        if (data.type === "state") emitState(data, { via: "broadcast" });
        if (data.type === "command") {
          // Deck aplica; notas no reenvían
          if (role === "deck") emitCommand(data, { via: "broadcast" });
        }
        if (data.type === "control") {
          // Todas las notas + deck (relay)
          if (role === "notes") emitControl(data, { via: "broadcast" });
          if (role === "deck") {
            // Reenviar a peers y a BC no (ya llegó por BC). Solo peers remotos.
            fanoutPeer(data);
            // No hace falta emitControl en deck salvo si quisiéramos HUD
          }
        }
      };
    }

    global.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY + ":" + room && e.newValue) {
        try {
          emitState(JSON.parse(e.newValue), { via: "storage" });
        } catch (_) { /* ignore */ }
      }
      if (e.key === COMMAND_KEY + ":" + room && e.newValue) {
        try {
          if (role === "deck") emitCommand(JSON.parse(e.newValue), { via: "storage" });
        } catch (_) { /* ignore */ }
      }
      if (e.key === CONTROL_KEY + ":" + room && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (role === "notes") emitControl(data, { via: "storage" });
          if (role === "deck") fanoutPeer(data);
        } catch (_) { /* ignore */ }
      }
    });

    const boot = readStorage();
    if (boot) latest = boot;
    const bootCtrl = readControlStorage();
    if (bootCtrl) latestControl = bootCtrl;

    function publish(state) {
      if (role !== "deck") return null;
      const payload = {
        ...state,
        v: 2,
        source: "deck",
        room,
        ts: Date.now(),
      };
      latest = payload;
      writeStorage(payload);
      if (channel) {
        try {
          channel.postMessage({ type: "state", ...payload });
        } catch (_) { /* ignore */ }
      }
      fanoutPeer({ type: "state", ...payload });
      setStatus(peerConns.size ? "live+" + peerConns.size : "live");
      return payload;
    }

    function sendCommand(cmd, extra) {
      if (role !== "notes") return null;
      const payload = {
        type: "command",
        v: 2,
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
      try {
        localStorage.setItem(COMMAND_KEY + ":" + room, JSON.stringify(payload));
      } catch (_) { /* ignore */ }
      fanoutPeer(payload);
      return payload;
    }

    /**
     * Control exclusivo entre notas.
     * action: "claim" | "release"
     * controllerId, controllerName
     */
    function sendControl(action, extra) {
      if (role !== "notes") return null;
      const payload = {
        type: "control",
        v: 2,
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
      try {
        localStorage.setItem(CONTROL_KEY + ":" + room, JSON.stringify(payload));
      } catch (_) { /* ignore */ }
      // Enviar al deck para que reenvíe a otros dispositivos
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
      fn(status, { room, role });
      return () => statusListeners.delete(fn);
    }

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
            // Relay a todos los demás peers + BC (por si hay tabs locales)
            peerConns.forEach((c) => {
              if (c !== conn && c.open) {
                try {
                  c.send(data);
                } catch (_) { /* ignore */ }
              }
            });
            if (channel) {
              try {
                channel.postMessage(data);
              } catch (_) { /* ignore */ }
            }
            try {
              localStorage.setItem(CONTROL_KEY + ":" + room, JSON.stringify(data));
            } catch (_) { /* ignore */ }
          }
          if (role === "notes") {
            emitControl(data, { via: "peer" });
          }
        }
        if (data.type === "hello" && role === "deck") {
          if (latest) {
            try {
              conn.send({ type: "state", ...latest });
            } catch (_) { /* ignore */ }
          }
          // Si hay control activo, avisar al que llega
          try {
            const ctrl = readControlStorage();
            if (ctrl && ctrl.action === "claim") conn.send(ctrl);
          } catch (_) { /* ignore */ }
        }
      });
      conn.on("close", () => {
        peerConns.delete(conn);
        if (role === "notes") setStatus("wait");
        if (role === "deck") setStatus(peerConns.size ? "live+" + peerConns.size : "live");
      });
      conn.on("error", () => {
        peerConns.delete(conn);
      });
      if (role === "deck" && latest && conn.open) {
        try {
          conn.send({ type: "state", ...latest });
        } catch (_) { /* ignore */ }
      }
      if (role === "deck") setStatus("live+" + peerConns.size);
      if (role === "notes") setStatus("live");
    }

    async function startPeer() {
      try {
        const Peer = await loadPeerScript();
        if (role === "deck") {
          const id = peerIdForRoom(room);
          peer = new Peer(id, { debug: 0 });
          peer.on("open", () => {
            peerReady = true;
            setStatus("live");
          });
          peer.on("connection", (conn) => {
            conn.on("open", () => wirePeerConn(conn));
          });
          peer.on("error", (err) => {
            console.warn("[webflix-sync] peer deck:", err && err.type);
            setStatus("local");
          });
        } else {
          peer = new Peer({ debug: 0 });
          peer.on("open", () => {
            peerReady = true;
            const hostId = peerIdForRoom(room);
            const conn = peer.connect(hostId, { reliable: true });
            conn.on("open", () => {
              wirePeerConn(conn);
              try {
                conn.send({ type: "hello", role: "notes" });
              } catch (_) { /* ignore */ }
            });
            conn.on("error", () => setStatus("wait"));
          });
          peer.on("error", (err) => {
            console.warn("[webflix-sync] peer notes:", err && err.type);
            setStatus(latest ? "local" : "wait");
          });
          setInterval(() => {
            if (!peerReady || peerConns.size > 0) return;
            try {
              const conn = peer.connect(peerIdForRoom(room), { reliable: true });
              conn.on("open", () => wirePeerConn(conn));
            } catch (_) { /* ignore */ }
          }, 4000);
        }
      } catch (e) {
        console.warn("[webflix-sync] PeerJS no disponible", e);
        setStatus(role === "deck" ? "local" : latest ? "local" : "wait");
      }
    }

    startPeer();

    if (role === "notes") {
      setStatus(latest ? "local" : "wait");
    } else {
      setStatus("local");
    }

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
    };
  }

  global.WebflixSync = {
    createBus,
    roomFromUrl,
    STORAGE_KEY,
    CHANNEL,
  };
})(typeof window !== "undefined" ? window : globalThis);
