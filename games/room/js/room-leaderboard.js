    /* ═══════════════════════════════
       10. MINI-GAME LEADERBOARD
       ═══════════════════════════════ */
    let _lbCurrentGame = 'flappy';

    function showLeaderboard() {
      document.getElementById('settingsOverlay').classList.add('hidden');
      document.getElementById('lbOverlay').classList.remove('hidden');
      renderLeaderboardTabs();
      loadLeaderboard(_lbCurrentGame);
    }

    function renderLeaderboardTabs() {
      const el = document.getElementById('lbTabs');
      el.innerHTML = LB_GAMES.map(g =>
        '<button class="lb-tab ' + (g.id === _lbCurrentGame ? 'active' : '') + '" onclick="switchLbGame(\'' + g.id + '\')">' + g.name + '</button>'
      ).join('');
    }

    function switchLbGame(gameId) {
      _lbCurrentGame = gameId;
      renderLeaderboardTabs();
      loadLeaderboard(gameId);
    }

    async function loadLeaderboard(gameId) {
      const listEl = document.getElementById('lbList');
      listEl.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,.3);padding:20px">Loading...</div>';
      const game = LB_GAMES.find(g => g.id === gameId);
      if (!game) return;
      try {
        const snap = await db.collection(game.key)
          .orderBy('score', 'desc').limit(20).get();
        if (snap.empty) {
          listEl.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,.3);padding:20px">No scores yet!</div>';
          return;
        }
        let html = '';
        let rank = 0;
        snap.forEach(doc => {
          rank++;
          const d = doc.data();
          const medals = ['🥇','🥈','🥉'];
          const cls = rank <= 3 ? ' top' + rank : '';
          html += '<div class="lb-row' + cls + '">' +
            '<div class="lb-rank">' + (rank <= 3 ? medals[rank-1] : '#' + rank) + '</div>' +
            '<div class="lb-name">' + escapeHtml(d.name || 'Anonymous') + '</div>' +
            '<div class="lb-score">' + (d.score || 0) + '</div></div>';
        });
        listEl.innerHTML = html;
      } catch(e) {
        listEl.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,.3);padding:20px">Could not load scores</div>';
      }
    }

    document.getElementById('lbCloseBtn').addEventListener('click', () => {
      document.getElementById('lbOverlay').classList.add('hidden');
    });

    // ═══ Chinese Chess invite listener ═══
    (function() {
      let chessInvUnsub = null;
      const _auth = firebase.auth();
      const _db = firebase.firestore();
      _auth.onAuthStateChanged((u) => {
        if (chessInvUnsub) { chessInvUnsub(); chessInvUnsub = null; }
        if (!u) return;
        console.log('[ChessInvite] Listening for invites on room, uid:', u.uid);
        chessInvUnsub = _db.collection('chess_invites')
          .where('toUid', '==', u.uid)
          .where('status', '==', 'pending')
          .onSnapshot((snap) => {
            snap.docChanges().forEach(ch => {
              if (ch.type !== 'added') return;
              const inv = ch.doc.data();
              const id = ch.doc.id;
              console.log('[ChessInvite] Invite received on room:', id, inv);
              if (document.querySelector('.chess-invite-overlay')) return;
              const ov = document.createElement('div');
              ov.className = 'chess-invite-overlay';
              ov.innerHTML = '<div class="chess-invite-box">' +
                '<h3>♟️ Chess Challenge!</h3>' +
                '<div class="ci-from">' + (inv.fromName||'Someone') + ' invites you</div>' +
                '<div class="ci-bet">💰 ' + inv.bet + ' coins</div>' +
                '<div class="ci-buttons">' +
                  '<button class="ci-reject">Reject</button>' +
                  '<button class="ci-accept">Accept</button>' +
                '</div></div>';
              document.body.appendChild(ov);
              ov.querySelector('.ci-accept').addEventListener('click', () => {
                ov.remove();
                _db.collection('chess_invites').doc(id).update({status:'accepted'});
                window.location.href = 'chinese-chess.html?join=' + inv.gameId;
              });
              ov.querySelector('.ci-reject').addEventListener('click', () => {
                ov.remove();
                _db.collection('chess_invites').doc(id).update({status:'rejected'});
              });
            });
          }, (err) => { console.error('[ChessInvite] onSnapshot error on room:', err); });
      });
    })();
