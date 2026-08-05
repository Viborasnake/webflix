/* Vista de notas · seguimiento / libre / control remoto del deck */
(() => {
  const NOTES = window.WEBFLIX_NOTES || [];
  const SPEAKERS = window.WEBFLIX_SPEAKERS || {};
  const TOTAL = NOTES.length;

  const WARN_MS = 9 * 60 * 1000 + 30 * 1000;
  const DANGER_MS = 10 * 60 * 1000 + 30 * 1000;

  // Vista local
  let viewSlide = 0;
  // Slide en vivo del deck
  let liveSlide = 0;
  let followLive = true;
  let controlMode = false; // true = ←→ mueven el deck (solo uno a la vez)
  let hasLive = false;
  let liveAdvancedWhileBrowsing = false;

  // Identidad de esta sesión de notas (control exclusivo)
  function getOrCreateSessionId() {
    try {
      let id = sessionStorage.getItem("webflix-notes-sid");
      if (!id) {
        id =
          (crypto.randomUUID && crypto.randomUUID()) ||
          "s-" + Math.random().toString(36).slice(2, 10);
        sessionStorage.setItem("webflix-notes-sid", id);
      }
      return id;
    } catch (_) {
      return "s-" + Math.random().toString(36).slice(2, 10);
    }
  }
  const SESSION_ID = getOrCreateSessionId();
  function sessionNameFromUrl() {
    try {
      const q = new URLSearchParams(window.location.search);
      const n = (q.get("name") || q.get("who") || "").trim();
      if (n) return n.slice(0, 24);
    } catch (_) { /* ignore */ }
    return "Sesión " + SESSION_ID.slice(0, 4);
  }
  const SESSION_NAME = sessionNameFromUrl();

  // Quién tiene el control remoto (null = nadie o nosotros)
  let remoteController = null; // { id, name, ts }
  let controlHeartbeat = null;
  let takeoverToastUntil = 0;

  let timerRunning = false;
  let timerAccumulated = 0;
  let timerStartedAt = null;
  let timerRaf = null;

  const bus = window.WebflixSync
    ? window.WebflixSync.createBus("notes")
    : null;

  const $ = (id) => document.getElementById(id);
  const timerTime = $("timer-time");
  const timerBlock = $("timer-block");
  const progressFill = $("progress-fill");
  const counterEl = $("counter");
  const syncStatus = $("sync-status");
  const pastStack = $("past-stack");
  const nextStack = $("next-stack");
  const rail = $("rail");
  const followBar = $("follow-bar");
  const btnFollow = $("btn-follow");
  const liveHint = $("live-hint");
  const nowBadge = $("now-badge");
  const btnControl = $("btn-control");
  const app = $("app");
  const btnPrev = $("btn-prev");
  const btnNext = $("btn-next");
  const btnQa = $("btn-qa");
  const btnQaClose = $("btn-qa-close");
  const qaPanel = $("qa-panel");
  const qaFilters = $("qa-filters");
  const qaBubbles = $("qa-bubbles");
  const qaIntro = $("qa-intro");
  const controlBar = $("control-bar");
  const controlBarTitle = $("control-bar-title");
  const controlBarHint = $("control-bar-hint");
  const btnTakeControl = $("btn-take-control");

  const QA = window.WEBFLIX_QA || { filters: [], pistas: [], intro: "" };
  const GLOSSARY = window.WEBFLIX_GLOSSARY || {};
  const GLOSSARY_CORE = window.WEBFLIX_GLOSSARY_CORE || [];
  let qaOpen = false;
  let qaFilter = "all";
  let qaAutoOpenedForClose = false;
  const glossaryChips = $("glossary-chips");

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

  function renderTimer() {
    const ms = elapsed();
    if (timerTime) timerTime.textContent = formatMs(ms);
    if (timerBlock) timerBlock.dataset.state = timerState(ms);
    if (timerRunning) timerRaf = requestAnimationFrame(renderTimer);
  }

  function applyTimerFromLive(state) {
    if (timerRaf) cancelAnimationFrame(timerRaf);
    timerRunning = !!state.timerRunning;
    timerAccumulated = Number(state.timerAccumulated) || 0;
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
    renderTimer();
  }

  function setSyncLabel(mode, extra) {
    if (!syncStatus) return;
    syncStatus.classList.remove("is-live", "is-wait", "is-solo", "is-free", "is-control");
    if (mode === "control") {
      syncStatus.classList.add("is-control");
      syncStatus.textContent = extra || "Tú controlas el deck";
    } else if (mode === "live") {
      syncStatus.classList.add("is-live");
      syncStatus.textContent = extra || "En seguimiento · presentación en vivo";
    } else if (mode === "free") {
      syncStatus.classList.add("is-free");
      syncStatus.textContent = extra || "Navegación libre · no afecta a otros";
    } else if (mode === "solo") {
      syncStatus.classList.add("is-solo");
      syncStatus.textContent = extra || "Sin señal del deck · modo local";
    } else {
      syncStatus.classList.add("is-wait");
      syncStatus.textContent = extra || "Esperando presentación…";
    }
  }

  function otherHasControl() {
    return !!(
      remoteController &&
      remoteController.id &&
      remoteController.id !== SESSION_ID
    );
  }

  function stopHeartbeat() {
    if (controlHeartbeat) {
      clearInterval(controlHeartbeat);
      controlHeartbeat = null;
    }
  }

  function startHeartbeat() {
    stopHeartbeat();
    controlHeartbeat = setInterval(() => {
      if (!controlMode || !bus || typeof bus.sendControl !== "function") return;
      bus.sendControl("claim", {
        controllerId: SESSION_ID,
        controllerName: SESSION_NAME,
      });
    }, 4000);
  }

  function claimControlBroadcast() {
    if (!bus || typeof bus.sendControl !== "function") return;
    bus.sendControl("claim", {
      controllerId: SESSION_ID,
      controllerName: SESSION_NAME,
    });
    remoteController = {
      id: SESSION_ID,
      name: SESSION_NAME,
      ts: Date.now(),
    };
    startHeartbeat();
  }

  function releaseControlBroadcast() {
    stopHeartbeat();
    if (!bus || typeof bus.sendControl !== "function") return;
    // Solo liberar si nosotros éramos el dueño
    if (remoteController && remoteController.id && remoteController.id !== SESSION_ID) {
      return;
    }
    bus.sendControl("release", {
      controllerId: SESSION_ID,
      controllerName: SESSION_NAME,
    });
    if (remoteController && remoteController.id === SESSION_ID) {
      remoteController = null;
    }
  }

  function updateControlButton() {
    if (!btnControl) return;
    btnControl.classList.toggle("is-on", controlMode);
    btnControl.setAttribute("aria-pressed", controlMode ? "true" : "false");
    if (controlMode) {
      btnControl.textContent = "● Control activo";
    } else if (otherHasControl()) {
      btnControl.textContent = "Tomar control";
    } else {
      btnControl.textContent = "Controlar presentación";
    }
    if (btnPrev) {
      btnPrev.title = controlMode
        ? "Anterior · mueve el deck"
        : "Anterior · solo tu vista";
    }
    if (btnNext) {
      btnNext.title = controlMode
        ? "Siguiente · mueve el deck"
        : "Siguiente · solo tu vista";
    }
    if (app) app.classList.toggle("is-controlling", controlMode);
  }

  function updateControlBar() {
    if (!controlBar) return;
    const showOther = otherHasControl() && !controlMode;
    const showToast = Date.now() < takeoverToastUntil;
    controlBar.hidden = !(showOther || showToast);
    if (controlBar.hidden) return;

    const name = (remoteController && remoteController.name) || "Otro usuario";
    if (controlBarTitle) {
      controlBarTitle.textContent = showOther
        ? `${name} tiene el control`
        : `${name} tomó el control`;
    }
    if (controlBarHint) {
      controlBarHint.textContent = showOther
        ? "Tus flechas solo mueven tu vista. Pulsa “Tomar control” para manejar el deck."
        : "Se soltó tu control. Puedes seguir en libre o recuperar el mando.";
    }
  }

  function updateFollowUI() {
    // En control: siempre alineado al vivo (tú eres el driver)
    const desynced = !followLive && !controlMode;
    if (followBar) {
      followBar.hidden = !desynced;
    }
    if (liveHint) {
      const liveNote = NOTES[liveSlide];
      const title = liveNote ? liveNote.title : "—";
      liveHint.textContent = hasLive
        ? `La presentación está en ${pad(liveSlide + 1)} · ${title}`
        : "Aún no hay señal del deck";
    }
    if (nowBadge) {
      if (controlMode) {
        nowBadge.textContent = "CONTROL";
        nowBadge.className = "pill control";
      } else if (otherHasControl()) {
        nowBadge.textContent = "REMOTO";
        nowBadge.className = "pill free";
      } else if (followLive && hasLive) {
        nowBadge.textContent = "EN VIVO";
        nowBadge.className = "pill live";
      } else if (!followLive) {
        nowBadge.textContent = "LIBRE";
        nowBadge.className = "pill free";
      } else {
        nowBadge.textContent = "AHORA";
        nowBadge.className = "pill live";
      }
    }

    updateControlButton();
    updateControlBar();

    if (controlMode) {
      setSyncLabel("control", "Tú controlas el deck · " + SESSION_NAME);
    } else if (otherHasControl()) {
      const n = remoteController.name || "Otro";
      setSyncLabel("free", n + " controla el deck");
    } else if (followLive && hasLive) {
      setSyncLabel("live");
    } else if (!followLive) {
      setSyncLabel(
        "free",
        liveAdvancedWhileBrowsing
          ? "Navegación libre · la presentación avanzó"
          : "Navegación libre · no afecta a otros"
      );
    } else if (!hasLive) {
      setSyncLabel("wait");
    }
  }

  function miniCard(note, emptyLabel) {
    if (!note) {
      return `<article class="mini-card is-empty"><div class="mc-n">—</div><h3>${emptyLabel}</h3></article>`;
    }
    const tip = (note.highlight && note.highlight[0]) || note.onScreen || "";
    const isLive = note.id === liveSlide && hasLive;
    return `<article class="mini-card${isLive ? " is-live-slide" : ""}" data-goto="${note.id}">
      <div class="mc-n">${note.n} · ${note.window || ""}${isLive ? " · VIVO" : ""}</div>
      <h3>${note.title}</h3>
      <div class="mc-speaker">${note.speaker}</div>
      <p class="mc-hint">${tip}</p>
    </article>`;
  }

  function fillList(el, items) {
    if (!el) return;
    el.innerHTML = (items || []).map((t) => `<li>${t}</li>`).join("") || "<li>—</li>";
  }

  function renderGlossary(note) {
    if (!glossaryChips) return;
    const keys = [];
    const seen = new Set();
    const pushKey = (k) => {
      if (!k || seen.has(k) || !GLOSSARY[k]) return;
      seen.add(k);
      keys.push(k);
    };
    // Primero términos de la slide; luego core si faltan y hay espacio visual
    (note.glossary || []).forEach(pushKey);
    GLOSSARY_CORE.forEach(pushKey);

    if (!keys.length) {
      glossaryChips.innerHTML =
        '<p class="gloss-def">Sin términos extra en esta slide.</p>';
      return;
    }

    glossaryChips.innerHTML = keys
      .map((k) => {
        const g = GLOSSARY[k];
        return `<div class="gloss-item">
          <div class="gloss-term">${g.term}</div>
          <div class="gloss-def">${g.def}</div>
        </div>`;
      })
      .join("");
  }

  function renderQaFilters() {
    if (!qaFilters) return;
    const filters = QA.filters || [];
    qaFilters.innerHTML = filters
      .map(
        (f) =>
          `<button type="button" class="qa-filter${f.id === qaFilter ? " is-on" : ""}" data-qa-filter="${f.id}">${f.label}</button>`
      )
      .join("");
  }

  function renderQaBubbles() {
    if (!qaBubbles) return;
    const list = (QA.pistas || QA.torpedos || []).filter(
      (t) => qaFilter === "all" || t.cat === qaFilter
    );
    qaBubbles.innerHTML = list
      .map(
        (t) => `<article class="qa-bubble" data-cat="${t.cat}">
          <div class="qa-bubble-meta">
            <span class="qa-tag">${t.tag || t.cat}</span>
            <span class="qa-who">${t.who || ""}</span>
          </div>
          <p class="qa-q">${t.q}</p>
          <p class="qa-pista">${t.pista}</p>
        </article>`
      )
      .join("");
  }

  function setQaOpen(open, { manual } = {}) {
    qaOpen = !!open;
    if (qaPanel) qaPanel.hidden = !qaOpen;
    if (app) app.classList.toggle("is-qa-open", qaOpen);
    if (btnQa) {
      btnQa.classList.toggle("is-on", qaOpen);
      btnQa.setAttribute("aria-pressed", qaOpen ? "true" : "false");
    }
    if (qaOpen) {
      if (qaIntro) qaIntro.textContent = QA.intro || "";
      renderQaFilters();
      renderQaBubbles();
    }
    if (manual && !qaOpen) {
      // si el usuario cierra en el cierre, no re-autoabrir en este slide
      qaAutoOpenedForClose = true;
    }
  }

  function maybeAutoOpenQa() {
    // En slide de cierre (último): abrir Q&A una vez
    if (viewSlide === TOTAL - 1 && !qaAutoOpenedForClose && !qaOpen) {
      qaAutoOpenedForClose = true;
      setQaOpen(true);
    }
  }

  function renderView() {
    const note = NOTES[viewSlide];
    if (!note) return;
    const sp = SPEAKERS[note.speaker] || {};

    $("now-title").textContent = note.title;
    $("now-on-screen").textContent = note.onScreen || "";
    $("time-window").textContent = note.window || "—";
    counterEl.textContent = `${pad(viewSlide + 1)} / ${pad(TOTAL)}`;
    const progressSlide = hasLive ? liveSlide : viewSlide;
    progressFill.style.width = `${((progressSlide + 1) / TOTAL) * 100}%`;

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
    say.innerHTML = (note.say || [])
      .map((line) => {
        const text = typeof line === "string" ? line : line.text || "";
        const hint = typeof line === "string" ? "" : line.hint || "";
        const hintHtml = hint
          ? `<span class="say-hint"><span class="say-hint-lab">En slide</span>${hint}</span>`
          : "";
        return `<div class="say-line"><p class="say-text">${text}</p>${hintHtml}</div>`;
      })
      .join("");
    fillList($("now-highlight"), note.highlight);
    fillList($("now-avoid"), note.avoid);
    renderGlossary(note);

    const past = [];
    for (let i = viewSlide - 1; i >= 0 && past.length < 2; i--) past.push(NOTES[i]);
    pastStack.innerHTML =
      past.map((n) => miniCard(n)).join("") || miniCard(null, "Inicio");

    const upcoming = [];
    for (let i = viewSlide + 1; i < TOTAL && upcoming.length < 2; i++) upcoming.push(NOTES[i]);
    nextStack.innerHTML =
      upcoming.map((n) => miniCard(n)).join("") || miniCard(null, "Fin · Q&A");

    rail.querySelectorAll(".rail-item").forEach((btn, i) => {
      btn.classList.toggle("is-active", i === viewSlide);
      btn.classList.toggle("is-past", i < viewSlide);
      btn.classList.toggle("is-live", hasLive && i === liveSlide);
    });

    // reset auto-flag al salir del cierre
    if (viewSlide !== TOTAL - 1) {
      qaAutoOpenedForClose = false;
      if (qaOpen && !btnQa?.classList.contains("is-on")) {
        /* keep if user forced */ 
      }
    }

    updateFollowUI();
    maybeAutoOpenQa();
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

  function sendCmd(cmd, extra) {
    if (!bus || typeof bus.sendCommand !== "function") return;
    // session-reset puede mandarlo cualquiera; el resto solo con control
    if (cmd !== "session-reset" && !controlMode) return;
    bus.sendCommand(cmd, {
      controllerId: SESSION_ID,
      controllerName: SESSION_NAME,
      ...extra,
    });
  }

  /** Reinicio total local + deck: slide 0, timer 00:00, sin control, seguimiento */
  function resetSessionAll() {
    const ok = window.confirm(
      "¿Reiniciar la sesión desde cero?\n\n• Slide 01 (portada)\n• Timer 00:00\n• Se suelta el control remoto\n• Afecta al deck y a todos en la sala"
    );
    if (!ok) return;

    // Local
    if (controlMode) releaseControlBroadcast();
    controlMode = false;
    stopHeartbeat();
    followLive = true;
    liveAdvancedWhileBrowsing = false;
    viewSlide = 0;
    liveSlide = 0;
    hasLive = true;
    timerRunning = false;
    timerStartedAt = null;
    timerAccumulated = 0;
    if (timerRaf) cancelAnimationFrame(timerRaf);
    renderTimer();

    // Deck + otros
    sendCmd("session-reset");
    renderView();
  }

  /** Navegación: libre (solo local) o control (mueve el deck) */
  function goNotes(index) {
    if (index < 0 || index >= TOTAL) return;

    if (controlMode) {
      // Control remoto: mueve el deck; la vista se alinea al eco en vivo
      viewSlide = index;
      followLive = true;
      liveAdvancedWhileBrowsing = false;
      sendCmd("goto", { slide: index });
      // Optimistic UI (el deck confirmará con state)
      liveSlide = index;
      hasLive = true;
      renderView();
      return;
    }

    // Browse libre
    viewSlide = index;
    if (hasLive && viewSlide === liveSlide) {
      followLive = true;
      liveAdvancedWhileBrowsing = false;
    } else {
      followLive = false;
    }
    renderView();
  }

  function resumeFollow() {
    if (controlMode) {
      releaseControlBroadcast();
    }
    controlMode = false;
    followLive = true;
    liveAdvancedWhileBrowsing = false;
    viewSlide = liveSlide;
    renderView();
  }

  function setControlMode(on) {
    const next = !!on;
    if (next === controlMode) {
      renderView();
      return;
    }

    if (next) {
      // Tomar control: los demás lo pierden al recibir el claim
      controlMode = true;
      followLive = true;
      liveAdvancedWhileBrowsing = false;
      viewSlide = liveSlide;
      claimControlBroadcast();
      sendCmd("goto", {
        slide: viewSlide,
        controllerId: SESSION_ID,
        controllerName: SESSION_NAME,
      });
    } else {
      controlMode = false;
      releaseControlBroadcast();
    }
    renderView();
  }

  function toggleControlMode() {
    setControlMode(!controlMode);
  }

  function onRemoteControl(ctrl) {
    if (!ctrl || !ctrl.action) return;
    const id = ctrl.controllerId;
    const name = ctrl.controllerName || "Otro usuario";

    if (ctrl.action === "claim") {
      if (!id) return;
      // Nosotros re-claimamos: ignorar eco
      if (id === SESSION_ID) {
        remoteController = { id, name, ts: ctrl.ts || Date.now() };
        updateFollowUI();
        return;
      }
      // Otro tomó el control
      const wasMine = controlMode;
      remoteController = { id, name, ts: ctrl.ts || Date.now() };
      if (wasMine) {
        controlMode = false;
        stopHeartbeat();
        followLive = true;
        viewSlide = liveSlide;
        takeoverToastUntil = Date.now() + 8000;
      } else if (!controlMode) {
        // Aviso suave aunque no teníamos control
        takeoverToastUntil = Date.now() + 5000;
      }
      renderView();
      return;
    }

    if (ctrl.action === "release") {
      // Solo limpia si liberó el dueño actual
      if (remoteController && id && remoteController.id === id) {
        remoteController = null;
      } else if (!remoteController || remoteController.id === id) {
        remoteController = null;
      }
      renderView();
    }
  }

  function onLiveState(state) {
    if (!state || typeof state.slide !== "number") return;
    hasLive = true;
    const nextLive = Math.min(TOTAL - 1, Math.max(0, state.slide));
    const changed = nextLive !== liveSlide;
    liveSlide = nextLive;

    applyTimerFromLive(state);

    if (controlMode || followLive) {
      viewSlide = liveSlide;
      liveAdvancedWhileBrowsing = false;
      if (controlMode) followLive = true;
    } else if (changed) {
      liveAdvancedWhileBrowsing = true;
    }
    renderView();
  }

  if (bus) {
    bus.subscribe((state) => onLiveState(state));
    if (typeof bus.onControl === "function") {
      bus.onControl((ctrl) => onRemoteControl(ctrl));
    }
    bus.onStatus((st) => {
      if (controlMode) setSyncLabel("control", "Tú controlas el deck · " + SESSION_NAME);
      else if (otherHasControl()) updateFollowUI();
      else if (!hasLive && (st === "wait" || st === "init")) setSyncLabel("wait");
      else if (!followLive) updateFollowUI();
      else if (hasLive) setSyncLabel("live");
      else if (st === "local") setSyncLabel("solo");
    });
  } else {
    setSyncLabel("solo", "Sync no cargó · solo local");
  }

  // Si al abrir ya hay claim en storage
  if (bus && typeof bus.getLatestControl === "function") {
    const boot = bus.getLatestControl();
    if (boot) onRemoteControl(boot);
  }

  buildRail();
  renderView();
  renderTimer();

  // Limpiar toast de takeover
  setInterval(() => {
    if (takeoverToastUntil && Date.now() > takeoverToastUntil) {
      takeoverToastUntil = 0;
      updateControlBar();
    }
  }, 500);

  // Al cerrar pestaña, liberar control si lo teníamos
  window.addEventListener("beforeunload", () => {
    if (controlMode) releaseControlBroadcast();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && controlMode) {
      // mantener claim con heartbeat; no liberar al minimizar
    }
  });

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-goto]");
    if (!t) return;
    goNotes(Number(t.dataset.goto));
  });

  if (btnPrev) btnPrev.addEventListener("click", () => goNotes(viewSlide - 1));
  if (btnNext) btnNext.addEventListener("click", () => goNotes(viewSlide + 1));
  if (btnFollow) btnFollow.addEventListener("click", () => resumeFollow());
  if (btnControl) btnControl.addEventListener("click", () => toggleControlMode());
  if (btnTakeControl) {
    btnTakeControl.addEventListener("click", () => setControlMode(true));
  }
  if (btnQa) btnQa.addEventListener("click", () => setQaOpen(!qaOpen, { manual: true }));
  if (btnQaClose) btnQaClose.addEventListener("click", () => setQaOpen(false, { manual: true }));

  if (qaFilters) {
    qaFilters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-qa-filter]");
      if (!btn) return;
      qaFilter = btn.dataset.qaFilter;
      renderQaFilters();
      renderQaBubbles();
    });
  }

  const btnTimer = $("btn-timer");
  const btnReset = $("btn-reset");
  const btnSessionReset = $("btn-session-reset");
  if (btnTimer) {
    btnTimer.addEventListener("click", () => {
      if (!controlMode) setControlMode(true);
      sendCmd("timer-toggle");
    });
  }
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (!controlMode) setControlMode(true);
      sendCmd("timer-reset");
    });
  }
  if (btnSessionReset) {
    btnSessionReset.addEventListener("click", () => resetSessionAll());
  }

  document.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case " ":
      case "PageDown":
        e.preventDefault();
        goNotes(viewSlide + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
      case "Backspace":
        e.preventDefault();
        goNotes(viewSlide - 1);
        break;
      case "Home":
        e.preventDefault();
        goNotes(0);
        break;
      case "End":
        e.preventDefault();
        goNotes(TOTAL - 1);
        break;
      case "q":
      case "Q":
        e.preventDefault();
        setQaOpen(!qaOpen, { manual: true });
        break;
      case "c":
      case "C":
        e.preventDefault();
        toggleControlMode();
        break;
      case "l":
      case "L":
      case "s":
      case "S":
        e.preventDefault();
        resumeFollow();
        break;
      case "Escape":
        if (qaOpen) {
          e.preventDefault();
          setQaOpen(false, { manual: true });
        } else if (controlMode) {
          e.preventDefault();
          setControlMode(false);
          resumeFollow();
        } else if (!followLive) {
          e.preventDefault();
          resumeFollow();
        }
        break;
      case "t":
      case "T":
        if (controlMode) {
          e.preventDefault();
          sendCmd("timer-toggle");
        }
        break;
      case "r":
      case "R":
        if (e.shiftKey) {
          e.preventDefault();
          resetSessionAll();
        } else if (controlMode) {
          e.preventDefault();
          sendCmd("timer-reset");
        }
        break;
      case "0":
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          resetSessionAll();
        }
        break;
      default:
        break;
    }
  });
})();
