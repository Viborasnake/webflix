/* Q&A · pistas para responder (obvias, no tan obvias, falacias, coherencia, decisión, plan B) */
window.WEBFLIX_QA = {
  intro:
    "Pistas para el cierre. No leas en voz alta: ancla, responde en una idea, cierra. Quién responde según el tema.",
  filters: [
    { id: "all", label: "Todos" },
    { id: "obvia", label: "Obvias" },
    { id: "profunda", label: "No tan obvias" },
    { id: "falacia", label: "Falacias / lógica" },
    { id: "coherencia", label: "Coherencia" },
    { id: "decision", label: "Decisiones" },
    { id: "planb", label: "Plan B · Exp. 2" },
  ],
  pistas: [
    // ── Obvias ──────────────────────────────────────
    {
      id: "d7-directo",
      cat: "obvia",
      tag: "Day-7",
      who: "Erick / Vale",
      q: "¿Por qué no miden Day-7 como KPI principal del experimento?",
      pista:
        "Day-7 es el outcome de negocio. Hoy validamos los pasos previos: activación y relevancia en la 1ª sesión. Con n=30–50 no se prueba retención a escala. Lo declaramos desde el minuto uno.",
    },
    {
      id: "n-chica",
      cat: "obvia",
      tag: "Muestra",
      who: "Tami / Vale",
      q: "¿30–50 usuarios no es muy poco?",
      pista:
        "Es direccional, no prueba de plataforma. Buscamos señal para decidir (automatizar / iterar / descartar), no significancia a escala WebFlix. El next step es muestra representativa por región.",
    },
    {
      id: "simulados",
      cat: "obvia",
      tag: "Datos",
      who: "Vale",
      q: "¿Estos resultados son reales o inventados?",
      pista:
        "Simulados para el ejercicio, coherentes con los umbrales de éxito predefinidos. No son campo en producción. La lógica de decisión (confirma / refuta) sí es la que usaríamos con datos reales.",
    },
    {
      id: "woz",
      cat: "obvia",
      tag: "WoZ",
      who: "Tami / Cris",
      q: "¿Por qué Wizard of Oz y no el motor real?",
      pista:
        "La incertidumbre hoy es de deseabilidad y usabilidad, no de factibilidad. Probamos la idea antes de ingeniería. El WoZ es techo de valor, no promesa del motor.",
    },
    {
      id: "tres-prefs",
      cat: "obvia",
      tag: "Diseño",
      who: "Tami",
      q: "¿Por qué solo tres preferencias?",
      pista:
        "Señal mínima suficiente vs fricción. Guardrail <30 s: si tarda más, se refuta. No es un paso nuevo: es el onboarding actual rediseñado y liviano.",
    },
    {
      id: "motor-roto",
      cat: "obvia",
      tag: "Motor",
      who: "Erick",
      q: "¿El algoritmo está roto?",
      pista:
        "No. Tarda en aprender por pocas señales (cold start). Problema de velocidad de personalización, no de oferta ni de “motor malo”. Supuesto a validar, no veredicto.",
    },

    // ── No tan obvias ───────────────────────────────
    {
      id: "causalidad",
      cat: "profunda",
      tag: "Causalidad",
      who: "Erick / Tami",
      q: "¿Cómo saben que no es precio, catálogo o UX general?",
      pista:
        "No lo “sabemos”: lo tratamos como supuesto. Por eso hay control con home genérica comparable. Atribuimos diferencia a la señal de preferencias, no al azar. Otros drivers pueden convivir; este test aísla una palanca.",
    },
    {
      id: "familiares",
      cat: "profunda",
      tag: "Familiares",
      who: "Vale / Erick",
      q: "¿Qué pasa con perfiles nuevos en planes familiares?",
      pista:
        "También son cold start (sin historial del perfil). Riesgo distinto: mezcla de señales entre perfiles. Por eso van en el alcance y en next steps con prueba específica.",
    },
    {
      id: "sesgo-woz",
      cat: "profunda",
      tag: "Sesgo",
      who: "Tami / Cris",
      q: "¿La curación manual no infla los resultados?",
      pista:
        "Sí puede ser techo de valor. Por eso no prometemos el motor automático con estos números. Si ni con curación hay lift, la idea muere barato. Si hay lift, el piloto con motor real es el siguiente test.",
    },
    {
      id: "intencion",
      cat: "profunda",
      tag: "Métricas",
      who: "Vale",
      q: "¿Por qué cuentan “intención de volver”?",
      pista:
        "Secundaria y cualitativa: es declarada, no retención observada. No la ponemos al mismo nivel que play válido o Watch Time. Solo señal de percepción de valor.",
    },
    {
      id: "ia-evidencia",
      cat: "profunda",
      tag: "IA",
      who: "Cris",
      q: "¿La IA validó la hipótesis?",
      pista:
        "No. Aceleró mapa de supuestos, copy y maquetas. El insight clave (señales tempranas, no motor roto) salió al desafiar intuiciones. La evidencia la pone el experimento con usuarios.",
    },
    {
      id: "una-h",
      cat: "profunda",
      tag: "Priorización",
      who: "Tami",
      q: "¿Por qué no probaron varias hipótesis a la vez?",
      pista:
        "Una palanca clara: impacto, incertidumbre y bajo esfuerzo. H·A (similares) y H·B (sesión cero en tiempo real) quedan en backlog / spike. Evita confusión de atribución.",
    },

    // ── Falacias / trampas de lógica ────────────────
    {
      id: "fal-d7",
      cat: "falacia",
      tag: "Trampa",
      who: "Vale",
      q: "“Entonces ya recuperaron el Day-7.”",
      pista:
        "NO. 29→33 es exploratorio con n chica. Luz verde para seguir mirando, no victoria estadística ni recuperación del negocio. Outcome de negocio ≠ resultado de este test.",
    },
    {
      id: "fal-post-hoc",
      cat: "falacia",
      tag: "Trampa",
      who: "Erick",
      q: "“Si cae Day-7, el motor es la causa.”",
      pista:
        "Post hoc. Day-7 cae es hecho; la causa es supuesto. Catálogo, precio, fricción de producto también pueden influir. Por eso el experimento aísla señales tempranas con control.",
    },
    {
      id: "fal-generalizar",
      cat: "falacia",
      tag: "Trampa",
      who: "Tami / Vale",
      q: "“Si funciona en 40 users, funciona en 310 M.”",
      pista:
        "No generalizamos. 310 M dimensiona impacto potencial. El piloto y la muestra regional son el puente. Hoy: decisión de producto, no rollout global.",
    },
    {
      id: "fal-mas-pasos",
      cat: "falacia",
      tag: "Trampa",
      who: "Tami",
      q: "“Están agregando fricción al onboarding.”",
      pista:
        "Rediseñar, no agregar. El paso de géneros ya existe y está mal hecho. Guardrail: si >30 s o sube abandono → refutada. La fricción es criterio de muerte, no detalle estético.",
    },
    {
      id: "fal-todo-ia",
      cat: "falacia",
      tag: "Trampa",
      who: "Cris",
      q: "“Esto es solo un demo de IA, no experimentación.”",
      pista:
        "IA = copiloto de proceso. El centro es hipótesis falsable, control vs experimental, umbrales y decisión predefinida. Sin evidencia de usuarios no hay claim.",
    },

    // ── Coherencia del argumento ────────────────────────
    {
      id: "coh-arco",
      cat: "coherencia",
      tag: "Arco",
      who: "Cualquiera",
      q: "¿Cómo se conectan las 4 voces?",
      pista:
        "Erick: problema + supuesto. Tami: hipótesis + experimento. Cris: herramientas + proto del tramo crítico. Vale: evidencia (simulada) + decisión + ask. Una cadena de aprendizaje, no monólogos sueltos.",
    },
    {
      id: "coh-honestidad",
      cat: "coherencia",
      tag: "Rigor",
      who: "Erick / Vale",
      q: "¿No se contradicen al mostrar resultados y decir que no probaron Day-7?",
      pista:
        "No: KPIs primarios = activación/relevancia/fricción. Day-7 solo exploratorio y etiquetado. La honestidad metodológica va desde el inicio, no es un disclaimer al final.",
    },
    {
      id: "coh-confirmar",
      cat: "coherencia",
      tag: "Decisión",
      who: "Vale",
      q: "¿Cómo “confirman” con datos simulados?",
      pista:
        "Confirmamos la lógica de decisión sobre umbrales predefinidos. Con datos reales usaríamos la misma matriz. El claim de negocio queda condicionado al piloto.",
    },
    {
      id: "coh-proto",
      cat: "coherencia",
      tag: "Scope",
      who: "Cris",
      q: "¿Por qué el prototipo no es el producto completo?",
      pista:
        "Solo el tramo de la hipótesis: perfil vacío → 3 señales → home → play. No tocamos motor ni catálogo. Barato de probar, fácil de refutar.",
    },

    // ── Decisiones ──────────────────────────────────
    {
      id: "dec-perseverar",
      cat: "decision",
      tag: "Confirma",
      who: "Vale",
      q: "¿Por qué perseverar y no pivotar?",
      pista:
        "Reglas antes de mirar datos: valor ↑ y fricción baja → avanzar. Cumplimos activación y relevancia vs control sin subir abandono. Ajuste: no seguir curado a mano.",
    },
    {
      id: "dec-refuta",
      cat: "decision",
      tag: "Refuta",
      who: "Tami / Vale",
      q: "¿Qué harían si se refuta?",
      pista:
        "Si no se cumplen umbrales o sube abandono → volver al tablero. No insistir en el motor. Revisar H·A/H·B o el momento de captura de preferencias (ver Plan B).",
    },
    {
      id: "dec-ask",
      cat: "decision",
      tag: "Ask",
      who: "Vale",
      q: "¿Qué piden exactamente hoy?",
      pista:
        "Apoyo para pasar de 30–50 a un piloto real con Ingeniería y Data. No pedimos rebuild del motor: pedimos que consuma señales tempranas y un checkpoint de decisión.",
    },
    {
      id: "dec-next",
      cat: "decision",
      tag: "Next",
      who: "Vale",
      q: "¿Cuáles son los próximos pasos concretos?",
      pista:
        "1) Muestra representativa por región (Day-7 con solidez). 2) Motor real consume señales (sin curación manual). 3) Prueba en perfiles familiares nuevos. 4) Sesión cero en paralelo (dispositivo, hora, clics).",
    },

    // ── Plan B · pensamiento divergente ─────────────
    {
      id: "planb-momento",
      cat: "planb",
      tag: "Exp. 2",
      who: "Tami / Vale",
      q: "¿Y si el experimento 1 no valida la hipótesis?",
      pista:
        "Pensamiento divergente (no es el claim de hoy): puede que el selector de gustos sí aporte valor, pero el onboarding no sea el momento —agrega fricción antes de explorar. Entonces no matamos la palanca: movemos el momento.",
    },
    {
      id: "planb-rescate",
      cat: "planb",
      tag: "Exp. 2",
      who: "Tami",
      q: "¿Cómo se vería un experimento de rescate?",
      pista:
        "Segundo experimento: activar el selector en los primeros 7 días solo para quienes aún no reprodujeron contenido. Comparamos captura de preferencias al inicio vs después de una primera exploración.",
    },
    {
      id: "planb-kpis",
      cat: "planb",
      tag: "Exp. 2",
      who: "Vale / Tami",
      q: "¿Cómo medirían ese segundo experimento?",
      pista:
        "Separar KPI: (1) Registro y pago = conversión. (2) Finalización y abandono = onboarding. (3) 1ª play válida, tiempo a 1ª play y retención D7 = activación. Así no mezclamos fricción de registro con valor de descubrimiento.",
    },
    {
      id: "planb-coherencia",
      cat: "planb",
      tag: "Exp. 2",
      who: "Cualquiera",
      q: "¿No contradice eso la apuesta de “onboarding liviano”?",
      pista:
        "No: es contingencia si el momento falla. Hoy apostamos a rediseñar el paso existente. Si se refuta por fricción de timing (no por la señal en sí), el Plan B preserva la palanca y cambia cuándo se pide. Es ciencia, no terquedad.",
    },
  ],
};
