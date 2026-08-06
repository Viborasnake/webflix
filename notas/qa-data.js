/* Q&A · pistas en lenguaje natural · métricas como tarjetas */
window.WEBFLIX_QA = {
  intro:
    "Respuestas listas para decir en voz alta. No leas todo: elige la idea, suéltala con calma y cierra. Las métricas también están en tarjetas (filtro Métricas).",
  filters: [
    { id: "all", label: "Todos" },
    { id: "metricas", label: "Métricas" },
    { id: "obvia", label: "Obvias" },
    { id: "profunda", label: "No tan obvias" },
    { id: "falacia", label: "Falacias / lógica" },
    { id: "coherencia", label: "Coherencia" },
    { id: "decision", label: "Decisiones" },
    { id: "planb", label: "Plan B · Exp. 2" },
  ],
  pistas: [
    // ── Métricas (misma pila que el resto) ───────────
    {
      id: "kpi-d7",
      cat: "metricas",
      tag: "Negocio",
      who: "Erick / Vale",
      q: "Day-7 Retention — 42% → 29%",
      pista:
        "Bajó trece puntos. Eso es lo que queremos recuperar a nivel negocio. Este experimento no lo mueve directo: le apunta.",
    },
    {
      id: "kpi-mau",
      cat: "metricas",
      tag: "Negocio",
      who: "Erick",
      q: "Escala — ~310M MAU",
      pista:
        "Es el tamaño del barco: con tantos usuarios, cada punto de retención pesa mucho.",
    },
    {
      id: "kpi-problema",
      cat: "metricas",
      tag: "Negocio",
      who: "Erick",
      q: "Problema de negocio — cold start / descubrimiento",
      pista:
        "El usuario nuevo no logra su primer momento de valor, el sistema no lo conoce y se va antes de que la app aprenda.",
    },
    {
      id: "kpi-d7-cohorte",
      cat: "metricas",
      tag: "Negocio",
      who: "Vale",
      q: "Day-7 en cohorte (exploratorio) — 29% → 33%",
      pista:
        "Con poca gente es solo una luz verde para seguir mirando, no una victoria estadística.",
    },
    {
      id: "kpi-completa",
      cat: "metricas",
      tag: "Experimento",
      who: "Tami / Vale",
      q: "Completa selección — ≥80% en <30 s",
      pista:
        "¿El swipe es liviano de verdad? En la simulación: 84% lo completó en unos 22 segundos.",
    },
    {
      id: "kpi-play",
      cat: "metricas",
      tag: "Experimento",
      who: "Vale",
      q: "Play válido (sesión 1) — ≥65%",
      pista:
        "¿Se activan en la primera sesión? Meta 65%; en simulación 69%. Queremos la primera play en menos de 3 minutos.",
    },
    {
      id: "kpi-wt",
      cat: "metricas",
      tag: "Experimento",
      who: "Vale",
      q: "Watch Time (sesión 1) — +10% vs control",
      pista:
        "¿Miran más que con el onboarding de hoy? Meta +10%; en simulación +12%.",
    },
    {
      id: "kpi-rel",
      cat: "metricas",
      tag: "Experimento",
      who: "Vale",
      q: "Relevancia percibida — ≥75% notas 4–5",
      pista:
        "¿Sienten que “esto es para mí”? Meta 75%; en simulación 78%.",
    },
    {
      id: "kpi-intencion",
      cat: "metricas",
      tag: "Experimento",
      who: "Vale",
      q: "Intención de volver — +15% (cualitativa)",
      pista:
        "Es lo que dicen, no lo que hacen. Sirve como señal, no como prueba de retención. Simulación +17%.",
    },
    {
      id: "kpi-guardrail",
      cat: "metricas",
      tag: "Experimento",
      who: "Tami / Vale",
      q: "Guardrail / refutación — abandono no sube",
      pista:
        "Si el swipe molesta o no cumplimos las metas, la hipótesis cae y volvemos al tablero.",
    },

    // ── Obvias ──────────────────────────────────────
    {
      id: "d7-directo",
      cat: "obvia",
      tag: "Day-7",
      who: "Erick / Vale",
      q: "¿Por qué no miden Day-7 como KPI principal del experimento?",
      pista:
        "Porque Day-7 es el resultado de negocio que nos importa a largo plazo, pero hoy estamos mirando los pasos de antes: si la gente se activa y si siente que le recomendamos bien en la primera sesión. Con 30 a 50 personas no puedes demostrar retención a escala. Eso lo dijimos desde el principio.",
    },
    {
      id: "n-chica",
      cat: "obvia",
      tag: "Muestra",
      who: "Tami / Vale",
      q: "¿30–50 usuarios no es muy poco?",
      pista:
        "Es poco a propósito. No estamos probando toda la plataforma: buscamos una señal para decidir si seguimos, iteramos o descartamos. El siguiente paso es una muestra más grande y representativa por región.",
    },
    {
      id: "simulados",
      cat: "obvia",
      tag: "Datos",
      who: "Vale",
      q: "¿Estos resultados son reales o inventados?",
      pista:
        "Son simulados para el ejercicio, pensados en línea con las metas que fijamos antes. No son datos de producción. Lo que sí es real es la lógica: con números de campo usaríamos la misma regla de confirma o refuta.",
    },
    {
      id: "woz",
      cat: "obvia",
      tag: "WoZ",
      who: "Tami / Cris",
      q: "¿Por qué Wizard of Oz y no el motor real?",
      pista:
        "Porque la duda de hoy no es si el motor se puede construir: es si al usuario le sirve y le gusta el flujo. Probamos la idea barato, a mano, antes de gastar ingeniería. Eso es el techo de valor, no la promesa del algoritmo final.",
    },
    {
      id: "tres-prefs",
      cat: "obvia",
      tag: "Diseño",
      who: "Tami",
      q: "¿Por qué 3 a 5 preferencias?",
      pista:
        "Porque es el mínimo que creemos suficiente para recomendar bien, sin alargar el onboarding. El usuario hace swipe hasta juntar de 3 a 5. Si tarda más de 30 segundos, la hipótesis se cae. No inventamos un paso nuevo: rediseñamos el que ya existe.",
    },
    {
      id: "motor-roto",
      cat: "obvia",
      tag: "Motor",
      who: "Erick",
      q: "¿El algoritmo está roto?",
      pista:
        "No decimos que esté roto. Decimos que aprende lento porque al usuario nuevo le faltan señales. Es un problema de velocidad de personalización, no de catálogo ni de “motor malo”. Eso es un supuesto: por eso lo estamos validando.",
    },

    // ── No tan obvias ───────────────────────────────
    {
      id: "causalidad",
      cat: "profunda",
      tag: "Causalidad",
      who: "Erick / Tami",
      q: "¿Cómo saben que no es precio, catálogo o UX general?",
      pista:
        "No lo sabemos a ciencia cierta: lo tratamos como supuesto. Por eso comparamos onboarding de hoy contra onboarding rediseñado. Si hay diferencia, la atribuimos al rediseño. Precio o catálogo pueden importar también; este test mira una palanca a la vez.",
    },
    {
      id: "familiares",
      cat: "profunda",
      tag: "Familiares",
      who: "Vale / Erick",
      q: "¿Qué pasa con perfiles nuevos en planes familiares?",
      pista:
        "También son usuarios sin historial propio. El riesgo extra es que se mezclen señales entre perfiles de la misma cuenta. Por eso los incluimos en el alcance y en los próximos pasos con una prueba específica.",
    },
    {
      id: "sesgo-woz",
      cat: "profunda",
      tag: "Sesgo",
      who: "Tami / Cris",
      q: "¿La curación manual no infla los resultados?",
      pista:
        "Puede inflarlos: es el mejor escenario posible. Por eso no prometemos el motor automático con estos números. Si ni con curación a mano hay mejora, la idea muere barato. Si hay mejora, el siguiente test es con motor de verdad.",
    },
    {
      id: "intencion",
      cat: "profunda",
      tag: "Métricas",
      who: "Vale",
      q: "¿Por qué cuentan “intención de volver”?",
      pista:
        "Es una señal de cómo se sienten, no de si vuelven de verdad. No la ponemos al mismo nivel que el play válido o el tiempo de mira. Solo ayuda a leer si perciben valor.",
    },
    {
      id: "ia-evidencia",
      cat: "profunda",
      tag: "IA",
      who: "Cris",
      q: "¿La IA validó la hipótesis?",
      pista:
        "No. La IA nos ayudó a ir más rápido: mapa de supuestos, textos, maquetas. El giro importante —que faltan señales tempranas, no que el motor esté roto— salió al cuestionar nuestras intuiciones. La evidencia la pone el experimento con usuarios.",
    },
    {
      id: "una-h",
      cat: "profunda",
      tag: "Priorización",
      who: "Tami",
      q: "¿Por qué no probaron varias hipótesis a la vez?",
      pista:
        "Porque si mueves varias cosas a la vez no sabes qué funcionó. Elegimos la más barata y clara de probar: onboarding liviano. Las otras —usuarios similares y sesión cero en tiempo real— quedan para después.",
    },

    // ── Falacias / trampas de lógica ────────────────
    {
      id: "fal-d7",
      cat: "falacia",
      tag: "Trampa",
      who: "Vale",
      q: "“Entonces ya recuperaron el Day-7.”",
      pista:
        "No. El 29 a 33 es exploratorio, con poca gente. Es permiso para seguir investigando, no para decir que recuperamos el negocio. Day-7 de la compañía y resultado de este test no son lo mismo.",
    },
    {
      id: "fal-post-hoc",
      cat: "falacia",
      tag: "Trampa",
      who: "Erick",
      q: "“Si cae Day-7, el motor es la causa.”",
      pista:
        "Cuidado: que caiga Day-7 es un hecho; que la causa sea el motor es un supuesto. También puede ser catálogo, precio o fricción de producto. Por eso diseñamos un test que aísla las señales tempranas con un grupo control.",
    },
    {
      id: "fal-generalizar",
      cat: "falacia",
      tag: "Trampa",
      who: "Tami / Vale",
      q: "“Si funciona en 40 users, funciona en 310 M.”",
      pista:
        "No extrapolamos así. Los 310 millones nos dicen por qué vale la pena el esfuerzo. El puente es un piloto con muestra regional. Hoy decidimos producto, no un lanzamiento global.",
    },
    {
      id: "fal-mas-pasos",
      cat: "falacia",
      tag: "Trampa",
      who: "Tami",
      q: "“Están agregando fricción al onboarding.”",
      pista:
        "Al revés: rediseñamos un paso que ya existe y hoy está pesado. Si tarda más de 30 segundos o sube el abandono, la hipótesis se refuta. La fricción es criterio de muerte, no un detalle de diseño.",
    },
    {
      id: "fal-todo-ia",
      cat: "falacia",
      tag: "Trampa",
      who: "Cris",
      q: "“Esto es solo un demo de IA, no experimentación.”",
      pista:
        "La IA fue copiloto del proceso. El centro es una hipótesis que se puede fallar, un control contra un experimental, umbrales claros y una decisión antes de mirar los datos. Sin usuarios no hay claim.",
    },

    // ── Coherencia del argumento ────────────────────────
    {
      id: "coh-arco",
      cat: "coherencia",
      tag: "Arco",
      who: "Cualquiera",
      q: "¿Cómo se conectan las 4 voces?",
      pista:
        "Erick pone el problema y el supuesto. Tami arma la hipótesis y el experimento. Cris muestra herramientas y el prototipo del tramo crítico. Vale cierra con evidencia, decisión y el pedido. Es una sola historia de aprendizaje, no cuatro monólogos.",
    },
    {
      id: "coh-honestidad",
      cat: "coherencia",
      tag: "Rigor",
      who: "Erick / Vale",
      q: "¿No se contradicen al mostrar resultados y decir que no probaron Day-7?",
      pista:
        "No. Los KPI principales son activación, relevancia y fricción. Day-7 solo lo miramos de reojo y lo etiquetamos como exploratorio. Esa honestidad está desde el inicio, no es un disclaimer al final.",
    },
    {
      id: "coh-confirmar",
      cat: "coherencia",
      tag: "Decisión",
      who: "Vale",
      q: "¿Cómo “confirman” con datos simulados?",
      pista:
        "Confirmamos la regla de decisión: si se cumplen los umbrales que fijamos antes, avanzamos. Con datos reales usaríamos la misma matriz. El claim de negocio grande queda sujeto al piloto de verdad.",
    },
    {
      id: "coh-proto",
      cat: "coherencia",
      tag: "Scope",
      who: "Cris",
      q: "¿Por qué el prototipo no es el producto completo?",
      pista:
        "Porque solo necesitamos el tramo de la hipótesis: perfil vacío, tres señales, home y primer play. No tocamos motor ni catálogo. Así es barato de probar y fácil de refutar.",
    },

    // ── Decisiones ──────────────────────────────────
    {
      id: "dec-perseverar",
      cat: "decision",
      tag: "Confirma",
      who: "Vale",
      q: "¿Por qué perseverar y no pivotar?",
      pista:
        "Porque las reglas las escribimos antes de ver números: si sube el valor y no sube la fricción, seguimos. Cumplimos activación y relevancia frente al control sin subir el abandono. El ajuste es dejar de curar a mano y conectar el motor real.",
    },
    {
      id: "dec-refuta",
      cat: "decision",
      tag: "Refuta",
      who: "Tami / Vale",
      q: "¿Qué harían si se refuta?",
      pista:
        "Si no se cumplen las metas o sube el abandono, volvemos al tablero. No insistimos en el motor. Revisamos otras hipótesis o si el momento de pedir preferencias está mal (eso es el Plan B).",
    },
    {
      id: "dec-ask",
      cat: "decision",
      tag: "Ask",
      who: "Vale",
      q: "¿Qué piden exactamente hoy?",
      pista:
        "Apoyo para pasar de un test de 30 a 50 personas a un piloto real con Ingeniería y Data. No pedimos rehacer el motor: pedimos que use las señales tempranas y un checkpoint de decisión.",
    },
    {
      id: "dec-next",
      cat: "decision",
      tag: "Next",
      who: "Vale",
      q: "¿Cuáles son los próximos pasos concretos?",
      pista:
        "Uno: muestra más grande y representativa por región, para mirar Day-7 con más solidez. Dos: que el motor real consuma las señales, sin curación manual. Tres: prueba en perfiles familiares nuevos. Cuatro: en paralelo, la sesión cero (dispositivo, hora, clics).",
    },

    // ── Plan B · pensamiento divergente ─────────────
    {
      id: "planb-momento",
      cat: "planb",
      tag: "Exp. 2",
      who: "Tami / Vale",
      q: "¿Y si el experimento 1 no valida la hipótesis?",
      pista:
        "Puede que el selector de gustos sí sirva, pero no en el onboarding: ahí agrega fricción antes de explorar. Entonces no matamos la idea; movemos el momento en que pedimos preferencias. Eso no es el claim de hoy: es el plan B.",
    },
    {
      id: "planb-rescate",
      cat: "planb",
      tag: "Exp. 2",
      who: "Tami",
      q: "¿Cómo se vería un experimento de rescate?",
      pista:
        "Un segundo experimento: en la primera semana, solo a quienes aún no vieron nada les ofrecemos el selector. Comparamos pedir gustos al inicio versus después de una primera exploración.",
    },
    {
      id: "planb-kpis",
      cat: "planb",
      tag: "Exp. 2",
      who: "Vale / Tami",
      q: "¿Cómo medirían ese segundo experimento?",
      pista:
        "Separando bien: registro y pago es conversión; terminar o abandonar el onboarding es fricción de setup; primera play, tiempo a esa play y Day-7 es activación. Así no mezclamos “costó registrarse” con “descubrió algo bueno”.",
    },
    {
      id: "planb-coherencia",
      cat: "planb",
      tag: "Exp. 2",
      who: "Cualquiera",
      q: "¿No contradice eso la apuesta de “onboarding liviano”?",
      pista:
        "No: es el plan si el momento falla. Hoy apostamos a rediseñar el paso que ya está. Si se cae por timing y no por la señal en sí, el Plan B guarda la palanca y cambia cuándo se pide. Es ciencia, no terquedad.",
    },
  ],
};
