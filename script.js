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

  const WARN_MS = 9 * 60 * 1000 + 30 * 1000;
  const DANGER_MS = 10 * 60 * 1000 + 30 * 1000;
  let timerStartedAt = null;
  let timerAccumulated = 0;
  let timerRunning = false;
  let timerRaf = null;
  let lastPublishAt = 0;
  /** Se incrementa en cada reinicio total para que las notas limpien control */
  let sessionEpoch = 0;

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
    };
  }

  function publish(force) {
    if (!bus) return;
    const now = Date.now();
    // Throttle heartbeats; siempre forzar en cambios de slide
    if (!force && now - lastPublishAt < 400) return;
    lastPublishAt = now;
    bus.publish(getState());
  }

  function renderTimer() {
    const ms = elapsed();
    if (timerTime) timerTime.textContent = formatMs(ms);
    if (timerEl) timerEl.dataset.state = timerState(ms);
    if (timerRunning) {
      // heartbeat para que las notas mantengan el reloj alineado
      if (Date.now() - lastPublishAt > 2000) publish(true);
      timerRaf = requestAnimationFrame(renderTimer);
    }
  }

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
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

  function maybeArmTimer(index) {
    if (index >= 1 && !timerArmed) {
      timerArmed = true;
      startTimer();
    }
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

  function setDemoLevel(level) {
    demoLevel = Math.min(3, Math.max(1, level));
    document.querySelectorAll(".demo-level").forEach((el) => {
      el.classList.toggle("is-active", Number(el.dataset.level) === demoLevel);
    });
    document.querySelectorAll(".dot").forEach((el) => {
      el.classList.toggle("is-on", Number(el.dataset.goto) === demoLevel);
    });
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
          resetTimer();
          if (current >= 1) {
            timerArmed = true;
            startTimer();
          }
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
    if (e.target.closest("button, a, kbd, .dot, .timer, .speaker-tag, .hud, #timer")) return;
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

  document.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case " ":
      case "PageDown":
        e.preventDefault();
        next();
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
      case "Backspace":
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
          resetTimer();
          if (current >= 1) {
            timerArmed = true;
            startTimer();
          }
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
      timerEl.title =
        "T pause · R reset · Shift+R sesión 0 · " + net + " · room=" + room;
    });
  }

  // Heartbeat de estado por si MQTT reconecta
  setInterval(() => {
    if (!document.hidden) publish(true);
  }, 4000);
});
