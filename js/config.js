/**
 * Configuration module — TeachPrompt
 * ----------------------------------------------------------------
 * Single source of truth for every option, model, and default.
 * To extend the app (new graphic types, colors, models, etc.),
 * edit only this file. The UI and prompt builder pick up changes
 * automatically.
 *
 * Every visible text is bilingual: { en: '...', es: '...' }.
 * The `value` and `id` fields never change with the language, so saved
 * settings, presets, and history keep working in both languages.
 */

export const APP_VERSION = '1.4.0';
export const STORAGE_KEY = 'igpa-settings-v1';
export const PRESETS_KEY = 'igpa-presets-v1';
export const HISTORY_KEY = 'igpa-history-v1';
export const HISTORY_LIMIT = 30;

/* ------------------------------------------------------------------ */
/*  Quick-start templates                                              */
/* ------------------------------------------------------------------ */
export const QUICK_STARTS = [
  {
    id: 'classroom',
    label: { en: 'Classroom Activity', es: 'Actividad en clase' },
    values: {
      audience: {
        en: 'K–12 students in a classroom setting',
        es: 'Estudiantes de K–12 en un salón de clases'
      },
      bloomLevel: 'understand',
      complexity: 'moderate',
      amountOfText: 'moderate-labels',
      pedagogical: ['factual-accuracy', 'clear-hierarchy'],
      accessibility: ['color-blind-safe', 'alt-text', 'readability-distance']
    }
  },
  {
    id: 'lecture',
    label: { en: 'Lecture', es: 'Clase magistral' },
    values: {
      audience: {
        en: 'College or adult learners in a lecture environment',
        es: 'Estudiantes universitarios o adultos en una clase magistral'
      },
      bloomLevel: 'analyze',
      complexity: 'detailed',
      amountOfText: 'moderate-labels',
      pedagogical: ['factual-accuracy', 'clear-hierarchy'],
      accessibility: ['alt-text', 'readability-distance']
    }
  },
  {
    id: 'training',
    label: { en: 'Training', es: 'Capacitación' },
    values: {
      audience: {
        en: 'Professional adult learners in corporate or skills training',
        es: 'Adultos en capacitación laboral o de habilidades técnicas'
      },
      bloomLevel: 'apply',
      complexity: 'moderate',
      amountOfText: 'key-terms',
      pedagogical: ['factual-accuracy', 'clear-hierarchy'],
      accessibility: ['color-blind-safe', 'readability-distance']
    }
  },
  {
    id: 'summary',
    label: { en: 'Learning Summary', es: 'Resumen de aprendizaje' },
    values: {
      audience: {
        en: 'Learners reviewing or consolidating knowledge',
        es: 'Estudiantes que repasan o consolidan lo aprendido'
      },
      bloomLevel: 'remember',
      complexity: 'minimal',
      amountOfText: 'key-terms',
      pedagogical: ['clear-hierarchy'],
      accessibility: ['readability-distance', 'alt-text']
    }
  }
];

/* ------------------------------------------------------------------ */
/*  Graphic types                                                      */
/* ------------------------------------------------------------------ */
export const GRAPHIC_TYPES = [
  {
    id: 'concept-map',
    title: { en: 'Concept Map', es: 'Mapa conceptual' },
    subtitle: { en: 'Show relationships', es: 'Mostrar relaciones' },
    description: {
      en: 'Connects ideas with labeled links to reveal how concepts interrelate.',
      es: 'Conecta ideas con enlaces etiquetados para mostrar cómo se relacionan los conceptos.'
    }
  },
  {
    id: 'flowchart',
    title: { en: 'Flowchart', es: 'Diagrama de flujo' },
    subtitle: { en: 'Clarify process steps', es: 'Aclarar los pasos de un proceso' },
    description: {
      en: 'Sequential decision-based steps showing how a process unfolds.',
      es: 'Pasos secuenciales con puntos de decisión que muestran cómo avanza un proceso.'
    }
  },
  {
    id: 'infographic',
    title: { en: 'Infographic', es: 'Infografía' },
    subtitle: { en: 'Combine data & narrative', es: 'Combinar datos y narrativa' },
    description: {
      en: 'Mixes statistics, illustrations, and short text into a scannable visual story.',
      es: 'Combina estadísticas, ilustraciones y textos breves en una historia visual fácil de recorrer.'
    }
  },
  {
    id: 'timeline',
    title: { en: 'Timeline', es: 'Línea de tiempo' },
    subtitle: { en: 'Show chronology', es: 'Mostrar la cronología' },
    description: {
      en: 'Plots events along a horizontal or vertical axis to reveal order and pacing.',
      es: 'Ubica eventos en un eje horizontal o vertical para mostrar su orden y ritmo.'
    }
  },
  {
    id: 'comparison',
    title: { en: 'Comparison Chart', es: 'Cuadro comparativo' },
    subtitle: { en: 'Emphasize differences', es: 'Resaltar diferencias' },
    description: {
      en: 'Side-by-side or matrix layout that contrasts two or more items across attributes.',
      es: 'Distribución lado a lado o en matriz que contrasta dos o más elementos según sus atributos.'
    }
  },
  {
    id: 'labeled-diagram',
    title: { en: 'Labeled Diagram', es: 'Diagrama con etiquetas' },
    subtitle: { en: 'Identify parts', es: 'Identificar partes' },
    description: {
      en: 'A clear illustration with callout labels pointing to each component.',
      es: 'Una ilustración clara con etiquetas que señalan cada componente.'
    }
  },
  {
    id: 'cycle',
    title: { en: 'Cycle Diagram', es: 'Diagrama de ciclo' },
    subtitle: { en: 'Show repeating processes', es: 'Mostrar procesos que se repiten' },
    description: {
      en: 'Circular arrangement of stages that loop back to the beginning.',
      es: 'Etapas en disposición circular que regresan al punto de inicio.'
    }
  },
  {
    id: 'hierarchy',
    title: { en: 'Hierarchy / Org Chart', es: 'Jerarquía / organigrama' },
    subtitle: { en: 'Show structure', es: 'Mostrar la estructura' },
    description: {
      en: 'Tree-like arrangement showing levels of authority, taxonomy, or containment.',
      es: 'Estructura de árbol que muestra niveles de autoridad, clasificación o pertenencia.'
    }
  },
  {
    id: 'venn',
    title: { en: 'Venn Diagram', es: 'Diagrama de Venn' },
    subtitle: { en: 'Show overlap & intersection', es: 'Mostrar coincidencias' },
    description: {
      en: 'Overlapping circles that reveal shared and distinct attributes.',
      es: 'Círculos superpuestos que muestran atributos compartidos y distintos.'
    }
  },
  {
    id: 'matrix',
    title: { en: '2×2 Matrix', es: 'Matriz 2×2' },
    subtitle: { en: 'Categorize by two axes', es: 'Clasificar según dos ejes' },
    description: {
      en: 'Quadrant grid that classifies items along two intersecting dimensions.',
      es: 'Cuadrícula de cuatro cuadrantes que clasifica elementos según dos dimensiones.'
    }
  },
  {
    id: 'mind-map',
    title: { en: 'Mind Map', es: 'Mapa mental' },
    subtitle: { en: 'Brainstorm & explore', es: 'Generar y explorar ideas' },
    description: {
      en: 'Radial branching from a central topic, capturing free associations.',
      es: 'Ramas que salen de un tema central y recogen asociaciones libres.'
    }
  },
  {
    id: 'sequence',
    title: { en: 'Sequence / Step-by-Step', es: 'Secuencia / paso a paso' },
    subtitle: { en: 'Demonstrate procedure', es: 'Mostrar un procedimiento' },
    description: {
      en: 'Numbered panels that show a linear how-to procedure.',
      es: 'Paneles numerados que muestran un procedimiento en orden.'
    }
  },
  {
    id: 'anatomy',
    title: { en: 'Anatomy / Cross-Section', es: 'Anatomía / corte transversal' },
    subtitle: { en: 'Reveal internal structure', es: 'Mostrar la estructura interna' },
    description: {
      en: 'Cutaway view exposing the internal workings of a subject.',
      es: 'Vista en corte que deja ver el funcionamiento interno de un objeto o sistema.'
    }
  },
  {
    id: 'data-viz',
    title: { en: 'Data Visualization', es: 'Visualización de datos' },
    subtitle: { en: 'Display quantitative evidence', es: 'Presentar datos numéricos' },
    description: {
      en: 'Charts, graphs, or plots conveying numeric information clearly.',
      es: 'Gráficas y diagramas que comunican información numérica con claridad.'
    }
  },
  {
    id: 'visual-analogy',
    title: { en: 'Visual Analogy', es: 'Analogía visual' },
    subtitle: { en: 'Bridge unfamiliar to familiar', es: 'Conectar lo nuevo con lo conocido' },
    description: {
      en: 'Pairs an abstract concept with a concrete, everyday metaphor.',
      es: 'Relaciona un concepto abstracto con una metáfora concreta de la vida diaria.'
    }
  },
  {
    id: 'reference-poster',
    title: { en: 'Reference Poster', es: 'Póster de referencia' },
    subtitle: { en: 'At-a-glance teaching wall piece', es: 'Consulta rápida para la pared del aula' },
    description: {
      en: 'Dense, visually rich poster designed to live on a classroom wall.',
      es: 'Póster con mucha información visual, pensado para quedarse en la pared del salón.'
    }
  }
];

/* ------------------------------------------------------------------ */
/*  Select / dropdown option groups                                    */
/* ------------------------------------------------------------------ */
const SELECT = { en: '— select —', es: '— elige —' };

export const OPTIONS = {
  subjectArea: [
    { value: '', label: SELECT },
    { value: 'science', label: { en: 'Science', es: 'Ciencias' } },
    { value: 'math', label: { en: 'Mathematics', es: 'Matemáticas' } },
    { value: 'history', label: { en: 'History / Social Studies', es: 'Historia / Ciencias sociales' } },
    { value: 'language-arts', label: { en: 'Language Arts / Literacy', es: 'Lengua y literatura' } },
    { value: 'computer-science', label: { en: 'Computer Science / IT', es: 'Informática / TI' } },
    { value: 'engineering', label: { en: 'Engineering', es: 'Ingeniería' } },
    { value: 'business', label: { en: 'Business / Economics', es: 'Negocios / Economía' } },
    { value: 'health', label: { en: 'Health / Medicine', es: 'Salud / Medicina' } },
    { value: 'arts', label: { en: 'Arts / Design', es: 'Artes / Diseño' } },
    { value: 'world-languages', label: { en: 'World Languages', es: 'Idiomas' } },
    { value: 'career-tech', label: { en: 'Career & Technical Education', es: 'Educación técnica y profesional' } },
    { value: 'other', label: { en: 'Other / Interdisciplinary', es: 'Otra / Interdisciplinaria' } }
  ],

  gradeLevel: [
    { value: '', label: SELECT },
    { value: 'elementary', label: { en: 'Elementary (K–5)', es: 'Primaria (K–5)' } },
    { value: 'middle', label: { en: 'Middle School (6–8)', es: 'Secundaria (6–8)' } },
    { value: 'high', label: { en: 'High School (9–12)', es: 'Preparatoria / Bachillerato (9–12)' } },
    { value: 'college', label: { en: 'College / University', es: 'Universidad / College' } },
    { value: 'adult', label: { en: 'Adult / Professional', es: 'Adultos / Profesionales' } },
    { value: 'mixed', label: { en: 'Mixed / Multi-level', es: 'Mixto / Varios niveles' } }
  ],

  bloomLevel: [
    { value: '', label: SELECT },
    { value: 'remember', label: { en: 'Remember — recall facts and basic concepts', es: 'Recordar — evocar datos y conceptos básicos' } },
    { value: 'understand', label: { en: 'Understand — explain ideas or concepts', es: 'Comprender — explicar ideas o conceptos' } },
    { value: 'apply', label: { en: 'Apply — use information in new situations', es: 'Aplicar — usar la información en situaciones nuevas' } },
    { value: 'analyze', label: { en: 'Analyze — draw connections among ideas', es: 'Analizar — establecer relaciones entre ideas' } },
    { value: 'evaluate', label: { en: 'Evaluate — justify a decision or course of action', es: 'Evaluar — justificar una decisión o una postura' } },
    { value: 'create', label: { en: 'Create — produce new or original work', es: 'Crear — producir un trabajo nuevo u original' } }
  ],

  visualStyle: [
    { value: 'flat-vector', label: { en: 'Flat vector illustration', es: 'Ilustración vectorial plana' } },
    { value: 'line-art', label: { en: 'Clean line art', es: 'Dibujo de líneas limpio' } },
    { value: 'isometric', label: { en: 'Isometric', es: 'Isométrico' } },
    { value: 'hand-drawn', label: { en: 'Hand-drawn / sketch', es: 'Dibujado a mano / boceto' } },
    { value: 'realistic', label: { en: 'Semi-realistic illustration', es: 'Ilustración semirrealista' } },
    { value: 'minimal-geometric', label: { en: 'Minimal geometric', es: 'Geométrico minimalista' } },
    { value: 'infographic-modern', label: { en: 'Modern infographic style', es: 'Infografía moderna' } },
    { value: 'textbook', label: { en: 'Classic textbook diagram', es: 'Diagrama de libro de texto clásico' } }
  ],

  tone: [
    { value: 'professional', label: { en: 'Professional / formal', es: 'Profesional / formal' } },
    { value: 'friendly', label: { en: 'Friendly / approachable', es: 'Amigable / cercano' } },
    { value: 'playful', label: { en: 'Playful / engaging', es: 'Lúdico / atractivo' } },
    { value: 'academic', label: { en: 'Academic / scholarly', es: 'Académico' } },
    { value: 'technical', label: { en: 'Technical / precise', es: 'Técnico / preciso' } },
    { value: 'inspirational', label: { en: 'Inspirational / motivational', es: 'Inspirador / motivador' } }
  ],

  colorScheme: [
    { value: 'editorial-neutrals', label: { en: 'Editorial neutrals (cream, ink, single accent)', es: 'Neutros editoriales (crema, tinta, un acento)' } },
    { value: 'cool-blues', label: { en: 'Cool blues & grays', es: 'Azules y grises fríos' } },
    { value: 'warm-earth', label: { en: 'Warm earth tones', es: 'Tonos tierra cálidos' } },
    { value: 'high-contrast', label: { en: 'High-contrast (black, white, bold accent)', es: 'Alto contraste (negro, blanco, un acento fuerte)' } },
    { value: 'pastel', label: { en: 'Soft pastels', es: 'Pasteles suaves' } },
    { value: 'vibrant', label: { en: 'Vibrant multi-color', es: 'Multicolor vibrante' } },
    { value: 'monochrome', label: { en: 'Monochrome + one accent', es: 'Monocromático + un acento' } },
    { value: 'brand-neutral', label: { en: 'Brand-neutral educational palette', es: 'Paleta educativa neutra, sin marca' } }
  ],

  complexity: [
    { value: 'minimal', label: { en: 'Minimal — single concept, sparse', es: 'Mínima — un solo concepto, poco contenido' } },
    { value: 'moderate', label: { en: 'Moderate — clear structure, balanced', es: 'Moderada — estructura clara y equilibrada' } },
    { value: 'detailed', label: { en: 'Detailed — rich but organized', es: 'Detallada — mucho contenido, bien organizado' } },
    { value: 'dense', label: { en: 'Dense — reference-level information', es: 'Densa — nivel de material de consulta' } }
  ],

  sizePreset: [
    { value: 'us-letter-portrait', label: { en: 'US Letter — 8.5 × 11 in (portrait)', es: 'Carta — 8.5 × 11 in (vertical)' } },
    { value: 'us-letter-landscape', label: { en: 'US Letter — 11 × 8.5 in (landscape)', es: 'Carta — 11 × 8.5 in (horizontal)' } },
    { value: 'a4-portrait', label: { en: 'A4 — 210 × 297 mm (portrait)', es: 'A4 — 210 × 297 mm (vertical)' } },
    { value: 'a4-landscape', label: { en: 'A4 — 297 × 210 mm (landscape)', es: 'A4 — 297 × 210 mm (horizontal)' } },
    { value: 'slide-16-9', label: { en: 'Presentation slide — 16:9', es: 'Diapositiva — 16:9' } },
    { value: 'slide-4-3', label: { en: 'Presentation slide — 4:3', es: 'Diapositiva — 4:3' } },
    { value: 'square', label: { en: 'Square — social / digital', es: 'Cuadrado — redes / digital' } },
    { value: 'poster-tabloid', label: { en: 'Tabloid / Poster — 11 × 17 in', es: 'Tabloide / Póster — 11 × 17 in' } },
    { value: 'custom', label: { en: 'Custom (describe in notes)', es: 'Personalizado (descríbelo en las notas)' } }
  ],

  orientation: [
    { value: 'as-preset', label: { en: 'As specified by size preset', es: 'Según el tamaño elegido' } },
    { value: 'portrait', label: { en: 'Portrait', es: 'Vertical' } },
    { value: 'landscape', label: { en: 'Landscape', es: 'Horizontal' } },
    { value: 'square', label: { en: 'Square', es: 'Cuadrada' } }
  ],

  amountOfText: [
    { value: 'key-terms', label: { en: 'Minimal labels — title + key terms only', es: 'Mínimo — solo título y términos clave' } },
    { value: 'moderate-labels', label: { en: 'Moderate — short captions and labels', es: 'Moderado — etiquetas y leyendas breves' } },
    { value: 'explanatory', label: { en: 'Explanatory — brief supporting sentences', es: 'Explicativo — frases breves de apoyo' } },
    { value: 'detailed', label: { en: 'Detailed — paragraphs allowed where needed', es: 'Detallado — párrafos donde haga falta' } }
  ],

  fileFormat: [
    { value: 'png', label: { en: 'PNG — screen & presentation (transparency-capable)', es: 'PNG — pantalla y presentaciones (admite transparencia)' } },
    { value: 'svg', label: { en: 'SVG — scalable vector', es: 'SVG — vectorial escalable' } },
    { value: 'pdf', label: { en: 'PDF — print-ready', es: 'PDF — listo para imprimir' } },
    { value: 'jpg', label: { en: 'JPG — photographic / web', es: 'JPG — fotografía / web' } },
    { value: 'webp', label: { en: 'WebP — modern web', es: 'WebP — web moderna' } }
  ],

  resolution: [
    { value: '72', label: { en: '72 DPI (screen)', es: '72 DPI (pantalla)' } },
    { value: '150', label: { en: '150 DPI (good quality)', es: '150 DPI (buena calidad)' } },
    { value: '300', label: { en: '300 DPI (print quality)', es: '300 DPI (calidad de impresión)' } },
    { value: '600', label: { en: '600 DPI (high-end print)', es: '600 DPI (impresión profesional)' } }
  ]
};

/* ------------------------------------------------------------------ */
/*  Icon & illustration preference chips (multi-select)                */
/* ------------------------------------------------------------------ */
export const ICON_PREFERENCES = [
  { id: 'icons-only', label: { en: 'Icons only', es: 'Solo íconos' } },
  { id: 'icons-illustrations', label: { en: 'Icons + illustrations', es: 'Íconos + ilustraciones' } },
  { id: 'people', label: { en: 'Illustrations of people', es: 'Ilustraciones de personas' } },
  { id: 'abstract', label: { en: 'Abstract shapes only', es: 'Solo formas abstractas' } },
  { id: 'labeled-diagrams', label: { en: 'Labeled diagrams', es: 'Diagramas con etiquetas' } },
  { id: 'type-only', label: { en: 'Type only', es: 'Solo tipografía' } }
];

/* ------------------------------------------------------------------ */
/*  Accessibility options                                              */
/* ------------------------------------------------------------------ */
export const ACCESSIBILITY = [
  { id: 'color-blind-safe', label: { en: 'Color-blind-safe palette', es: 'Paleta apta para daltonismo' } },
  { id: 'alt-text', label: { en: 'Include alt-text description', es: 'Incluir texto alternativo (alt)' } },
  { id: 'readability-distance', label: { en: 'Prioritize readability at distance', es: 'Priorizar la lectura a distancia' } },
  { id: 'high-contrast', label: { en: 'High-contrast text and shapes', es: 'Texto y formas de alto contraste' } },
  { id: 'large-labels', label: { en: 'Large, legible labels', es: 'Etiquetas grandes y legibles' } }
];

/* ------------------------------------------------------------------ */
/*  Pedagogical constraints                                            */
/* ------------------------------------------------------------------ */
export const PEDAGOGICAL = [
  { id: 'factual-accuracy', label: { en: 'Enforce factual & technical accuracy', es: 'Exigir exactitud factual y técnica' } },
  { id: 'clear-hierarchy', label: { en: 'Clear visual hierarchy', es: 'Jerarquía visual clara' } },
  { id: 'cite-sources', label: { en: 'Cite sources in caption', es: 'Citar las fuentes en la leyenda' } },
  { id: 'age-appropriate', label: { en: 'Age-appropriate content and imagery', es: 'Contenido e imágenes adecuados a la edad' } },
  { id: 'scaffold-complexity', label: { en: 'Scaffold complexity for the stated grade level', es: 'Graduar la complejidad según el nivel indicado' } }
];

/* ------------------------------------------------------------------ */
/*  Target AI models                                                   */
/* ------------------------------------------------------------------ */
export const MODELS = [
  {
    id: 'claude',
    name: 'Claude',
    tagline: { en: 'Structured · Anthropic', es: 'Estructurado · Anthropic' },
    url: 'https://claude.ai/new',
    promptHint: {
      en: 'Use precise, structured language. Prefer explicit constraints and numbered requirements. Claude responds well to clear role and output-format instructions.',
      es: 'Usa un lenguaje preciso y estructurado. Prefiere restricciones explícitas y requisitos numerados. Claude responde bien a instrucciones claras sobre el rol y el formato de salida.'
    }
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    tagline: { en: 'Conversational · OpenAI', es: 'Conversacional · OpenAI' },
    url: 'https://chatgpt.com/',
    promptHint: {
      en: 'Use clear, conversational yet precise language. Explicitly request step-by-step reasoning when helpful and specify the desired output format.',
      es: 'Usa un lenguaje claro y conversacional, pero preciso. Pide razonamiento paso a paso cuando sea útil e indica el formato de salida deseado.'
    }
  },
  {
    id: 'gemini',
    name: 'Gemini',
    tagline: { en: 'Multimodal · Google', es: 'Multimodal · Google' },
    url: 'https://gemini.google.com/app',
    promptHint: {
      en: 'Leverage multimodal strengths. Be explicit about visual composition, layout, and any reference to real-world educational contexts.',
      es: 'Aprovecha sus capacidades multimodales. Sé explícito sobre la composición visual, la distribución y cualquier referencia a contextos educativos reales.'
    }
  },
  {
    id: 'grok',
    name: 'Grok',
    tagline: { en: 'Truth-seeking · xAI', es: 'Orientado a la verdad · xAI' },
    url: 'https://grok.com/',
    promptHint: {
      en: 'Be direct and precise. Emphasize accuracy, clarity, and practical usefulness. Avoid unnecessary flourish; favor concrete visual specifications.',
      es: 'Sé directo y preciso. Prioriza la exactitud, la claridad y la utilidad práctica. Evita adornos innecesarios y prefiere especificaciones visuales concretas.'
    }
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    tagline: { en: 'Research-first', es: 'Enfocado en investigación' },
    url: 'https://www.perplexity.ai/',
    promptHint: {
      en: 'Emphasize accuracy and sourcing. Request citations or verification of factual content where appropriate.',
      es: 'Prioriza la exactitud y las fuentes. Pide citas o verificación del contenido factual cuando corresponda.'
    }
  },
  {
    id: 'generic',
    name: { en: 'Generic / Other', es: 'Genérico / Otro' },
    tagline: { en: 'Model-agnostic', es: 'Para cualquier modelo' },
    url: 'https://chatgpt.com/',
    promptHint: {
      en: 'Write in clear, model-agnostic instructional-design language that works across most modern LLMs.',
      es: 'Escribe con un lenguaje de diseño instruccional claro, que funcione en la mayoría de los modelos de lenguaje actuales.'
    }
  }
];

/* ------------------------------------------------------------------ */
/*  Default application state                                          */
/* ------------------------------------------------------------------ */
export const DEFAULT_STATE = {
  topic: '',
  subjectArea: '',
  gradeLevel: '',
  audience: '',
  learningObjective: '',
  bloomLevel: '',
  graphicType: null,
  visualStyle: 'flat-vector',
  tone: 'professional',
  colorScheme: 'editorial-neutrals',
  complexity: 'moderate',
  iconPreferences: ['icons-illustrations'],
  sizePreset: 'us-letter-portrait',
  orientation: 'as-preset',
  amountOfText: 'key-terms',
  fileFormat: 'png',
  resolution: '300',
  transparentBg: false,
  safeMargins: true,
  accessibility: ['color-blind-safe', 'alt-text', 'readability-distance'],
  pedagogical: ['factual-accuracy', 'clear-hierarchy'],
  model: 'claude',
  extraNotes: '',
  theme: 'light'
};
