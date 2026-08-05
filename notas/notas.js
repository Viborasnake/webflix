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
  let controlMode = false; // true = ←→ mueven el deck
  let hasLive = false;
  let liveAdvancedWhileBrowsing = false;

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
      syncStatus.textContent = extra || "Control remoto · mueves la presentación";
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

  function updateControlButton() {
    if (!btnControl) return;
    btnControl.classList.toggle("is-on", controlMode);
    btnControl.setAttribute("aria-pressed", controlMode ? "true" : "false");
    btnControl.textContent = controlMode ? "● Control activo" : "Controlar presentación";
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

    if (controlMode) {
      setSyncLabel("control");
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
    say.innerHTML = (note.say || []).map((line) => `<p>${line}</p>`).join("");
    fillList($("now-highlight"), note.highlight);
    fillList($("now-avoid"), note.avoid);

    const past = [];
    for (let i = viewSlide - 1; i >= 0 && past.length < 2; i--) past.push(NOTES[i]);
    pastStack.innerHTML =
      past.map((n) => miniCard(n)).join("") || miniCard(null, "Inicio del pitch");

    const upcoming = [];
    for (let i = viewSlide + 1; i < TOTAL && upcoming.length < 2; i++) upcoming.push(NOTES[i]);
    nextStack.innerHTML =
      upcoming.map((n) => miniCard(n)).join("") || miniCard(null, "Fin · Q&A");

    rail.querySelectorAll(".rail-item").forEach((btn, i) => {
      btn.classList.toggle("is-active", i === viewSlide);
      btn.classList.toggle("is-past", i < viewSlide);
      btn.classList.toggle("is-live", hasLive && i === liveSlide);
    });

    updateFollowUI();
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
    bus.sendCommand(cmd, extra);
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
    controlMode = false;
    followLive = true;
    liveAdvancedWhileBrowsing = false;
    viewSlide = liveSlide;
    renderView();
  }

  function setControlMode(on) {
    controlMode = !!on;
    if (controlMode) {
      // Al activar control, saltamos al vivo y enganchamos
      followLive = true;
      liveAdvancedWhileBrowsing = false;
      viewSlide = liveSlide;
      // Forzar al deck al slide actual de esta vista (por si quiere arrancar control desde aquí)
      sendCmd("goto", { slide: viewSlide });
    }
    renderView();
  }

  function toggleControlMode() {
    setControlMode(!controlMode);
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
    bus.onStatus((st) => {
      if (controlMode) setSyncLabel("control");
      else if (!hasLive && (st === "wait" || st === "init")) setSyncLabel("wait");
      else if (!followLive) updateFollowUI();
      else if (hasLive) setSyncLabel("live");
      else if (st === "local") setSyncLabel("solo");
    });
  } else {
    setSyncLabel("solo", "Sync no cargó · solo local");
  }

  buildRail();
  renderView();
  renderTimer();

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-goto]");
    if (!t) return;
    goNotes(Number(t.dataset.goto));
  });

  if (btnPrev) btnPrev.addEventListener("click", () => goNotes(viewSlide - 1));
  if (btnNext) btnNext.addEventListener("click", () => goNotes(viewSlide + 1));
  if (btnFollow) btnFollow.addEventListener("click", () => resumeFollow());
  if (btnControl) btnControl.addEventListener("click", () => toggleControlMode());

  const btnTimer = $("btn-timer");
  const btnReset = $("btn-reset");
  if (btnTimer) {
    btnTimer.addEventListener("click", () => {
      if (!controlMode) {
        // hint: solo en control
        setControlMode(true);
      }
      sendCmd("timer-toggle");
    });
  }
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (!controlMode) setControlMode(true);
      sendCmd("timer-reset");
    });
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
        if (controlMode) {
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
        if (controlMode) {
          e.preventDefault();
          sendCmd("timer-reset");
        }
        break;
      default:
        break;
    }
  });
})();
