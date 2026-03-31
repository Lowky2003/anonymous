    function flushLayerData() {
      if (!roomData.layerData) roomData.layerData = {};
      roomData.layerData[currentLayer] = {
        wallPattern:   roomData.wallPattern,
        windowStyle:   roomData.windowStyle,
        placedDecors:  roomData.placedDecors,
        plantPosition: roomData.plantPosition || null
      };
    }

    /**
     * Switches the active view layer, loading the new layer's decor/wall data,
     * and re-renders the room. Optionally saves after switching.
     */
    function enterLayer(n, doSave) {
      if (n < 1 || n > 3) return;
      const total = roomData.unlockedLayers || 1;
      if (n > total) {
        showToast('Floor ' + n + ' is locked! Unlock it from ⬆ Feed > 🏠 Floors.', 'error');
        return;
      }
      // Persist current layer before switching
      flushLayerData();
      currentLayer = n;
      // Load the new layer's data into the active roomData slots
      const ld = (roomData.layerData || {})[n] || {};
      roomData.wallPattern   = ld.wallPattern  || getLayerDefaultWall(n);
      roomData.windowStyle   = ld.windowStyle  || getLayerDefaultWindow(n);
      roomData.placedDecors  = Array.isArray(ld.placedDecors) ? ld.placedDecors : [];
      roomData.plantPosition = ld.plantPosition || null;
      // Hide outside view
      isOutsideView = false;
      document.getElementById('outsideView')?.classList.remove('visible');
      // Force full bg redraw (wall pattern may have changed)
      const bgc = document.getElementById('roomBgCanvas');
      if (bgc) bgc.dataset.init = '';
      _lastPetKey   = '';
      _lastPlantKey = '';
      renderAll();
      if (doSave) saveRoom();
    }

    /** Shows the outside view overlay and renders the building on canvas. */
    function goOutside() {
      flushLayerData();
      isOutsideView = true;
      document.getElementById('outsideView')?.classList.add('visible');
      drawOutsideCanvas();
      updateLayerBadge();
    }

    /** Updates the layer badge text inside the room. */
    function updateLayerBadge() {
      const badge = document.getElementById('layerBadge');
      if (!badge) return;
      const total = roomData.unlockedLayers || 1;
      if (isOutsideView) {
        badge.textContent = '🌳 Outside';
      } else if (total > 1) {
        badge.textContent = '🏠 Floor ' + currentLayer + ' / ' + total;
      } else {
        badge.textContent = '🏠 My Room';
      }
    }

    // Stores floor hit-rects for canvas click handling: { floorNum: {x,y,w,h,unlocked} }
    let _outsideFloorRects = {};
    // Pre-computed stable star positions (avoids flickering on re-render)
    let _outsideStars = null;

    /**
     * Draws the full building exterior scene on the #outsideCanvas canvas element.
     * Called whenever the outside view is opened or needs refreshing.
     */
    function drawOutsideCanvas() {
      const cvs = document.getElementById('outsideCanvas');
      if (!cvs) return;
      const par = cvs.parentElement;
      cvs.width  = par.clientWidth;
      cvs.height = par.clientHeight;
      const W = cvs.width, H = cvs.height;
      const ctx = cvs.getContext('2d');
      _outsideFloorRects = {};

      // ── Pre-compute stable star positions using deterministic seeding ──
      if (!_outsideStars) {
        _outsideStars = Array.from({length: 28}, (_, i) => ({
          x: (Math.sin(i * 7.3 + 2.1) * 0.5 + 0.5),
          y: (Math.sin(i * 3.7 + 0.9) * 0.5 + 0.5) * 0.4,
          r: 0.8 + (i % 3) * 0.4
        }));
      }

      // ── 1. Night sky gradient ──
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.7);
      sky.addColorStop(0,   '#060d1f');
      sky.addColorStop(0.4, '#0d1f40');
      sky.addColorStop(0.7, '#14304f');
      sky.addColorStop(1,   '#1e4a38');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // ── 2. Ground ──
      const grd = ctx.createLinearGradient(0, H * 0.7, 0, H);
      grd.addColorStop(0,   '#2a5a1a');
      grd.addColorStop(0.4, '#1e4410');
      grd.addColorStop(1,   '#0e2a06');
      ctx.fillStyle = grd;
      ctx.fillRect(0, H * 0.7, W, H * 0.3);

      // ── 3. Cobblestone path to door ──
      const pathW = 38, pathX = W / 2 - 19;
      ctx.fillStyle = '#8a7a60';
      ctx.fillRect(pathX, H * 0.68, pathW, H * 0.32);
      ctx.strokeStyle = 'rgba(60,50,35,0.35)';
      ctx.lineWidth = 0.8;
      for (let py = H * 0.7; py < H; py += 14) {
        ctx.beginPath(); ctx.moveTo(pathX, py); ctx.lineTo(pathX + pathW, py); ctx.stroke();
      }

      // ── 4. Stars ──
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      _outsideStars.forEach(s => {
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fill();
      });

      // ── 5. Crescent moon ──
      const moonX = W * 0.84, moonY = H * 0.10, moonR = Math.min(W, H) * 0.055;
      ctx.fillStyle = '#fff9c4';
      ctx.beginPath(); ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0d1f40';
      ctx.beginPath(); ctx.arc(moonX + moonR * 0.4, moonY - moonR * 0.1, moonR * 0.82, 0, Math.PI * 2); ctx.fill();

      // ── 6. Draw trees (left & right) ──
      function drawTree(tx, ty, tH) {
        ctx.fillStyle = '#4a2e10';
        ctx.fillRect(tx - 5, ty - tH * 0.32, 10, tH * 0.32);
        for (let t = 0; t < 3; t++) {
          const tw  = tH * (0.22 - t * 0.055);
          const tyy = ty - tH * 0.32 - t * tH * 0.26;
          const g   = ctx.createLinearGradient(tx - tw, tyy - tH * 0.26, tx + tw, tyy);
          g.addColorStop(0, '#1a5a10'); g.addColorStop(0.5, '#2a7a20'); g.addColorStop(1, '#1a5a10');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(tx, tyy - tH * 0.30);
          ctx.lineTo(tx - tw, tyy); ctx.lineTo(tx + tw, tyy);
          ctx.closePath(); ctx.fill();
        }
      }
      const tH = H * 0.25;
      drawTree(W * 0.12, H * 0.68, tH);
      drawTree(W * 0.88, H * 0.68, tH * 0.88);

      // ── 7. Building layout ──
      const MAX_FLOORS = 3;
      const bW     = Math.min(W * 0.52, 260);
      const bX     = (W - bW) / 2;
      const floorH = Math.min((H * 0.42) / MAX_FLOORS, 72);
      const bH     = floorH * MAX_FLOORS;
      const bTop   = H * 0.68 - bH;
      const total  = roomData.unlockedLayers || 1;

      // ── 8. Building drop-shadow ──
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur  = 20;
      ctx.fillStyle   = '#2a1e10';
      ctx.fillRect(bX - 4, bTop - 2, bW + 8, bH + 6);
      ctx.shadowBlur  = 0; ctx.shadowColor = 'transparent';

      // ── 9. Draw each floor ──
      for (let i = 1; i <= MAX_FLOORS; i++) {
        // Floor 1 sits at the bottom; floor 3 is at the top of the building
        const fi  = MAX_FLOORS - i;        // 0 = topmost slot
        const fy  = bTop + fi * floorH;
        const unlocked  = i <= total;
        const isCurrent = i === currentLayer;
        const ld        = (roomData.layerData || {})[i] || {};
        const wallColor = getWallPreviewColor(ld.wallPattern || getLayerDefaultWall(i));

        // Panel fill
        if (unlocked) {
          ctx.fillStyle = wallColor;
          ctx.fillRect(bX, fy, bW, floorH);
          // Subtle sheen
          const tex = ctx.createLinearGradient(bX, fy, bX + bW, fy + floorH);
          tex.addColorStop(0,   'rgba(255,255,255,0.07)');
          tex.addColorStop(0.5, 'rgba(255,255,255,0.0)');
          tex.addColorStop(1,   'rgba(0,0,0,0.06)');
          ctx.fillStyle = tex;
          ctx.fillRect(bX, fy, bW, floorH);
        } else {
          // Locked — dark hatched background
          ctx.fillStyle = '#1a1525';
          ctx.fillRect(bX, fy, bW, floorH);
          ctx.strokeStyle = 'rgba(100,80,160,0.12)';
          ctx.lineWidth = 0.7;
          for (let lx = -floorH; lx < bW + floorH; lx += 14) {
            ctx.beginPath();
            ctx.moveTo(bX + lx, fy);
            ctx.lineTo(bX + lx + floorH, fy + floorH);
            ctx.stroke();
          }
        }

        // Border (gold highlight for current floor)
        ctx.strokeStyle = (isCurrent && unlocked) ? '#f7c97e' : 'rgba(0,0,0,0.35)';
        ctx.lineWidth   = (isCurrent && unlocked) ? 2.5 : 1;
        ctx.strokeRect(bX + (isCurrent ? 1.25 : 0), fy + (isCurrent ? 1.25 : 0),
                       bW - (isCurrent ? 2.5 : 0),  floorH - (isCurrent ? 2.5 : 0));

        // Windows (two per floor)
        const winW = bW * 0.16, winH = floorH * 0.5;
        const winY = fy + (floorH - winH) / 2;
        [bX + bW * 0.18, bX + bW * 0.62].forEach(wx => {
          if (unlocked) {
            // Glass gradient
            const wg = ctx.createLinearGradient(wx, winY, wx + winW, winY + winH);
            wg.addColorStop(0, 'rgba(200,230,255,0.65)');
            wg.addColorStop(1, 'rgba(160,210,255,0.45)');
            ctx.fillStyle = wg;
            ctx.fillRect(wx, winY, winW, winH);
            // Warm interior glow
            ctx.fillStyle = 'rgba(255,245,200,0.20)';
            ctx.fillRect(wx + 2, winY + 2, winW - 4, winH - 4);
            // Frame
            ctx.strokeStyle = 'rgba(60,90,130,0.7)';  ctx.lineWidth = 1.5;
            ctx.strokeRect(wx, winY, winW, winH);
            // Pane cross
            ctx.strokeStyle = 'rgba(60,90,130,0.5)';  ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(wx + winW/2, winY); ctx.lineTo(wx + winW/2, winY + winH); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(wx, winY + winH/2); ctx.lineTo(wx + winW, winY + winH/2); ctx.stroke();
          } else {
            // Boarded X
            ctx.fillStyle = 'rgba(30,20,10,0.8)';
            ctx.fillRect(wx, winY, winW, winH);
            ctx.strokeStyle = 'rgba(100,70,40,0.55)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(wx, winY); ctx.lineTo(wx + winW, winY + winH); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(wx + winW, winY); ctx.lineTo(wx, winY + winH); ctx.stroke();
          }
        });

        // Floor label
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        if (unlocked) {
          ctx.fillStyle = 'rgba(0,0,0,0.65)';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(isCurrent ? '★ Floor ' + i : 'Floor ' + i, bX + bW / 2, fy + floorH - 16);
        } else {
          ctx.fillStyle = 'rgba(180,150,220,0.75)';
          ctx.font = '10px sans-serif';
          const UNLOCK_COST = { 2: 10000, 3: 20000 };
          ctx.fillText('🔒 ' + (UNLOCK_COST[i] || '') + ' coins', bX + bW / 2, fy + floorH - 16);
        }
        ctx.textBaseline = 'alphabetic';

        // Store rect for click detection
        _outsideFloorRects[i] = { x: bX, y: fy, w: bW, h: floorH, unlocked };
      }

      // ── 10. Peaked roof ──
      const roofPeakX = W / 2;
      const roofPeakY = bTop - bW * 0.28;
      const roofG = ctx.createLinearGradient(bX, bTop, roofPeakX, roofPeakY);
      roofG.addColorStop(0, '#c8a060'); roofG.addColorStop(0.5, '#a07840'); roofG.addColorStop(1, '#7a5820');
      ctx.fillStyle = roofG;
      ctx.beginPath();
      ctx.moveTo(bX - 12, bTop); ctx.lineTo(roofPeakX, roofPeakY); ctx.lineTo(bX + bW + 12, bTop);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1; ctx.stroke();

      // ── 11. Chimney ──
      const chimX = bX + bW * 0.68;
      const chimY = roofPeakY + (bTop - roofPeakY) * 0.32;
      ctx.fillStyle = '#8a6520';
      ctx.fillRect(chimX, chimY - 22, 14, 26);
      ctx.fillStyle = '#6a4a10';
      ctx.fillRect(chimX - 2, chimY - 24, 18, 4);
      for (let sp = 0; sp < 3; sp++) {
        ctx.fillStyle = `rgba(200,200,200,${0.25 - sp * 0.07})`;
        ctx.beginPath();
        ctx.arc(chimX + 7 + sp * 2, chimY - 28 - sp * 7, 4 + sp * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 12. Front door ──
      const doorW = bW * 0.13, doorH = floorH * 0.82;
      const doorX = W / 2 - doorW / 2;
      const doorY = H * 0.68 - doorH;
      ctx.fillStyle = '#5a3a18';
      ctx.fillRect(doorX - 4, doorY + doorH * 0.08, doorW + 8, doorH * 0.92 + 3);
      const dg = ctx.createLinearGradient(doorX, doorY, doorX + doorW, doorY + doorH);
      dg.addColorStop(0, '#8a5030'); dg.addColorStop(1, '#5a3018');
      ctx.fillStyle = dg;
      ctx.fillRect(doorX, doorY + doorH * 0.08, doorW, doorH * 0.92);
      ctx.fillStyle = '#6a4020';
      ctx.beginPath();
      ctx.arc(doorX + doorW / 2, doorY + doorH * 0.08, doorW / 2, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = 'rgba(40,20,5,0.5)'; ctx.lineWidth = 1;
      ctx.strokeRect(doorX + 3, doorY + doorH * 0.15, doorW - 6, doorH * 0.32);
      ctx.strokeRect(doorX + 3, doorY + doorH * 0.52, doorW - 6, doorH * 0.34);
      ctx.fillStyle = '#e0b850';
      ctx.beginPath(); ctx.arc(doorX + doorW * 0.72, doorY + doorH * 0.54, 3.5, 0, Math.PI * 2); ctx.fill();

      // ── 13. Attach click handler ──
      _attachOutsideClickHandler();
    }

    /** Attaches a click handler on #outsideCanvas for floor entry/navigation. */
    function _attachOutsideClickHandler() {
      const cvs = document.getElementById('outsideCanvas');
      if (!cvs) return;
      // Replace onclick each time to avoid stale closures
      cvs.onclick = (e) => {
        const rect = cvs.getBoundingClientRect();
        const cx = (e.clientX - rect.left) * (cvs.width  / rect.width);
        const cy = (e.clientY - rect.top)  * (cvs.height / rect.height);
        for (const [fi, r] of Object.entries(_outsideFloorRects)) {
          if (cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h) {
            if (r.unlocked) {
              enterLayer(Number(fi));
            } else {
              const ownRoom = viewingUid === currentUid;
              showToast(ownRoom ? 'Unlock from ⬆ Feed → 🏠 Floors' : 'Floor is locked.', 'error');
            }
            return;
          }
        }
      };
    }

    /**
     * @deprecated - HTML floor tiles replaced by canvas.
     * Kept as a thin wrapper so existing callers (upgrade tab, etc.) still work.
     */
    function renderOutsideView() {
      if (isOutsideView) drawOutsideCanvas();
    }

    /**
     * Returns a representative CSS background colour for a wall pattern
     * used in the outside-view floor preview tiles.
     */
    function getWallPreviewColor(wallId) {
      const map = {
        wall_default: '#d4c4a0', wall_brick:   '#b5745a', wall_wood:    '#a08060',
        wall_stripe:  '#e0d8cc', wall_dots:    '#e8e0d8', wall_diamond: '#d8d0c4',
        wall_pastel:  '#ffd1dc', wall_mint:    '#b8e8d0', wall_navy:    '#2c3e6b',
        wall_sunset:  '#ff7b54', wall_marble:  '#e8e4e0', wall_galaxy:  '#1a1035',
        wall_lavender:'#d4bcf0', wall_forest:  '#2d5a27', wall_bamboo:  '#a8c878',
        wall_cherry:  '#f5d0d8'
      };
      return map[wallId] || '#d4c4a0';
    }

    /**
     * Unlocks a new floor layer, deducting coins and initialising the layer's
     * default wall/window settings. Called from the 🏠 Floors upgrade sub-tab.
     */
    async function unlockLayer(n) {
      if (viewingUid !== currentUid) return;
      const UNLOCK_COST = { 2: 10000, 3: 20000 };
      const cost = UNLOCK_COST[n];
      if (!cost) return;
      if ((roomData.unlockedLayers || 1) >= n) return showToast('Floor ' + n + ' already unlocked!', 'error');
      if ((roomData.unlockedLayers || 1) < n - 1)
        return showToast('Unlock Floor ' + (n - 1) + ' first!', 'error');
      if (roomData.coins < cost)
        return showToast('Not enough coins! Need ' + cost + ' 🪙', 'error');
      roomData.coins -= cost;
      roomData.unlockedLayers = n;
      // Initialise the new floor with its default wall/window and empty decors
      if (!roomData.layerData) roomData.layerData = {};
      roomData.layerData[n] = {
        wallPattern:   getLayerDefaultWall(n),
        windowStyle:   getLayerDefaultWindow(n),
        placedDecors:  [],
        plantPosition: null
      };
      // Ensure the default window style is in the owned list
      const defWin = getLayerDefaultWindow(n);
      if (!roomData.ownedWindows.includes(defWin)) roomData.ownedWindows.push(defWin);
      await saveRoom();
      renderAll();
      showToast('🏠 Floor ' + n + ' unlocked! Tap it to enter.', 'success');
    }

    function getPlayerName() {
      const custom = currentUid ? localStorage.getItem('flappy_custom_name_' + currentUid) : null;
      if (custom) return custom;
      // Prefer current Firebase user's displayName over potentially stale localStorage
      if (currentUser && currentUser.displayName) return currentUser.displayName;
      return localStorage.getItem('flappy_name') || 'Anonymous';
    }

