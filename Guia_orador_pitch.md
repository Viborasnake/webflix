# Guía del orador · WebFlix Pitch Shark Tank

**Meta:** 8 minutos · **Máximo:** 10 minutos · **Grupo 5**

**Presentación en vivo:** [https://viborasnake.github.io/webflix/](https://viborasnake.github.io/webflix/)  
**Local:** `index.html` o `python3 -m http.server 8765`

**Controles:** `→` / espacio = avanzar · `←` = atrás · `T` timer · `R` reset · `D` demo · `F` fullscreen · `1` `2` `3` Plan B demo

Este guion está alineado con las **11 slides del HTML actual**. No inventes cifras ni promesas que no estén en pantalla.

---

## Run of show

| # | Slide en pantalla | Orador | Tiempo | Qué debe quedar en la cabeza del jurado |
|---|-------------------|--------|--------|-----------------------------------------|
| 01 | Portada | Erick | 0:35 | Cold start: perdemos 1 de 3 antes de conocer al user |
| 02 | Equipo | Erick | 0:25 | Una cadena, cuatro voces |
| 03 | Problema | Erick | 1:00 | Hecho D7; supuesto ≠ veredicto; cadena no virtuosa |
| 04 | Usuario y urgencia | Erick | 0:50 | Persona + segmento del experimento ≠ 310 M |
| 05 | Hipótesis | Tamara | 1:00 | Una H; 3 prefs; priorización impacto/incertidumbre/esfuerzo |
| 06 | Mecanismo | Tamara | 0:50 | Cadena de valor; Day-7 es fase 2 |
| 07 | Experimento | Valeria | 0:55 | Control vs exp; 3 swipes; WoZ; n=30–50 direccional |
| 08 | Evidencia y decisión | Valeria | 1:00 | Cadena de señales + matriz 4 salidas + 3 límites |
| 09 | Artefacto / Demo | Cristian | 1:20 | Flujo swipe→play; IA copiloto; demo o Plan B |
| 10 | El Ask | Cristian | 0:50 | Acceso, no rebuild; 4 próximos pasos |
| 11 | Cierre | Cristian (+ equipo) | 0:25 | Gracias · Q&A |
| | **Total** | | **~8:10** | |

**Si van largos:** recortar Usuario a 35 s y Mecanismo a 35 s.  
**Si van cortos:** alargar Demo + Ask.

---

## Bloque 1 · Erick Fuentealba (~2:50)

### Slide 01 · Portada

**En pantalla:** pregunta cold start · “Perdemos 1 de cada 3…” · 310M / −13 pp / 10 min · tesis de 3 señales.

**Di (aprox.):**

> ¿Cómo puede recomendar bien una plataforma cuando todavía no conoce a la persona que acaba de llegar?  
> Ese momento define si la primera visita se transforma en descubrimiento o en frustración.  
> En WebFlix perdemos 1 de cada 3 usuarios **antes de que la app los conozca**.  
> No necesitamos adivinar mejor: necesitamos una **primera señal útil** — tres preferencias — antes de que abandone.  
> Hoy no prometemos recuperar el Day-7. Validamos el mecanismo del primer valor.

**Pausa** tras el hook. No leas todos los KPIs: apunta a **−13 pp** si quieres anclar.

---

### Slide 02 · Equipo

**En pantalla:** story rail Problema → Hipótesis → Experimento → Decisión · 4 cards.

**Di:**

> Somos el Grupo 5. Una sola cadena de aprendizaje: yo abro con el problema y el usuario; Tamara con hipótesis y mecanismo; Valeria con experimento y decisión; Cristian con demo y el ask. Todos hablamos.

Señala el rail con la mano o el cursor. **Máx. 25 s.**

---

### Slide 03 · Problema

**En pantalla:** “El reto no es atraer… es lograr que vuelvan” · Hecho / Supuesto / Pregunta · cadena no virtuosa 1→4.

**Di:**

> El reto no es atraer usuarios: es lograr que vuelvan.  
> La primera semana perdió capacidad de convertir curiosidad en hábito.  
> **Hecho:** Day-7 cayó de 42% a 29% — menos 13 puntos. También caen Watch Time y sesiones, y sube el churn del primer mes.  
> **Supuesto — no veredicto:** la baja relevancia inicial *podría* explicar parte de esto. También podrían influir catálogo, precio o fricción de producto.  
> **Pregunta del experimento:** ¿tres señales tempranas bastan para mejorar play y retorno sin sumar fricción?  
> Hoy la experiencia es una **cadena no virtuosa**: registro con perfil vacío → home genérica → scroll y búsqueda → abandono **antes del valor**.

**Evitar:** “el algoritmo está roto”.

---

### Slide 04 · Usuario y urgencia

**En pantalla:** buyer persona · segmento · 310 M / 360 M · urgencia 6 meses.

**Di:**

> El buyer persona es el **nuevo usuario frustrado**: entra esperando “algo para mí” y recibe genérico. Sesiones cortas, bajo consumo; se va antes del día 7 o cancela en el mes 1.  
> **Segmento del experimento:** recién suscritos, primer perfil, sin historial. Perfiles familiares nuevos se reportan aparte.  
> Los **310 millones** dimensionan impacto potencial: **no** son el tamaño de la muestra.  
> Si no actuamos en 6 meses: baja crecimiento orgánico y sube el CAC.

**Transición a Tamara:**

> Ahora: qué creemos que mueve el primer valor — y qué no prometemos todavía.

---

## Bloque 2 · Tamara Valdivia (~1:50)

### Slide 05 · Hipótesis

**En pantalla:** fórmula Si → Entonces + guardrail · texto de hipótesis · priorización 01–03 + ★.

**Di:**

> **Creemos que** pedir a usuarios nuevos **tres preferencias** en un onboarding rediseñado genera recomendaciones iniciales más relevantes, mejora la **activación de play**, y lo hace **sin fricción significativa**, porque obtenemos señales **antes** del historial.  
> Intervención, mecanismo, resultado y guardrail: ≤ 30 segundos y al menos 80% completa.  
> ¿Por qué esta hipótesis primero? **Impacto** — ataca lo que precede al Day-7. **Incertidumbre** — no sabemos si tres señales bastan. **Esfuerzo** — se prueba sin armar un motor real, con Wizard of Oz. Resultado accionable: automatizar, iterar o descartar.

**Si preguntan “¿por qué solo una?”**  
Una palanca clara; el resto (similares, tiempo real, regiones) queda en backlog / spike.

---

### Slide 06 · Mecanismo

**En pantalla:** “Validamos hoy” vs “Fase 2” · cadena 3 prefs → … → Day-7 · tabla de evidencia · 2 riesgos.

**Di:**

> Esta es la **cadena virtuosa** que queremos activar: tres prefs → relevancia → play → retorno en 7 días.  
> Day-7 de negocio es **fase 2 a escala**. Hoy validamos los eslabones de la izquierda.  
> En la tabla: selección y relevancia con evidencia moderada; activación direccional; retorno exploratorio; Day-7 no concluyente con n chica.  
> Dos riesgos que declaramos: **causalidad** — el motor no es el único driver — y **fricción** — el nuevo paso podría alargar el onboarding; por eso es guardrail y criterio de refutación.

**Transición a Valeria:**

> Así lo probamos: comparación real, no solo una maqueta bonita.

---

## Bloque 3 · Valeria Nieto (~1:55)

### Slide 07 · Experimento

**En pantalla:** Control vs Experimental (La apuesta) · swipe 01–04 · 30–50 · 14 días.

**Di:**

> Primero validamos que la **señal explícita produce valor**. Todavía no construimos el sistema que la automatiza.  
> **Control:** sin selección, portada genérica.  
> **Experimental — la apuesta:** tres swipes y portada curada; el usuario percibe recomendación automática.  
> Flujo visible: swipe × 3 → perfil inicial → home curado (curación manual detrás) → medición 7 días en ambos brazos.  
> **30 a 50** nuevos suscriptores, direccional; **14 días** de ejecución.  
> La curación manual es un **techo de valor** del WoZ, no la promesa del motor futuro.

**Si preguntan significancia:** señal para decidir, no prueba estadística de plataforma.

---

### Slide 08 · Evidencia y decisión

**En pantalla:** cadena de señales (D7* / play / diagnóstico / resguardo / cuali) · matriz 2×2 · 3 límites.

**Di:**

> No traemos resultados inventados: traemos **qué mediremos** y **cómo decidiremos**.  
> Cadena: Day-7 es outcome de fase 2 (exploratorio hoy); **señal temprana** = play recomendado (+15% vs control como umbral inicial); diagnóstico = tiempo a play, Watch Time, sesiones; **resguardo** = fin de onboarding ≥80%, ≤30 s; cualitativo = relevancia 1–5.  
> Reglas **antes** de mirar datos:  
> - Mayor valor y baja fricción → **Avanzar** a MVP automatizado.  
> - Hay valor pero sube fricción → **Simplificar** el onboarding.  
> - Poco valor y poca fricción → **Reformular** la causa.  
> - Empeora la experiencia → **Descartar**.  
> Tres límites que ya sabemos: **manual ≠ automático**, **señal ≠ certeza**, **perfil ≠ suscriptor**.

**Transición a Cristian:**

> Y esto es lo que se ve en el artefacto.

---

## Bloque 4 · Cristian Pizarro (~2:35 + Q&A)

### Slide 09 · Artefacto / Demo

**En pantalla:** flujo 1–4 · ChatGPT / Figma Make / Stitch · mockup · Plan B.

**Di:**

> El prototipo solo cubre el tramo de la hipótesis: del perfil vacío al primer play.  
> Flujo: **swipe × 3** → perfil → home curado (WoZ) → play válido.  
> La IA aceleró el proceso — ChatGPT, Figma Make, Stitch — **no reemplaza evidencia de usuarios**.  
> *(Demo en vivo si está; si no:)* Plan B con video o capturas. Atajos 1, 2, 3.

**Checklist pre-pitch**
- [ ] Prototipo <10 s  
- [ ] Flujo feliz ×2  
- [ ] Video/GIF local  
- [ ] Capturas offline  
- [ ] Pantalla / cable probado  

---

### Slide 10 · El Ask

**En pantalla:** 4 asks · 4 próximos pasos · quote final.

**Di:**

> Bajo riesgo, alto aprendizaje. Pedimos **acceso**, no un rebuild del motor.  
> 1) Aval para reclutar 30–50 y exponer el onboarding 2 semanas.  
> 2) Acceso a analítica del segmento nuevo.  
> 3) Soporte para instrumentar el WoZ y el spike de factibilidad en paralelo.  
> 4) Checkpoint de decisión a 14 días con las reglas que ya vieron.  
> Próximos pasos: línea base → ejecutar 2 semanas → analizar la cadena → automatizar **solo** si hay valor y baja fricción.  
> **Cierre:** no necesitamos un algoritmo más complejo primero. Necesitamos saber si **tres señales bastan**.

---

### Slide 11 · Cierre

**En pantalla:** Gracias · equipo · rail 1–4.

**Di:**

> Gracias. ¿Preguntas?

El equipo se pone de pie o asiente. Erick/Tami/Vale responden según mapa Q&A.

---

## Q&A — mapa rápido

| Tema | Responde | Ancla en slides |
|------|----------|-----------------|
| Cifras D7, WT, churn, persona | Erick | 03 · 04 |
| Hecho vs supuesto | Erick | 03 (lógica 1-2-3) |
| Hipótesis, priorización, por qué 3 | Tamara | 05 |
| Day-7 no prometido / cadena | Tamara | 06 |
| Control vs exp, n, swipes, WoZ | Valeria | 07 |
| Umbrales, matriz, límites | Valeria | 08 |
| Demo, Plan B, IA | Cristian | 09 |
| Ask, ROI, próximos pasos | Cristian (+ Tami en ROI) | 10 |
| “¿Y el motor en producción?” | Vale + Cris | Spike paralelo; WoZ no lo construye |

---

## Frases prohibidas (todo el equipo)

- “El algoritmo está roto / es malo.”  
- “Con este experimento recuperamos el Day-7.”  
- “Es estadísticamente significativo a escala WebFlix.”  
- Presentar datos simulados como si ya se hubiera corrido el estudio.

---

## Ensayo recomendado

1. Lectura individual del guion + scroll de la web (10 min).  
2. Ensayo con timer en https://viborasnake.github.io/webflix/ (meta 8:00).  
3. Ensayo con demo real + un Plan B.  
4. Q&A: 6 preguntas de la tabla (10 min).

---

## Archivos

| Archivo | Uso |
|---------|-----|
| `index.html` + `styles.css` + `script.js` | Presentación web (fuente de verdad visual) |
| https://viborasnake.github.io/webflix/ | Pitch en vivo / ensayo |
| `Guia_orador_pitch.md` | Este guion |
| `WebFlix_Pitch_Shark_Tank.pptx` / `.pdf` | Opcional; puede estar desfasado vs HTML |
