/**
 * i18n — language selection and every fixed text in the app.
 * ----------------------------------------------------------------
 * Supported languages: English (en) and Spanish (es).
 *
 * - t('key', { name: 'x' }) returns a UI string in the current language
 *   and replaces {name} placeholders.
 * - L(value) resolves a bilingual label from config.js ({ en, es }).
 *   Plain strings pass through unchanged.
 *
 * To add a language: add its code to LANGUAGES, a block to STRINGS,
 * and the same key to every { en, es } label in config.js.
 */

const LANG_KEY = 'teachprompt-lang';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
];

const SUPPORTED = LANGUAGES.map(l => l.code);

/** First visit: use the browser language. After that: the saved choice. */
function detectLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (SUPPORTED.includes(saved)) return saved;
  } catch (e) { /* storage blocked: fall through */ }

  const browser = navigator.languages || [navigator.language || 'en'];
  for (const code of browser) {
    const short = String(code).slice(0, 2).toLowerCase();
    if (SUPPORTED.includes(short)) return short;
  }
  return 'en';
}

let current = detectLanguage();

export function getLang() {
  return current;
}

export function setLang(code) {
  if (!SUPPORTED.includes(code)) return;
  current = code;
  try { localStorage.setItem(LANG_KEY, code); } catch (e) { /* ignore */ }
  document.documentElement.lang = code;
}

/** Resolve a { en, es } label into the current language. */
export function L(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[current] ?? value.en ?? '';
  }
  return value ?? '';
}

/** Translate a UI key. Falls back to English, then to the key itself. */
export function t(key, vars = {}) {
  const str = STRINGS[current]?.[key] ?? STRINGS.en[key] ?? key;
  return str.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? vars[name] : m));
}

const STRINGS = {
  en: {
    /* Document */
    'doc.title': 'TeachPrompt — AI Studio for Educators',

    /* Header */
    'header.skip': 'Skip to workspace',
    'header.logoAlt': 'TeachPrompt logo',
    'header.tagline': 'Design professional prompts customized for each AI tool to transform educational ideas into engaging learning materials: infographics, diagrams, concept maps, timelines, and personalized teaching resources for every academic level.',
    'header.history': 'Prompt history',
    'header.historyAria': 'View prompt history',
    'header.theme': 'Toggle dark / light mode',
    'header.themeAria': 'Toggle dark mode',
    'header.lang': 'Cambiar a español',
    'header.langAria': 'Change language to Spanish',
    'header.langButton': 'ES',
    'header.levels': 'K–12 · Higher Ed',

    /* Preview panel */
    'preview.aria': 'Generated prompt preview',
    'preview.title': 'The Generated Prompt',
    'preview.outputAria': 'Live prompt text',
    'preview.execute': 'Run Prompt',
    'preview.copy': 'Copy',
    'preview.download': 'Download .txt',
    'preview.reset': 'Reset',
    'preview.forModel': 'For {name}',
    'preview.placeholderSuffix': '. Your prompt will compose itself here.',

    /* Footer */
    'footer.line1': 'Professional AI prompt creation for educators. Every selection updates your prompt instantly.',
    'footer.line2': 'Smart Prompts · Better Teaching · Better Learning',

    /* Preset modal */
    'presetModal.title': 'Save Preset',
    'presetModal.label': 'Preset name',
    'presetModal.placeholder': 'e.g. Biology Concept Maps – High School',
    'presetModal.cancel': 'Cancel',
    'presetModal.save': 'Save',
    'presetModal.defaultName': '{topic} preset',

    /* History modal */
    'history.title': 'Prompt History',
    'history.clear': 'Clear all',
    'history.subtitle': "Prompts you've copied or downloaded, newest first. Nothing is recorded until you use Copy or Download.",
    'history.close': 'Close',
    'history.empty': 'No prompts recorded yet. Copy or download a prompt to start building your history.',
    'history.restore': 'Restore',
    'history.copy': 'Copy',
    'history.delete': 'Delete',
    'history.untitled': '(untitled)',

    /* Sections */
    'quick.aria': 'Quick start templates',
    'quick.label': 'Quick start →',

    's1.title': 'Learning Content',
    's1.desc': 'The concepts, topics, and skills taught in this lesson.',
    's1.topic': 'Topic or Lesson Title',
    's1.topicPh': 'e.g., SQL Joins, OSI Model Layers, Mitochondrial Respiration',
    's1.subject': 'Subject Area',
    's1.grade': 'Grade / Skill Level',
    's1.audience': 'Audience',
    's1.audiencePh': 'e.g., 10th-grade biology students, adult professional learners',
    's1.objective': 'Learning Objective',
    's1.objectivePh': 'By the end of viewing this graphic, the learner will be able to…',
    's1.bloom': "Bloom's Taxonomy Level",

    's2.title': 'Visual Format',
    's2.desc': 'How the information is presented',
    's2.aria': 'Select graphic type',

    's3.title': 'Look &amp; Feel',
    's3.desc': 'The overall aesthetic and visual tone',
    's3.style': 'Visual Style',
    's3.tone': 'Tone',
    's3.color': 'Color Palette',
    's3.complexity': 'Complexity / Density',
    's3.icons': 'Icon &amp; Illustration Preference',

    's4.title': 'Layout &amp; Dimensions',
    's4.desc': 'The physical arrangement and size of visual elements',
    's4.size': 'Size Preset',
    's4.orientation': 'Orientation',
    's4.text': 'Amount of Text',

    's5.title': 'Delivery Format',
    's5.desc': 'The technical format of the final deliverable',
    's5.format': 'File Format',
    's5.resolution': 'Resolution',
    's5.transparent': 'Transparent background',
    's5.margins': 'Include safe margins / bleed area',

    's6.title': 'Accessibility Features',
    's6.desc': 'Design choices that support diverse learners',

    's7.title': 'Instructional Guidelines',
    's7.desc': 'Standards and rules for effective learning design',

    's8.title': 'AI Model',
    's8.desc': 'The model used to generate the output',
    's8.aria': 'Select target AI model',

    's9.title': 'Additional Notes',
    's9.desc': 'Optional details or preferences',
    's9.label': 'Extra instructions or constraints',
    's9.ph': 'Any specific content points, must-include examples, brand colors, or other constraints…',

    /* Preset bar */
    'presets.aria': 'Presets',
    'presets.save': 'Save Preset',
    'presets.loadLabel': 'Load preset',
    'presets.loadOption': '— Load preset —',
    'presets.delete': 'Delete',
    'presets.deleteTitle': 'Delete selected preset',
    'presets.export': 'Export',
    'presets.exportTitle': 'Download all presets as a JSON file',
    'presets.import': 'Import',
    'presets.importTitle': 'Import presets from a JSON file',

    /* Toasts and confirmations */
    'toast.executeOk': 'Prompt copied. Opening {name}…',
    'toast.executeFail': "Couldn't copy automatically. Opening {name}…",
    'toast.copied': 'Copied to clipboard',
    'toast.copyFailed': 'Copy failed — select and copy manually',
    'toast.download': 'Download started',
    'toast.reset': 'Reset to defaults',
    'toast.imported': 'Imported {count} preset(s)',
    'toast.importFailed': 'Import failed',
    'toast.historyCleared': 'History cleared',
    'toast.presetNameMissing': 'Please enter a preset name',
    'toast.presetSaved': 'Preset “{name}” saved',
    'toast.templateApplied': 'Applied “{name}” template',
    'toast.presetLoaded': 'Loaded “{name}”',
    'toast.selectPreset': 'Select a preset to delete',
    'toast.presetDeleted': 'Preset deleted',
    'toast.noPresets': 'No presets to export yet',
    'toast.presetsExported': 'Presets exported',
    'toast.restored': 'Prompt settings restored',
    'confirm.reset': 'Reset all fields to defaults? This cannot be undone.',
    'confirm.clearHistory': 'Clear your entire prompt history? This cannot be undone.',
    'confirm.deletePreset': 'Delete preset “{name}”?',

    /* Import errors (storage.js) */
    'import.noFile': 'No file selected.',
    'import.invalidJson': 'That file is not valid JSON.',
    'import.noArray': 'No presets array found in this file.',
    'import.noValid': 'This file does not contain any recognizable presets.',
    'import.readError': 'Could not read that file.',
    'import.suffix': '(imported)',

    /* Status (prompt-builder.js) */
    'status.complete': 'Ready to generate',
    'status.addObjective': 'Add a learning objective for best results',
    'status.partial': 'Select a topic and graphic type',
    'status.empty': 'Begin by entering a topic and selecting a graphic type',

    /* Generated prompt (prompt-builder.js) */
    'p.role': 'You are an expert instructional designer and visual communication specialist. Create a detailed, classroom-ready instructional graphic based on the following specifications.',
    'p.content': '## Content',
    'p.topic': '- Topic / Lesson Title: {value}',
    'p.topicMissing': '- Topic / Lesson Title: [Please specify the topic]',
    'p.subject': '- Subject Area: {value}',
    'p.grade': '- Grade / Skill Level: {value}',
    'p.audience': '- Target Audience: {value}',
    'p.objective': '- Learning Objective: By the end of viewing this graphic, the learner will be able to {value}',
    'p.bloom': "- Bloom's Taxonomy Level: {value}",
    'p.graphicHeader': '## Graphic Type',
    'p.type': '- Type: {value}',
    'p.purpose': '- Purpose: {value}',
    'p.intent': '- Design intent: {value}',
    'p.typeMissing': '- Type: [Select a graphic type]',
    'p.visualHeader': '## Visual Style & Aesthetic',
    'p.style': '- Visual Style: {value}',
    'p.tone': '- Tone: {value}',
    'p.color': '- Color Palette: {value}',
    'p.complexity': '- Complexity / Density: {value}',
    'p.icons': '- Icon & Illustration Preference: {value}',
    'p.layoutHeader': '## Layout & Image Size',
    'p.size': '- Size Preset: {value}',
    'p.orientation': '- Orientation: {value}',
    'p.text': '- Amount of Text: {value}',
    'p.outputHeader': '## Output Format',
    'p.format': '- File Format: {value}',
    'p.resolution': '- Resolution: {value}',
    'p.transparent': '- Transparent Background: {value}',
    'p.margins': '- Include Safe Margins / Bleed Area: {value}',
    'p.yes': 'Yes',
    'p.no': 'No',
    'p.langHeader': '## Language & Typography Consistency',
    'p.lang1': '- SINGLE-LANGUAGE RULE: Detect the language used in the "Topic / Lesson Title" and "Learning Objective".',
    'p.lang2': '- ALL visible text inside the graphic (main titles, section headers, diagrams, callout labels, step-by-step descriptions, and captions) MUST use THAT SAME LANGUAGE throughout the entire image.',
    'p.lang3': '- Do NOT mix languages. If the topic is written in Spanish, every label and description in the graphic must be in Spanish. If it is written in English, everything must be in English.',
    'p.a11yHeader': '## Accessibility',
    'p.pedHeader': '## Pedagogical Constraints',
    'p.notesHeader': '## Additional Instructions',
    'p.genHeader': '## Generation Instructions',
    'p.target': 'Target model: {name} ({tagline})',
    'p.closing': 'Produce a single, coherent, high-quality instructional graphic that fully satisfies every constraint above. Prioritize clarity, accuracy, and educational effectiveness. If any required detail is missing, make reasonable, research-based assumptions and note them briefly.',

    /* Download file name fallback */
    'file.defaultName': 'instructional-graphic-prompt'
  },

  es: {
    'doc.title': 'TeachPrompt — Estudio de IA para docentes',

    'header.skip': 'Ir al área de trabajo',
    'header.logoAlt': 'Logo de TeachPrompt',
    'header.tagline': 'Diseña prompts profesionales adaptados a cada herramienta de IA para convertir tus ideas educativas en materiales de aprendizaje: infografías, diagramas, mapas conceptuales, líneas de tiempo y recursos didácticos personalizados para cada nivel académico.',
    'header.history': 'Historial de prompts',
    'header.historyAria': 'Ver historial de prompts',
    'header.theme': 'Cambiar modo claro / oscuro',
    'header.themeAria': 'Cambiar a modo oscuro',
    'header.lang': 'Switch to English',
    'header.langAria': 'Cambiar el idioma a inglés',
    'header.langButton': 'EN',
    'header.levels': 'K–12 · Educación superior',

    'preview.aria': 'Vista previa del prompt generado',
    'preview.title': 'El prompt generado',
    'preview.outputAria': 'Texto del prompt en tiempo real',
    'preview.execute': 'Ejecutar prompt',
    'preview.copy': 'Copiar',
    'preview.download': 'Descargar .txt',
    'preview.reset': 'Restablecer',
    'preview.forModel': 'Para {name}',
    'preview.placeholderSuffix': '. Tu prompt se va a armar aquí.',

    'footer.line1': 'Creación profesional de prompts de IA para docentes. Cada opción que eliges actualiza tu prompt al instante.',
    'footer.line2': 'Prompts precisos · Mejor enseñanza · Mejor aprendizaje',

    'presetModal.title': 'Guardar configuración',
    'presetModal.label': 'Nombre de la configuración',
    'presetModal.placeholder': 'Ej.: Mapas conceptuales de biología – Preparatoria',
    'presetModal.cancel': 'Cancelar',
    'presetModal.save': 'Guardar',
    'presetModal.defaultName': 'Configuración: {topic}',

    'history.title': 'Historial de prompts',
    'history.clear': 'Borrar todo',
    'history.subtitle': 'Prompts que copiaste o descargaste, del más reciente al más antiguo. No se guarda nada hasta que usas Copiar o Descargar.',
    'history.close': 'Cerrar',
    'history.empty': 'Todavía no hay prompts guardados. Copia o descarga un prompt para empezar tu historial.',
    'history.restore': 'Restaurar',
    'history.copy': 'Copiar',
    'history.delete': 'Eliminar',
    'history.untitled': '(sin título)',

    'quick.aria': 'Plantillas de inicio rápido',
    'quick.label': 'Inicio rápido →',

    's1.title': 'Contenido de aprendizaje',
    's1.desc': 'Los conceptos, temas y habilidades que se enseñan en esta lección.',
    's1.topic': 'Tema o título de la lección',
    's1.topicPh': 'Ej.: Joins en SQL, capas del modelo OSI, respiración mitocondrial',
    's1.subject': 'Área temática',
    's1.grade': 'Grado / nivel',
    's1.audience': 'Público',
    's1.audiencePh': 'Ej.: estudiantes de biología de 10.º grado, adultos en formación profesional',
    's1.objective': 'Objetivo de aprendizaje',
    's1.objectivePh': 'Al terminar de ver este gráfico, el estudiante podrá…',
    's1.bloom': 'Nivel de la taxonomía de Bloom',

    's2.title': 'Formato visual',
    's2.desc': 'Cómo se presenta la información',
    's2.aria': 'Elige el tipo de gráfico',

    's3.title': 'Estilo visual',
    's3.desc': 'La estética general y el tono visual',
    's3.style': 'Estilo',
    's3.tone': 'Tono',
    's3.color': 'Paleta de colores',
    's3.complexity': 'Complejidad / densidad',
    's3.icons': 'Íconos e ilustraciones',

    's4.title': 'Diseño y dimensiones',
    's4.desc': 'La distribución y el tamaño de los elementos visuales',
    's4.size': 'Tamaño',
    's4.orientation': 'Orientación',
    's4.text': 'Cantidad de texto',

    's5.title': 'Formato de entrega',
    's5.desc': 'El formato técnico del archivo final',
    's5.format': 'Tipo de archivo',
    's5.resolution': 'Resolución',
    's5.transparent': 'Fondo transparente',
    's5.margins': 'Incluir márgenes de seguridad / sangrado',

    's6.title': 'Accesibilidad',
    's6.desc': 'Decisiones de diseño que apoyan a estudiantes diversos',

    's7.title': 'Criterios pedagógicos',
    's7.desc': 'Normas y reglas para un diseño de aprendizaje eficaz',

    's8.title': 'Modelo de IA',
    's8.desc': 'El modelo que va a generar el resultado',
    's8.aria': 'Elige el modelo de IA',

    's9.title': 'Notas adicionales',
    's9.desc': 'Detalles o preferencias opcionales',
    's9.label': 'Instrucciones o restricciones extra',
    's9.ph': 'Puntos de contenido específicos, ejemplos que deben aparecer, colores de marca u otras restricciones…',

    'presets.aria': 'Configuraciones guardadas',
    'presets.save': 'Guardar configuración',
    'presets.loadLabel': 'Cargar configuración',
    'presets.loadOption': '— Cargar configuración —',
    'presets.delete': 'Eliminar',
    'presets.deleteTitle': 'Eliminar la configuración seleccionada',
    'presets.export': 'Exportar',
    'presets.exportTitle': 'Descargar todas las configuraciones en un archivo JSON',
    'presets.import': 'Importar',
    'presets.importTitle': 'Importar configuraciones desde un archivo JSON',

    'toast.executeOk': 'Prompt copiado. Abriendo {name}…',
    'toast.executeFail': 'No se pudo copiar automáticamente. Abriendo {name}…',
    'toast.copied': 'Copiado al portapapeles',
    'toast.copyFailed': 'No se pudo copiar. Selecciónalo y cópialo a mano',
    'toast.download': 'Descarga iniciada',
    'toast.reset': 'Valores restablecidos',
    'toast.imported': 'Se importaron {count} configuraciones',
    'toast.importFailed': 'No se pudo importar',
    'toast.historyCleared': 'Historial borrado',
    'toast.presetNameMissing': 'Escribe un nombre para la configuración',
    'toast.presetSaved': 'Configuración “{name}” guardada',
    'toast.templateApplied': 'Plantilla “{name}” aplicada',
    'toast.presetLoaded': 'Configuración “{name}” cargada',
    'toast.selectPreset': 'Elige una configuración para eliminar',
    'toast.presetDeleted': 'Configuración eliminada',
    'toast.noPresets': 'Todavía no hay configuraciones para exportar',
    'toast.presetsExported': 'Configuraciones exportadas',
    'toast.restored': 'Configuración del prompt restaurada',
    'confirm.reset': '¿Restablecer todos los campos? Esta acción no se puede deshacer.',
    'confirm.clearHistory': '¿Borrar todo el historial de prompts? Esta acción no se puede deshacer.',
    'confirm.deletePreset': '¿Eliminar la configuración “{name}”?',

    'import.noFile': 'No se eligió ningún archivo.',
    'import.invalidJson': 'Ese archivo no es un JSON válido.',
    'import.noArray': 'El archivo no contiene una lista de configuraciones.',
    'import.noValid': 'El archivo no contiene configuraciones que se puedan reconocer.',
    'import.readError': 'No se pudo leer el archivo.',
    'import.suffix': '(importada)',

    'status.complete': 'Listo para generar',
    'status.addObjective': 'Agrega un objetivo de aprendizaje para obtener mejores resultados',
    'status.partial': 'Escribe un tema y elige un tipo de gráfico',
    'status.empty': 'Empieza escribiendo un tema y eligiendo un tipo de gráfico',

    'p.role': 'Eres un diseñador instruccional experto y especialista en comunicación visual. Crea un gráfico didáctico detallado, listo para usar en clase, con las siguientes especificaciones.',
    'p.content': '## Contenido',
    'p.topic': '- Tema / título de la lección: {value}',
    'p.topicMissing': '- Tema / título de la lección: [Indica el tema]',
    'p.subject': '- Área temática: {value}',
    'p.grade': '- Grado / nivel: {value}',
    'p.audience': '- Público: {value}',
    'p.objective': '- Objetivo de aprendizaje: Al terminar de ver este gráfico, el estudiante podrá {value}',
    'p.bloom': '- Nivel de la taxonomía de Bloom: {value}',
    'p.graphicHeader': '## Tipo de gráfico',
    'p.type': '- Tipo: {value}',
    'p.purpose': '- Propósito: {value}',
    'p.intent': '- Intención del diseño: {value}',
    'p.typeMissing': '- Tipo: [Elige un tipo de gráfico]',
    'p.visualHeader': '## Estilo visual y estética',
    'p.style': '- Estilo visual: {value}',
    'p.tone': '- Tono: {value}',
    'p.color': '- Paleta de colores: {value}',
    'p.complexity': '- Complejidad / densidad: {value}',
    'p.icons': '- Íconos e ilustraciones: {value}',
    'p.layoutHeader': '## Diseño y tamaño de la imagen',
    'p.size': '- Tamaño: {value}',
    'p.orientation': '- Orientación: {value}',
    'p.text': '- Cantidad de texto: {value}',
    'p.outputHeader': '## Formato de salida',
    'p.format': '- Tipo de archivo: {value}',
    'p.resolution': '- Resolución: {value}',
    'p.transparent': '- Fondo transparente: {value}',
    'p.margins': '- Incluir márgenes de seguridad / sangrado: {value}',
    'p.yes': 'Sí',
    'p.no': 'No',
    'p.langHeader': '## Idioma y consistencia tipográfica',
    'p.lang1': '- REGLA DE UN SOLO IDIOMA: Detecta el idioma en que están escritos el "Tema / título de la lección" y el "Objetivo de aprendizaje".',
    'p.lang2': '- TODO el texto visible dentro del gráfico (títulos, encabezados de sección, diagramas, etiquetas, descripciones de pasos y leyendas) DEBE estar en ESE MISMO IDIOMA en toda la imagen.',
    'p.lang3': '- NO mezcles idiomas. Si el tema está escrito en español, todas las etiquetas y descripciones del gráfico deben estar en español. Si está escrito en inglés, todo debe estar en inglés.',
    'p.a11yHeader': '## Accesibilidad',
    'p.pedHeader': '## Criterios pedagógicos',
    'p.notesHeader': '## Instrucciones adicionales',
    'p.genHeader': '## Instrucciones de generación',
    'p.target': 'Modelo de destino: {name} ({tagline})',
    'p.closing': 'Genera un único gráfico didáctico, coherente y de alta calidad, que cumpla todas las restricciones anteriores. Prioriza la claridad, la exactitud y la eficacia educativa. Si falta algún dato necesario, haz suposiciones razonables basadas en la investigación educativa y menciónalas brevemente.',

    'file.defaultName': 'prompt-grafico-didactico'
  }
};
