/**
 * Access Gate — shared across all pages.
 *
 * Checks localStorage for a verified access code.
 * If not verified, redirects to the index page where the
 * user must enter the correct code.
 *
 * This script runs in <head> so it blocks before any body content renders.
 * The index page does NOT include this script (its inline code handles the overlay).
 *
 * Usage: add in <head> of every NON-index page:
 *   <script src="../src/js/access-gate.js"></script>   (from games/)
 */
(function () {
  'use strict';

  try {
    var ACCESS_CODE_KEY = 'access_code_verified';

    // Already verified — allow page to load normally
    if (localStorage.getItem(ACCESS_CODE_KEY) === 'true') return;

    // Not verified — hide everything and redirect to index page.
    // Hide body immediately to prevent content flash
    document.documentElement.style.display = 'none';

    // All game pages live in games/, so go one level up.
    window.location.replace('../index.html');
  } catch (e) {
    // If localStorage is blocked (privacy mode), still redirect
    document.documentElement.style.display = 'none';
    window.location.replace('../index.html');
  }
})();
