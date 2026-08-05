/**
 * WebFlix Pitch Shark Tank v2 → PPTX
 * Mismo contenido y orden que index.html (10 slides)
 */
const PptxGenJS = require("./.pptx-build/node_modules/pptxgenjs");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "WebFlix_Pitch_Shark_Tank_v2.pptx");
const ASSETS = path.join(__dirname, "assets");

// Palette WebFlix DS
const C = {
  bg: "07070B",
  card: "12121A",
  card2: "16161F",
  white: "F8FAFC",
  muted: "A1A1AA",
  dim: "71717A",
  purple: "8B5CF6",
  purpleSoft: "A78BFA",
  purpleDeep: "5B21B6",
  cyan: "22D3EE",
  red: "F87171",
  amber: "FBBF24",
  green: "4ADE80",
  border: "2A2A35",
};

const pptx = new PptxGenJS();
pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
pptx.layout = "WIDE";
pptx.author = "Grupo 5 · WebFlix";
pptx.title = "WebFlix · Pitch Shark Tank v2";
pptx.subject = "Erick → Tami → Cris → Vale";

function bg(s) {
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5,
    fill: { color: C.bg },
  });
  // subtle glow orbs
  s.addShape(pptx.shapes.OVAL, {
    x: 9.5, y: -1.2, w: 5, h: 5,
    fill: { color: C.purpleDeep, transparency: 82 },
  });
  s.addShape(pptx.shapes.OVAL, {
    x: -1.5, y: 4.5, w: 4, h: 4,
    fill: { color: C.cyan, transparency: 90 },
  });
}

function logo(s, x = 0.5, y = 0.28) {
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w: 0.38, h: 0.38,
    fill: { color: C.purple },
    rectRadius: 0.08,
  });
  s.addText("W", {
    x, y, w: 0.38, h: 0.38,
    fontSize: 14, fontFace: "Arial", bold: true,
    color: C.white, align: "center", valign: "middle", margin: 0,
  });
  s.addText("WebFlix", {
    x: x + 0.48, y, w: 1.5, h: 0.38,
    fontSize: 16, fontFace: "Arial", bold: true,
    color: C.white, valign: "middle", margin: 0,
  });
}

function badge(s, text, x, y, w = 2.8) {
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h: 0.32,
    fill: { color: C.purple, transparency: 70 },
    rectRadius: 0.15,
    line: { color: C.purpleSoft, width: 1, transparency: 40 },
  });
  s.addText(text, {
    x, y, w, h: 0.32,
    fontSize: 10, fontFace: "Arial", bold: true,
    color: "E9D5FF", align: "center", valign: "middle", margin: 0,
  });
}

function kicker(s, text, x, y) {
  s.addText(text, {
    x, y, w: 8, h: 0.28,
    fontSize: 11, fontFace: "Arial",
    color: C.dim, margin: 0,
  });
}

function card(s, x, y, w, h, opts = {}) {
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || C.card },
    rectRadius: 0.12,
    line: { color: opts.border || C.border, width: 1 },
  });
}

// ═══════════════════════════════════════════════════
// SLIDE 1 · PORTADA
// ═══════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  logo(s, 0.55, 0.35);
  s.addText("GRUPO 5  ·  PITCH SHARK TANK  ·  ~10 MIN", {
    x: 3.5, y: 0.4, w: 6.5, h: 0.3,
    fontSize: 11, fontFace: "Arial", bold: true,
    color: C.purpleSoft, align: "center", margin: 0,
  });

  s.addText("Plataforma global de streaming · Caso de experimentación", {
    x: 0.7, y: 1.5, w: 7.2, h: 0.35,
    fontSize: 13, fontFace: "Arial", color: C.muted, margin: 0,
  });

  s.addText([
    { text: "Perdemos\n", options: { color: C.white, breakLine: false } },
    { text: "1 de cada 3 usuarios\n", options: { color: C.red, breakLine: false } },
    { text: "antes de que la app\nlos conozca.", options: { color: C.white } },
  ], {
    x: 0.7, y: 1.95, w: 7.5, h: 2.8,
    fontSize: 40, fontFace: "Arial", bold: true,
    margin: 0, valign: "top",
  });

  s.addText("El Day-7 es el outcome de negocio. Hoy no lo probamos directo: validamos activación y relevancia en la primera sesión — los pasos que creemos que pueden moverlo.", {
    x: 0.7, y: 4.85, w: 7.2, h: 0.7,
    fontSize: 13, fontFace: "Arial", color: C.muted, margin: 0,
  });

  // Phone mock
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 9.6, y: 1.6, w: 2.6, h: 4.4,
    fill: { color: "0A0A12" },
    rectRadius: 0.35,
    line: { color: C.purpleSoft, width: 1.5 },
  });
  s.addText("3 SWIPES", {
    x: 9.6, y: 2.35, w: 2.6, h: 0.3,
    fontSize: 10, fontFace: "Arial", bold: true,
    color: C.dim, align: "center", margin: 0,
  });
  const chips = [
    ["Acción", true], ["Romance", false], ["Sci-Fi", true],
    ["Drama", false], ["Thriller", true], ["Comedia", false],
  ];
  chips.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 9.85 + col * 0.8;
    const y = 2.85 + row * 0.42;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 0.72, h: 0.32,
      fill: { color: c[1] ? C.purple : C.card2, transparency: c[1] ? 40 : 0 },
      rectRadius: 0.15,
      line: { color: C.purpleSoft, width: 1 },
    });
    s.addText(c[0], {
      x, y, w: 0.72, h: 0.32,
      fontSize: 8, fontFace: "Arial", bold: true,
      color: C.white, align: "center", valign: "middle", margin: 0,
    });
  });

  // KPIs footer
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.7, y: 5.7, w: 12, h: 0.02,
    fill: { color: C.border },
  });
  const kpis = [
    ["310M", "Suscriptores"],
    ["42% → 29%", "Day-7 Retention"],
  ];
  kpis.forEach((k, i) => {
    const x = 2.5 + i * 5;
    s.addText(k[0], {
      x, y: 5.85, w: 4.5, h: 0.4,
      fontSize: 24, fontFace: "Arial", bold: true,
      color: i === 1 ? C.red : C.white, align: "center", margin: 0,
    });
    s.addText(k[1], {
      x, y: 6.25, w: 4.5, h: 0.25,
      fontSize: 11, fontFace: "Arial", bold: true,
      color: C.purpleSoft, align: "center", margin: 0,
    });
  });
  s.addText("Erick · Tami · Cris · Vale  ·  FEN Universidad de Chile  ·  Diplomado EEP", {
    x: 0.7, y: 6.7, w: 12, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: C.dim, align: "center", margin: 0,
  });

  s.addNotes("Erick abre. Hook: perdemos 1 de 3. Day-7 es outcome; hoy no lo probamos directo.");
}

// ═══════════════════════════════════════════════════
// SLIDE 2 · PROBLEMA
// ═══════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  logo(s);
  badge(s, "01 · Erick · Problema", 2.2, 0.32, 2.6);
  kicker(s, "0:00 → 1:15 · Primer momento de valor", 5.0, 0.35);

  s.addText([
    { text: "Se suscriben… y se van\n", options: { color: C.white, breakLine: false } },
    { text: "antes de vivir el valor", options: { color: C.purpleSoft } },
  ], {
    x: 0.55, y: 0.85, w: 12, h: 1.0,
    fontSize: 30, fontFace: "Arial", bold: true, margin: 0,
  });

  s.addText("Usuarios nuevos no logran descubrir contenido relevante en su primera semana. Catálogo enorme, sin historial, poca señal — consumen poco, se frustran y abandonan.", {
    x: 0.55, y: 1.95, w: 12, h: 0.55,
    fontSize: 14, fontFace: "Arial", color: C.muted, margin: 0,
  });

  // Big KPI card
  card(s, 0.55, 2.65, 6.2, 3.4, { border: C.purple });
  s.addText("42%", {
    x: 0.9, y: 2.95, w: 2.2, h: 0.9,
    fontSize: 48, fontFace: "Arial", bold: true, color: C.muted, margin: 0,
  });
  s.addText("→", {
    x: 3.0, y: 3.1, w: 0.7, h: 0.7,
    fontSize: 36, fontFace: "Arial", bold: true, color: C.red, align: "center", margin: 0,
  });
  s.addText("29%", {
    x: 3.6, y: 2.95, w: 2.5, h: 0.9,
    fontSize: 52, fontFace: "Arial", bold: true, color: C.red, margin: 0,
  });
  s.addText("Day-7 Retention", {
    x: 0.9, y: 3.95, w: 5, h: 0.35,
    fontSize: 16, fontFace: "Arial", bold: true, color: C.white, margin: 0,
  });
  s.addText("−13 pp · ≈ 31% de caída relativa", {
    x: 0.9, y: 4.35, w: 5, h: 0.3,
    fontSize: 13, fontFace: "Arial", color: C.red, margin: 0,
  });
  // bars
  s.addText("Antes", { x: 0.9, y: 4.9, w: 0.9, h: 0.25, fontSize: 10, color: C.dim, margin: 0 });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.9, y: 4.95, w: 3.5 * 0.42, h: 0.16,
    fill: { color: C.purpleSoft }, rectRadius: 0.08,
  });
  s.addText("42%", { x: 5.5, y: 4.9, w: 0.7, h: 0.25, fontSize: 11, color: C.muted, margin: 0 });
  s.addText("Hoy", { x: 0.9, y: 5.3, w: 0.9, h: 0.25, fontSize: 10, color: C.dim, margin: 0 });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.9, y: 5.35, w: 3.5 * 0.29, h: 0.16,
    fill: { color: C.red }, rectRadius: 0.08,
  });
  s.addText("29%", { x: 5.5, y: 5.3, w: 0.7, h: 0.25, fontSize: 11, color: C.red, margin: 0 });

  // Mini stats
  const mins = [
    ["↓ Watch Time", "En caída", "Primera semana", C.red],
    ["↓ Sesiones", "Menos visitas", "D1–D7", C.red],
    ["↑ Churn", "Al alza", "Primer mes", C.amber],
  ];
  mins.forEach((m, i) => {
    const y = 2.65 + i * 1.15;
    card(s, 7.05, y, 5.7, 1.05, { border: i < 2 ? "4A2020" : "4A3A10" });
    s.addText(m[0], { x: 7.3, y: y + 0.12, w: 5, h: 0.25, fontSize: 11, color: C.dim, bold: true, margin: 0 });
    s.addText(m[1], { x: 7.3, y: y + 0.38, w: 5, h: 0.32, fontSize: 18, color: m[3], bold: true, margin: 0 });
    s.addText(m[2], { x: 7.3, y: y + 0.72, w: 5, h: 0.22, fontSize: 11, color: C.dim, margin: 0 });
  });

  // Bottom cards
  card(s, 0.55, 6.25, 6.0, 0.95);
  s.addText("¿A quién afecta?", { x: 0.75, y: 6.32, w: 5.5, h: 0.25, fontSize: 12, bold: true, color: C.white, margin: 0 });
  s.addText("310 M suscriptores · ~360 M MAU con perfiles · usuarios nuevos 1ª semana · perfiles nuevos en planes familiares", {
    x: 0.75, y: 6.58, w: 5.5, h: 0.5, fontSize: 11, color: C.muted, margin: 0,
  });
  card(s, 6.75, 6.25, 6.0, 0.95, { border: "5B4A20" });
  s.addText("Honestidad del pitch", { x: 6.95, y: 6.32, w: 5.5, h: 0.25, fontSize: 12, bold: true, color: C.amber, margin: 0 });
  s.addText("Day-7 es el outcome de negocio a recuperar. Hoy no lo probamos directo: activación y relevancia en 1ª sesión.", {
    x: 6.95, y: 6.58, w: 5.5, h: 0.5, fontSize: 11, color: C.muted, margin: 0,
  });

  s.addNotes("Erick 0:00-1:15. Problema, 310M, Day-7 42→29, honestidad: no probamos Day-7 directo.");
}

// ═══════════════════════════════════════════════════
// SLIDE 3 · ENTENDIMIENTO
// ═══════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  logo(s);
  badge(s, "02 · Erick · Entendimiento", 2.2, 0.32, 3.2);
  kicker(s, "1:15 → 2:15 · Tres fricciones · Supuesto, no hecho", 5.6, 0.35);

  s.addText("Tres fricciones. Una distinción clave.", {
    x: 0.55, y: 0.85, w: 12, h: 0.55,
    fontSize: 30, fontFace: "Arial", bold: true, color: C.white, margin: 0,
  });

  const fr = [
    ["01", "Descubrimiento lento", "Hay que recorrer demasiadas categorías. Títulos, imágenes y descripciones no bastan para decidir rápido."],
    ["02", "Onboarding mal diseñado", "La selección de géneros actual es lenta y pesada. No es que sobre un paso: el paso que ya existe está mal hecho."],
    ["03", "Cold start de señales", "El motor no está roto: tarda en aprender porque tiene pocas señales. Problema de velocidad de personalización, no de oferta."],
  ];
  fr.forEach((f, i) => {
    const x = 0.55 + i * 4.15;
    card(s, x, 1.6, 4.0, 2.4);
    s.addText(f[0], { x: x + 0.25, y: 1.8, w: 3.5, h: 0.3, fontSize: 12, bold: true, color: C.purpleSoft, margin: 0 });
    s.addText(f[1], { x: x + 0.25, y: 2.2, w: 3.5, h: 0.4, fontSize: 16, bold: true, color: C.white, margin: 0 });
    s.addText(f[2], { x: x + 0.25, y: 2.7, w: 3.5, h: 1.1, fontSize: 13, color: C.muted, margin: 0 });
  });

  card(s, 0.55, 4.25, 12.2, 0.85, { fill: "1A1228", border: C.purple });
  s.addText("Insight de equipo: no asumimos que el motor era la causa. Lo tratamos como supuesto a validar, no como hecho. Eso cambió todo el enfoque de experimentación.", {
    x: 0.8, y: 4.4, w: 11.7, h: 0.55,
    fontSize: 14, fontFace: "Arial", color: C.white, margin: 0,
  });

  s.addText("CADENA NO VIRTUOSA · HOY", {
    x: 0.55, y: 5.3, w: 12, h: 0.28,
    fontSize: 11, bold: true, color: C.red, margin: 0,
  });

  const j = [
    ["1", "Registro", "Sin historial"],
    ["2", "Home genérica", "Pocas señales"],
    ["3", "Scroll / búsqueda", "Fricción"],
    ["4", "Abandono", "Antes del valor"],
  ];
  j.forEach((step, i) => {
    const x = 0.55 + i * 3.2;
    const bad = i > 0;
    s.addShape(pptx.shapes.OVAL, {
      x, y: 5.75, w: 0.38, h: 0.38,
      fill: { color: i === 3 ? C.red : C.purple },
    });
    s.addText(step[0], {
      x, y: 5.75, w: 0.38, h: 0.38,
      fontSize: 12, bold: true, color: i === 3 ? C.bg : C.white, align: "center", valign: "middle", margin: 0,
    });
    s.addText(step[1], {
      x: x + 0.5, y: 5.72, w: 2.2, h: 0.28,
      fontSize: 14, bold: true, color: bad ? "FECACA" : C.white, margin: 0,
    });
    s.addText(step[2], {
      x: x + 0.5, y: 6.05, w: 2.2, h: 0.25,
      fontSize: 11, color: C.dim, margin: 0,
    });
    if (i < 3) {
      s.addText("→", {
        x: x + 2.7, y: 5.75, w: 0.4, h: 0.35,
        fontSize: 16, color: C.red, margin: 0,
      });
    }
  });

  s.addNotes("Erick 1:15-2:15. Tres fricciones. Motor no roto. Supuesto a validar. Cadena no virtuosa.");
}

// ═══════════════════════════════════════════════════
// SLIDE 4 · HIPÓTESIS
// ═══════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  logo(s);
  badge(s, "03 · Tami · Hipótesis", 2.2, 0.32, 2.6);
  kicker(s, "2:15 → 3:10 · Rediseñar, no agregar", 5.0, 0.35);

  s.addText("El mismo paso, hecho liviano", {
    x: 0.55, y: 0.85, w: 12, h: 0.5,
    fontSize: 30, fontFace: "Arial", bold: true, color: C.white, margin: 0,
  });

  card(s, 0.55, 1.5, 12.2, 1.5, { fill: "1A1228", border: C.purple });
  s.addText("Creemos que rediseñar —no agregar— la selección de gustos del onboarding, dejándola en solo tres elecciones rápidas, da señales suficientes para recomendaciones relevantes desde la primera sesión. No es un paso nuevo encima: es el paso actual, bien diseñado.", {
    x: 0.85, y: 1.7, w: 11.6, h: 1.15,
    fontSize: 15, fontFace: "Arial", color: C.white, margin: 0,
  });

  const qs = [
    ["Intervención", "3 elecciones", "Géneros o títulos · swipe"],
    ["Guardrail", "< 30 s", "Si tarda más → refutada"],
    ["Éxito", "− tiempo a play", "+15% play en sesión 1"],
    ["Alcance", "Sin tocar motor", "Ni catálogo · barata de probar"],
  ];
  qs.forEach((q, i) => {
    const x = 0.55 + i * 3.15;
    const hot = i === 1;
    card(s, x, 3.25, 3.0, 1.55, {
      border: hot ? C.cyan : C.border,
      fill: hot ? "0A1A1E" : C.card,
    });
    s.addText(q[0], { x: x + 0.2, y: 3.4, w: 2.6, h: 0.25, fontSize: 11, color: C.dim, bold: true, margin: 0 });
    s.addText(q[1], { x: x + 0.2, y: 3.75, w: 2.6, h: 0.4, fontSize: 18, color: C.white, bold: true, margin: 0 });
    s.addText(q[2], { x: x + 0.2, y: 4.25, w: 2.6, h: 0.35, fontSize: 12, color: C.muted, margin: 0 });
  });

  const pr = [
    ["H·A", "Usuarios similares", "Patrones de perfiles afines — backlog."],
    ["H·B", "Sesión cero más rápida", "Procesar señales en tiempo real — spike técnico."],
    ["H·C ★", "Onboarding liviano", "La más rápida de validar y de menor riesgo técnico — la probamos primero."],
  ];
  pr.forEach((p, i) => {
    const x = 0.55 + i * 4.15;
    const hot = i === 2;
    card(s, x, 5.1, 4.0, 1.85, {
      border: hot ? C.purple : C.border,
      fill: hot ? "1A1228" : C.card,
    });
    s.addText(p[0], { x: x + 0.25, y: 5.25, w: 3.5, h: 0.25, fontSize: 11, bold: true, color: C.purpleSoft, margin: 0 });
    s.addText(p[1], { x: x + 0.25, y: 5.55, w: 3.5, h: 0.35, fontSize: 16, bold: true, color: C.white, margin: 0 });
    s.addText(p[2], { x: x + 0.25, y: 6.0, w: 3.5, h: 0.7, fontSize: 13, color: C.muted, margin: 0 });
  });

  s.addNotes("Tami 2:15-3:10. Rediseñar no agregar. Guardrail <30s. H-C primero.");
}

// ═══════════════════════════════════════════════════
// SLIDE 5 · EXPERIMENTO
// ═══════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  logo(s);
  badge(s, "04 · Tami · Experimento ⭐", 2.2, 0.32, 3.0);
  kicker(s, "3:10 → 4:50 · Wizard of Oz longitudinal", 5.4, 0.35);

  s.addText("Probamos la idea antes de la ingeniería", {
    x: 0.55, y: 0.8, w: 12, h: 0.45,
    fontSize: 28, fontFace: "Arial", bold: true, color: C.white, margin: 0,
  });
  s.addText("El usuario cree que recibe recomendaciones automáticas. En esta fase las armamos con perfiles predefinidos y curación manual.", {
    x: 0.55, y: 1.3, w: 12, h: 0.4,
    fontSize: 13, color: C.muted, margin: 0,
  });

  // Control
  card(s, 0.55, 1.85, 5.5, 2.7);
  s.addText("CONTROL", { x: 0.8, y: 2.0, w: 5, h: 0.25, fontSize: 11, bold: true, color: C.dim, margin: 0 });
  s.addText("Sin selección de preferencias", { x: 0.8, y: 2.35, w: 5, h: 0.35, fontSize: 16, bold: true, color: C.white, margin: 0 });
  s.addText([
    { text: "• Home genérica comparable\n", options: { breakLine: false } },
    { text: "• Misma medición 7 días\n", options: { breakLine: false } },
    { text: "• Base para atribuir el efecto a la señal", options: {} },
  ], { x: 0.8, y: 2.85, w: 5, h: 1.3, fontSize: 13, color: C.muted, margin: 0 });

  s.addShape(pptx.shapes.OVAL, {
    x: 6.35, y: 2.9, w: 0.6, h: 0.6,
    fill: { color: C.card2 },
    line: { color: C.border, width: 1 },
  });
  s.addText("VS", {
    x: 6.35, y: 2.9, w: 0.6, h: 0.6,
    fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle", margin: 0,
  });

  // Experimental
  card(s, 7.2, 1.85, 5.55, 2.7, { border: C.purple, fill: "1A1228" });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 10.5, y: 1.7, w: 1.5, h: 0.3,
    fill: { color: C.purple },
    rectRadius: 0.12,
  });
  s.addText("LA APUESTA", {
    x: 10.5, y: 1.7, w: 1.5, h: 0.3,
    fontSize: 10, bold: true, color: C.bg, align: "center", valign: "middle", margin: 0,
  });
  s.addText("EXPERIMENTAL", { x: 7.45, y: 2.0, w: 5, h: 0.25, fontSize: 11, bold: true, color: C.cyan, margin: 0 });
  s.addText("3 géneros + home curada", { x: 7.45, y: 2.35, w: 5, h: 0.35, fontSize: 16, bold: true, color: C.white, margin: 0 });
  s.addText([
    { text: "• Onboarding rediseñado (liviano)\n", options: { breakLine: false } },
    { text: "• Perfil predefinido + portada curada\n", options: { breakLine: false } },
    { text: "• Sigue pareciendo “automático”", options: {} },
  ], { x: 7.45, y: 2.85, w: 5, h: 1.3, fontSize: 13, color: C.muted, margin: 0 });

  // Criteria
  const crit = [
    ["≥80%", "completa <30 s"],
    ["≥65%", "play válido s1"],
    ["<3 min", "a 1ª play"],
    ["+10%", "Watch Time vs control"],
    ["≥75%", "relevancia 4–5"],
    ["+15%", "intención volver*"],
  ];
  crit.forEach((c, i) => {
    const x = 0.55 + i * 2.1;
    card(s, x, 4.8, 2.0, 1.0, { border: i === 1 ? C.purple : C.border });
    s.addText(c[0], { x, y: 4.9, w: 2.0, h: 0.4, fontSize: 18, bold: true, color: C.white, align: "center", margin: 0 });
    s.addText(c[1], { x: x + 0.1, y: 5.35, w: 1.8, h: 0.35, fontSize: 10, color: C.dim, align: "center", margin: 0 });
  });

  const stats = [
    ["Muestra", "30–50", "Nuevos perfiles · incl. familiares"],
    ["Seguimiento", "7 días", "Sesión 1 + diario breve"],
    ["Ejecución", "2 semanas", "Recluta · corre · analiza"],
  ];
  stats.forEach((st, i) => {
    const x = 0.55 + i * 4.2;
    s.addText(st[0], { x, y: 6.1, w: 4, h: 0.22, fontSize: 10, color: C.dim, bold: true, margin: 0 });
    s.addText(st[1], { x, y: 6.35, w: 4, h: 0.35, fontSize: 22, bold: true, color: C.purpleSoft, margin: 0 });
    s.addText(st[2], { x, y: 6.75, w: 4, h: 0.25, fontSize: 11, color: C.dim, margin: 0 });
  });

  s.addNotes("Tami 3:10-4:50 ÉNFASIS. WoZ longitudinal. Control vs experimental. Umbrales de éxito/refutación.");
}

// ═══════════════════════════════════════════════════
// SLIDE 6 · HERRAMIENTAS
// ═══════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  logo(s);
  badge(s, "05 · Cris · Herramientas", 2.2, 0.32, 2.9);
  kicker(s, "4:50 → 5:25 · IA como copiloto, no como evidencia", 5.3, 0.35);

  s.addText("La IA aceleró el proceso.\nNo reemplazó la evidencia.", {
    x: 0.55, y: 0.9, w: 12, h: 1.0,
    fontSize: 30, fontFace: "Arial", bold: true, color: C.white, margin: 0,
  });

  const tools = [
    ["Figma AI", "Maquetas rápidas de pantallas. Iterar el flujo sin horas de producción manual."],
    ["Claude + ChatGPT", "Problema, mapa de supuestos, hipótesis falsable y desafío de sesgos."],
    ["Ejemplo que cambió el rumbo", "Al inicio creíamos que el problema era el motor. Iterando el mapa de supuestos vimos que era intuición sin evidencia: el cuello de botella era la falta de señales tempranas."],
  ];
  tools.forEach((t, i) => {
    const x = 0.55 + i * 4.15;
    const hot = i === 2;
    card(s, x, 2.2, 4.0, 3.2, {
      border: hot ? C.cyan : C.border,
      fill: hot ? "0A1A1E" : C.card,
    });
    s.addText(t[0], { x: x + 0.3, y: 2.5, w: 3.4, h: 0.5, fontSize: 18, bold: true, color: C.white, margin: 0 });
    s.addText(t[1], { x: x + 0.3, y: 3.2, w: 3.4, h: 1.9, fontSize: 14, color: C.muted, margin: 0 });
  });

  card(s, 0.55, 5.7, 12.2, 1.1, { fill: "1A1228", border: C.purple });
  s.addText("Con la hipótesis de Tami definida, el prototipo solo tiene que representar el tramo crítico — no un producto completo.", {
    x: 0.85, y: 5.95, w: 11.6, h: 0.6,
    fontSize: 15, color: C.white, margin: 0,
  });

  s.addNotes("Cris 4:50-5:25. Figma AI, Claude/ChatGPT. Insight: señales tempranas, no motor roto.");
}

// ═══════════════════════════════════════════════════
// SLIDE 7 · PROTOTIPO
// ═══════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  logo(s);
  badge(s, "06 · Cris · Prototipo ⭐", 2.2, 0.32, 2.9);
  kicker(s, "5:25 → 7:15 · Hipótesis hecha experimento", 5.3, 0.35);

  s.addText("Del perfil vacío al primer play", {
    x: 0.55, y: 0.85, w: 7.5, h: 0.5,
    fontSize: 28, fontFace: "Arial", bold: true, color: C.white, margin: 0,
  });
  s.addText("Outcome acotado: ¿tres preferencias tempranas generan portada más relevante y más reproducción, sin fricción? No probamos el algoritmo final.", {
    x: 0.55, y: 1.4, w: 7.5, h: 0.65,
    fontSize: 13, color: C.muted, margin: 0,
  });

  const steps = [
    ["1", "3 swipes (Tinder-like)", "Ley de Jakob · affordance inmediato · meta <30 s"],
    ["2", "Perfil de preferencia", "Tres señales explícitas de sesión cero"],
    ["3", "Home curada (WoZ)", "Manual ahora · “automática” para el usuario"],
    ["4", "Play + métricas", "Finalización · tiempo · play válido · WT · relevancia"],
  ];
  steps.forEach((st, i) => {
    const y = 2.2 + i * 0.85;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.55, y, w: 0.45, h: 0.45,
      fill: { color: C.purple, transparency: 40 },
      rectRadius: 0.1,
      line: { color: C.purpleSoft, width: 1 },
    });
    s.addText(st[0], {
      x: 0.55, y, w: 0.45, h: 0.45,
      fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle", margin: 0,
    });
    s.addText(st[1], {
      x: 1.2, y, w: 6.5, h: 0.3,
      fontSize: 15, bold: true, color: C.white, margin: 0,
    });
    s.addText(st[2], {
      x: 1.2, y: y + 0.3, w: 6.5, h: 0.3,
      fontSize: 12, color: C.dim, margin: 0,
    });
  });

  // Phone with prototype image
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 9.3, y: 1.35, w: 3.2, h: 5.35,
    fill: { color: "0A0A12" },
    rectRadius: 0.4,
    line: { color: C.purpleSoft, width: 1.5 },
  });
  const phoneImg = path.join(ASSETS, "home-phones.png");
  if (fs.existsSync(phoneImg)) {
    try {
      s.addImage({
        path: phoneImg,
        x: 9.5, y: 1.7, w: 2.8, h: 3.5,
      });
    } catch (_) { /* fallback below */ }
  }
  s.addText("SIMULACIÓN · WIZARD OF OZ", {
    x: 9.4, y: 5.3, w: 3.0, h: 0.25,
    fontSize: 9, bold: true, color: C.cyan, align: "center", margin: 0,
  });
  s.addText("Figma · en pulido · Demo en vivo", {
    x: 9.4, y: 5.55, w: 3.0, h: 0.25,
    fontSize: 11, bold: true, color: C.white, align: "center", margin: 0,
  });
  s.addText("Plan B: video / capturas", {
    x: 9.4, y: 5.85, w: 3.0, h: 0.25,
    fontSize: 10, color: C.dim, align: "center", margin: 0,
  });

  card(s, 0.55, 5.7, 8.4, 1.15, { fill: "1A1228", border: C.purple });
  s.addText("Cada umbral es también guardrail de refutación. Contingencia: 1 vivo · 2 video · 3 capturas · D esta slide.", {
    x: 0.8, y: 5.95, w: 7.9, h: 0.7,
    fontSize: 13, color: C.white, margin: 0,
  });

  s.addNotes("Cris 5:25-7:15 ÉNFASIS. Demo. Swipe Tinder-like. WoZ. Cada umbral es guardrail de refutación.");
}

// ═══════════════════════════════════════════════════
// SLIDE 8 · RESULTADOS
// ═══════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  logo(s);
  badge(s, "07 · Vale · Resultados", 2.2, 0.32, 2.7);
  kicker(s, "7:15 → 8:25 · Datos simulados del ejercicio", 5.1, 0.35);

  s.addText("Coherentes con los criterios.\nNo son resultados de campo.", {
    x: 0.55, y: 0.85, w: 12, h: 0.9,
    fontSize: 28, fontFace: "Arial", bold: true, color: C.white, margin: 0,
  });

  card(s, 0.55, 1.9, 12.2, 0.55, { fill: "2A2010", border: C.amber });
  s.addText("Simulación para el ejercicio — construida con los umbrales de éxito. No presentar como estudio ya corrido en producción.", {
    x: 0.8, y: 2.0, w: 11.7, h: 0.4,
    fontSize: 13, color: C.amber, margin: 0,
  });

  const res = [
    ["Guardrail fricción", "84%", "completó · promedio 22 s", "Meta ≥80% · <30 s ✓"],
    ["Play válido s1", "69%", "mediana a 1ª play 2:40", "Meta ≥65% · <3 min ✓"],
    ["Watch Time s1", "+12%", "vs grupo control", "Meta +10% ✓"],
    ["Relevancia 4–5", "78%", "score percibido", "Meta ≥75% ✓"],
  ];
  res.forEach((r, i) => {
    const x = 0.55 + i * 3.15;
    card(s, x, 2.7, 3.0, 2.3, { border: "1A3A28", fill: "0C1A14" });
    s.addText(r[0], { x: x + 0.2, y: 2.9, w: 2.6, h: 0.3, fontSize: 11, color: C.dim, bold: true, margin: 0 });
    s.addText(r[1], { x: x + 0.2, y: 3.3, w: 2.6, h: 0.6, fontSize: 32, bold: true, color: C.green, margin: 0 });
    s.addText(r[2], { x: x + 0.2, y: 4.0, w: 2.6, h: 0.35, fontSize: 12, color: C.muted, margin: 0 });
    s.addText(r[3], { x: x + 0.2, y: 4.45, w: 2.6, h: 0.3, fontSize: 12, bold: true, color: C.green, margin: 0 });
  });

  card(s, 0.55, 5.3, 6.0, 1.6);
  s.addText("Secundaria · cualitativa", { x: 0.8, y: 5.5, w: 5.5, h: 0.3, fontSize: 13, bold: true, color: C.white, margin: 0 });
  s.addText("Intención de volver en la semana +17% (meta +15%). Es intención declarada, no retención observada.", {
    x: 0.8, y: 5.9, w: 5.5, h: 0.75, fontSize: 13, color: C.muted, margin: 0,
  });

  card(s, 6.8, 5.3, 6.0, 1.6);
  s.addText("Exploratoria · con cuidado", { x: 7.05, y: 5.5, w: 5.5, h: 0.3, fontSize: 13, bold: true, color: C.white, margin: 0 });
  s.addText("Day-7 de la cohorte 29% → 33%. Con n=30–50 no es prueba estadística — luz verde para seguir mirando.", {
    x: 7.05, y: 5.9, w: 5.5, h: 0.75, fontSize: 13, color: C.muted, margin: 0,
  });

  s.addNotes("Vale 7:15-8:25. SIMULADOS. 84%/22s, 69%/2:40, +12% WT, 78% relevancia. Day-7 exploratorio 29→33.");
}

// ═══════════════════════════════════════════════════
// SLIDE 9 · APRENDIZAJES + DECISIÓN
// ═══════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  logo(s);
  badge(s, "08 · Vale · Aprendizajes ⭐", 2.2, 0.32, 3.1);
  kicker(s, "8:25 → 9:45 · Confirma · Perseverar · Pedido", 5.5, 0.35);

  s.addText("Confirmamos. Ahora hay que construirlo.", {
    x: 0.55, y: 0.85, w: 12, h: 0.5,
    fontSize: 28, fontFace: "Arial", bold: true, color: C.white, margin: 0,
  });

  const learns = [
    ["Dispuestos en segundos", "Contar gustos no se sintió como fricción"],
    ["3 señales bastan", "Portada percibida como relevante"],
    ["Es descubrimiento", "No es catálogo ni falta de oferta"],
  ];
  learns.forEach((l, i) => {
    const x = 0.55 + i * 4.15;
    card(s, x, 1.5, 4.0, 1.2, { border: C.purple, fill: "1A1228" });
    s.addText(l[0], { x: x + 0.25, y: 1.7, w: 3.5, h: 0.35, fontSize: 15, bold: true, color: "E9D5FF", margin: 0 });
    s.addText(l[1], { x: x + 0.25, y: 2.15, w: 3.5, h: 0.35, fontSize: 13, color: C.muted, margin: 0 });
  });

  card(s, 0.55, 2.95, 12.2, 1.35, { fill: "0C1A14", border: C.green });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 3.15, w: 3.2, h: 0.3,
    fill: { color: C.green },
    rectRadius: 0.12,
  });
  s.addText("DECISIÓN PREDEFINIDA · CONFIRMA", {
    x: 0.8, y: 3.15, w: 3.2, h: 0.3,
    fontSize: 10, bold: true, color: C.bg, align: "center", valign: "middle", margin: 0,
  });
  s.addText("Cumplimos activación y relevancia vs control, sin subir abandono en el onboarding rediseñado. Por eso: perseverar, con un ajuste — la próxima fase no puede seguir curada a mano.", {
    x: 0.8, y: 3.55, w: 11.6, h: 0.6,
    fontSize: 14, color: C.white, margin: 0,
  });

  const ns = [
    ["01", "Escalar muestra", "Representativa por región · Day-7 con solidez"],
    ["02", "Motor real", "Ingeniería + Data consumen señales tempranas"],
    ["03", "Planes familiares", "Perfiles nuevos · riesgo de mezcla de señales"],
    ["04", "Sesión cero", "Dispositivo, hora, primeros clics en paralelo"],
  ];
  ns.forEach((n, i) => {
    const x = 0.55 + i * 3.15;
    card(s, x, 4.55, 3.0, 1.35);
    s.addText(n[0], { x: x + 0.2, y: 4.7, w: 2.6, h: 0.22, fontSize: 11, bold: true, color: C.purpleSoft, margin: 0 });
    s.addText(n[1], { x: x + 0.2, y: 4.95, w: 2.6, h: 0.3, fontSize: 14, bold: true, color: C.white, margin: 0 });
    s.addText(n[2], { x: x + 0.2, y: 5.3, w: 2.6, h: 0.4, fontSize: 11, color: C.dim, margin: 0 });
  });

  card(s, 0.55, 6.15, 12.2, 0.95, { fill: "1A1228", border: C.purple });
  s.addText("Lo que pedimos hoy: apoyo para pasar de un experimento de 30–50 usuarios a un piloto real con Ingeniería y Data. Ya validamos que el usuario quiere esto. Ahora hay que construirlo de verdad.", {
    x: 0.8, y: 6.3, w: 11.7, h: 0.65,
    fontSize: 14, color: C.white, margin: 0,
  });

  s.addNotes("Vale 8:25-9:45 ÉNFASIS Y CIERRE. Confirma. Perseverar. Piloto con Ingeniería/Data. Pedido.");
}

// ═══════════════════════════════════════════════════
// SLIDE 10 · CIERRE
// ═══════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  logo(s, 0.55, 0.4);

  s.addText("WebFlix · Grupo 5", {
    x: 0.55, y: 1.3, w: 12, h: 0.35,
    fontSize: 14, bold: true, color: C.purpleSoft, align: "center", margin: 0,
  });
  s.addText("Gracias.", {
    x: 0.55, y: 1.8, w: 12, h: 0.9,
    fontSize: 54, bold: true, color: C.white, align: "center", margin: 0,
  });
  s.addText("¿Preguntas?", {
    x: 0.55, y: 2.75, w: 12, h: 0.45,
    fontSize: 22, color: C.muted, align: "center", margin: 0,
  });

  const team = [
    ["Erick", "Problema · Entendimiento ⭐", C.purple, "Erick.png"],
    ["Tami", "Hipótesis · Experimento ⭐", C.amber, "Tami.png"],
    ["Cris", "Herramientas · Prototipo ⭐", C.green, "Cris.png"],
    ["Vale", "Resultados · Decisión ⭐", C.cyan, "Vale.png"],
  ];
  team.forEach((t, i) => {
    const x = 1.3 + i * 2.9;
    card(s, x, 3.6, 2.6, 2.5, { border: t[2] });
    const imgPath = path.join(ASSETS, t[3]);
    if (fs.existsSync(imgPath)) {
      try {
        s.addImage({
          path: imgPath,
          x: x + 0.7, y: 3.85, w: 1.2, h: 1.2,
        });
      } catch (_) {
        s.addShape(pptx.shapes.OVAL, {
          x: x + 0.7, y: 3.85, w: 1.2, h: 1.2,
          fill: { color: t[2], transparency: 50 },
        });
      }
    } else {
      s.addShape(pptx.shapes.OVAL, {
        x: x + 0.7, y: 3.85, w: 1.2, h: 1.2,
        fill: { color: t[2], transparency: 50 },
      });
    }
    s.addText(t[0], {
      x, y: 5.2, w: 2.6, h: 0.35,
      fontSize: 16, bold: true, color: C.white, align: "center", margin: 0,
    });
    s.addText(t[1], {
      x: x + 0.1, y: 5.55, w: 2.4, h: 0.35,
      fontSize: 11, color: t[2], align: "center", margin: 0,
    });
  });

  s.addText("Ya validamos que el usuario quiere esto. Ahora necesitamos construirlo de verdad.", {
    x: 1.5, y: 6.5, w: 10.3, h: 0.4,
    fontSize: 14, color: C.dim, align: "center", margin: 0,
  });

  s.addNotes("Cierre. Vale cierra el pitch. Q&A. Erick/Tami/Cris/Vale según tema.");
}

pptx.writeFile({ fileName: OUT })
  .then(() => {
    console.log("OK →", OUT);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
