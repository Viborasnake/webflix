/* WebFlix Pitch Deck · navigation, timer, demo · publica estado a /notas */

document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const progress = document.getElementById("progress");
  const counter = document.getElementById("counter");
  const chromeLogo = document.getElementById("chrome-logo");
  const speakerTag = document.getElementById("speaker-tag");
  const speakerImg = document.getElementById("speaker-img");
  const speakerName = document.getElementById("speaker-name");
  const hudEl = document.getElementById("hud");
  const timerEl = document.getElementById("timer");
  const timerTime = document.getElementById("timer-time");
  const timerPlayBtn = document.getElementById("timer-play");
  const timerPlayIcon = document.getElementById("timer-play-icon");
  const btnPresent = document.getElementById("btn-present");
  const presentLabel = document.getElementById("present-label");

  const SPEAKERS = {
    Erick: { name: "Erick Fuentealba", img: "assets/Erick.png" },
    Tamara: { name: "Tamara Valdivia", img: "assets/Tami.png" },
    Valeria: { name: "Valeria Nieto", img: "assets/Vale.png" },
    Cristian: { name: "Cristian Pizarro", img: "assets/Cris.png" },
  };

  const bus = window.WebflixSync
    ? window.WebflixSync.createBus("deck")
    : null;

  const DEMO_INDEX = slides.findIndex((s) => s.hasAttribute("data-demo"));
  const total = slides.length;
  let current = 0;
  let demoLevel = 1;
  let hudVisible = false;
  let timerArmed = false;

  // Pitch v3 meta ~8:00 · warn 7:00 · danger 8:30
  const WARN_MS = 7 * 60 * 1000;
  const DANGER_MS = 8 * 60 * 1000 + 30 * 1000;
  let timerStartedAt = null;
  let timerAccumulated = 0;
  let timerRunning = false;
  let timerRaf = null;
  let lastPublishAt = 0;
  /** Se incrementa en cada reinicio total para que las notas limpien control */
  let sessionEpoch = 0;

  /**
   * Solo el deck en modo PRESENTAR emite slide/timer a /notas.
   * Por defecto OFF: revisar el deck no mueve las notas de nadie.
   * Activa con ?present=1, tecla E, o el botón "Emitir".
   */
  const PRESENT_KEY = "webflix-deck-present";
  function readPresentFlag() {
    try {
      const q = new URLSearchParams(window.location.search);
      if (q.get("present") === "1" || q.get("emit") === "1") return true;
      if (q.get("present") === "0" || q.get("review") === "1") return false;
      return sessionStorage.getItem(PRESENT_KEY) === "1";
    } catch (_) {
      return false;
    }
  }
  let isPresenter = readPresentFlag();

  function getPresenterId() {
    try {
      let id = sessionStorage.getItem("webflix-deck-pid");
      if (!id) {
        id =
          (crypto.randomUUID && crypto.randomUUID()) ||
          "d-" + Math.random().toString(36).slice(2, 10);
        sessionStorage.setItem("webflix-deck-pid", id);
      }
      return id;
    } catch (_) {
      return "d-" + Math.random().toString(36).slice(2, 10);
    }
  }
  const PRESENTER_ID = getPresenterId();

  function updatePresentUI() {
    if (btnPresent) {
      btnPresent.classList.toggle("is-on", isPresenter);
      btnPresent.setAttribute("aria-pressed", isPresenter ? "true" : "false");
      btnPresent.title = isPresenter
        ? "E · Dejar de emitir (las notas dejan de seguir este deck)"
        : "E · Emitir a /notas. Apagado = revisar sin mover las notas de nadie";
    }
    if (presentLabel) {
      presentLabel.textContent = isPresenter ? "Emitiendo" : "Revisar";
    }
  }

  function setPresenter(on, opts) {
    const next = !!on;
    const forcePublish = opts && opts.forcePublish;
    if (next === isPresenter && !forcePublish) {
      updatePresentUI();
      return;
    }
    isPresenter = next;
    try {
      sessionStorage.setItem(PRESENT_KEY, isPresenter ? "1" : "0");
    } catch (_) { /* private mode */ }
    updatePresentUI();
    if (isPresenter) {
      // Anuncia este deck como fuente de verdad
      publish(true);
    }
  }

  function togglePresenter() {
    setPresenter(!isPresenter);
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function formatMs(ms) {
    const sec = Math.floor(ms / 1000);
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
      slide: current,
      total,
      demoLevel,
      timerRunning,
      timerAccumulated,
      timerStartedAt,
      timerMs: elapsed(),
      timerArmed,
      sessionEpoch,
      speaker: slides[current] && slides[current].dataset.speaker,
      // Las notas solo siguen estados con broadcast:true (modo presentador)
      broadcast: true,
      presenterId: PRESENTER_ID,
    };
  }

  function publish(force) {
    if (!bus) return;
    // Revisores: navegan en silencio. Solo el presentador mueve /notas.
    if (!isPresenter) return;
    const now = Date.now();
    // Throttle heartbeats; siempre forzar en cambios de slide
    if (!force && now - lastPublishAt < 400) return;
    lastPublishAt = now;
    bus.publish(getState());
  }

  function updateTimerPlayUI() {
    if (timerEl) timerEl.dataset.running = timerRunning ? "true" : "false";
    if (timerPlayIcon) timerPlayIcon.textContent = timerRunning ? "❚❚" : "▶";
    if (timerPlayBtn) {
      timerPlayBtn.setAttribute(
        "aria-label",
        timerRunning ? "Pausar cronómetro" : "Iniciar cronómetro"
      );
      timerPlayBtn.title = timerRunning ? "Pausar (T)" : "Play (T)";
    }
  }

  function renderTimer() {
    const ms = elapsed();
    if (timerTime) timerTime.textContent = formatMs(ms);
    if (timerEl) timerEl.dataset.state = timerState(ms);
    updateTimerPlayUI();
    if (timerRunning) {
      // heartbeat para que las notas mantengan el reloj alineado
      if (Date.now() - lastPublishAt > 2000) publish(true);
      timerRaf = requestAnimationFrame(renderTimer);
    }
  }

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    timerArmed = true;
    timerStartedAt = Date.now();
    renderTimer();
    publish(true);
  }

  function pauseTimer() {
    if (!timerRunning) return;
    timerAccumulated = elapsed();
    timerRunning = false;
    timerStartedAt = null;
    if (timerRaf) cancelAnimationFrame(timerRaf);
    renderTimer();
    publish(true);
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
    publish(true);
  }

  /** Antes armaba solo al salir de portada; ahora el cronómetro es 100% manual */
  function maybeArmTimer(_index) {
    /* no-op: play solo con botón / T / control remoto */
  }

  function setHud(visible) {
    hudVisible = visible;
    if (hudEl) hudEl.hidden = !visible;
    if (!visible && speakerTag) speakerTag.hidden = true;
    else if (visible) updateSpeaker(slides[current]);
  }

  function toggleHud() {
    setHud(!hudVisible);
  }

  function getDemoVideo() {
    return document.getElementById("demo-video");
  }

  function getDemoLevelEl() {
    const v = getDemoVideo();
    return v ? v.closest(".demo-level") : null;
  }

  function getDemoStage() {
    return document.getElementById("stage-demo");
  }

  let demoCinema = false;

  function setDemoCinema(on) {
    demoCinema = !!on;
    const stage = getDemoStage();
    const exitBtn = document.getElementById("demo-exit-btn");
    const slide = DEMO_INDEX >= 0 ? slides[DEMO_INDEX] : null;
    if (stage) stage.classList.toggle("is-cinema", demoCinema);
    if (slide) slide.classList.toggle("is-demo-cinema", demoCinema);
    if (exitBtn) exitBtn.hidden = !demoCinema;
    if (!demoCinema) {
      // Al salir del foco, pausar para no seguir oyendo en segundo plano
      const v = getDemoVideo();
      if (v && !v.paused) {
        try {
          v.pause();
        } catch (_) { /* ignore */ }
      }
      setDemoPlayingUI(false);
    }
  }

  function exitDemoCinema() {
    setDemoCinema(false);
  }

  function setDemoPlayingUI(playing) {
    const level = getDemoLevelEl();
    const btn = document.getElementById("demo-play-btn");
    if (level) level.classList.toggle("is-playing", !!playing);
    if (btn) {
      const icon = btn.querySelector(".demo-play-icon");
      const label = btn.querySelector(".demo-play-label");
      if (icon) icon.textContent = playing ? "❚❚" : "▶";
      if (label) label.textContent = playing ? "Pause" : "Play";
      btn.setAttribute("aria-label", playing ? "Pausar video" : "Reproducir video");
    }
  }

  function pauseDemoVideo() {
    const v = getDemoVideo();
    if (!v) return;
    try {
      v.pause();
    } catch (_) { /* ignore */ }
    setDemoPlayingUI(false);
  }

  function playDemoVideo({ restart } = {}) {
    const v = getDemoVideo();
    if (!v) return;
    // Ampliar al centro y ocultar el texto del slide
    setDemoCinema(true);
    try {
      if (restart) v.currentTime = 0;
      const p = v.play();
      if (p && typeof p.then === "function") {
        p.then(() => setDemoPlayingUI(true)).catch(() => setDemoPlayingUI(false));
      } else {
        setDemoPlayingUI(!v.paused);
      }
    } catch (_) {
      setDemoPlayingUI(false);
    }
  }

  function toggleDemoVideo() {
    const v = getDemoVideo();
    if (!v) return;
    if (v.paused) playDemoVideo();
    else pauseDemoVideo(); // queda en modo cine pausado
  }

  function setDemoLevel(level) {
    demoLevel = Math.min(3, Math.max(1, level));
    document.querySelectorAll(".demo-level").forEach((el) => {
      el.classList.toggle("is-active", Number(el.dataset.level) === demoLevel);
    });
    document.querySelectorAll(".dot").forEach((el) => {
      el.classList.toggle("is-on", Number(el.dataset.goto) === demoLevel);
    });

    // Video solo en nivel 1 — play siempre manual (botón / Space / P)
    if (demoLevel !== 1) {
      exitDemoCinema();
      pauseDemoVideo();
    } else {
      const v = getDemoVideo();
      setDemoPlayingUI(v && !v.paused);
    }
    publish(true);
  }

  function updateSpeaker(slide) {
    if (!hudVisible || !speakerTag) {
      if (speakerTag) speakerTag.hidden = true;
      return;
    }
    const key = slide.dataset.speaker;
    const info = key && SPEAKERS[key];
    if (!info || slide.dataset.theme === "immersive") {
      speakerTag.hidden = true;
      return;
    }
    speakerImg.src = info.img;
    speakerImg.alt = info.name;
    speakerName.textContent = info.name;
    speakerTag.hidden = false;
  }

  function goTo(index, opts) {
    if (index < 0 || index >= total) return;
    const noArm = opts && opts.noArm;

    if (index !== current) {
      slides[current].classList.remove("is-active");
      current = index;
      slides[current].classList.add("is-active");
    } else if (!slides[current].classList.contains("is-active")) {
      slides[current].classList.add("is-active");
    }

    if (!noArm) maybeArmTimer(current);

    const slide = slides[current];
    const pct = ((current + 1) / total) * 100;
    if (progress) progress.style.width = `${pct}%`;
    if (counter) {
      counter.textContent = `${pad(current + 1)} / ${pad(total)}`;
    }

    const hideLogo = slide.hasAttribute("data-no-logo");
    if (chromeLogo) chromeLogo.hidden = hideLogo;

    updateSpeaker(slide);

    // Demo video: al salir de la slide, cerrar modo cine y pausar
    if (DEMO_INDEX >= 0 && current !== DEMO_INDEX) {
      exitDemoCinema();
      pauseDemoVideo();
    }

    publish(true);
  }

  /** Reinicio total: portada, timer 00:00, demo nivel 1, sin armar cronómetro */
  function resetSession() {
    sessionEpoch += 1;
    // Orden: timer off → demo 1 → portada (sin armar timer)
    timerRunning = false;
    timerStartedAt = null;
    timerAccumulated = 0;
    timerArmed = false;
    if (timerRaf) {
      cancelAnimationFrame(timerRaf);
      timerRaf = null;
    }
    if (timerTime) timerTime.textContent = "00:00";
    if (timerEl) timerEl.dataset.state = "ok";
    updateTimerPlayUI();

    demoLevel = 1;
    document.querySelectorAll(".demo-level").forEach((el) => {
      el.classList.toggle("is-active", Number(el.dataset.level) === 1);
    });
    document.querySelectorAll(".dot").forEach((el) => {
      el.classList.toggle("is-on", Number(el.dataset.goto) === 1);
    });

    goTo(0, { noArm: true });
    publish(true);
  }

  function next() {
    goTo(Math.min(total - 1, current + 1));
  }

  function prev() {
    goTo(Math.max(0, current - 1));
  }

  // Comandos remotos desde /notas en modo "Controlar presentación"
  if (bus && typeof bus.onCommand === "function") {
    bus.onCommand((cmd) => {
      if (!cmd || !cmd.cmd) return;
      switch (cmd.cmd) {
        case "goto":
          if (typeof cmd.slide === "number") goTo(cmd.slide);
          break;
        case "next":
          next();
          break;
        case "prev":
          prev();
          break;
        case "timer-toggle":
          toggleTimer();
          break;
        case "timer-reset":
          // Solo a cero; no arranca solo (play manual)
          resetTimer();
          break;
        case "session-reset":
          resetSession();
          break;
        case "demo-level":
          if (typeof cmd.level === "number") setDemoLevel(cmd.level);
          break;
        default:
          break;
      }
    });
  }

  document.getElementById("deck").addEventListener("click", (e) => {
    if (
      e.target.closest(
        "button, a, kbd, .dot, .timer, .speaker-tag, .hud, #timer, .present-btn, .deck-top-right, .demo-exit-btn, .demo-play-btn, .demo-video, .phone"
      )
    )
      return;
    // En modo cine, un clic fuera no avanza slides
    if (demoCinema) return;
    const x = e.clientX / window.innerWidth;
    if (x < 0.22) prev();
    else next();
  });

  document.querySelectorAll(".dot").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setDemoLevel(Number(btn.dataset.goto));
    });
  });

  // Play manual del video de Cris (botón + clic). Flechas = solo slides.
  const demoPlayBtn = document.getElementById("demo-play-btn");
  const demoExitBtn = document.getElementById("demo-exit-btn");
  const demoVideo = getDemoVideo();

  function blurDemoFocus() {
    try {
      if (demoVideo) demoVideo.blur();
      if (demoPlayBtn) demoPlayBtn.blur();
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }
    } catch (_) { /* ignore */ }
  }

  if (demoExitBtn) {
    demoExitBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      exitDemoCinema();
      blurDemoFocus();
    });
  }

  if (demoPlayBtn) {
    demoPlayBtn.tabIndex = -1;
    demoPlayBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDemoVideo();
      blurDemoFocus();
    });
  }
  if (demoVideo) {
    // Sin foco/controls nativos: evita seek con ← →
    demoVideo.tabIndex = -1;
    demoVideo.removeAttribute("controls");
    demoVideo.setAttribute("controlslist", "nodownload noplaybackrate noremoteplayback");
    demoVideo.setAttribute("disablePictureInPicture", "");

    demoVideo.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDemoVideo();
      blurDemoFocus();
    });
    demoVideo.addEventListener("play", () => {
      setDemoCinema(true);
      setDemoPlayingUI(true);
    });
    demoVideo.addEventListener("pause", () => setDemoPlayingUI(false));
    demoVideo.addEventListener("ended", () => {
      setDemoPlayingUI(false);
      try {
        demoVideo.currentTime = 0;
      } catch (_) { /* ignore */ }
      // Se queda en modo cine con Play para repetir o Salir
    });
    demoVideo.addEventListener("error", () => {
      console.warn("[webflix] No se pudo cargar el video del experimento");
      setDemoPlayingUI(false);
    });
  }

  document.addEventListener(
    "keydown",
    (e) => {
      // Bloquear seek nativo del <video> (flechas, j/l, media keys, etc.)
      const v = getDemoVideo();
      const mediaKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "PageUp",
        "PageDown",
        "MediaTrackNext",
        "MediaTrackPrevious",
        "MediaPlayPause",
        "MediaFastForward",
        "MediaRewind",
      ];
      if (
        v &&
        (e.target === v || document.activeElement === v) &&
        mediaKeys.includes(e.key)
      ) {
        e.preventDefault();
        try {
          v.blur();
        } catch (_) { /* ignore */ }
      }
    },
    true
  );

  document.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    // Si el foco quedó en el video, quitarlo: flechas son de slides
    if (e.target && e.target.id === "demo-video") {
      try {
        e.target.blur();
      } catch (_) { /* ignore */ }
    }

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
        if (demoCinema) {
          e.preventDefault();
          break;
        }
        e.preventDefault();
        next();
        break;
      case " ":
        // Solo Space (y P) controlan el video; flechas NUNCA
        if (current === DEMO_INDEX && demoLevel === 1) {
          e.preventDefault();
          toggleDemoVideo();
          break;
        }
        if (demoCinema) {
          e.preventDefault();
          break;
        }
        e.preventDefault();
        next();
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
      case "Backspace":
        if (demoCinema) {
          e.preventDefault();
          // ← o Esc-like: salir del cine
          if (e.key === "Backspace" || e.key === "ArrowLeft") {
            exitDemoCinema();
          }
          break;
        }
        e.preventDefault();
        prev();
        break;
      case "Home":
        e.preventDefault();
        goTo(0);
        break;
      case "End":
        e.preventDefault();
        goTo(total - 1);
        break;
      case "h":
      case "H":
        toggleHud();
        break;
      case "t":
      case "T":
        toggleTimer();
        break;
      case "r":
      case "R":
        if (e.shiftKey) {
          e.preventDefault();
          resetSession();
        } else {
          // Solo reinicia a 00:00; hay que dar play de nuevo
          e.preventDefault();
          resetTimer();
        }
        break;
      case "0":
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          resetSession();
        }
        break;
      case "d":
      case "D":
        if (DEMO_INDEX >= 0) goTo(DEMO_INDEX);
        break;
      case "1":
      case "2":
      case "3":
        if (current === DEMO_INDEX) setDemoLevel(Number(e.key));
        break;
      case "p":
      case "P":
        if (current === DEMO_INDEX && demoLevel === 1) {
          e.preventDefault();
          toggleDemoVideo();
        }
        break;
      case "Escape":
        if (demoCinema) {
          e.preventDefault();
          exitDemoCinema();
        }
        break;
      case "e":
      case "E":
        // En modo cine, E no cambia emitir (evita confusión)
        if (demoCinema) {
          e.preventDefault();
          exitDemoCinema();
          break;
        }
        e.preventDefault();
        togglePresenter();
        break;
      case "f":
      case "F":
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
        break;
      case "n":
      case "N": {
        window.open("notas/", "webflix-notas");
        break;
      }
      default:
        break;
    }
  });

  let touchX = null;
  document.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  document.addEventListener(
    "touchend",
    (e) => {
      if (touchX == null) return;
      const dx = e.changedTouches[0].screenX - touchX;
      if (Math.abs(dx) > 50) {
        if (dx < 0) next();
        else prev();
      }
      touchX = null;
    },
    { passive: true }
  );

  setHud(false);
  updatePresentUI();
  if (btnPresent) {
    btnPresent.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePresenter();
    });
  }
  if (timerPlayBtn) {
    timerPlayBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTimer();
    });
  }
  if (timerEl) {
    // Clic en el reloj también play/pausa (no solo el botón)
    timerEl.addEventListener("click", (e) => {
      if (e.target.closest(".timer-play")) return;
      e.stopPropagation();
      toggleTimer();
    });
  }

  // Init limpio: portada, timer en 0, demo 1 (sin armar cronómetro)
  demoLevel = 1;
  document.querySelectorAll(".demo-level").forEach((el) => {
    el.classList.toggle("is-active", Number(el.dataset.level) === 1);
  });
  document.querySelectorAll(".dot").forEach((el) => {
    el.classList.toggle("is-on", Number(el.dataset.goto) === 1);
  });
  goTo(0, { noArm: true });
  renderTimer();
  // Solo emite si este deck es el presentador (no al revisar)
  publish(true);

  // Re-publicar al recuperar foco (clientes que se reconectan)
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) publish(true);
  });

  // Estado de red global en el title del timer
  if (bus && typeof bus.onStatus === "function") {
    bus.onStatus((st, meta) => {
      if (!timerEl) return;
      const room = (meta && meta.room) || (bus && bus.room) || "";
      const net =
        st === "online"
          ? "Online global"
          : st === "reconnect"
            ? "Reconectando…"
            : "Local / misma red";
      const mode = isPresenter ? "Emitiendo → notas" : "Solo revisar";
      timerEl.title =
        "T pause · R reset · E emitir · Shift+R sesión 0 · " +
        mode +
        " · " +
        net +
        " · room=" +
        room;
    });
  }

  // Heartbeat de estado por si MQTT reconecta (solo presentador)
  setInterval(() => {
    if (!document.hidden) publish(true);
  }, 4000);
});
