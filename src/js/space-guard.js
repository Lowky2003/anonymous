/* ── Space Guard ─────────────────────────────────────────────────
   Include on every page EXCEPT join.html.
   Runs synchronously (no Firebase needed).
   If no space code is stored → redirects to join.html.
   If a code is found → exposes window.SPACE_CODE for Firebase scoping.
   ───────────────────────────────────────────────────────────────── */
(function () {
  var code = localStorage.getItem('space_code');
  if (!code) {
    var inGames = window.location.pathname.indexOf('/games/') !== -1;
    window.location.replace(inGames ? '../join.html' : 'join.html');
  } else {
    window.SPACE_CODE = code;
  }
})();
