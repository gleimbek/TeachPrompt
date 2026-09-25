/**
 * Persistence layer — localStorage for settings and named presets.
 * All storage keys are versioned so future schema changes can migrate cleanly.
 */

import { STORAGE_KEY, PRESETS_KEY, HISTORY_KEY, HISTORY_LIMIT, DEFAULT_STATE } from './config.js';
import { t } from './i18n.js';

/**
 * Load the last-used settings from localStorage.
 * Falls back to DEFAULT_STATE on any error or missing data.
 */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    // Shallow merge so new keys added in future versions still get defaults
    return { ...DEFAULT_STATE, ...parsed };
  } catch (e) {
    console.warn('Failed to load settings, using defaults.', e);
    return { ...DEFAULT_STATE };
  }
}

/**
 * Persist the current state.
 */
export function saveSettings(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save settings.', e);
  }
}

/**
 * Load all named presets.
 * Returns an array of { id, name, created, updated, state }
 */
export function loadPresets() {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to load presets.', e);
    return [];
  }
}

/**
 * Save the full presets array.
 */
export function savePresets(presets) {
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  } catch (e) {
    console.warn('Failed to save presets.', e);
  }
}

/**
 * Add or update a preset. If id is provided and exists, it is updated.
 * Returns the new/updated preset object.
 */
export function upsertPreset(name, state, id = null) {
  const presets = loadPresets();
  const now = new Date().toISOString();

  if (id) {
    const idx = presets.findIndex(p => p.id === id);
    if (idx !== -1) {
      presets[idx] = {
        ...presets[idx],
        name,
        state: { ...state },
        updated: now
      };
      savePresets(presets);
      return presets[idx];
    }
  }

  const newPreset = {
    id: id || `preset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    created: now,
    updated: now,
    state: { ...state }
  };
  presets.push(newPreset);
  savePresets(presets);
  return newPreset;
}

/**
 * Delete a preset by id.
 */
export function deletePreset(id) {
  const presets = loadPresets().filter(p => p.id !== id);
  savePresets(presets);
  return presets;
}

/* ------------------------------------------------------------------ */
/*  Preset export / import (JSON file, portable between browsers)      */
/* ------------------------------------------------------------------ */

/**
 * Export all presets as a downloadable, versioned JSON file.
 */
export function exportPresets() {
  const presets = loadPresets();
  const payload = {
    app: "TeachPrompt",
    exportedAt: new Date().toISOString(),
    schema: 1,
    presets
  };
  const stamp = new Date().toISOString().slice(0, 10);
  downloadText(`teachprompt-presets-${stamp}.json`, JSON.stringify(payload, null, 2));
}

/**
 * Import presets from a File object (from an <input type="file">).
 * Accepts either a raw array of presets or the { presets: [...] } export
 * format produced by exportPresets(). Merges into existing presets,
 * assigning fresh ids on collision and renaming on name collision.
 * Resolves with { added } or rejects with a human-readable Error.
 */
export function importPresetsFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) { reject(new Error(t('import.noFile'))); return; }
    const reader = new FileReader();
    reader.onload = () => {
      let parsed;
      try {
        parsed = JSON.parse(reader.result);
      } catch (e) {
        reject(new Error(t('import.invalidJson')));
        return;
      }
      const incoming = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.presets) ? parsed.presets : null);
      if (!incoming) {
        reject(new Error(t('import.noArray')));
        return;
      }
      const valid = incoming.filter(p => p && typeof p.name === 'string' && p.state && typeof p.state === 'object');
      if (!valid.length) {
        reject(new Error(t('import.noValid')));
        return;
      }

      const existing = loadPresets();
      const existingIds = new Set(existing.map(p => p.id));
      const existingNames = new Set(existing.map(p => p.name));
      const now = new Date().toISOString();
      let added = 0;

      valid.forEach(p => {
        let id = p.id;
        if (!id || existingIds.has(id)) {
          id = `preset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        }
        let name = p.name;
        if (existingNames.has(name)) name = `${name} ${t('import.suffix')}`;
        existing.push({
          id,
          name,
          created: p.created || now,
          updated: now,
          state: { ...DEFAULT_STATE, ...p.state }
        });
        existingIds.add(id);
        existingNames.add(name);
        added += 1;
      });

      savePresets(existing);
      resolve({ added });
    };
    reader.onerror = () => reject(new Error(t('import.readError')));
    reader.readAsText(file);
  });
}

/* ------------------------------------------------------------------ */
/*  Prompt history — a running log of prompts you've actually copied   */
/*  or downloaded, so a good composition is never lost.                */
/* ------------------------------------------------------------------ */

/**
 * Load prompt history, newest first.
 */
export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to load prompt history.', e);
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to save prompt history.', e);
  }
}

/**
 * Record a generated prompt. Called when the user copies or downloads,
 * not on every keystroke, so history reflects prompts actually used.
 * Capped at HISTORY_LIMIT entries (oldest dropped first).
 */
export function addToHistory(promptText, state) {
  const history = loadHistory();
  const entry = {
    id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created: new Date().toISOString(),
    topic: (state.topic || '').trim() || t('history.untitled'),
    graphicType: state.graphicType,
    model: state.model,
    promptText,
    state: { ...state }
  };
  history.unshift(entry);
  if (history.length > HISTORY_LIMIT) history.length = HISTORY_LIMIT;
  saveHistory(history);
  return entry;
}

/**
 * Remove a single history entry by id.
 */
export function deleteHistoryEntry(id) {
  const history = loadHistory().filter(h => h.id !== id);
  saveHistory(history);
  return history;
}

/**
 * Clear all prompt history.
 */
export function clearHistory() {
  saveHistory([]);
}

/**
 * Export current prompt text as a downloadable .txt file.
 */
export function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard with fallback for non-secure contexts.
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, falling back to execCommand', err);
    }
  }
 
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (e) {
    success = false;
  } finally {
    document.body.removeChild(ta);
  }
  return success;
}