/* Glosario · definiciones cortas para leer al vuelo */
window.WEBFLIX_GLOSSARY = {
  "Day-7": {
    term: "Day-7 (D7)",
    def: "% que sigue activo al día 7. Es el outcome de negocio. Hoy no lo medimos como prueba principal.",
  },
  "pp": {
    term: "pp (puntos porcentuales)",
    def: "42% → 29% = −13 pp. Es la resta directa de porcentajes, no el % relativo.",
  },
  "caida-relativa": {
    term: "Caída relativa (~31%)",
    def: "13 ÷ 42 ≈ 31%. Qué tan grande es la caída respecto al punto de partida.",
  },
  "MAU": {
    term: "MAU",
    def: "Usuarios activos al mes (~360 M con perfiles).",
  },
  "cold-start": {
    term: "Cold start",
    def: "Usuario nuevo sin historial. El sistema casi no tiene señales para personalizar.",
  },
  "primer-momento-valor": {
    term: "Primer momento de valor",
    def: "Cuando la app se siente útil por primera vez (encuentra algo y reproduce).",
  },
  "activacion": {
    term: "Activación",
    def: "Primera acción de valor: play válido en la sesión 1. No basta con registrarse.",
  },
  "relevancia": {
    term: "Relevancia",
    def: "Que lo que ves se sienta “para ti”. Aquí: nota 4–5 y más reproducción.",
  },
  "outcome": {
    term: "Outcome de negocio",
    def: "Lo que importa al negocio (Day-7). Distinto de las métricas intermedias del test.",
  },
  "supuesto": {
    term: "Supuesto (≠ hecho)",
    def: "Hecho: Day-7 cayó. Supuesto: “faltan señales tempranas”. Hay que validarlo.",
  },
  "friccion": {
    term: "Fricción",
    def: "Esfuerzo o tiempo de más que empuja a abandonar.",
  },
  "onboarding": {
    term: "Onboarding",
    def: "Flujo de llegada. Aquí: elegir géneros — el paso ya existe y está mal hecho.",
  },
  "guardrail": {
    term: "Guardrail",
    def: "Límite duro. Si se rompe, la hipótesis muere ahí. Ejemplo: más de 30 s eligiendo.",
  },
  "<30s": {
    term: "< 30 s",
    def: "Máximo para completar las 3 elecciones. Si pasa de 30 s → refutada.",
  },
  "H-A": {
    term: "H·A",
    def: "Hipótesis A (backlog): copiar patrones de usuarios similares. No la probamos hoy.",
  },
  "H-B": {
    term: "H·B",
    def: "Hipótesis B (spike): procesar señales de sesión cero en tiempo real.",
  },
  "H-C": {
    term: "H·C ★",
    def: "Hipótesis C: onboarding liviano con 3 elecciones. La más barata de probar. Va primero.",
  },
  "redisenar-no-agregar": {
    term: "Rediseñar, no agregar",
    def: "No sumamos un paso nuevo. Arreglamos el de gustos que ya existe.",
  },
  "falsable": {
    term: "Hipótesis falsable",
    def: "Está escrita para poder fallar. Si no se cumplen umbrales → se descarta.",
  },
  "WoZ": {
    term: "Wizard of Oz (WoZ)",
    def: "El usuario cree que es automático. Detrás hay curación manual. Probamos sin ingeniería pesada.",
  },
  "longitudinal": {
    term: "Longitudinal",
    def: "Seguimos a la persona varios días (aquí: 7), no solo una entrevista.",
  },
  "control": {
    term: "Grupo control",
    def: "Sin preferencias + home genérica. Sirve de base para comparar.",
  },
  "experimental": {
    term: "Brazo experimental",
    def: "3 elecciones + home curada. “La apuesta”. Misma medición que el control.",
  },
  "play-valido": {
    term: "Play válido (s1)",
    def: "Reproducción que cuenta como activación en la primera sesión. Meta ≥65%.",
  },
  "Watch-Time": {
    term: "Watch Time (WT)",
    def: "Minutos de visualización. Meta: +10% en sesión 1 vs control.",
  },
  "n-direccional": {
    term: "n = 30–50 (direccional)",
    def: "Muestra chica para decidir dirección. No prueba a escala WebFlix.",
  },
  "umbral": {
    term: "Umbral de éxito",
    def: "Número fijado de antemano para decir confirma o refuta.",
  },
  "refutacion": {
    term: "Refutación",
    def: "La hipótesis no se sostiene: fallan umbrales o sube el abandono.",
  },
  "copiloto": {
    term: "IA como copiloto",
    def: "Acelera mapas y maquetas. No reemplaza evidencia de usuarios.",
  },
  "sesion-cero": {
    term: "Sesión cero",
    def: "Primeros minutos sin historial: dispositivo, hora, clics. Señales extra al onboarding.",
  },
  "Ley-Jakob": {
    term: "Ley de Jakob",
    def: "La gente prefiere que funcione como lo que ya conoce (aquí: swipe tipo Tinder).",
  },
  "affordance": {
    term: "Affordance",
    def: "La interfaz “se entiende sola”: invita a la acción sin explicar.",
  },
  "tramo-critico": {
    term: "Tramo crítico",
    def: "Solo el flujo de la hipótesis: vacío → 3 señales → home → play.",
  },
  "simulacion": {
    term: "Datos simulados",
    def: "Números del ejercicio, alineados a los umbrales. No son resultados de campo reales.",
  },
  "intencion-declarada": {
    term: "Intención declarada",
    def: "Lo que el usuario dice que hará. No es retención medida.",
  },
  "exploratoria": {
    term: "Métrica exploratoria",
    def: "Se mira con cuidado (D7 29→33). Con n chica no es prueba estadística.",
  },
  "confirma": {
    term: "Confirma (decisión)",
    def: "Hubo valor y poca fricción → perseverar / ir a piloto.",
  },
  "perseverar": {
    term: "Perseverar (con ajuste)",
    def: "Seguimos la dirección, pero sin curar a mano: conectar señales al motor real.",
  },
  "piloto": {
    term: "Piloto real",
    def: "Siguiente fase con Ingeniería/Data, más muestra y motor consumiendo señales.",
  },
  "mezcla-senales": {
    term: "Mezcla de señales",
    def: "En planes familiares, los gustos de un perfil pueden “contaminar” a otro.",
  },
  "Plan-B-Exp2": {
    term: "Plan B · Exp. 2",
    def: "Si el onboarding no es el momento: probar el selector en D1–D7 solo a quien aún no reprodujo.",
  },
};

window.WEBFLIX_GLOSSARY_CORE = ["guardrail", "Day-7", "WoZ", "H-C", "<30s"];
