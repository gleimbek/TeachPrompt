/**
 * Prompt Builder — composes the master instructional-graphic prompt
 * from the current application state.
 *
 * The prompt is written in the interface language (English or Spanish).
 * The graphic's own text follows the language of the topic, as the
 * "single-language rule" section tells the model.
 */

import {
  GRAPHIC_TYPES,
  OPTIONS,
  ICON_PREFERENCES,
  ACCESSIBILITY,
  PEDAGOGICAL,
  MODELS
} from './config.js';
import { t, L } from './i18n.js';

/** Look up a label from an options list by value */
function labelOf(list, value) {
  const item = list.find(o => o.value === value);
  return item ? L(item.label) : value || '';
}

/** Look up graphic type object */
function getGraphicType(id) {
  return GRAPHIC_TYPES.find(g => g.id === id) || null;
}

/** Look up model object */
function getModel(id) {
  return MODELS.find(m => m.id === id) || MODELS[MODELS.length - 1];
}

/** Labels of the selected ids in a chip/checkbox list */
function selectedLabels(list, ids) {
  return (ids || [])
    .map(id => list.find(p => p.id === id))
    .filter(Boolean)
    .map(p => L(p.label));
}

/**
 * Build the complete prompt string from state.
 * Returns a ready-to-copy, model-aware instructional design prompt.
 */
export function buildPrompt(state) {
  const lines = [];
  const model = getModel(state.model);
  const graphic = getGraphicType(state.graphicType);

  // --- Role & intent ---
  lines.push(t('p.role'));
  lines.push('');

  // --- Content core ---
  lines.push(t('p.content'));
  if (state.topic?.trim()) {
    lines.push(t('p.topic', { value: state.topic.trim() }));
  } else {
    lines.push(t('p.topicMissing'));
  }
  if (state.subjectArea) {
    lines.push(t('p.subject', { value: labelOf(OPTIONS.subjectArea, state.subjectArea) }));
  }
  if (state.gradeLevel) {
    lines.push(t('p.grade', { value: labelOf(OPTIONS.gradeLevel, state.gradeLevel) }));
  }
  if (state.audience?.trim()) {
    lines.push(t('p.audience', { value: state.audience.trim() }));
  }
  if (state.learningObjective?.trim()) {
    lines.push(t('p.objective', { value: state.learningObjective.trim() }));
  }
  if (state.bloomLevel) {
    lines.push(t('p.bloom', { value: labelOf(OPTIONS.bloomLevel, state.bloomLevel) }));
  }
  lines.push('');

  // --- Graphic type ---
  lines.push(t('p.graphicHeader'));
  if (graphic) {
    lines.push(t('p.type', { value: L(graphic.title) }));
    lines.push(t('p.purpose', { value: L(graphic.description) }));
    lines.push(t('p.intent', { value: L(graphic.subtitle) }));
  } else {
    lines.push(t('p.typeMissing'));
  }
  lines.push('');

  // --- Visual style ---
  lines.push(t('p.visualHeader'));
  lines.push(t('p.style', { value: labelOf(OPTIONS.visualStyle, state.visualStyle) }));
  lines.push(t('p.tone', { value: labelOf(OPTIONS.tone, state.tone) }));
  lines.push(t('p.color', { value: labelOf(OPTIONS.colorScheme, state.colorScheme) }));
  lines.push(t('p.complexity', { value: labelOf(OPTIONS.complexity, state.complexity) }));
  const iconLabels = selectedLabels(ICON_PREFERENCES, state.iconPreferences);
  if (iconLabels.length) {
    lines.push(t('p.icons', { value: iconLabels.join('; ') }));
  }
  lines.push('');

  // --- Layout & size ---
  lines.push(t('p.layoutHeader'));
  lines.push(t('p.size', { value: labelOf(OPTIONS.sizePreset, state.sizePreset) }));
  lines.push(t('p.orientation', { value: labelOf(OPTIONS.orientation, state.orientation) }));
  lines.push(t('p.text', { value: labelOf(OPTIONS.amountOfText, state.amountOfText) }));
  lines.push('');

  // --- Output specs ---
  lines.push(t('p.outputHeader'));
  lines.push(t('p.format', { value: labelOf(OPTIONS.fileFormat, state.fileFormat) }));
  lines.push(t('p.resolution', { value: labelOf(OPTIONS.resolution, state.resolution) }));
  lines.push(t('p.transparent', { value: state.transparentBg ? t('p.yes') : t('p.no') }));
  lines.push(t('p.margins', { value: state.safeMargins ? t('p.yes') : t('p.no') }));
  lines.push('');

  // --- Language consistency ---
  lines.push(t('p.langHeader'));
  lines.push(t('p.lang1'));
  lines.push(t('p.lang2'));
  lines.push(t('p.lang3'));
  lines.push('');

  // --- Accessibility ---
  const activeA11y = selectedLabels(ACCESSIBILITY, state.accessibility);
  if (activeA11y.length) {
    lines.push(t('p.a11yHeader'));
    activeA11y.forEach(label => lines.push(`- ${label}`));
    lines.push('');
  }

  // --- Pedagogical constraints ---
  const activePed = selectedLabels(PEDAGOGICAL, state.pedagogical);
  if (activePed.length) {
    lines.push(t('p.pedHeader'));
    activePed.forEach(label => lines.push(`- ${label}`));
    lines.push('');
  }

  // --- Extra notes ---
  if (state.extraNotes?.trim()) {
    lines.push(t('p.notesHeader'));
    lines.push(state.extraNotes.trim());
    lines.push('');
  }

  // --- Model-specific guidance ---
  lines.push(t('p.genHeader'));
  lines.push(t('p.target', { name: L(model.name), tagline: L(model.tagline) }));
  lines.push(L(model.promptHint));
  lines.push('');
  lines.push(t('p.closing'));

  return lines.join('\n').trim();
}

/**
 * Returns a short status summary for the UI (completeness indicator).
 */
export function getPromptStatus(state) {
  const hasTopic = Boolean(state.topic?.trim());
  const hasType = Boolean(state.graphicType);
  const hasObjective = Boolean(state.learningObjective?.trim());

  if (hasTopic && hasType && hasObjective) {
    return { level: 'complete', label: t('status.complete') };
  }
  if (hasTopic && hasType) {
    return { level: 'partial', label: t('status.addObjective') };
  }
  if (hasTopic || hasType) {
    return { level: 'partial', label: t('status.partial') };
  }
  return { level: 'empty', label: t('status.empty') };
}
