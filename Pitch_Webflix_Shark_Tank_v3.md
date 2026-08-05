# Pitch Webflix — Shark Tank v3 (8 min)

**Reparto:** Erick abre → Tami → Cris → Vale cierra.  
**Énfasis:** Experimento (Tami), Prototipo paso a paso (Cris) y Aprendizajes/Decisión (Vale).  
**Duración objetivo:** 8:00, incluyendo cambios de expositor.

---

## ERICK — Problema (0:00 → 0:55)

Hola a todos. Somos el equipo 5: Cris, Tami, Vale y yo.

Webflix es una plataforma global de streaming. Los usuarios nuevos no logran descubrir contenido relevante en su primera semana: entran con ganas, se topan con un catálogo enorme que todavía no sabe qué les gusta, consumen muy poco, se frustran y se van antes de vivir su primer momento de valor.

Esto afecta a toda la base de usuarios nuevos — 310 millones de suscriptores, cerca de 360 millones de usuarios activos al mes, incluyendo los perfiles nuevos dentro de cuentas familiares.

¿Por qué importa ahora? El Day-7 Retention cayó de 42% a 29%: trece puntos, un 31% relativo. No es un problema de catálogo, es un problema de descubrimiento.

El Day-7 es el outcome de negocio que nos importa recuperar. Guárdense esa cifra: el experimento de hoy no lo mueve directamente, pero le apunta.

---

## ERICK — Entendimiento (0:55 → 1:35)

Identificamos tres fricciones concretas.

Primero, el usuario navega demasiado antes de encontrar algo que le llame la atención.

Segundo, el onboarding actual, donde elige géneros al registrarse, es lento y poco liviano — no es que falte un paso, es que el que existe está mal diseñado.

Tercero: el motor de recomendaciones no está roto, simplemente tarda en aprender los gustos de alguien que recién llega, porque tiene pocas señales.

Y aquí hicimos algo importante: no asumimos que el motor era la causa. Lo tratamos como un supuesto a validar, no como un hecho. Eso definió todo nuestro enfoque de experimentación.

---

## TAMI — Hipótesis (1:35 → 2:20)

Priorizamos tres hipótesis: aprovechar patrones de usuarios similares, procesar más rápido las señales de sesión cero, y la que decidimos probar primero, por ser la más rápida de validar y la de menor riesgo técnico.

Nuestra hipótesis central: rediseñar, no agregar, la selección de gustos que ya existe en el onboarding, con un swipe estilo Tinder donde el usuario desliza hasta acumular entre 3 y 5 preferencias. Eso le da al sistema señales suficientes para recomendar bien desde la primera sesión. No es un paso nuevo — es el mismo paso, hecho liviano. Por eso menos de 30 segundos no es un lujo, es guardrail: si toma más, la hipótesis queda refutada ahí mismo.

---

## TAMI — Experimento diseñado (2:20 → 3:25)

Para probarla sin construir el motor real, diseñamos un Wizard of Oz longitudinal: el usuario cree que recibe recomendaciones automáticas, pero en esta fase las armamos manualmente según perfiles predefinidos.

Reclutamos entre 30 y 50 usuarios nuevos. El grupo experimental pasa por el onboarding rediseñado con swipe. El grupo control pasa por el onboarding que existe hoy — el mismo objetivo, capturar gustos, pero en su versión más larga y menos amigable. Así cualquier diferencia se la atribuimos al rediseño, no al azar.

Seguimos la primera sesión de ambos grupos y los acompañamos siete días con analítica. Dos semanas en total, entre reclutamiento, ejecución y análisis.

Criterios de éxito: al menos 80% completa la selección en menos de 30 segundos, al menos 65% hace una reproducción válida en su primera sesión, el Watch Time sube 10% frente al control, y el 75% califica las recomendaciones con nota 4 o 5. Si no se cumple, o si la selección aumenta el abandono, la hipótesis queda refutada y volvemos al tablero.

---

## CRIS — Herramientas (3:25 → 3:50)

Para llegar hasta acá usamos Figma AI para maquetar rápido, y Claude y ChatGPT para todo el trabajo de oportunidad: problema, mapa de supuestos, hipótesis falsable. De hecho, iterando el mapa de supuestos con IA fue como descartamos que el motor fuera la causa raíz — era pura intuición sin evidencia.

---

## CRIS — Prototipo, paso a paso (3:50 → 5:55)

⭐ Énfasis — recorrido en vivo del prototipo

Les muestro la hipótesis hecha experimento. Es un Wizard of Oz longitudinal: el usuario cree que recibe recomendaciones reales, pero en esta fase las armamos manualmente. Elegimos este método porque hoy la incertidumbre es de deseabilidad y usabilidad, no de factibilidad técnica.

Recorramos el flujo paso a paso.

Pantalla uno: justo después de suscribirse, aparece "Así Webflix se parece más a ti. Elige lo que te gusta ver, te tomará menos de 30 segundos." Le explica la mecánica: desliza a la derecha si te interesa, a la izquierda si prefieres pasar. Objetivo: entre 3 y 5 gustos.

El usuario empieza a deslizar hasta que la app le indica "máximo alcanzado": ya tiene sus preferencias.

Pantalla dos: antes de mostrarle nada, un resumen rápido — "Ya conocimos un poco más de ti" — con lo que detectó: comedia, acción, ciencia ficción, drama. Este paso importa: el usuario siente que fue escuchado antes de ver resultados.

Pantalla tres: carga el catálogo personalizado. Acá está el truco del Wizard of Oz — no hay ningún algoritmo procesando esto en tiempo real, es una maqueta armada a mano, pero invisible para el usuario. Puede tocar la primera sugerencia o explorar categorías. Si reproduce, la app le muestra 95% de afinidad.

Ese es el grupo experimental. El grupo control ve exactamente el onboarding de hoy: el mismo objetivo, capturar gustos, pero en su versión larga y menos amigable — validando en vivo la fricción que identificamos en el mapa de supuestos.

---

## VALE — Evidencias o resultados (5:55 → 6:55)

Datos simulados para efectos del ejercicio, construidos de forma coherente con los criterios de éxito que definimos.

84% de los usuarios completó la selección de gustos, en un promedio de 22 segundos. 69% hizo una reproducción válida en su primera sesión, sobre el umbral de 65%, con un tiempo mediano de 2 minutos 40 segundos hasta esa primera reproducción. El Watch Time de la primera sesión subió 12% frente al grupo control, sobre la meta de 10%, y el 78% calificó las recomendaciones con nota 4 o 5.

Como señal cualitativa, la intención de volver durante la semana subió 17%. Y como señal exploratoria — con esta muestra no se puede afirmar esto estadísticamente — el Day-7 Retention de esta cohorte se movió de 29% a 33%. No es una prueba, es una luz verde para seguir mirando.

---

## VALE — Aprendizajes y decisión (6:55 → 8:00)

⭐ Énfasis y cierre

Aprendimos que los usuarios sí están dispuestos a contarnos sus gustos en segundos, sin que eso se sienta como fricción. Que con pocas señales tempranas se puede armar una portada que se percibe como relevante. Y confirmamos algo clave: este es un problema de descubrimiento, no de catálogo.

Con estos números, la hipótesis cae en confirma: cumplimos los umbrales de activación y relevancia percibida frente al grupo control, sin aumentar el abandono en el onboarding rediseñado.

Nuestra decisión es perseverar, con un ajuste: la próxima fase conecta estas mismas señales con el motor real — ya no puede seguir curada a mano. Y para ser precisos: este experimento no valida si el motor es lento. Ese supuesto sigue abierto, y es lo primero que vamos a medir en la Fase 2, con datos de telemetría histórica antes de invertir en un spike técnico.

Lo que les pedimos hoy es apoyo para pasar de un experimento de 30 a 50 usuarios a un piloto real con Ingeniería y Data detrás. Ya validamos que el usuario quiere esto: ahora necesitamos construirlo de verdad.
