/* Vista de notas · seguimiento / libre / control remoto del deck */
(() => {
  const NOTES = window.WEBFLIX_NOTES || [];
  const SPEAKERS = window.WEBFLIX_SPEAKERS || {};
  const TOTAL = NOTES.length;

  // Pitch v3 meta ~8:00 · warn 7:00 · danger 8:30
  const WARN_MS = 7 * 60 * 1000;
  const DANGER_MS = 8 * 60 * 1000 + 30 * 1000;

  // Vista local — cada pestaña de notas es independiente por defecto.
  // Solo se alinea al deck si el usuario aprieta "Seguir presentación" (o toma control).
  let viewSlide = 0;
  // Slide en vivo del deck (solo referencia; no mueve la vista si followLive=false)
  let liveSlide = 0;
  let followLive = false;
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
  // Nombre genérico de esta pestaña (sin personalizar por orador)
  const SESSION_NAME = "Presentador " + SESSION_ID.slice(0, 4);

  // Quién tiene el control remoto (null = nadie o nosotros)
  let remoteController = null; // { id, name, ts }
  let controlHeartbeat = null;
  let takeoverToastUntil = 0;
  let lastSessionEpoch = 0;
  const CONTROL_STALE_MS = 45 * 1000;

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
  const btnFocus = $("btn-focus");
  const qaPanel = $("qa-panel");
  const qaMetrics = $("qa-metrics");
  const qaFilters = $("qa-filters");
  const qaBubbles = $("qa-bubbles");
  const qaIntro = $("qa-intro");
  let focusMode = false;
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
    syncStatus.classList.remove(
      "is-live",
      "is-wait",
      "is-solo",
      "is-free",
      "is-control",
      "is-online",
      "is-reconnect"
    );
    if (mode === "control") {
      syncStatus.classList.add("is-control");
      syncStatus.textContent = extra || "Tú controlas el deck";
    } else if (mode === "online") {
      syncStatus.classList.add("is-online");
      syncStatus.textContent = extra || "Online global · en seguimiento";
    } else if (mode === "live") {
      syncStatus.classList.add("is-live");
      syncStatus.textContent = extra || "En seguimiento · presentación en vivo";
    } else if (mode === "free") {
      syncStatus.classList.add("is-free");
      syncStatus.textContent = extra || "Navegación libre · no afecta a otros";
    } else if (mode === "solo" || mode === "local") {
      syncStatus.classList.add("is-solo");
      syncStatus.textContent = extra || "Sin red global · solo local / misma máquina";
    } else if (mode === "reconnect") {
      syncStatus.classList.add("is-reconnect");
      syncStatus.textContent = extra || "Reconectando…";
    } else {
      syncStatus.classList.add("is-wait");
      syncStatus.textContent = extra || "Esperando presentación…";
    }
  }

  // Mostrar room compartido
  if (bus && bus.room) {
    const chip = $("room-chip");
    if (chip) chip.textContent = "room: " + bus.room;
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
    // Solo liberar si nosotros éramos el dueño (o no hay dueño)
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

  /** Limpieza local forzada (reinicio de sesión o claim viejo) */
  function clearControlLocal() {
    controlMode = false;
    stopHeartbeat();
    remoteController = null;
    takeoverToastUntil = 0;
  }

  function clearControlGlobal() {
    clearControlLocal();
    if (bus && typeof bus.sendControl === "function") {
      bus.sendControl("clear", {
        controllerId: SESSION_ID,
        controllerName: SESSION_NAME,
      });
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
    // Libre por defecto: la barra ofrece "Seguir presentación" hasta que el usuario opte in
    const freeBrowse = !followLive && !controlMode;
    if (followBar) {
      followBar.hidden = !freeBrowse;
    }
    if (liveHint) {
      const liveNote = NOTES[liveSlide];
      const title = liveNote ? liveNote.title : "—";
      if (!hasLive) {
        liveHint.textContent =
          "Tus notas no se mueven solas. Cuando el deck emita, puedes seguirlo aquí.";
      } else if (viewSlide === liveSlide) {
        liveHint.textContent = `Presentación en ${pad(liveSlide + 1)} · ${title} (mismo slide; aún en libre)`;
      } else {
        liveHint.textContent = `Presentación en ${pad(liveSlide + 1)} · ${title}`;
      }
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
    updateControlBar();

    const online = bus && typeof bus.isOnline === "function" && bus.isOnline();
    if (controlMode) {
      setSyncLabel(
        "control",
        (online ? "Online · " : "") + "Tú controlas · " + SESSION_NAME
      );
    } else if (followLive && hasLive) {
      setSyncLabel(
        online ? "online" : "live",
        online ? "Online · siguiendo presentación" : "Siguiendo presentación"
      );
    } else if (!followLive) {
      const n =
        otherHasControl() && remoteController
          ? remoteController.name + " controla el deck · "
          : "";
      setSyncLabel(
        "free",
        n +
          (liveAdvancedWhileBrowsing
            ? "Tus notas (libre) · la presentación avanzó"
            : "Tus notas (libre) · pulsa Seguir para alinear")
      );
    } else if (!hasLive) {
      setSyncLabel(
        online ? "online" : "wait",
        online ? "Online · notas en libre" : undefined
      );
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

  function renderMetricGroup(key, group) {
    if (!group || !group.items || !group.items.length) return "";
    const items = group.items
      .map(
        (m) => `<article class="qa-metric-item">
          <div class="qa-metric-top">
            <span class="qa-metric-name">${m.name}</span>
            <span class="qa-metric-meta">${m.meta || ""}</span>
          </div>
          <p class="qa-metric-note">${m.note || ""}</p>
        </article>`
      )
      .join("");
    return `<section class="qa-metric-col qa-metric-col--${key}">
      <header class="qa-metric-head">
        <h3>${group.title || key}</h3>
        <p>${group.subtitle || ""}</p>
      </header>
      <div class="qa-metric-list">${items}</div>
    </section>`;
  }

  function renderQaMetrics() {
    if (!qaMetrics) return;
    const m = QA.metricas;
    if (!m) {
      qaMetrics.innerHTML = "";
      qaMetrics.hidden = true;
      return;
    }
    qaMetrics.hidden = false;
    qaMetrics.innerHTML =
      renderMetricGroup("negocio", m.negocio) +
      renderMetricGroup("experimento", m.experimento);
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
      // Q&A y foco no conviven bien: salir de foco al abrir pistas
      if (focusMode) setFocusMode(false);
      if (qaIntro) qaIntro.textContent = QA.intro || "";
      renderQaMetrics();
      renderQaFilters();
      renderQaBubbles();
    }
    if (manual && !qaOpen) {
      // si el usuario cierra en el cierre, no re-autoabrir en este slide
      qaAutoOpenedForClose = true;
    }
  }

  function setFocusMode(on) {
    focusMode = !!on;
    if (app) app.classList.toggle("is-focus", focusMode);
    if (btnFocus) {
      btnFocus.classList.toggle("is-on", focusMode);
      btnFocus.setAttribute("aria-pressed", focusMode ? "true" : "false");
      btnFocus.textContent = focusMode ? "Salir foco" : "Modo foco";
      btnFocus.title = focusMode
        ? "F o Esc · volver a la vista completa"
        : "F · solo las notas, resto oscurecido";
    }
  }

  function maybeAutoOpenQa() {
    // En slide de cierre (último): abrir Q&A una vez
    if (viewSlide === TOTAL - 1 && !qaAutoOpenedForClose && !qaOpen) {
      qaAutoOpenedForClose = true;
      setQaOpen(true);
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderView() {
    const note = NOTES[viewSlide];
    if (!note) return;
    const sp = SPEAKERS[note.speaker] || {};

    const elTitle = $("now-title");
    const elOn = $("now-on-screen");
    const elWin = $("time-window");
    if (elTitle) elTitle.textContent = note.title;
    if (elOn) elOn.textContent = note.onScreen || "";
    if (elWin) elWin.textContent = note.window || "—";
    if (counterEl) counterEl.textContent = `${pad(viewSlide + 1)} / ${pad(TOTAL)}`;
    const progressSlide = hasLive ? liveSlide : viewSlide;
    if (progressFill) {
      progressFill.style.width = `${((progressSlide + 1) / TOTAL) * 100}%`;
    }

    const elSpName = $("speaker-name");
    const elSpRole = $("speaker-role");
    if (elSpName) elSpName.textContent = sp.name || note.speaker;
    if (elSpRole) elSpRole.textContent = note.role || "";
    const img = $("speaker-img");
    if (img) {
      if (sp.img) {
        img.src = sp.img;
        img.alt = sp.name || note.speaker;
        img.hidden = false;
      } else {
        img.hidden = true;
      }
    }

    const say = $("now-say");
    if (say) {
      say.innerHTML = (note.say || [])
        .map((line) => {
          const text = typeof line === "string" ? line : line.text || "";
          const hint = typeof line === "string" ? "" : line.hint || "";
          const hintHtml = hint
            ? `<span class="say-hint"><span class="say-hint-lab">En slide</span>${escapeHtml(hint)}</span>`
            : "";
          return `<div class="say-line"><p class="say-text">${escapeHtml(text)}</p>${hintHtml}</div>`;
        })
        .join("");
    }
    fillList($("now-highlight"), note.highlight);
    fillList($("now-avoid"), note.avoid);
    renderGlossary(note);

    if (pastStack) {
      const past = [];
      for (let i = viewSlide - 1; i >= 0 && past.length < 2; i--) past.push(NOTES[i]);
      pastStack.innerHTML =
        past.map((n) => miniCard(n)).join("") || miniCard(null, "Inicio");
    }

    if (nextStack) {
      const upcoming = [];
      for (let i = viewSlide + 1; i < TOTAL && upcoming.length < 2; i++) {
        upcoming.push(NOTES[i]);
      }
      nextStack.innerHTML =
        upcoming.map((n) => miniCard(n)).join("") || miniCard(null, "Fin · Q&A");
    }

    if (rail) {
      rail.querySelectorAll(".rail-item").forEach((btn, i) => {
        btn.classList.toggle("is-active", i === viewSlide);
        btn.classList.toggle("is-past", i < viewSlide);
        btn.classList.toggle("is-live", hasLive && i === liveSlide);
      });
    }

    // reset auto-flag al salir del cierre
    if (viewSlide !== TOTAL - 1) {
      qaAutoOpenedForClose = false;
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

  /** Reinicio total local + deck: slide 0, timer 00:00, sin control */
  function resetSessionAll() {
    const ok = window.confirm(
      "¿Reiniciar la sesión desde cero?\n\n• Slide 01 (portada)\n• Timer 00:00\n• Se suelta el control remoto\n• Afecta al deck y a todos en la sala"
    );
    if (!ok) return;

    // Limpiar control de toda la sala
    clearControlGlobal();

    // Esta pestaña vuelve a portada en libre (no en seguimiento automático)
    followLive = false;
    liveAdvancedWhileBrowsing = false;
    viewSlide = 0;
    liveSlide = 0;
    hasLive = true;
    timerRunning = false;
    timerStartedAt = null;
    timerAccumulated = 0;
    if (timerRaf) {
      cancelAnimationFrame(timerRaf);
      timerRaf = null;
    }
    renderTimer();
    if (qaOpen) setQaOpen(false, { manual: true });
    qaAutoOpenedForClose = false;

    // Deck + otros (sessionEpoch en el state)
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

    // Browse libre: nunca re-engancha el seguimiento solo por coincidir de slide
    viewSlide = index;
    followLive = false;
    if (hasLive && viewSlide !== liveSlide) {
      liveAdvancedWhileBrowsing = true;
    }
    renderView();
  }

  /** Opt-in: el usuario pide alinear sus notas al deck */
  function resumeFollow() {
    if (controlMode) {
      releaseControlBroadcast();
    }
    controlMode = false;
    followLive = true;
    liveAdvancedWhileBrowsing = false;
    viewSlide = hasLive ? liveSlide : viewSlide;
    renderView();
  }

  function setControlMode(on) {
    const next = !!on;
    if (next === controlMode) {
      renderView();
      return;
    }

    if (next) {
      // Tomar control implica alinear (tú eres el driver del deck)
      controlMode = true;
      followLive = true;
      liveAdvancedWhileBrowsing = false;
      viewSlide = hasLive ? liveSlide : viewSlide;
      claimControlBroadcast();
      sendCmd("goto", {
        slide: viewSlide,
        controllerId: SESSION_ID,
        controllerName: SESSION_NAME,
      });
    } else {
      // Al soltar control, volver a libre en el slide actual (no arrastrar al vivo)
      controlMode = false;
      followLive = false;
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
    const ts = ctrl.ts || Date.now();

    // Claim caducado (sesión anterior en localStorage)
    if (ctrl.action === "claim" && Date.now() - ts > CONTROL_STALE_MS) {
      return;
    }

    if (ctrl.action === "clear") {
      clearControlLocal();
      // No forzar seguimiento: cada pestaña se queda donde estaba
      renderView();
      return;
    }

    if (ctrl.action === "claim") {
      if (!id) return;
      // Nosotros re-claimamos: eco / heartbeat
      if (id === SESSION_ID) {
        remoteController = { id, name, ts };
        updateFollowUI();
        return;
      }
      // Otro tomó el control
      const wasMine = controlMode;
      remoteController = { id, name, ts };
      if (wasMine) {
        controlMode = false;
        stopHeartbeat();
        // Quedarse en libre en el slide actual — no saltar al vivo
        followLive = false;
        takeoverToastUntil = Date.now() + 8000;
      } else {
        takeoverToastUntil = Date.now() + 5000;
      }
      renderView();
      return;
    }

    if (ctrl.action === "release") {
      // Solo limpia si liberó el dueño actual
      if (!remoteController || !id || remoteController.id === id) {
        remoteController = null;
      }
      renderView();
    }
  }

  function onLiveState(state) {
    if (!state || typeof state.slide !== "number") return;

    // Solo el deck en modo "Emitir" mueve las notas.
    // Así un revisor que navega el pitch no te saca del guion.
    // (Estados viejos sin broadcast se ignoran.)
    if (state.broadcast !== true) {
      return;
    }

    hasLive = true;

    // Reinicio total desde el deck: actualiza reloj/live; solo mueve la vista si ya se optó a seguir
    if (
      typeof state.sessionEpoch === "number" &&
      state.sessionEpoch > 0 &&
      state.sessionEpoch !== lastSessionEpoch
    ) {
      lastSessionEpoch = state.sessionEpoch;
      clearControlLocal();
      liveSlide = Math.min(TOTAL - 1, Math.max(0, state.slide));
      applyTimerFromLive(state);
      if (qaOpen) setQaOpen(false, { manual: true });
      qaAutoOpenedForClose = false;
      if (controlMode || followLive) {
        viewSlide = liveSlide;
        liveAdvancedWhileBrowsing = false;
      } else {
        liveAdvancedWhileBrowsing = viewSlide !== liveSlide;
      }
      renderView();
      return;
    }

    const nextLive = Math.min(TOTAL - 1, Math.max(0, state.slide));
    const changed = nextLive !== liveSlide;
    liveSlide = nextLive;

    // Timer del deck siempre (contexto compartido); la slide solo si follow/control
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
      if (controlMode) {
        setSyncLabel(
          "control",
          (st === "online" ? "Online · " : "") + "Tú controlas · " + SESSION_NAME
        );
      } else if (!followLive) {
        updateFollowUI();
      } else if (st === "online") {
        setSyncLabel(
          "online",
          hasLive
            ? "Online · siguiendo presentación"
            : "Online · esperando Emitir en el deck…"
        );
      } else if (st === "reconnect") setSyncLabel("reconnect");
      else if (!hasLive && (st === "wait" || st === "init")) {
        setSyncLabel("wait", "Esperando deck en modo Emitir…");
      } else if (hasLive) setSyncLabel(st === "local" ? "solo" : "live");
      else if (st === "local") setSyncLabel("solo", "Local · sin presentador emitiendo");
    });
  } else {
    setSyncLabel("solo", "Sync no cargó · solo local");
  }

  // Si al abrir ya hay claim fresco en storage
  if (bus && typeof bus.getLatestControl === "function") {
    const boot = bus.getLatestControl();
    if (boot && boot.action === "claim") {
      const age = Date.now() - (boot.ts || 0);
      if (age <= CONTROL_STALE_MS) onRemoteControl(boot);
    }
  }

  // Bootstrap estado del deck (slide/timer) si ya hay sesión en curso
  if (bus && typeof bus.getLatest === "function") {
    const bootState = bus.getLatest();
    if (bootState && typeof bootState.slide === "number") {
      if (typeof bootState.sessionEpoch === "number") {
        lastSessionEpoch = bootState.sessionEpoch;
      }
      onLiveState(bootState);
    }
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
  if (btnFocus) {
    btnFocus.addEventListener("click", () => setFocusMode(!focusMode));
  }

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
      case "f":
      case "F":
        e.preventDefault();
        setFocusMode(!focusMode);
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
        } else if (focusMode) {
          e.preventDefault();
          setFocusMode(false);
        } else if (controlMode) {
          e.preventDefault();
          // Suelta control y queda en libre (no salta al vivo)
          setControlMode(false);
        }
        // Esc ya no fuerza "Seguir": el follow es solo L / botón
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
