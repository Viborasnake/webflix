/* Vista de notas · sync bidireccional con el deck */
(() => {
  const NOTES = window.WEBFLIX_NOTES || [];
  const SPEAKERS = window.WEBFLIX_SPEAKERS || {};
  const TOTAL = NOTES.length;

  const SYNC_KEY = "webflix-pitch-state";
  const SYNC_CHANNEL = "webflix-pitch-sync";
  const SOURCE = "notas";

  const WARN_MS = 9 * 60 * 1000 + 30 * 1000;
  const DANGER_MS = 10 * 60 * 1000 + 30 * 1000;

  let current = 0;
  let timerRunning = false;
  let timerAccumulated = 0;
  let timerStartedAt = null;
  let timerArmed = false;
  let applyingRemote = false;
  let lastRemoteTs = 0;
  let linked = false;
  let timerRaf = null;

  let channel = null;
  try {
    channel = new BroadcastChannel(SYNC_CHANNEL);
  } catch (_) {
    channel = null;
  }

  const $ = (id) => document.getElementById(id);
  const timerTime = $("timer-time");
  const timerBlock = $("timer-block");
  const progressFill = $("progress-fill");
  const counterEl = $("counter");
  const syncStatus = $("sync-status");
  const pastStack = $("past-stack");
  const nextStack = $("next-stack");
  const rail = $("rail");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function formatMs(ms) {
    const sec = Math.floor(Math.max(0, ms) / 1000);
    return `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`;
  }

  function elapsed() {
    if (!timerRunning || timerStartedAt == null) return timerAccumulated;
    return timerAccumulated + (Date.now() - timerStartedAt);
  }

  function timerState(ms) {
    if (ms >= DANGER_MS) return "danger";
    if (ms >= WARN_MS) return "warn";
    return "ok";
  }

  function getState() {
    return {
      v: 1,
      source: SOURCE,
      slide: current,
      total: TOTAL,
      demoLevel: 1,
      timerRunning,
      timerAccumulated,
      timerStartedAt,
      timerMs: elapsed(),
      timerArmed,
      ts: Date.now(),
    };
  }

  function broadcastState() {
    if (applyingRemote) return;
    const state = getState();
    try {
      localStorage.setItem(SYNC_KEY, JSON.stringify(state));
    } catch (_) { /* ignore */ }
    if (channel) {
      try {
        channel.postMessage({ type: "state", ...state });
      } catch (_) { /* ignore */ }
    }
  }

  function setSyncUI(mode) {
    if (!syncStatus) return;
    syncStatus.classList.remove("is-live", "is-wait", "is-solo");
    if (mode === "live") {
      syncStatus.classList.add("is-live");
      syncStatus.textContent = "Sincronizado con la presentación";
    } else if (mode === "solo") {
      syncStatus.classList.add("is-solo");
      syncStatus.textContent = "Modo local · abre el deck en otra pestaña";
    } else {
      syncStatus.classList.add("is-wait");
      syncStatus.textContent = "Esperando presentación…";
    }
  }

  function renderTimer() {
    const ms = elapsed();
    if (timerTime) timerTime.textContent = formatMs(ms);
    if (timerBlock) timerBlock.dataset.state = timerState(ms);
    if (timerRunning) timerRaf = requestAnimationFrame(renderTimer);
  }

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    timerStartedAt = Date.now();
    renderTimer();
    broadcastState();
  }

  function pauseTimer() {
    if (!timerRunning) return;
    timerAccumulated = elapsed();
    timerRunning = false;
    timerStartedAt = null;
    if (timerRaf) cancelAnimationFrame(timerRaf);
    renderTimer();
    broadcastState();
  }

  function toggleTimer() {
    if (timerRunning) pauseTimer();
    else startTimer();
  }

  function resetTimer() {
    timerRunning = false;
    timerStartedAt = null;
    timerAccumulated = 0;
    timerArmed = false;
    if (timerRaf) cancelAnimationFrame(timerRaf);
    renderTimer();
    broadcastState();
  }

  function maybeArmTimer(index) {
    if (index >= 1 && !timerArmed) {
      timerArmed = true;
      startTimer();
    }
  }

  function miniCard(note, emptyLabel) {
    if (!note) {
      return `<article class="mini-card is-empty"><div class="mc-n">—</div><h3>${emptyLabel}</h3></article>`;
    }
    const tip = (note.highlight && note.highlight[0]) || note.onScreen || "";
    return `<article class="mini-card" data-goto="${note.id}">
      <div class="mc-n">${note.n} · ${note.window || ""}</div>
      <h3>${note.title}</h3>
      <div class="mc-speaker">${note.speaker}</div>
      <p class="mc-hint">${tip}</p>
    </article>`;
  }

  function fillList(el, items) {
    if (!el) return;
    el.innerHTML = (items || []).map((t) => `<li>${t}</li>`).join("") || "<li>—</li>";
  }

  function renderNow() {
    const note = NOTES[current];
    if (!note) return;
    const sp = SPEAKERS[note.speaker] || {};

    $("now-title").textContent = note.title;
    $("now-on-screen").textContent = note.onScreen || "";
    $("time-window").textContent = note.window || "—";
    counterEl.textContent = `${pad(current + 1)} / ${pad(TOTAL)}`;
    progressFill.style.width = `${((current + 1) / TOTAL) * 100}%`;

    $("speaker-name").textContent = sp.name || note.speaker;
    $("speaker-role").textContent = note.role || "";
    const img = $("speaker-img");
    if (sp.img) {
      img.src = sp.img;
      img.alt = sp.name || note.speaker;
      img.hidden = false;
    } else {
      img.hidden = true;
    }

    const say = $("now-say");
    say.innerHTML = (note.say || []).map((line) => `<p>${line}</p>`).join("");
    fillList($("now-highlight"), note.highlight);
    fillList($("now-avoid"), note.avoid);

    // past: last 2
    const past = [];
    for (let i = current - 1; i >= 0 && past.length < 2; i--) past.push(NOTES[i]);
    pastStack.innerHTML =
      past.map((n) => miniCard(n)).join("") || miniCard(null, "Inicio del pitch");

    // next: next 2
    const upcoming = [];
    for (let i = current + 1; i < TOTAL && upcoming.length < 2; i++) upcoming.push(NOTES[i]);
    nextStack.innerHTML =
      upcoming.map((n) => miniCard(n)).join("") || miniCard(null, "Fin · Q&A");

    // rail
    rail.querySelectorAll(".rail-item").forEach((btn, i) => {
      btn.classList.toggle("is-active", i === current);
      btn.classList.toggle("is-past", i < current);
    });
  }

  function buildRail() {
    rail.innerHTML = NOTES.map(
      (n) => `<button type="button" class="rail-item" data-goto="${n.id}">
        <span class="ri-n">${n.n}</span>
        <span class="ri-t">${n.title}</span>
        <span class="ri-s">${n.speaker}</span>
      </button>`
    ).join("");
  }

  function goTo(index, { silent } = {}) {
    if (index < 0 || index >= TOTAL) return;
    current = index;
    if (!silent) maybeArmTimer(current);
    renderNow();
    if (!silent) broadcastState();
  }

  function applyRemoteState(state) {
    if (!state || state.source === SOURCE) return;
    if (typeof state.slide !== "number") return;
    if (state.ts && state.ts < lastRemoteTs) return;
    lastRemoteTs = state.ts || Date.now();

    applyingRemote = true;
    linked = true;
    setSyncUI("live");
    try {
      if (timerRaf) cancelAnimationFrame(timerRaf);

      timerRunning = !!state.timerRunning;
      timerAccumulated = Number(state.timerAccumulated) || 0;
      // realinear reloj si viene running: usar startedAt remoto o reconstruir
      if (timerRunning) {
        if (state.timerStartedAt) {
          timerStartedAt = Number(state.timerStartedAt);
        } else if (typeof state.timerMs === "number") {
          timerAccumulated = state.timerMs;
          timerStartedAt = Date.now();
        } else {
          timerStartedAt = Date.now();
        }
      } else {
        timerStartedAt = null;
        if (typeof state.timerMs === "number") {
          timerAccumulated = state.timerMs;
        }
      }
      timerArmed = !!state.timerArmed;

      goTo(Math.min(TOTAL - 1, Math.max(0, state.slide)), { silent: true });
      renderTimer();
    } finally {
      applyingRemote = false;
    }
  }

  function onSyncMessage(data) {
    if (!data || data.type !== "state") return;
    applyRemoteState(data);
  }

  if (channel) {
    channel.onmessage = (ev) => onSyncMessage(ev.data);
  }

  window.addEventListener("storage", (e) => {
    if (e.key !== SYNC_KEY || !e.newValue) return;
    try {
      onSyncMessage(JSON.parse(e.newValue));
    } catch (_) { /* ignore */ }
  });

  // bootstrap from localStorage
  try {
    const raw = localStorage.getItem(SYNC_KEY);
    if (raw) {
      const state = JSON.parse(raw);
      if (state && state.source !== SOURCE) {
        applyRemoteState(state);
      } else if (state && typeof state.slide === "number") {
        current = state.slide;
      }
    }
  } catch (_) { /* ignore */ }

  if (!linked) setSyncUI("solo");

  // ping: if no remote after a few seconds, stay solo
  setTimeout(() => {
    if (!linked) setSyncUI("solo");
  }, 2500);

  buildRail();
  renderNow();
  renderTimer();

  // interactions
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-goto]");
    if (!t) return;
    goTo(Number(t.dataset.goto));
  });

  $("btn-prev").addEventListener("click", () => goTo(current - 1));
  $("btn-next").addEventListener("click", () => goTo(current + 1));
  $("btn-timer").addEventListener("click", () => toggleTimer());
  $("btn-reset").addEventListener("click", () => {
    resetTimer();
    if (current >= 1) {
      timerArmed = true;
      startTimer();
    }
  });

  document.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case " ":
      case "PageDown":
        e.preventDefault();
        goTo(current + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
      case "Backspace":
        e.preventDefault();
        goTo(current - 1);
        break;
      case "Home":
        e.preventDefault();
        goTo(0);
        break;
      case "End":
        e.preventDefault();
        goTo(TOTAL - 1);
        break;
      case "t":
      case "T":
        toggleTimer();
        break;
      case "r":
      case "R":
        resetTimer();
        if (current >= 1) {
          timerArmed = true;
          startTimer();
        }
        break;
      default:
        break;
    }
  });

  // No broadcast al abrir: evita resetear el deck a slide 0.
  // Solo emite cuando el presentador navega o toca el timer aquí.
})();
