/**
 * UI module — renders sections, binds events, and keeps the live preview
 * in sync with application state.
 *
 * Each section is rendered by a dedicated function that reads from config.
 * Adding a new section requires only a new renderer + a call in renderWorkspace.
 */

import {
  APP_VERSION,
  QUICK_STARTS,
  GRAPHIC_TYPES,
  OPTIONS,
  ICON_PREFERENCES,
  ACCESSIBILITY,
  PEDAGOGICAL,
  MODELS,
  DEFAULT_STATE
} from './config.js';
import { buildPrompt, getPromptStatus } from './prompt-builder.js';
import { t, L, getLang, setLang } from './i18n.js';
import {
  loadSettings,
  saveSettings,
  loadPresets,
  upsertPreset,
  deletePreset,
  exportPresets,
  importPresetsFromFile,
  loadHistory,
  addToHistory,
  deleteHistoryEntry,
  clearHistory,
  downloadText,
  copyToClipboard
} from './storage.js';

/** Application state — single source of truth */
let state = loadSettings();

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/** Apply theme class to <html> */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  state.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0f1419' : '#F2F8FC');
  }
}

/** Persist state and refresh the prompt preview */
function commit(partial = {}) {
  Object.assign(state, partial);
  saveSettings(state);
  updatePromptPreview();
  updateStatus();
}

/** Render the entire application shell */
export function renderApp() {
  applyTheme(state.theme || 'light');
  document.documentElement.lang = getLang();
  document.title = t('doc.title');

  const app = $('#app');
  if (!app) return;

  app.innerHTML = `
    <a class="skip-link" href="#workspace">${t('header.skip')}</a>

    <header class="site-header">
      <div class="header-inner">
        
		<div class="brand">
          <div class="brand-row">
            <img src="assets/logo.png" alt="${t('header.logoAlt')}">
          
			<p class="tagline">${t('header.tagline')}</p>
		  </div>
		</div>
		
        <div class="header-actions">
          <button type="button" class="btn btn-ghost btn-icon" id="btn-history" aria-label="${t('header.historyAria')}" title="${t('header.history')}">
            <span class="history-icon" aria-hidden="true"></span>
          </button>
		  
          <button type="button" class="btn btn-ghost btn-icon btn-lang" id="btn-lang" aria-label="${t('header.langAria')}" title="${t('header.lang')}">
            <span aria-hidden="true">${t('header.langButton')}</span>
          </button>

          <button type="button" class="btn btn-ghost btn-icon" id="btn-theme" aria-label="${t('header.themeAria')}" title="${t('header.theme')}">
            <span class="theme-icon" aria-hidden="true"></span>
          </button>
		  
          <span class="version-badge">v${APP_VERSION}</span>
          <span class="for-educators">${t('header.levels')}</span>
        </div>
      </div>
    </header>

    <main class="main-layout">
      <div class="workspace" id="workspace" tabindex="-1">
        <!-- Sections injected by renderWorkspace -->
      </div>

      <aside class="preview-panel" aria-label="${t('preview.aria')}">
        <div class="preview-header">
          <h2>${t('preview.title')}</h2>
          <span class="model-tag" id="preview-model-tag"></span>
        </div>
        <div class="preview-body">
          <pre id="prompt-output" class="prompt-output" tabindex="0" role="region" aria-live="polite" aria-label="${t('preview.outputAria')}"></pre>
          <p class="preview-placeholder" id="preview-placeholder"></p>
        </div>
        <div class="preview-actions">
		  <button type="button" class="btn btn-primary" id="btn-execute">${t('preview.execute')}</button>
          <button type="button" class="btn btn-secondary" id="btn-copy">${t('preview.copy')}</button>
          <button type="button" class="btn btn-secondary" id="btn-download">${t('preview.download')}</button>
          <button type="button" class="btn btn-secondary" id="btn-reset">${t('preview.reset')}</button>
        </div>
        <div class="preview-status" id="preview-status" aria-live="polite"></div>
      </aside>
    </main>

    <footer class="site-footer">
      <p>${t('footer.line1')}</p>
      <p class="footer-meta">${t('footer.line2')}</p>
    </footer>

    <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>

    <div class="modal" id="preset-modal" hidden>
      <div class="modal-backdrop" data-close-modal></div>
      <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="preset-modal-title">
        <h2 id="preset-modal-title">${t('presetModal.title')}</h2>
        <label class="field-label" for="preset-name">${t('presetModal.label')}</label>
        <input type="text" id="preset-name" class="field-input" placeholder="${t('presetModal.placeholder')}" maxlength="80" />
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" data-close-modal>${t('presetModal.cancel')}</button>
          <button type="button" class="btn btn-primary" id="btn-confirm-save-preset">${t('presetModal.save')}</button>
        </div>
      </div>
    </div>

    <div class="modal" id="history-modal" hidden>
      <div class="modal-backdrop" data-close-modal></div>
      <div class="modal-dialog modal-dialog-wide" role="dialog" aria-modal="true" aria-labelledby="history-modal-title">
        <div class="modal-header-row">
          <h2 id="history-modal-title">${t('history.title')}</h2>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-clear-history">${t('history.clear')}</button>
        </div>
        <p class="modal-subtitle">${t('history.subtitle')}</p>
        <div class="history-list" id="history-list"></div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" data-close-modal>${t('history.close')}</button>
        </div>
      </div>
    </div>

    <input type="file" id="preset-import-input" accept="application/json" hidden />
  `;

  renderWorkspace();
  bindGlobalEvents();
  updatePromptPreview();
  updateStatus();
}

/** Render all form sections into #workspace */
function renderWorkspace() {
  const workspace = $('#workspace');
  if (!workspace) return;

  workspace.innerHTML = `
    ${renderQuickStart()}
    ${renderSectionContent()}
    ${renderSectionGraphicType()}
    ${renderSectionVisuals()}
    ${renderSectionLayout()}
    ${renderSectionOutput()}
    ${renderSectionAccessibility()}
    ${renderSectionPedagogical()}
    ${renderSectionModel()}
    ${renderSectionNotes()}
    ${renderPresetBar()}
  `;

  bindSectionEvents();
}

/* ================================================================== */
/*  Section renderers                                                  */
/* ================================================================== */

function renderQuickStart() {
  const buttons = QUICK_STARTS.map(qs =>
    `<button type="button" class="chip chip-quick" data-quick="${qs.id}">${L(qs.label)}</button>`
  ).join('');

  return `
    <section class="section quick-start" aria-label="${t('quick.aria')}">
      <div class="quick-start-row">
        <span class="quick-label">${t('quick.label')}</span>
        ${buttons}
      </div>
    </section>
  `;
}

function renderSectionContent() {
  const subjectOpts = OPTIONS.subjectArea.map(o =>
    `<option value="${o.value}" ${state.subjectArea === o.value ? 'selected' : ''}>${L(o.label)}</option>`
  ).join('');
  const gradeOpts = OPTIONS.gradeLevel.map(o =>
    `<option value="${o.value}" ${state.gradeLevel === o.value ? 'selected' : ''}>${L(o.label)}</option>`
  ).join('');
  const bloomOpts = OPTIONS.bloomLevel.map(o =>
    `<option value="${o.value}" ${state.bloomLevel === o.value ? 'selected' : ''}>${L(o.label)}</option>`
  ).join('');

  return `
    <section class="section" id="section-content" aria-labelledby="heading-content">
      <div class="section-header">
        <h2 id="heading-content"><span class="section-num">§ 01</span> ${t('s1.title')}</h2>
        <p class="section-desc">${t('s1.desc')}</p>
      </div>

      <div class="field-group">
        <label class="field-label" for="topic">${t('s1.topic')} <span class="req" aria-hidden="true">*</span></label>
        <input type="text" id="topic" class="field-input"
               placeholder="${t('s1.topicPh')}"
               value="${escapeAttr(state.topic)}" autocomplete="off" />
      </div>

      <div class="field-row">
        <div class="field-group">
          <label class="field-label" for="subjectArea">${t('s1.subject')}</label>
          <select id="subjectArea" class="field-select">${subjectOpts}</select>
        </div>
        <div class="field-group">
          <label class="field-label" for="gradeLevel">${t('s1.grade')}</label>
          <select id="gradeLevel" class="field-select">${gradeOpts}</select>
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="audience">${t('s1.audience')}</label>
        <input type="text" id="audience" class="field-input"
               placeholder="${t('s1.audiencePh')}"
               value="${escapeAttr(state.audience)}" />
      </div>

      <div class="field-group">
        <label class="field-label" for="learningObjective">${t('s1.objective')}</label>
        <textarea id="learningObjective" class="field-textarea" rows="2"
                  placeholder="${t('s1.objectivePh')}">${escapeHtml(state.learningObjective)}</textarea>
      </div>

      <div class="field-group">
        <label class="field-label" for="bloomLevel">${t('s1.bloom')}</label>
        <select id="bloomLevel" class="field-select">${bloomOpts}</select>
      </div>
    </section>
  `;
}

function renderSectionGraphicType() {
  const cards = GRAPHIC_TYPES.map(g => {
    const selected = state.graphicType === g.id ? 'is-selected' : '';
    return `
      <button type="button" class="graphic-card ${selected}" data-graphic="${g.id}"
              aria-pressed="${state.graphicType === g.id}" title="${escapeAttr(L(g.description))}">
        <span class="graphic-title">${L(g.title)}</span>
        <span class="graphic-subtitle">${L(g.subtitle)}</span>
        <span class="graphic-desc">${L(g.description)}</span>
      </button>
    `;
  }).join('');

  return `
    <section class="section" id="section-graphic-type" aria-labelledby="heading-graphic">
      <div class="section-header">
        <h2 id="heading-graphic"><span class="section-num">§ 02</span>${t('s2.title')}</h2>
        <p class="section-desc">${t('s2.desc')}</p>
      </div>
      <div class="graphic-grid" role="group" aria-label="${t('s2.aria')}">
        ${cards}
      </div>
    </section>
  `;
}

function renderSectionVisuals() {
  const styleOpts = OPTIONS.visualStyle.map(o =>
    `<option value="${o.value}" ${state.visualStyle === o.value ? 'selected' : ''}>${L(o.label)}</option>`
  ).join('');
  const toneOpts = OPTIONS.tone.map(o =>
    `<option value="${o.value}" ${state.tone === o.value ? 'selected' : ''}>${L(o.label)}</option>`
  ).join('');
  const colorOpts = OPTIONS.colorScheme.map(o =>
    `<option value="${o.value}" ${state.colorScheme === o.value ? 'selected' : ''}>${L(o.label)}</option>`
  ).join('');
  const complexOpts = OPTIONS.complexity.map(o =>
    `<option value="${o.value}" ${state.complexity === o.value ? 'selected' : ''}>${L(o.label)}</option>`
  ).join('');

  const iconChips = ICON_PREFERENCES.map(p => {
    const active = (state.iconPreferences || []).includes(p.id) ? 'is-active' : '';
    return `<button type="button" class="chip chip-toggle ${active}" data-icon="${p.id}" aria-pressed="${active ? 'true' : 'false'}">${L(p.label)}</button>`;
  }).join('');

  return `
    <section class="section" id="section-visuals" aria-labelledby="heading-visuals">
      <div class="section-header">
        <h2 id="heading-visuals"><span class="section-num">§ 03</span>${t('s3.title')}</h2>
        <p class="section-desc">${t('s3.desc')}</p>
      </div>

      <div class="field-row">
        <div class="field-group">
          <label class="field-label" for="visualStyle">${t('s3.style')}</label>
          <select id="visualStyle" class="field-select">${styleOpts}</select>
        </div>
        <div class="field-group">
          <label class="field-label" for="tone">${t('s3.tone')}</label>
          <select id="tone" class="field-select">${toneOpts}</select>
        </div>
      </div>

      <div class="field-row">
        <div class="field-group">
          <label class="field-label" for="colorScheme">${t('s3.color')}</label>
          <select id="colorScheme" class="field-select">${colorOpts}</select>
        </div>
        <div class="field-group">
          <label class="field-label" for="complexity">${t('s3.complexity')}</label>
          <select id="complexity" class="field-select">${complexOpts}</select>
        </div>
      </div>

      <div class="field-group">
        <span class="field-label" id="icon-pref-label">${t('s3.icons')}</span>
        <div class="chip-row chip-label" role="group" aria-labelledby="icon-pref-label">
          ${iconChips}
        </div>
      </div>
    </section>
  `;
}

function renderSectionLayout() {
  const sizeOpts = OPTIONS.sizePreset.map(o =>
    `<option value="${o.value}" ${state.sizePreset === o.value ? 'selected' : ''}>${L(o.label)}</option>`
  ).join('');
  const orientOpts = OPTIONS.orientation.map(o =>
    `<option value="${o.value}" ${state.orientation === o.value ? 'selected' : ''}>${L(o.label)}</option>`
  ).join('');
  const textOpts = OPTIONS.amountOfText.map(o =>
    `<option value="${o.value}" ${state.amountOfText === o.value ? 'selected' : ''}>${L(o.label)}</option>`
  ).join('');

  return `
    <section class="section" id="section-layout" aria-labelledby="heading-layout">
      <div class="section-header">
        <h2 id="heading-layout"><span class="section-num">§ 04</span>${t('s4.title')}</h2>
        <p class="section-desc">${t('s4.desc')}</p>
      </div>

      <div class="field-group">
        <label class="field-label" for="sizePreset">${t('s4.size')}</label>
        <select id="sizePreset" class="field-select">${sizeOpts}</select>
      </div>

      <div class="field-row">
        <div class="field-group">
          <label class="field-label" for="orientation">${t('s4.orientation')}</label>
          <select id="orientation" class="field-select">${orientOpts}</select>
        </div>
        <div class="field-group">
          <label class="field-label" for="amountOfText">${t('s4.text')}</label>
          <select id="amountOfText" class="field-select">${textOpts}</select>
        </div>
      </div>
    </section>
  `;
}

function renderSectionOutput() {
  const formatOpts = OPTIONS.fileFormat.map(o =>
    `<option value="${o.value}" ${state.fileFormat === o.value ? 'selected' : ''}>${L(o.label)}</option>`
  ).join('');
  const resOpts = OPTIONS.resolution.map(o =>
    `<option value="${o.value}" ${state.resolution === o.value ? 'selected' : ''}>${L(o.label)}</option>`
  ).join('');

  return `
    <section class="section" id="section-output" aria-labelledby="heading-output">
      <div class="section-header">
        <h2 id="heading-output"><span class="section-num">§ 05</span>${t('s5.title')}</h2>
        <p class="section-desc">${t('s5.desc')}</p>
      </div>

      <div class="field-row">
        <div class="field-group">
          <label class="field-label" for="fileFormat">${t('s5.format')}</label>
          <select id="fileFormat" class="field-select">${formatOpts}</select>
        </div>
        <div class="field-group">
          <label class="field-label" for="resolution">${t('s5.resolution')}</label>
          <select id="resolution" class="field-select">${resOpts}</select>
        </div>
      </div>

      <div class="checkbox-row">
        <label class="checkbox-label">
          <input type="checkbox" id="transparentBg" ${state.transparentBg ? 'checked' : ''} />
          <span>${t('s5.transparent')}</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" id="safeMargins" ${state.safeMargins ? 'checked' : ''} />
          <span>${t('s5.margins')}</span>
        </label>
      </div>
    </section>
  `;
}

function renderSectionAccessibility() {
  const checks = ACCESSIBILITY.map(p => {
    const checked = (state.accessibility || []).includes(p.id) ? 'checked' : '';
    return `
      <label class="checkbox-label">
        <input type="checkbox" data-a11y="${p.id}" ${checked} />
        <span>${L(p.label)}</span>
      </label>
    `;
  }).join('');

  return `
    <section class="section" id="section-accessibility" aria-labelledby="heading-a11y">
      <div class="section-header">
        <h2 id="heading-a11y"><span class="section-num">§ 06</span>${t('s6.title')}</h2>
        <p class="section-desc">${t('s6.desc')}</p>
      </div>
      <div class="checkbox-grid">
        ${checks}
      </div>
    </section>
  `;
}

function renderSectionPedagogical() {
  const checks = PEDAGOGICAL.map(p => {
    const checked = (state.pedagogical || []).includes(p.id) ? 'checked' : '';
    return `
      <label class="checkbox-label">
        <input type="checkbox" data-pedagogical="${p.id}" ${checked} />
        <span>${L(p.label)}</span>
      </label>
    `;
  }).join('');

  return `
    <section class="section" id="section-pedagogical" aria-labelledby="heading-pedagogical">
      <div class="section-header">
        <h2 id="heading-pedagogical"><span class="section-num">§ 07</span>${t('s7.title')}</h2>
        <p class="section-desc">${t('s7.desc')}</p>
      </div>
      <div class="checkbox-grid">
        ${checks}
      </div>
    </section>
  `;
}

function renderSectionModel() {
  const modelButtons = MODELS.map(m => {
    const active = state.model === m.id ? 'is-active' : '';
    return `
      <button type="button" class="model-card ${active}" data-model="${m.id}" aria-pressed="${state.model === m.id}">
        <span class="model-name">${L(m.name)}</span>
        <span class="model-tagline">${L(m.tagline)}</span>
      </button>
    `;
  }).join('');

  return `
    <section class="section" id="section-model" aria-labelledby="heading-model">
      <div class="section-header">
        <h2 id="heading-model"><span class="section-num">§ 08</span>${t('s8.title')}</h2>
        <p class="section-desc">${t('s8.desc')}</p>
      </div>
      <div class="model-grid" role="group" aria-label="${t('s8.aria')}">
        ${modelButtons}
      </div>
    </section>
  `;
}

function renderSectionNotes() {
  return `
    <section class="section" id="section-notes" aria-labelledby="heading-notes">
      <div class="section-header">
        <h2 id="heading-notes"><span class="section-num">§ 09</span>${t('s9.title')}</h2>
        <p class="section-desc">${t('s9.desc')}</p>
      </div>
      <div class="field-group">
        <label class="field-label" for="extraNotes">${t('s9.label')}</label>
        <textarea id="extraNotes" class="field-textarea" rows="3"
                  placeholder="${t('s9.ph')}">${escapeHtml(state.extraNotes || '')}</textarea>
      </div>
    </section>
  `;
}

function renderPresetBar() {
  const presets = loadPresets();
  const options = presets.map(p =>
    `<option value="${p.id}">${escapeHtml(p.name)}</option>`
  ).join('');

  return `
    <section class="section preset-bar" aria-label="${t('presets.aria')}">
      <div class="preset-controls">
        <button type="button" class="btn btn-secondary" id="btn-save-preset">${t('presets.save')}</button>
        <div class="preset-load-group">
          <label class="visually-hidden" for="preset-select">${t('presets.loadLabel')}</label>
          <select id="preset-select" class="field-select">
            <option value="">${t('presets.loadOption')}</option>
            ${options}
          </select>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-delete-preset" title="${t('presets.deleteTitle')}" ${presets.length ? '' : 'disabled'}>${t('presets.delete')}</button>
        </div>
        <div class="preset-io-group">
          <button type="button" class="btn btn-ghost btn-sm" id="btn-export-presets" title="${t('presets.exportTitle')}" ${presets.length ? '' : 'disabled'}>${t('presets.export')}</button>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-import-presets" title="${t('presets.importTitle')}">${t('presets.import')}</button>
        </div>
      </div>
    </section>
  `;
}

/* ================================================================== */
/*  Event binding                                                      */
/* ================================================================== */

function bindGlobalEvents() {
  // Evento para ejecutar el prompt: copia secuencial + apertura de pestaña
  $('#btn-execute')?.addEventListener('click', async (e) => {
    const text = buildPrompt(state);
    const activeModel = MODELS.find(m => m.id === state.model) || MODELS[0];

    // Mapas de URL de respaldo
    const modelUrls = {
      claude: 'https://claude.ai/new',
      chatgpt: 'https://chatgpt.com/',
      gemini: 'https://gemini.google.com/app',
      grok: 'https://grok.com/',
      perplexity: 'https://www.perplexity.ai/',
      generic: 'https://chatgpt.com/'
    };

    const targetUrl = activeModel.url || modelUrls[activeModel.id] || 'https://gemini.google.com/app';

    // 1. Copiar primero al portapapeles usando la función con fallback
    const copied = await copyToClipboard(text);

    if (copied) {
      addToHistory(text, state);
      showToast(t('toast.executeOk', { name: L(activeModel.name) }));
    } else {
      showToast(t('toast.executeFail', { name: L(activeModel.name) }));
    }

    // 2. Abrir la URL inmediatamente después de la copia
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  });

  // Cambiar idioma: vuelve a dibujar toda la app con el mismo estado
  $('#btn-lang')?.addEventListener('click', () => {
    setLang(getLang() === 'es' ? 'en' : 'es');
    renderApp();
    $('#btn-lang')?.focus();
  });

  // Alternar tema claro/oscuro
  $('#btn-theme')?.addEventListener('click', () => {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    commit({ theme: next });
  });

  // Copiar solo al portapapeles
  $('#btn-copy')?.addEventListener('click', async () => {
    const text = buildPrompt(state);
    const ok = await copyToClipboard(text);
    if (ok) addToHistory(text, state);
    showToast(ok ? t('toast.copied') : t('toast.copyFailed'));
  });

  // Descargar archivo .txt
  $('#btn-download')?.addEventListener('click', () => {
    const text = buildPrompt(state);
    const safeName = (state.topic || t('file.defaultName'))
      .slice(0, 40)
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase() || 'prompt';
    downloadText(`${safeName}.txt`, text);
    addToHistory(text, state);
    showToast(t('toast.download'));
  });

  // Resetear campos
  $('#btn-reset')?.addEventListener('click', () => {
    if (!confirm(t('confirm.reset'))) return;
    state = { ...DEFAULT_STATE, theme: state.theme };
    saveSettings(state);
    renderWorkspace();
    updatePromptPreview();
    updateStatus();
    showToast(t('toast.reset'));
  });

  // Ver historial
  $('#btn-history')?.addEventListener('click', openHistoryModal);

  // Importar presets desde JSON
  $('#preset-import-input')?.addEventListener('change', async e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const { added } = await importPresetsFromFile(file);
      renderWorkspace();
      showToast(t('toast.imported', { count: added }));
    } catch (err) {
      showToast(err.message || t('toast.importFailed'));
    }
  });

  // Cerrar modales
  $$('[data-close-modal]').forEach(el => {
    el.addEventListener('click', () => {
      closePresetModal();
      closeHistoryModal();
    });
  });

  // Limpiar historial
  $('#btn-clear-history')?.addEventListener('click', () => {
    if (!loadHistory().length) return;
    if (!confirm(t('confirm.clearHistory'))) return;
    clearHistory();
    renderHistoryList();
    showToast(t('toast.historyCleared'));
  });

  // Guardar preset
  $('#btn-confirm-save-preset')?.addEventListener('click', () => {
    const name = ($('#preset-name')?.value || '').trim();
    if (!name) {
      showToast(t('toast.presetNameMissing'));
      return;
    }
    upsertPreset(name, state);
    closePresetModal();
    renderWorkspace();
    showToast(t('toast.presetSaved', { name }));
  });

  // Cerrar modales con la tecla Escape.
  // Se registra una sola vez: renderApp() se vuelve a ejecutar al cambiar de idioma.
  if (bindGlobalEvents.escapeBound) return;
  bindGlobalEvents.escapeBound = true;
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const presetModal = $('#preset-modal');
      const historyModal = $('#history-modal');
      if (presetModal && !presetModal.hidden) closePresetModal();
      if (historyModal && !historyModal.hidden) closeHistoryModal();
    }
  });
}

function bindSectionEvents() {
  // Quick starts
  $$('[data-quick]').forEach(btn => {
    btn.addEventListener('click', () => {
      const qs = QUICK_STARTS.find(q => q.id === btn.dataset.quick);
      if (!qs) return;
      commit({ ...qs.values, audience: L(qs.values.audience) });
      renderWorkspace();
      showToast(t('toast.templateApplied', { name: L(qs.label) }));
    });
  });

  // Text inputs & textareas
  ['topic', 'audience', 'learningObjective', 'extraNotes'].forEach(id => {
    const el = $(`#${id}`);
    if (!el) return;
    el.addEventListener('input', () => commit({ [id]: el.value }));
  });

  // Selects
  [
    'subjectArea', 'gradeLevel', 'bloomLevel', 'visualStyle', 'tone',
    'colorScheme', 'complexity', 'sizePreset', 'orientation',
    'amountOfText', 'fileFormat', 'resolution'
  ].forEach(id => {
    const el = $(`#${id}`);
    if (!el) return;
    el.addEventListener('change', () => commit({ [id]: el.value }));
  });

  // Output checkboxes
  $('#transparentBg')?.addEventListener('change', e => commit({ transparentBg: e.target.checked }));
  $('#safeMargins')?.addEventListener('change', e => commit({ safeMargins: e.target.checked }));

  // Accessibility checkboxes
  $$('[data-a11y]').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.a11y;
      let list = [...(state.accessibility || [])];
      if (cb.checked) {
        if (!list.includes(id)) list.push(id);
      } else {
        list = list.filter(x => x !== id);
      }
      commit({ accessibility: list });
    });
  });

  // Pedagogical checkboxes
  $$('[data-pedagogical]').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.pedagogical;
      let list = [...(state.pedagogical || [])];
      if (cb.checked) {
        if (!list.includes(id)) list.push(id);
      } else {
        list = list.filter(x => x !== id);
      }
      commit({ pedagogical: list });
    });
  });

  // Graphic type cards
  $$('[data-graphic]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.graphic;
      commit({ graphicType: state.graphicType === id ? null : id });
      $$('[data-graphic]').forEach(b => {
        const selected = b.dataset.graphic === state.graphicType;
        b.classList.toggle('is-selected', selected);
        b.setAttribute('aria-pressed', selected);
      });
    });
  });

  // Icon preference chips
  $$('[data-icon]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.icon;
      let list = [...(state.iconPreferences || [])];
      if (list.includes(id)) {
        list = list.filter(x => x !== id);
      } else {
        list.push(id);
      }
      commit({ iconPreferences: list });
      btn.classList.toggle('is-active');
      btn.setAttribute('aria-pressed', list.includes(id));
    });
  });

  // Model cards
  $$('[data-model]').forEach(btn => {
    btn.addEventListener('click', () => {
      commit({ model: btn.dataset.model });
      $$('[data-model]').forEach(b => {
        const active = b.dataset.model === state.model;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active);
      });
      updateModelTag();
    });
  });

  // Preset actions
  $('#btn-save-preset')?.addEventListener('click', openPresetModal);

  $('#preset-select')?.addEventListener('change', e => {
    const id = e.target.value;
    if (!id) return;
    const presets = loadPresets();
    const preset = presets.find(p => p.id === id);
    if (!preset) return;
    state = { ...DEFAULT_STATE, ...preset.state, theme: state.theme };
    saveSettings(state);
    renderWorkspace();
    updatePromptPreview();
    updateStatus();
    showToast(t('toast.presetLoaded', { name: preset.name }));
  });

  $('#btn-delete-preset')?.addEventListener('click', () => {
    const select = $('#preset-select');
    const id = select?.value;
    if (!id) {
      showToast(t('toast.selectPreset'));
      return;
    }
    const presets = loadPresets();
    const preset = presets.find(p => p.id === id);
    if (!preset) return;
    if (!confirm(t('confirm.deletePreset', { name: preset.name }))) return;
    deletePreset(id);
    renderWorkspace();
    showToast(t('toast.presetDeleted'));
  });

  $('#btn-export-presets')?.addEventListener('click', () => {
    if (!loadPresets().length) {
      showToast(t('toast.noPresets'));
      return;
    }
    exportPresets();
    showToast(t('toast.presetsExported'));
  });

  $('#btn-import-presets')?.addEventListener('click', () => {
    $('#preset-import-input')?.click();
  });
}

/* ================================================================== */
/*  Live preview                                                       */
/* ================================================================== */

function updatePromptPreview() {
  const output = $('#prompt-output');
  const placeholder = $('#preview-placeholder');
  if (!output) return;

  const text = buildPrompt(state);
  output.textContent = text;

  const status = getPromptStatus(state);
  if (placeholder) {
    if (status.level === 'empty') {
      placeholder.textContent = status.label + t('preview.placeholderSuffix');
      placeholder.hidden = false;
      output.classList.add('is-empty');
    } else {
      placeholder.hidden = true;
      output.classList.remove('is-empty');
    }
  }

  updateModelTag();
}

function updateModelTag() {
  const tag = $('#preview-model-tag');
  if (!tag) return;
  const model = MODELS.find(m => m.id === state.model);
  tag.textContent = model ? t('preview.forModel', { name: L(model.name) }) : '';
}

function updateStatus() {
  const el = $('#preview-status');
  if (!el) return;
  const status = getPromptStatus(state);
  el.textContent = status.label;
  el.dataset.level = status.level;
}

/* ================================================================== */
/*  Modal & toast                                                      */
/* ================================================================== */

function openPresetModal() {
  const modal = $('#preset-modal');
  const input = $('#preset-name');
  if (!modal) return;
  modal.hidden = false;
  if (input) {
    input.value = state.topic ? t('presetModal.defaultName', { topic: state.topic.slice(0, 40) }) : '';
    setTimeout(() => input.focus(), 50);
  }
}

function closePresetModal() {
  const modal = $('#preset-modal');
  if (modal) modal.hidden = true;
}

function openHistoryModal() {
  const modal = $('#history-modal');
  if (!modal) return;
  modal.hidden = false;
  renderHistoryList();
}

function closeHistoryModal() {
  const modal = $('#history-modal');
  if (modal) modal.hidden = true;
}

function renderHistoryList() {
  const list = $('#history-list');
  if (!list) return;
  const history = loadHistory();

  if (!history.length) {
    list.innerHTML = `<p class="history-empty">${t('history.empty')}</p>`;
    return;
  }

  list.innerHTML = history.map(entry => {
    const graphic = GRAPHIC_TYPES.find(g => g.id === entry.graphicType);
    const model = MODELS.find(m => m.id === entry.model);
    const date = new Date(entry.created);
    const dateLabel = isNaN(date) ? '' : date.toLocaleString(getLang(), {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
    return `
      <div class="history-item" data-history-id="${entry.id}">
        <div class="history-item-main">
          <p class="history-item-topic">${escapeHtml(entry.topic)}</p>
          <div class="history-item-meta">
            ${graphic ? `<span class="history-chip">${escapeHtml(L(graphic.title))}</span>` : ''}
            ${model ? `<span class="history-chip">${escapeHtml(L(model.name))}</span>` : ''}
            ${dateLabel ? `<span class="history-date">${dateLabel}</span>` : ''}
          </div>
        </div>
        <div class="history-item-actions">
          <button type="button" class="btn btn-ghost btn-sm" data-restore-history="${entry.id}">${t('history.restore')}</button>
          <button type="button" class="btn btn-ghost btn-sm" data-copy-history="${entry.id}">${t('history.copy')}</button>
          <button type="button" class="btn btn-ghost btn-sm" data-delete-history="${entry.id}">${t('history.delete')}</button>
        </div>
      </div>
    `;
  }).join('');

  list.querySelectorAll('[data-restore-history]').forEach(btn => {
    btn.addEventListener('click', () => {
      const entry = loadHistory().find(h => h.id === btn.dataset.restoreHistory);
      if (!entry) return;
      state = { ...DEFAULT_STATE, ...entry.state, theme: state.theme };
      saveSettings(state);
      renderWorkspace();
      updatePromptPreview();
      updateStatus();
      closeHistoryModal();
      showToast(t('toast.restored'));
    });
  });

  list.querySelectorAll('[data-copy-history]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const entry = loadHistory().find(h => h.id === btn.dataset.copyHistory);
      if (!entry) return;
      const ok = await copyToClipboard(entry.promptText);
      showToast(ok ? t('toast.copied') : t('toast.copyFailed'));
    });
  });

  list.querySelectorAll('[data-delete-history]').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteHistoryEntry(btn.dataset.deleteHistory);
      renderHistoryList();
    });
  });
}

function showToast(message, duration = 2200) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.hidden = true;
  }, duration);
}

/* ================================================================== */
/*  Utilities                                                          */
/* ================================================================== */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, '&#39;');
}

