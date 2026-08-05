/* Notas del presentador · WebFlix Shark Tank v2
 * Guion original en punteo + hints = frases directas de la slide
 * Erick → Tami → Cris → Vale
 *
 * say: string | { text, hint? }
 * hint = texto en pantalla (para alinear parlamento con la slide)
 */
window.WEBFLIX_NOTES = [
  {
    id: 0,
    n: "01",
    title: "Portada",
    speaker: "Erick",
    role: "Apertura",
    window: "Setup · saludo",
    onScreen: "Hook “Perdemos 1 de cada 3…” · 310M · 42%→29% · tesis Day-7",
    say: [
      {
        text: "Hola a todos, espero que se encuentren muy bien. Somos el equipo 5, conformado por Cris, Tami, Vale y yo.",
        hint: "Erick · Tami · Cris · Vale · FEN · Diplomado EEP",
      },
      {
        text: "El caso que abordamos plantea el problema de una plataforma global de streaming, que como equipo llamamos WebFlix, donde los usuarios que se suscriben por primera vez no logran descubrir contenido relevante en su primera semana.",
        hint: "Plataforma global de streaming · Caso de experimentación",
      },
      {
        text: "Entran con ganas de ver algo, y se topan con un catálogo enorme que todavía no sabe qué les gusta. Consumen muy poco, se frustran, y se van antes de vivir lo que nosotros llamamos el “primer momento de valor”.",
        hint: "Perdemos 1 de cada 3 usuarios antes de que la app los conozca.",
      },
    ],
    highlight: [
      "Presentar al equipo en una frase",
      "Pausa tras el hook de cold start",
      "No leer todos los KPIs de portada",
    ],
    avoid: [
      "No prometer recuperar Day-7 hoy",
      "No alargar el saludo",
    ],
    glossary: [
      "Day-7",
      "cold-start",
      "primer-momento-valor",
      "outcome",
      "activacion",
      "relevancia",
    ],
  },
  {
    id: 1,
    n: "02",
    title: "Problema",
    speaker: "Erick",
    role: "Problema · 0:00→1:15",
    window: "0:00 → 1:15",
    onScreen: "42%→29% Day-7 · Watch Time / Sesiones / Churn · honestidad del experimento",
    say: [
      {
        text: "¿A quién afecta esto? A la base completa de usuarios nuevos, dentro de una plataforma con 310 millones de suscriptores y cerca de 360 millones de usuarios activos al mes, contando perfiles familiares.",
        hint: "310 M suscriptores · ~360 M MAU · usuarios nuevos · perfiles familiares",
      },
      {
        text: "Y ojo: los perfiles nuevos dentro de un plan familiar también entran en esta categoría, aunque la cuenta ya sea antigua.",
        hint: "¿A quién afecta? · perfiles nuevos en planes familiares",
      },
      {
        text: "¿Por qué importa resolverlo ahora? Porque el Day-7 Retention, la gente que sigue activa al séptimo día, cayó de 42% a 29%. Trece puntos. Un 31% relativo. Y esto no es un problema de catálogo, es un problema de descubrimiento.",
        hint: "42% → 29% · Day-7 Retention · −13 pp · ≈ 31% de caída relativa",
      },
      {
        text: "El Day-7 es el outcome de negocio que nos importa recuperar. Pero quiero ser honesto con ustedes desde ahora: el experimento que les vamos a mostrar hoy no prueba el Day-7 directamente. Prueba los pasos previos, activación y relevancia en la primera sesión, que creemos que pueden moverlo.",
        hint: "Honestidad del pitch · Day-7 es outcome · no lo probamos directo · 1ª sesión",
      },
      {
        text: "Guárdense esa distinción: outcome de negocio versus lo que medimos ahora.",
        hint: "Se suscriben… y se van antes de vivir el valor",
      },
    ],
    highlight: [
      "310 M / ~360 M MAU = escala, no tamaño de muestra",
      "−13 pp · ≈31% de caída relativa",
      "Declarar honestidad: no probamos Day-7 directo",
    ],
    avoid: [
      "No decir “el algoritmo está roto”",
      "No vender Day-7 como resultado de este test",
    ],
    glossary: [
      "Day-7",
      "pp",
      "caida-relativa",
      "MAU",
      "activacion",
      "relevancia",
      "outcome",
      "supuesto",
    ],
  },
  {
    id: 2,
    n: "03",
    title: "Entendimiento",
    speaker: "Erick",
    role: "Tres fricciones · 1:15→2:15",
    window: "1:15 → 2:15",
    onScreen: "3 fricciones · insight “supuesto a validar” · cadena no virtuosa",
    say: [
      {
        text: "Entendemos que existen tres fricciones muy concretas.",
        hint: "Tres fricciones. Una distinción clave.",
      },
      {
        text: "Primero: los usuarios nuevos tienen que buscar y recorrer demasiadas categorías antes de encontrar algo que les llame la atención. Los títulos, las imágenes, las descripciones, no les dan suficiente información para decidir rápido.",
        hint: "01 · Descubrimiento lento",
      },
      {
        text: "Segundo: el proceso de onboarding actual, donde piden elegir géneros al registrarse, es lento y poco liviano. No está pensado para completarse en segundos, y eso hace que muchos lo abandonen o lo hagan a medias. No es que sobre un paso, es que el paso que ya existe está mal diseñado.",
        hint: "02 · Onboarding mal diseñado · el paso que ya existe está mal hecho",
      },
      {
        text: "Tercero, y este fue el insight que más nos costó aislar: el motor de recomendaciones no está roto. Simplemente tarda demasiado en aprender los gustos de alguien que recién llega, porque tiene muy pocas señales para trabajar. No es un problema de oferta, hay contenido de sobra; es un problema de velocidad de personalización.",
        hint: "03 · Cold start de señales · velocidad de personalización, no de oferta",
      },
      {
        text: "Y aquí hicimos algo importante como equipo: no asumimos que el motor era la causa. Lo tratamos como un supuesto a validar, no como un hecho. Eso cambió todo nuestro enfoque de experimentación.",
        hint: "Insight de equipo · supuesto a validar, no como hecho",
      },
      {
        text: "Hoy la experiencia es una cadena no virtuosa: registro sin historial, home genérica, scroll y búsqueda, abandono antes del valor.",
        hint: "Cadena no virtuosa · hoy: Registro → Home genérica → Scroll → Abandono",
      },
    ],
    highlight: [
      "Frase ancla: “el paso que ya existe está mal diseñado”",
      "Motor no roto → velocidad de personalización",
      "Supuesto a validar, no hecho",
    ],
    avoid: [
      "No culpar al catálogo como única causa",
      "No saltar a la solución sin las 3 fricciones",
    ],
    glossary: [
      "cold-start",
      "friccion",
      "onboarding",
      "supuesto",
      "sesion-cero",
    ],
  },
  {
    id: 3,
    n: "04",
    title: "Hipótesis",
    speaker: "Tamara",
    role: "Hipótesis · 2:15→3:10",
    window: "2:15 → 3:10",
    onScreen: "Rediseñar, no agregar · 3 elecciones · guardrail <30 s · H·C ★",
    say: [
      {
        text: "Con ese entendimiento, priorizamos tres hipótesis usando nuestro tablero: una sobre aprovechar patrones de usuarios similares, otra sobre procesar más rápido las señales de sesión cero, y la que decidimos probar primero porque es la más rápida de validar y la de menor riesgo técnico.",
        hint: "H·A Usuarios similares · H·B Sesión cero · H·C ★ Onboarding liviano",
      },
      {
        text: "Nuestra hipótesis central es esta: creemos que rediseñar, no agregar, esa selección de gustos y géneros del onboarding, dejándola en solo tres elecciones rápidas, le va a dar al sistema señales suficientes para generar recomendaciones relevantes desde la primera sesión.",
        hint: "El mismo paso, hecho liviano · rediseñar, no agregar · tres elecciones rápidas",
      },
      {
        text: "Ojo con esto: no es un paso nuevo encima del onboarding actual, es el mismo paso hecho liviano. Por eso el tiempo de selección, menos de 30 segundos, no es un lujo, es un guardrail: si toma más que eso, la hipótesis queda refutada ahí mismo, antes de mirar cualquier otra métrica.",
        hint: "Guardrail · < 30 s · Si tarda más → refutada",
      },
      {
        text: "Sabremos que funcionó si disminuye el tiempo hasta la primera reproducción, y si aumenta un 15% la tasa de usuarios que consume contenido durante su primera sesión.",
        hint: "Éxito · − tiempo a play · +15% play en sesión 1",
      },
      {
        text: "Es una apuesta simple, barata de probar, y que no toca el motor de recomendaciones ni el catálogo. Por eso la pusimos primero en la fila.",
        hint: "Alcance · Sin tocar motor · H·C la probamos primero",
      },
    ],
    highlight: [
      "“Rediseñar, no agregar” es la frase ancla",
      "Guardrail <30 s = refutación inmediata",
      "Señalar H·C / onboarding liviano primero",
    ],
    avoid: [
      "No vender H·A / H·B como parte del test de hoy",
      "No tocar motor ni catálogo en el alcance",
    ],
    glossary: [
      "H-A",
      "H-B",
      "H-C",
      "guardrail",
      "<30s",
      "redisenar-no-agregar",
      "falsable",
      "onboarding",
    ],
  },
  {
    id: 4,
    n: "05",
    title: "Experimento ⭐",
    speaker: "Tamara",
    role: "Experimento · 3:10→4:50 · ÉNFASIS",
    window: "3:10 → 4:50",
    onScreen: "Control vs Experimental · umbrales · 30–50 · 7 días · 2 semanas",
    say: [
      {
        text: "Para probarla sin construir nada del motor real, diseñamos un Wizard of Oz longitudinal. El usuario cree que está recibiendo recomendaciones automáticas, pero en esta primera fase las armamos manualmente según perfiles de gustos predefinidos. Así probamos la idea antes de invertir en ingeniería.",
        hint: "Probamos la idea antes de la ingeniería · Wizard of Oz longitudinal",
      },
      {
        text: "¿Cómo lo hicimos? Reclutamos entre 30 y 50 usuarios nuevos, gente que recién crea su perfil por primera vez, incluyendo perfiles nuevos dentro de cuentas familiares.",
        hint: "Muestra 30–50 · Nuevos perfiles · incl. familiares",
      },
      {
        text: "Les pedimos elegir tres géneros o títulos durante el onboarding rediseñado. Con eso los asignamos a un perfil de preferencia predefinido, y les mostramos una pantalla de inicio curada según esa elección.",
        hint: "Experimental · 3 géneros + home curada · La apuesta",
      },
      {
        text: "En paralelo, un grupo control recibe una portada genérica comparable, sin selección de preferencias, así cualquier diferencia que veamos se la podemos atribuir a la señal, no al azar. Después seguimos la primera sesión de ambos grupos y los acompañamos siete días con analítica y un diario breve.",
        hint: "Control · Sin selección de preferencias · Home genérica · 7 días",
      },
      {
        text: "La duración total fue de dos semanas: reclutamiento, ejecución y análisis. Por participante, el seguimiento fue de siete días desde el onboarding.",
        hint: "Ejecución 2 semanas · Seguimiento 7 días",
      },
      {
        text: "¿Y los criterios de éxito? Que al menos el 80% complete la selección en menos de 30 segundos. Que al menos el 65% haga una reproducción válida en su primera sesión. Que el tiempo mediano hasta esa primera reproducción sea menor a tres minutos. Que el Watch Time de la primera sesión suba un 10% frente al grupo control. Que el 75% califique las recomendaciones con nota 4 o 5. Y que la intención de volver durante la semana aumente un 15%.",
        hint: "≥80% <30 s · ≥65% play s1 · <3 min · +10% WT · ≥75% relevancia · +15% volver",
      },
      {
        text: "Si no se cumple esto, o si la selección aumenta el abandono, la hipótesis queda refutada y volvemos al tablero.",
        hint: "Cada umbral es también guardrail de refutación",
      },
    ],
    highlight: [
      "⭐ Énfasis del bloque de Tami",
      "Control vs “la apuesta” experimental",
      "WoZ = techo de valor, no promesa del motor",
      "Listar umbrales con calma; no correr",
    ],
    avoid: [
      "No hablar de significancia a escala WebFlix",
      "No confundir curación manual con producto final",
    ],
    glossary: [
      "WoZ",
      "longitudinal",
      "control",
      "experimental",
      "guardrail",
      "<30s",
      "play-valido",
      "Watch-Time",
      "umbral",
      "n-direccional",
      "refutacion",
    ],
  },
  {
    id: 5,
    n: "06",
    title: "Herramientas",
    speaker: "Cristian",
    role: "IA copiloto · 4:50→5:25",
    window: "4:50 → 5:25",
    onScreen: "Figma AI · Claude + ChatGPT · ejemplo que cambió el rumbo",
    say: [
      {
        text: "Con la hipótesis de Tami ya definida, les cuento cómo llegamos ahí.",
        hint: "La IA aceleró el proceso. No reemplazó la evidencia.",
      },
      {
        text: "Usamos Figma AI para maquetar rápido las pantallas, iterando sin perder horas en producción manual.",
        hint: "Figma AI · maquetas rápidas de pantallas",
      },
      {
        text: "Y usamos Claude y ChatGPT para todo el trabajo de oportunidad: problema, mapa de supuestos, hipótesis falsable.",
        hint: "Claude + ChatGPT · mapa de supuestos · hipótesis falsable",
      },
      {
        text: "Un ejemplo rápido: al principio creíamos que el problema era el motor de recomendaciones. Iterando el mapa de supuestos con la IA, vimos que era pura intuición sin evidencia; el verdadero cuello de botella era la falta de señales tempranas.",
        hint: "Ejemplo que cambió el rumbo · falta de señales tempranas",
      },
    ],
    highlight: [
      "Frase: IA aceleró el proceso, no reemplazó evidencia",
      "Insight del rumbo: señales tempranas, no motor roto",
      "Bloque corto · no alargar",
    ],
    avoid: [
      "No vender la demo de IA como validación de usuarios",
    ],
    glossary: [
      "copiloto",
      "supuesto",
      "cold-start",
      "falsable",
    ],
  },
  {
    id: 6,
    n: "07",
    title: "Prototipo ⭐",
    speaker: "Cristian",
    role: "Demo · 5:25→7:15 · ÉNFASIS",
    window: "5:25 → 7:15",
    onScreen: "3 swipes → perfil → home curada (WoZ) → play + métricas · Plan B",
    say: [
      {
        text: "Les muestro la hipótesis hecha experimento: maqueta funcional en Figma, todavía en pulido.",
        hint: "Del perfil vacío al primer play · Figma en pulido",
      },
      {
        text: "El problema, en una línea: el usuario nuevo llega sin historial, el sistema no tiene señales, y mientras aprende, el usuario se va.",
        hint: "Outcome acotado · tres preferencias tempranas · sin fricción",
      },
      {
        text: "El outcome de este proto es acotado: comprobar si tres preferencias tempranas generan una portada más relevante y más reproducción, sin fricción. No estamos probando el algoritmo final, eso viene después.",
        hint: "No probamos el algoritmo final",
      },
      {
        text: "Es un Wizard of Oz longitudinal: el usuario cree que recibe recomendaciones automáticas, pero en esta fase las armamos manualmente con reglas simples. Elegimos este método porque hoy la incertidumbre es de deseabilidad y usabilidad, no de factibilidad técnica. Y corre en paralelo con un grupo control de portada genérica, para medir el efecto real de la señal.",
        hint: "3 · Home curada (WoZ) · Manual ahora · “automática” para el usuario",
      },
      {
        text: "Primera pantalla: selección de tres géneros o títulos, con la lógica de interacción de Tinder, deslizar o tocar. Es la Ley de Jakob: el usuario ya conoce el patrón, así que no necesita aprenderlo, y eso genera affordance inmediato.",
        hint: "1 · 3 swipes (Tinder-like) · Ley de Jakob · meta <30 s",
      },
      {
        text: "Segunda pantalla: portada curada manualmente en esta fase. El truco del Wizard of Oz: probar la experiencia antes de construir el motor real.",
        hint: "2 · Perfil de preferencia · Tres señales de sesión cero",
      },
      {
        text: "Este flujo produce las métricas exactas del experimento de Tami: finalización, tiempo de selección, reproducción válida, Watch Time y relevancia percibida. Cada umbral es también un guardrail de refutación.",
        hint: "4 · Play + métricas · Cada umbral es guardrail de refutación",
      },
      {
        text: "Si el patrón funciona como esperamos, deberían ver alta finalización rápida y alta reproducción válida. Eso es justo lo que Vale les muestra ahora.",
        hint: "Contingencia: 1 vivo · 2 video · 3 capturas",
      },
    ],
    highlight: [
      "⭐ Énfasis demo · mirar al jurado",
      "Ley de Jakob / Tinder-like",
      "Plan B demo: 1 vivo · 2 video · 3 capturas",
      "Cerrar el puente y ceder a Vale",
    ],
    avoid: [
      "No improvisar features fuera del tramo crítico",
      "No decir que ya corre el motor real",
    ],
    glossary: [
      "WoZ",
      "tramo-critico",
      "Ley-Jakob",
      "affordance",
      "guardrail",
      "<30s",
      "play-valido",
      "Watch-Time",
      "control",
    ],
  },
  {
    id: 7,
    n: "08",
    title: "Resultados",
    speaker: "Valeria",
    role: "Simulación · 7:15→8:25",
    window: "7:15 → 8:25",
    onScreen: "Banner simulación · 84% / 69% / +12% / 78% · Day-7 exploratorio 29→33",
    say: [
      {
        text: "Estos son datos simulados para efectos del ejercicio, pero construidos de forma coherente con los criterios de éxito que definimos.",
        hint: "Simulación para el ejercicio · No son resultados de campo",
      },
      {
        text: "El 84% de los usuarios completó la selección de gustos, en un promedio de 22 segundos, sobre la meta del 80% en menos de 30.",
        hint: "Guardrail fricción · 84% · promedio 22 s · Meta ≥80% · <30 s ✓",
      },
      {
        text: "El 69% hizo una reproducción válida durante su primera sesión, superando el umbral del 65%, con un tiempo mediano hasta esa primera reproducción de 2 minutos con 40 segundos.",
        hint: "Play válido s1 · 69% · mediana 2:40 · Meta ≥65% · <3 min ✓",
      },
      {
        text: "El Watch Time de la primera sesión subió 12% frente al grupo control, sobre la meta de 10%. Y el 78% calificó las recomendaciones con nota 4 o 5.",
        hint: "Watch Time s1 +12% · Relevancia 4–5 · 78% · Meta +10% / ≥75% ✓",
      },
      {
        text: "Como métrica secundaria y cualitativa, y no la pongo al mismo nivel que las anteriores porque es intención declarada y no comportamiento observado: la intención de volver durante la semana aumentó 17%, por sobre el 15% esperado. Es una señal de que el usuario percibe valor, no una medición de retención real.",
        hint: "Secundaria · cualitativa · intención de volver +17% (meta +15%)",
      },
      {
        text: "Como señal exploratoria, y lo decimos con cuidado porque con 30 a 50 usuarios no se puede afirmar esto estadísticamente: el Day-7 Retention de esta cohorte se movió de 29% a 33%. No es prueba, es una luz verde para seguir mirando.",
        hint: "Exploratoria · Day-7 29% → 33% · no es prueba estadística",
      },
    ],
    highlight: [
      "Primera frase: “datos simulados”",
      "Separar primaria vs secundaria vs exploratoria",
      "Day-7 29→33 con cuidado · no victoria estadística",
    ],
    avoid: [
      "NUNCA presentar simulados como campo real",
      "No vender Day-7 como prueba de plataforma",
    ],
    glossary: [
      "simulacion",
      "play-valido",
      "Watch-Time",
      "guardrail",
      "intencion-declarada",
      "exploratoria",
      "Day-7",
      "n-direccional",
    ],
  },
  {
    id: 8,
    n: "09",
    title: "Aprendizajes ⭐",
    speaker: "Valeria",
    role: "Decisión · 8:25→9:45 · ÉNFASIS Y CIERRE",
    window: "8:25 → 9:45",
    onScreen: "3 aprendizajes · Confirma · 4 next steps · el pedido",
    say: [
      {
        text: "¿Qué aprendimos? Que los usuarios sí están dispuestos a contarnos sus gustos en segundos, sin que eso se sienta como fricción. Que con solo tres señales tempranas se puede armar una portada que se percibe como relevante. Y que confirmamos algo clave: este es un problema de descubrimiento, no de catálogo ni de oferta de contenido.",
        hint: "Dispuestos en segundos · 3 señales bastan · Es descubrimiento",
      },
      {
        text: "Antes de correr este experimento, definimos qué resultado contaba como confirma, refuta o inconcluso. Con estos números, la hipótesis cae en confirma: cumplimos los umbrales de activación y de relevancia percibida frente al grupo control, sin aumentar el abandono en el onboarding rediseñado.",
        hint: "Decisión predefinida · Confirma",
      },
      {
        text: "Por eso nuestra decisión es perseverar, con un ajuste: la próxima fase no puede seguir siendo curada a mano. El paso que sigue es conectar estas mismas señales de onboarding con el motor real, y complementarlas con las señales de sesión cero (dispositivo, hora, primeros clics) para que la personalización deje de depender de manual y empiece a aprender sola desde el primer minuto.",
        hint: "Perseverar · la próxima fase no puede seguir curada a mano",
      },
      {
        text: "Los próximos pasos que proponemos: primero, escalar esta prueba a una muestra representativa por región para poder hablar de Day-7 con solidez estadística. Segundo, trabajar con los equipos de Ingeniería y Data para que el motor real consuma estas señales tempranas, sin curación manual. Y tercero, probar este mismo flujo específicamente en perfiles nuevos dentro de cuentas familiares, porque ahí detectamos un riesgo distinto de mezcla de señales.",
        hint: "01 Escalar muestra · 02 Motor real · 03 Planes familiares · 04 Sesión cero",
      },
      {
        text: "Lo que les pedimos hoy es apoyo para pasar de un experimento de 30 a 50 usuarios a un piloto real con Ingeniería y Data detrás. Ya validamos que el usuario quiere esto. Ahora necesitamos construirlo de verdad.",
        hint: "Lo que pedimos hoy · piloto real con Ingeniería y Data",
      },
    ],
    highlight: [
      "⭐ Énfasis y cierre del arco de Vale",
      "Decisión predefinida · Confirma · perseverar con ajuste",
      "El ask: piloto real con Ingeniería y Data",
    ],
    avoid: [
      "No pedir “arreglar el algoritmo” sin el puente del piloto",
      "No reabrir todo el argumento en el pedido",
    ],
    glossary: [
      "confirma",
      "perseverar",
      "piloto",
      "sesion-cero",
      "mezcla-senales",
      "guardrail",
      "refutacion",
    ],
  },
  {
    id: 9,
    n: "10",
    title: "Cierre",
    speaker: "Valeria",
    role: "Cierra · Q&A",
    window: "9:45 → fin",
    onScreen: "Gracias · equipo · Q&A · pistas",
    say: [
      {
        text: "Gracias. ¿Preguntas?",
        hint: "Gracias. · ¿Preguntas?",
      },
      {
        text: "Ya validamos que el usuario quiere esto. Ahora necesitamos construirlo de verdad.",
        hint: "Ya validamos que el usuario quiere esto. Ahora necesitamos construirlo de verdad.",
      },
    ],
    highlight: [
      "Equipo de pie o asiente",
      "Abrir panel Q&A (tecla Q) con pistas",
      "Mapa: Erick cifras · Tami hip/exp · Cris demo · Vale decisión",
      "Si atacan el momento del onboarding: Plan B · Exp. 2",
    ],
    avoid: [
      "No recontar todo el caso en cada respuesta",
      "No inventar cifras que no estén en pantalla",
      "No presentar simulados como estudio real",
      "No defender el Plan B como claim de hoy: es contingencia",
    ],
    glossary: [
      "piloto",
      "Plan-B-Exp2",
      "simulacion",
      "Day-7",
      "confirma",
      "guardrail",
      "H-C",
    ],
  },
];

window.WEBFLIX_SPEAKERS = {
  Erick: { name: "Erick Fuentealba", img: "../assets/Erick.png", color: "purple" },
  Tamara: { name: "Tamara Valdivia", img: "../assets/Tami.png", color: "amber" },
  Cristian: { name: "Cristian Pizarro", img: "../assets/Cris.png", color: "green" },
  Valeria: { name: "Valeria Nieto", img: "../assets/Vale.png", color: "cyan" },
};
