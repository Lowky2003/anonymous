    async function saveRoom() {
      if (viewingUid !== currentUid) return;
      if (!_roomLoaded) return; // Don't save defaults before Firestore data loads
      // Sync active layer's mutable state (wall/window/decors/plantPos) into layerData
      flushLayerData();
      const data = {
        coins: roomData.coins,
        pets: roomData.pets.map(p => ({ id: p.id, type: p.type, name: p.name, hunger: p.hunger, thirst: p.thirst, affection: p.affection, color: p.color, layer: p.layer ?? null, accessory: p.accessory || null })),
        plant: roomData.plant,
        plantLevels: roomData.plantLevels,
        ownedPlants: roomData.ownedPlants,
        ownedDecors: roomData.ownedDecors,
        // Top-level layer-1 fields kept for backward compatibility with older clients
        placedDecors: (roomData.layerData[1] || {}).placedDecors || roomData.placedDecors,
        ownedWalls: roomData.ownedWalls,
        wallPattern: (roomData.layerData[1] || {}).wallPattern || roomData.wallPattern,
        ownedWindows: roomData.ownedWindows,
        windowStyle: (roomData.layerData[1] || {}).windowStyle || roomData.windowStyle,
        ownedAccessories: roomData.ownedAccessories || [],
        plantPosition: (roomData.layerData[1] || {}).plantPosition || null,
        displayName: getPlayerName(),
        lastCoinCollect: roomData.lastCoinCollect || Date.now(),
        lastSeen: Date.now(),
        updatedAt: Date.now(),
        loginStreak: roomData.loginStreak || 0,
        lastLoginDay: roomData.lastLoginDay || '',
        achievements: roomData.achievements || [],
        gachaPulls: roomData.gachaPulls || 0,
        giftsGiven: roomData.giftsGiven || 0,
        giftsReceived: roomData.giftsReceived || 0,
        jukeboxTrack: roomData.jukeboxTrack || null,
        jukeboxVol: roomData.jukeboxVol ?? 0.5,
        // Multi-layer fields
        unlockedLayers: roomData.unlockedLayers || 1,
        layerData: roomData.layerData || {}
      };
      _lastLocalSaveTime = Date.now();
      await userDocRef().set(data, { merge: true });
    }

    /* ═══════════════════════════════
       Init
       ═══════════════════════════════ */
    let _offlineCoinsCollected = false;
    let _plantCoinInterval = null;
    let _lastLocalSaveTime = 0;
    let _unsubRoomSnap = null;
    let _roomLoaded = false;
    async function initRoom() {
      _offlineCoinsCollected = false;
      _roomLoaded = false;
      // Unsubscribe previous room listener (account switch)
      if (_unsubRoomSnap) { _unsubRoomSnap(); _unsubRoomSnap = null; }
      if (unsubVisitList) { unsubVisitList(); unsubVisitList = null; }
      // Reset roomData to defaults for clean account switch
      roomData = { coins: 0, pets: [], plant: null, plantLevels: {}, plantPosition: null, ownedPlants: [], ownedDecors: [], placedDecors: [], ownedWalls: ['wall_default'], wallPattern: 'wall_default', ownedWindows: ['win_none','win_classic'], windowStyle: 'win_classic', ownedAccessories: [], displayName: getPlayerName(), lastCoinCollect: 0, loginStreak: 0, lastLoginDay: '', achievements: [], gachaPulls: 0, giftsGiven: 0, giftsReceived: 0, jukeboxTrack: null, jukeboxVol: 0.5, unlockedLayers: 1, layerData: {} };
      // Reset to floor 1 when re-initialising (e.g. account switch)
      currentLayer = 1;
      isOutsideView = false;
      document.getElementById('outsideView')?.classList.remove('visible');
      renderAll(); // Immediately show current user before Firestore loads
      initRoomDropZone();
      initDecorDrag();
      initMobileFoodTap();
      // Listen to own room data
      // Ensure room doc exists and displayName is current — use onSnapshot for reads,
      // only write if needed (avoids redundant .get())
      _unsubRoomSnap = userDocRef().onSnapshot((snap) => {
        // Guard: if currentUid changed mid-flight, ignore stale snapshot
        if (!currentUid) return;
        if (viewingUid !== currentUid) return; // Don't overwrite visited room data
        if (snap.exists) {
          // Check displayName sync once on first snapshot
          if (!_offlineCoinsCollected) {
            const currentName = getPlayerName();
            if (snap.data().displayName !== currentName) {
              userDocRef().update({ displayName: currentName });
            }
          }
          const d = snap.data();
          roomData.coins = d.coins ?? 0;
          // Migrate old pet format or load new pets array
          roomData.pets = migratePets(d);
          roomData.plant = d.plant ?? null;
          roomData.plantLevels = d.plantLevels ?? {};
          roomData.ownedPlants = d.ownedPlants ?? [];
          roomData.ownedDecors = d.ownedDecors ?? [];
          roomData.ownedWalls = d.ownedWalls ?? ['wall_default'];
          roomData.ownedWindows = d.ownedWindows ?? ['win_none','win_classic'];
          // ── Multi-layer: load unlockedLayers + layerData ──
          roomData.unlockedLayers = d.unlockedLayers ?? 1;
          // Build layerData from Firestore; fall back to top-level fields for backward compat
          const rawLayerData = d.layerData ? JSON.parse(JSON.stringify(d.layerData)) : {};
          if (!rawLayerData[1]) {
            // Migrate existing single-layer Firestore data into layerData[1]
            const rawPlaced = d.placedDecors ?? [];
            rawLayerData[1] = {
              wallPattern: d.wallPattern ?? 'wall_default',
              windowStyle: d.windowStyle ?? 'win_classic',
              placedDecors: rawPlaced.map(p => {
                if (typeof p === 'string') {
                  const def = DECORATIONS.find(x => x.id === p);
                  return { id: p, x: def ? def.dx : 0.5, y: def ? def.dy : 0.5 };
                }
                return p;
              }),
              plantPosition: d.plantPosition ?? null
            };
          }
          // Migrate any layer-specific placedDecors still in old string format
          for (const k of Object.keys(rawLayerData)) {
            const ld = rawLayerData[k];
            if (ld && Array.isArray(ld.placedDecors)) {
              ld.placedDecors = ld.placedDecors.map(p => {
                if (typeof p === 'string') {
                  const def = DECORATIONS.find(x => x.id === p);
                  return { id: p, x: def ? def.dx : 0.5, y: def ? def.dy : 0.5 };
                }
                return p;
              });
            }
          }
          roomData.layerData = rawLayerData;
          // Load the currently active layer's data into the main roomData slots
          const activeLD = roomData.layerData[currentLayer] || {};
          roomData.wallPattern = activeLD.wallPattern || 'wall_default';
          roomData.windowStyle = activeLD.windowStyle || 'win_classic';
          roomData.placedDecors = Array.isArray(activeLD.placedDecors) ? activeLD.placedDecors : [];
          roomData.plantPosition = activeLD.plantPosition || null;
          roomData.displayName = d.displayName ?? '';
          roomData.lastCoinCollect = d.lastCoinCollect ?? d.updatedAt ?? Date.now();
          roomData.ownedAccessories = d.ownedAccessories ?? [];
          roomData.loginStreak = d.loginStreak ?? 0;
          roomData.lastLoginDay = d.lastLoginDay ?? '';
          roomData.achievements = d.achievements ?? [];
          roomData.gachaPulls = d.gachaPulls ?? 0;
          roomData.giftsGiven = d.giftsGiven ?? 0;
          roomData.giftsReceived = d.giftsReceived ?? 0;
          roomData.jukeboxTrack = d.jukeboxTrack ?? null;
          roomData.jukeboxVol = d.jukeboxVol ?? 0.5;
          _roomLoaded = true;
          // Decay hunger based on elapsed time (1% per 10 min)
          const lastUpdate = d.updatedAt ?? Date.now();
          const elapsed = Date.now() - lastUpdate;
          const decay = Math.floor(elapsed / (10 * 60 * 1000));
          if (decay > 0) {
            let changed = false;
            for (const pet of roomData.pets) {
              const newH = Math.max(0, pet.hunger - decay);
              const newT = Math.max(0, (pet.thirst ?? 100) - decay);
              if (newH !== pet.hunger || newT !== (pet.thirst ?? 100)) {
                pet.hunger = newH; pet.thirst = newT; changed = true;
              }
            }
            if (changed) saveRoom();
          }
          // Plant passive coin generation (offline earnings)
          if (!_offlineCoinsCollected && roomData.plant) {
            _offlineCoinsCollected = true;
            const plantLvl = roomData.plantLevels[roomData.plant] || 1;
            const plantDef = PLANTS.find(p => p.id === roomData.plant);
            const baseRate = plantDef ? plantDef.coinRate : 1;
            const coinsPerCycle = plantLvl * baseRate;
            const lastCollect = roomData.lastCoinCollect || Date.now();
            const elapsed = Date.now() - lastCollect;
            const cycles = Math.floor(elapsed / (5 * 60 * 1000));
            if (cycles > 0) {
              const earned = cycles * coinsPerCycle;
              roomData.coins += earned;
              roomData.lastCoinCollect = Date.now();
              saveRoom();
              setTimeout(() => {
                showToast('🌱 Your Lv.' + plantLvl + ' ' + (plantDef ? plantDef.name : 'plant') + ' earned ' + earned + ' coins while you were away!', 'success');
              }, 800);
            }
          }
          _roomLoaded = true;
        } else {
          // New user — create room document
          _roomLoaded = true;
          roomData.displayName = getPlayerName();
          saveRoom();
        }
        // Hide loading overlay and always render on first snapshot
        const _loadOv = document.getElementById('roomLoadingOverlay');
        const _wasFirstLoad = _loadOv && _loadOv.style.display !== 'none';
        if (_loadOv) _loadOv.style.display = 'none';
        // Always render on first load; skip only if a local save just triggered this snapshot
        if (!_wasFirstLoad && Date.now() - _lastLocalSaveTime < 2000) return;
        renderAllDebounced();
      }, (err) => {
        console.error('Room onSnapshot error:', err);
        const _loadOv = document.getElementById('roomLoadingOverlay');
        if (_loadOv) _loadOv.style.display = 'none';
      });

      // Periodic hunger/thirst decay: -1% every 10 min while page is open
      setInterval(async () => {
        if (viewingUid !== currentUid) return;
        let changed = false;
        for (const pet of roomData.pets) {
          if (pet.hunger > 0) { pet.hunger = pet.hunger - 1; changed = true; }
          if ((pet.thirst ?? 100) > 0) { pet.thirst = (pet.thirst ?? 100) - 1; changed = true; }
        }
        if (changed) { await saveRoom(); renderAllDebounced(); }
      }, 10 * 60 * 1000);

      // Heartbeat: update lastSeen every 30s so others see you online
      userDocRef().update({ lastSeen: Date.now() }).catch(() => {});
      setInterval(() => {
        if (viewingUid !== currentUid) return;
        userDocRef().update({ lastSeen: Date.now() }).catch(() => {});
      }, 30 * 1000);

      // Mark offline on page close / tab switch
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && currentUid) {
          userDocRef().update({ lastSeen: 0 }).catch(() => {});
        } else if (document.visibilityState === 'visible' && currentUid) {
          userDocRef().update({ lastSeen: Date.now() }).catch(() => {});
        }
      });
      window.addEventListener('beforeunload', () => {
        if (currentUid) userDocRef().update({ lastSeen: 0 }).catch(() => {});
      });

      // Plant passive coin generation: every 5 min while online
      if (_plantCoinInterval) clearInterval(_plantCoinInterval);
      _plantCoinInterval = setInterval(async () => {
        if (viewingUid !== currentUid || !roomData.plant) return;
        const plantLvl = roomData.plantLevels[roomData.plant] || 1;
        const plantDef = PLANTS.find(p => p.id === roomData.plant);
        const baseRate = plantDef ? plantDef.coinRate : 1;
        const earned = plantLvl * baseRate;
        roomData.coins += earned;
        roomData.lastCoinCollect = Date.now();
        await saveRoom();
        renderAllDebounced();
        showToast('🌱 ' + (plantDef ? plantDef.name : 'Plant') + ' earned ' + earned + ' coins!', 'success');
      }, 5 * 60 * 1000);

      // Check daily login reward & achievements on load
      setTimeout(() => { checkDailyOnLogin(); checkAchievements(); }, 1500);
    }

