/* Notas · Pitch Webflix Shark Tank v3 (8 min)
 * Fuente: guion final del equipo · punteo + hints de slide
 * Erick → Tami → Cris → Vale
 */
window.WEBFLIX_NOTES = [
  {
    id: 0,
    n: "01",
    title: "Portada",
    speaker: "Erick",
    role: "Apertura",
    window: "Setup",
    onScreen: "Perdemos 1 de cada 3… · 310M · 42%→29% · ~8 min",
    say: [
      {
        text: "Hola a todos. Somos el equipo 5: Cris, Tami, Vale y yo.",
        hint: "Grupo 5 · Erick · Tami · Cris · Vale · ~8 min",
      },
      {
        text: "Webflix es una plataforma global de streaming. Los usuarios nuevos no logran descubrir contenido relevante en su primera semana: entran con ganas, se topan con un catálogo enorme que todavía no sabe qué les gusta, consumen muy poco, se frustran y se van antes de vivir su primer momento de valor.",
        hint: "Perdemos 1 de cada 3 usuarios antes de que la app los conozca.",
      },
    ],
    highlight: ["Saludo + equipo en una frase", "Pausa tras el hook"],
    avoid: ["No alargar el saludo", "No prometer Day-7 hoy"],
    glossary: ["Day-7", "cold-start", "primer-momento-valor", "outcome"],
  },
  {
    id: 1,
    n: "02",
    title: "Problema",
    speaker: "Erick",
    role: "Problema · 0:00→0:55",
    window: "0:00 → 0:55",
    onScreen: "42%→29% Day-7 · 310M · honestidad del experimento",
    say: [
      {
        text: "Esto afecta a toda la base de usuarios nuevos: 310 millones de suscriptores, cerca de 360 millones de usuarios activos al mes, incluyendo los perfiles nuevos dentro de cuentas familiares.",
        hint: "310 M suscriptores · ~360 M MAU · perfiles familiares",
      },
      {
        text: "¿Por qué importa ahora? El Day-7 Retention cayó de 42% a 29%: trece puntos, un 31% relativo. No es un problema de catálogo, es un problema de descubrimiento.",
        hint: "42% → 29% · Day-7 Retention · −13 pp · ≈ 31% relativa",
      },
      {
        text: "El Day-7 es el outcome de negocio que nos importa recuperar. Guárdense esa cifra: el experimento de hoy no lo mueve directamente, pero le apunta.",
        hint: "Outcome de negocio · no lo mueve directamente, pero le apunta",
      },
    ],
    highlight: [
      "310 M = escala, no muestra",
      "Descubrimiento, no catálogo",
      "Ancla: no mueve Day-7 directo, le apunta",
    ],
    avoid: ["No decir “algoritmo roto”", "No vender Day-7 como resultado de este test"],
    glossary: ["Day-7", "pp", "caida-relativa", "MAU", "outcome", "activacion"],
  },
  {
    id: 2,
    n: "03",
    title: "Entendimiento",
    speaker: "Erick",
    role: "Entendimiento · 0:55→1:35",
    window: "0:55 → 1:35",
    onScreen: "Tres fricciones · supuesto a validar",
    say: [
      {
        text: "Identificamos tres fricciones concretas.",
        hint: "Tres fricciones. Una distinción clave.",
      },
      {
        text: "Primero, el usuario navega demasiado antes de encontrar algo que le llame la atención.",
        hint: "01 · Descubrimiento lento",
      },
      {
        text: "Segundo, el onboarding actual, donde elige géneros al registrarse, es lento y poco liviano: no es que falte un paso, es que el que existe está mal diseñado.",
        hint: "02 · Onboarding mal diseñado",
      },
      {
        text: "Tercero: el motor de recomendaciones no está roto, simplemente tarda en aprender los gustos de alguien que recién llega, porque tiene pocas señales.",
        hint: "03 · Cold start de señales · motor no roto",
      },
      {
        text: "Y aquí hicimos algo importante: no asumimos que el motor era la causa. Lo tratamos como un supuesto a validar, no como un hecho. Eso definió todo nuestro enfoque de experimentación.",
        hint: "Supuesto a validar, no como un hecho",
      },
    ],
    highlight: ["Tres fricciones en orden", "Cierre: supuesto, no hecho"],
    avoid: ["No culpar solo al catálogo", "No saltar a la solución"],
    glossary: ["cold-start", "friccion", "onboarding", "supuesto"],
  },
  {
    id: 3,
    n: "04",
    title: "Hipótesis",
    speaker: "Tamara",
    role: "Hipótesis · 1:35→2:20",
    window: "1:35 → 2:20",
    onScreen: "Rediseñar, no agregar · swipe 3–5 · guardrail <30 s · H·C",
    say: [
      {
        text: "Priorizamos tres hipótesis: aprovechar patrones de usuarios similares, procesar más rápido las señales de sesión cero, y la que decidimos probar primero, por ser la más rápida de validar y la de menor riesgo técnico.",
        hint: "H·A · H·B · H·C ★ la probamos primero",
      },
      {
        text: "Nuestra hipótesis central: rediseñar, no agregar, la selección de gustos que ya existe en el onboarding, con un swipe estilo Tinder donde el usuario desliza hasta acumular entre 3 y 5 preferencias. Eso le da al sistema señales suficientes para recomendar bien desde la primera sesión.",
        hint: "El mismo paso, hecho liviano · 3–5 preferencias · swipe Tinder",
      },
      {
        text: "No es un paso nuevo: es el mismo paso, hecho liviano. Por eso menos de 30 segundos no es un lujo, es guardrail: si toma más, la hipótesis queda refutada ahí mismo.",
        hint: "Guardrail · < 30 s · Si tarda más → refutada",
      },
    ],
    highlight: ["Rediseñar, no agregar", "3 a 5 preferencias", "Guardrail <30 s"],
    avoid: ["No vender H·A/H·B como test de hoy", "No tocar motor ni catálogo"],
    glossary: ["H-A", "H-B", "H-C", "guardrail", "<30s", "redisenar-no-agregar", "onboarding"],
  },
  {
    id: 4,
    n: "05",
    title: "Experimento ⭐",
    speaker: "Tamara",
    role: "Experimento · 2:20→3:25 · ÉNFASIS",
    window: "2:20 → 3:25",
    onScreen: "Control = onboarding hoy · Exp = swipe · umbrales · 30–50",
    say: [
      {
        text: "Para probarla sin construir el motor real, diseñamos un Wizard of Oz longitudinal: el usuario cree que recibe recomendaciones automáticas, pero en esta fase las armamos manualmente según perfiles predefinidos.",
        hint: "Antes de la ingeniería · WoZ longitudinal",
      },
      {
        text: "Reclutamos entre 30 y 50 usuarios nuevos. El grupo experimental pasa por el onboarding rediseñado con swipe. El grupo control pasa por el onboarding que existe hoy: el mismo objetivo, capturar gustos, pero en su versión más larga y menos amigable. Así cualquier diferencia se la atribuimos al rediseño, no al azar.",
        hint: "Control = onboarding de hoy · Experimental = swipe 3–5",
      },
      {
        text: "Seguimos la primera sesión de ambos grupos y los acompañamos siete días con analítica. Dos semanas en total, entre reclutamiento, ejecución y análisis.",
        hint: "30–50 · 7 días · 2 semanas",
      },
      {
        text: "Criterios de éxito: al menos 80% completa la selección en menos de 30 segundos, al menos 65% hace una reproducción válida en su primera sesión, el Watch Time sube 10% frente al control, y el 75% califica las recomendaciones con nota 4 o 5. Si no se cumple, o si la selección aumenta el abandono, la hipótesis queda refutada y volvemos al tablero.",
        hint: "≥80% <30 s · ≥65% play s1 · +10% WT · ≥75% relevancia 4–5",
      },
    ],
    highlight: [
      "⭐ Énfasis Tami",
      "Control = onboarding actual (largo), no “sin preferencias”",
      "Atribuimos al rediseño, no al azar",
    ],
    avoid: ["No hablar de significancia WebFlix", "No confundir WoZ con motor real"],
    glossary: ["WoZ", "longitudinal", "control", "experimental", "guardrail", "<30s", "play-valido", "Watch-Time", "umbral", "n-direccional", "refutacion"],
  },
  {
    id: 5,
    n: "06",
    title: "Herramientas",
    speaker: "Cristian",
    role: "Herramientas · 3:25→3:50",
    window: "3:25 → 3:50",
    onScreen: "Figma AI · Claude + ChatGPT · intuición sin evidencia",
    say: [
      {
        text: "Para llegar hasta acá usamos Figma AI para maquetar rápido, y Claude y ChatGPT para todo el trabajo de oportunidad: problema, mapa de supuestos, hipótesis falsable.",
        hint: "La IA aceleró el proceso. No reemplazó la evidencia.",
      },
      {
        text: "De hecho, iterando el mapa de supuestos con IA fue como descartamos que el motor fuera la causa raíz: era pura intuición sin evidencia.",
        hint: "Ejemplo que cambió el rumbo · motor no era la causa raíz",
      },
    ],
    highlight: ["Bloque corto (~25 s)", "IA = copiloto"],
    avoid: ["No vender IA como validación de usuarios"],
    glossary: ["copiloto", "supuesto", "falsable"],
  },
  {
    id: 6,
    n: "07",
    title: "Prototipo ⭐",
    speaker: "Cristian",
    role: "Prototipo · 3:50→5:55 · ÉNFASIS",
    window: "3:50 → 5:55",
    onScreen: "1 Swipe · 2 Resumen · 3 Catálogo WoZ · 4 Control hoy",
    say: [
      {
        text: "Les muestro la hipótesis hecha experimento. Es un Wizard of Oz longitudinal: el usuario cree que recibe recomendaciones reales, pero en esta fase las armamos manualmente. Elegimos este método porque hoy la incertidumbre es de deseabilidad y usabilidad, no de factibilidad técnica.",
        hint: "Del perfil vacío al primer play · deseabilidad y usabilidad",
      },
      {
        text: "Recorramos el flujo paso a paso.",
        hint: "Recorrido en vivo del prototipo",
      },
      {
        text: "Pantalla uno: justo después de suscribirse, aparece “Así Webflix se parece más a ti. Elige lo que te gusta ver, te tomará menos de 30 segundos.” Le explica la mecánica: desliza a la derecha si te interesa, a la izquierda si prefieres pasar. Objetivo: entre 3 y 5 gustos.",
        hint: "1 · Swipe · “Así Webflix se parece más a ti” · 3–5 · <30 s",
      },
      {
        text: "El usuario empieza a deslizar hasta que la app le indica “máximo alcanzado”: ya tiene sus preferencias.",
        hint: "Máximo alcanzado · preferencias listas",
      },
      {
        text: "Pantalla dos: antes de mostrarle nada, un resumen rápido, “Ya conocimos un poco más de ti”, con lo que detectó: comedia, acción, ciencia ficción, drama. Este paso importa: el usuario siente que fue escuchado antes de ver resultados.",
        hint: "2 · “Ya conocimos un poco más de ti” · comedia · acción · sci-fi · drama",
      },
      {
        text: "Pantalla tres: carga el catálogo personalizado. Acá está el truco del Wizard of Oz: no hay ningún algoritmo procesando esto en tiempo real, es una maqueta armada a mano, pero invisible para el usuario. Puede tocar la primera sugerencia o explorar categorías. Si reproduce, la app le muestra 95% de afinidad.",
        hint: "3 · Catálogo personalizado (WoZ) · 95% de afinidad",
      },
      {
        text: "Ese es el grupo experimental. El grupo control ve exactamente el onboarding de hoy: el mismo objetivo, capturar gustos, pero en su versión larga y menos amigable, validando en vivo la fricción que identificamos en el mapa de supuestos.",
        hint: "4 · Control = onboarding de hoy · valida la fricción",
      },
    ],
    highlight: [
      "⭐ Énfasis · video del flujo en el teléfono",
      "Space / P = play-pause del video",
      "1 video · 2 capturas · 3 offline · D salta a esta slide",
    ],
    avoid: ["No decir que corre el motor real", "No improvisar fuera del flujo"],
    glossary: ["WoZ", "tramo-critico", "Ley-Jakob", "affordance", "guardrail", "<30s", "control", "experimental"],
  },
  {
    id: 7,
    n: "08",
    title: "Resultados",
    speaker: "Valeria",
    role: "Resultados · 5:55→6:55",
    window: "5:55 → 6:55",
    onScreen: "84% · 69% · +12% · 78% · Day-7 29→33 exploratorio",
    say: [
      {
        text: "Datos simulados para efectos del ejercicio, construidos de forma coherente con los criterios de éxito que definimos.",
        hint: "Simulación · no son resultados de campo",
      },
      {
        text: "84% de los usuarios completó la selección de gustos, en un promedio de 22 segundos. 69% hizo una reproducción válida en su primera sesión, sobre el umbral de 65%, con un tiempo mediano de 2 minutos 40 segundos hasta esa primera reproducción. El Watch Time de la primera sesión subió 12% frente al grupo control, sobre la meta de 10%, y el 78% calificó las recomendaciones con nota 4 o 5.",
        hint: "84% / 22 s · 69% / 2:40 · +12% WT · 78% relevancia",
      },
      {
        text: "Como señal cualitativa, la intención de volver durante la semana subió 17%. Y como señal exploratoria, con esta muestra no se puede afirmar esto estadísticamente, el Day-7 Retention de esta cohorte se movió de 29% a 33%. No es una prueba, es una luz verde para seguir mirando.",
        hint: "Intención +17% · Day-7 29% → 33% · no es prueba estadística",
      },
    ],
    highlight: ["Primera frase: datos simulados", "Primaria vs cualitativa vs exploratoria"],
    avoid: ["No presentar simulados como campo", "No vender Day-7 como victoria"],
    glossary: ["simulacion", "play-valido", "Watch-Time", "intencion-declarada", "exploratoria", "Day-7", "n-direccional"],
  },
  {
    id: 8,
    n: "09",
    title: "Aprendizajes ⭐",
    speaker: "Valeria",
    role: "Aprendizajes · 6:55→8:00 · ÉNFASIS Y CIERRE",
    window: "6:55 → 8:00",
    onScreen: "Confirma · perseverar · telemetría motor · piloto",
    say: [
      {
        text: "Aprendimos que los usuarios sí están dispuestos a contarnos sus gustos en segundos, sin que eso se sienta como fricción. Que con pocas señales tempranas se puede armar una portada que se percibe como relevante. Y confirmamos algo clave: este es un problema de descubrimiento, no de catálogo.",
        hint: "Dispuestos en segundos · Pocas señales bastan · Es descubrimiento",
      },
      {
        text: "Con estos números, la hipótesis cae en confirma: cumplimos los umbrales de activación y relevancia percibida frente al grupo control, sin aumentar el abandono en el onboarding rediseñado.",
        hint: "Decisión predefinida · Confirma",
      },
      {
        text: "Nuestra decisión es perseverar, con un ajuste: la próxima fase conecta estas mismas señales con el motor real, ya no puede seguir curada a mano. Y para ser precisos: este experimento no valida si el motor es lento. Ese supuesto sigue abierto, y es lo primero que vamos a medir en la Fase 2, con datos de telemetría histórica antes de invertir en un spike técnico.",
        hint: "Perseverar · motor real · telemetría del motor (supuesto abierto)",
      },
      {
        text: "Lo que les pedimos hoy es apoyo para pasar de un experimento de 30 a 50 usuarios a un piloto real con Ingeniería y Data detrás. Ya validamos que el usuario quiere esto: ahora necesitamos construirlo de verdad.",
        hint: "Pedido · piloto real con Ingeniería y Data",
      },
    ],
    highlight: [
      "⭐ Énfasis y cierre Vale",
      "Confirma + ajuste",
      "“Motor lento” no validado → telemetría Fase 2",
    ],
    avoid: ["No pedir arreglar el algoritmo sin piloto", "No decir que ya probamos que el motor es lento"],
    glossary: ["confirma", "perseverar", "piloto", "supuesto", "guardrail"],
  },
  {
    id: 9,
    n: "10",
    title: "Cierre",
    speaker: "Valeria",
    role: "Cierre · Q&A",
    window: "8:00 → fin",
    onScreen: "Gracias · ¿Preguntas?",
    say: [
      {
        text: "Gracias. ¿Preguntas?",
        hint: "Gracias. · ¿Preguntas?",
      },
    ],
    highlight: ["Equipo asiente", "Q&A por tema"],
    avoid: ["No recontar todo el caso", "No inventar cifras"],
    glossary: ["piloto", "Day-7", "confirma"],
  },
];

window.WEBFLIX_SPEAKERS = {
  Erick: { name: "Erick Fuentealba", img: "../assets/Erick.png", color: "purple" },
  Tamara: { name: "Tamara Valdivia", img: "../assets/Tami.png", color: "amber" },
  Cristian: { name: "Cristian Pizarro", img: "../assets/Cris.png", color: "green" },
  Valeria: { name: "Valeria Nieto", img: "../assets/Vale.png", color: "cyan" },
};
