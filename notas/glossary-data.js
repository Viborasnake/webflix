/* Glosario del pitch · términos complejos
 * Cada slide lista keys en note.glossary; se resuelven aquí.
 */
window.WEBFLIX_GLOSSARY = {
  "Day-7": {
    term: "Day-7 (D7)",
    def: "Retención al día 7: % de usuarios que siguen activos una semana después de llegar. Outcome de negocio; hoy no lo probamos directo.",
  },
  "pp": {
    term: "pp (puntos porcentuales)",
    def: "Diferencia absoluta entre porcentajes. 42% → 29% = −13 pp (no es “−13%” relativo).",
  },
  "caida-relativa": {
    term: "Caída relativa (~31%)",
    def: "13 / 42 ≈ 31%. Cómo de grande es la caída respecto al valor de partida.",
  },
  "MAU": {
    term: "MAU",
    def: "Monthly Active Users: usuarios activos en el mes (~360 M con perfiles).",
  },
  "cold-start": {
    term: "Cold start",
    def: "El sistema no tiene historial del usuario nuevo; tarda en personalizar por falta de señales.",
  },
  "primer-momento-valor": {
    term: "Primer momento de valor",
    def: "Cuando el usuario siente por primera vez que la app “le sirve” (p. ej. encuentra algo y reproduce).",
  },
  "activacion": {
    term: "Activación",
    def: "Que el usuario haga la primera acción de valor (play válido en sesión 1), no solo registrarse.",
  },
  "relevancia": {
    term: "Relevancia",
    def: "Que lo mostrado se sienta “para mí”. Aquí: score percibido 4–5 y más play.",
  },
  "outcome": {
    term: "Outcome de negocio",
    def: "Resultado que importa al negocio (Day-7). Distinto de métricas intermedias del experimento.",
  },
  "supuesto": {
    term: "Supuesto (≠ hecho)",
    def: "Creencia a validar. Hecho = Day-7 cayó. Supuesto = “falta de señales lo explica”.",
  },
  "friccion": {
    term: "Fricción",
    def: "Costo de esfuerzo/tiempo que hace abandonar (onboarding lento, scroll infinito, etc.).",
  },
  "onboarding": {
    term: "Onboarding",
    def: "Flujo de llegada/registro. Aquí: la selección de géneros que ya existe y está mal diseñada.",
  },
  "guardrail": {
    term: "Guardrail",
    def: "Límite duro de refutación. Si se rompe, la hipótesis muere antes de mirar el resto. Ej.: selección > 30 s.",
  },
  "<30s": {
    term: "< 30 s",
    def: "Guardrail de fricción: completar las 3 elecciones en menos de 30 segundos. Si tarda más → refutada.",
  },
  "H-A": {
    term: "H·A",
    def: "Hipótesis A (backlog): patrones de usuarios similares. No la probamos primero.",
  },
  "H-B": {
    term: "H·B",
    def: "Hipótesis B (spike técnico): procesar señales de sesión cero en tiempo real.",
  },
  "H-C": {
    term: "H·C ★",
    def: "Hipótesis C — onboarding liviano (3 elecciones). La más rápida y de menor riesgo; la probamos primero.",
  },
  "redisenar-no-agregar": {
    term: "Rediseñar, no agregar",
    def: "No sumamos un paso nuevo: mejoramos el paso de gustos que ya existe, dejándolo liviano.",
  },
  "falsable": {
    term: "Hipótesis falsable",
    def: "Está escrita para poder fallar. Si no se cumplen umbrales o sube abandono → se refuta.",
  },
  "WoZ": {
    term: "Wizard of Oz (WoZ)",
    def: "El usuario cree que es automático; detrás hay curación manual. Probamos la idea antes de ingeniería.",
  },
  "longitudinal": {
    term: "Longitudinal",
    def: "Seguimiento en el tiempo (aquí: 7 días por persona), no solo una entrevista puntual.",
  },
  "control": {
    term: "Grupo control",
    def: "Sin selección de preferencias + home genérica. Base para comparar el efecto de la señal.",
  },
  "experimental": {
    term: "Brazo experimental",
    def: "3 géneros/títulos + home curada (“la apuesta”). Misma medición que el control.",
  },
  "play-valido": {
    term: "Play válido (s1)",
    def: "Reproducción que cuenta como activación en la primera sesión (umbral ≥65%).",
  },
  "Watch-Time": {
    term: "Watch Time (WT)",
    def: "Tiempo de visualización. Meta: +10% en sesión 1 vs control (simulado: +12%).",
  },
  "n-direccional": {
    term: "n = 30–50 (direccional)",
    def: "Muestra chica para decidir dirección, no para afirmar significancia a escala WebFlix.",
  },
  "umbral": {
    term: "Umbral de éxito",
    def: "Número predefinido para confirma/refuta (≥80% <30 s, ≥65% play, etc.).",
  },
  "refutacion": {
    term: "Refutación",
    def: "La hipótesis queda fuera: no se cumplen umbrales o sube el abandono en onboarding.",
  },
  "copiloto": {
    term: "IA como copiloto",
    def: "Acelera proceso (mapas, maquetas). No reemplaza evidencia de usuarios.",
  },
  "sesion-cero": {
    term: "Sesión cero",
    def: "Primeros minutos sin historial: dispositivo, hora, clics. Señales paralelas al onboarding.",
  },
  "Ley-Jakob": {
    term: "Ley de Jakob",
    def: "Los usuarios prefieren que tu producto funcione como los que ya conocen (aquí: swipe tipo Tinder).",
  },
  "affordance": {
    term: "Affordance",
    def: "La interfaz “invita” a la acción correcta sin explicar (deslizar/tocar se entiende solo).",
  },
  "tramo-critico": {
    term: "Tramo crítico",
    def: "Solo el flujo de la hipótesis: vacío → 3 señales → home → play. No el producto completo.",
  },
  "simulacion": {
    term: "Datos simulados",
    def: "Números del ejercicio alineados a umbrales. No son resultados de campo en producción.",
  },
  "intencion-declarada": {
    term: "Intención declarada",
    def: "Lo que el usuario dice que hará (volver). No es retención observada.",
  },
  "exploratoria": {
    term: "Métrica exploratoria",
    def: "Se mira con cuidado (D7 29→33). No es prueba estadística con n chica.",
  },
  "confirma": {
    term: "Confirma (decisión)",
    def: "Regla predefinida: hay valor y baja fricción → perseverar / avanzar a piloto.",
  },
  "perseverar": {
    term: "Perseverar (con ajuste)",
    def: "Seguir la dirección, pero sin curación manual: conectar señales al motor real.",
  },
  "piloto": {
    term: "Piloto real",
    def: "Siguiente fase con Ingeniería/Data, muestra mayor y motor consumiendo señales.",
  },
  "mezcla-senales": {
    term: "Mezcla de señales",
    def: "Riesgo en planes familiares: gustos de un perfil “contaminan” a otro.",
  },
  "Plan-B-Exp2": {
    term: "Plan B · Exp. 2",
    def: "Si el momento onboarding falla: probar el selector en D1–D7 solo a quienes aún no reprodujeron.",
  },
};

/** Keys base que conviene ver casi siempre */
window.WEBFLIX_GLOSSARY_CORE = ["guardrail", "Day-7", "WoZ", "H-C", "<30s"];
