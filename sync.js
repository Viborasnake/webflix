/**
 * WebFlix pitch sync bus
 * ─────────────────────────────────────────────
 * El DECK es la única fuente de verdad (publica).
 * Las vistas /notas solo ESCUCHAN. Cada sesión de
 * notas puede navegar libre; eso no se publica.
 *
 * Transportes:
 *  1) BroadcastChannel + localStorage → misma máquina / pestañas
 *  2) PeerJS (opcional) → varios dispositivos en la misma sala
 */
(function (global) {
  const CHANNEL = "webflix-pitch-sync-v2";
  const STORAGE_KEY = "webflix-pitch-state-v2";
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
    // PeerJS: alfanumérico, único global en su cloud
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
    const listeners = new Set();
    let latest = null;
    let channel = null;
    let peer = null;
    let peerReady = false;
    /** @type {Set<any>} */
    const peerConns = new Set();
    let status = "init";
    const statusListeners = new Set();

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

    function emit(state, meta) {
      if (!state || typeof state.slide !== "number") return;
      // Solo aceptar estados del deck (o legacy sin source)
      if (state.source && state.source !== "deck") return;
      if (latest && state.ts && latest.ts && state.ts < latest.ts) return;
      latest = state;
      listeners.forEach((fn) => {
        try {
          fn(state, meta || { via: "unknown" });
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

    if (channel) {
      channel.onmessage = (ev) => {
        const data = ev.data;
        if (!data || data.type !== "state") return;
        emit(data, { via: "broadcast" });
      };
    }

    global.addEventListener("storage", (e) => {
      if (e.key !== STORAGE_KEY + ":" + room || !e.newValue) return;
      try {
        emit(JSON.parse(e.newValue), { via: "storage" });
      } catch (_) { /* ignore */ }
    });

    // Bootstrap last known
    const boot = readStorage();
    if (boot) {
      latest = boot;
    }

    function publish(state) {
      if (role !== "deck") return; // notas nunca publican
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
      // PeerJS: enviar a todos los clientes de notas
      peerConns.forEach((conn) => {
        if (conn.open) {
          try {
            conn.send({ type: "state", ...payload });
          } catch (_) { /* ignore */ }
        }
      });
      setStatus(peerConns.size ? "live+" + peerConns.size : "live");
      return payload;
    }

    function subscribe(fn) {
      listeners.add(fn);
      if (latest) {
        try {
          fn(latest, { via: "bootstrap" });
        } catch (_) { /* ignore */ }
      }
      return () => listeners.delete(fn);
    }

    function onStatus(fn) {
      statusListeners.add(fn);
      fn(status, { room, role });
      return () => statusListeners.delete(fn);
    }

    function wirePeerConn(conn) {
      peerConns.add(conn);
      conn.on("data", (data) => {
        // Los clientes no envían estado de slide; ignorar basura
        if (role === "deck") return;
        if (!data || data.type !== "state") return;
        emit(data, { via: "peer" });
      });
      conn.on("close", () => {
        peerConns.delete(conn);
        if (role === "notes") setStatus("wait");
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
            // ID taken u offline → seguimos con BroadcastChannel
            console.warn("[webflix-sync] peer deck:", err && err.type);
            setStatus("local");
          });
        } else {
          // notes client: peer id aleatorio, conecta al deck
          peer = new Peer({ debug: 0 });
          peer.on("open", () => {
            peerReady = true;
            const hostId = peerIdForRoom(room);
            const conn = peer.connect(hostId, { reliable: true });
            conn.on("open", () => {
              wirePeerConn(conn);
              // pedir estado actual
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
          // reintentar conexión al host cada 4s si no hay conns
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

    // En deck: si un cliente dice hello, reenviar estado (vía wirePeerConn on open)
    // Arrancar peer en background
    startPeer();

    // Si hay bootstrap local, notas pueden empezar en "local"
    if (role === "notes") {
      setStatus(latest ? "local" : "wait");
    } else {
      setStatus("local");
    }

    return {
      role,
      room,
      publish,
      subscribe,
      onStatus,
      getLatest: () => latest,
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
