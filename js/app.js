/**
 * Application entry point.
 * Bootstraps the UI once the DOM is ready.
 */

import { renderApp } from './ui.js';

function init() {
  renderApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Register the service worker so the app installs as a PWA and keeps
// working offline. Only runs over HTTPS or localhost — browsers refuse
// service workers on plain http:// or file:// for security reasons.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}
