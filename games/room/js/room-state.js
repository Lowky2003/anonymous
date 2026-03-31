    /* ═══════════════════════════════
       State
       ═══════════════════════════════ */
    let roomData = { coins: 0, pets: [], plant: null, plantLevels: {}, plantPosition: null, ownedPlants: [], ownedDecors: [], placedDecors: [], ownedWalls: ['wall_default'], wallPattern: 'wall_default', ownedWindows: ['win_none','win_classic'], windowStyle: 'win_classic', ownedAccessories: [], displayName: '', lastCoinCollect: 0, loginStreak: 0, lastLoginDay: '', achievements: [], gachaPulls: 0, giftsGiven: 0, giftsReceived: 0, jukeboxTrack: null, jukeboxVol: 0.5, unlockedLayers: 1, layerData: {} };
    // Active layer (1–3) and view mode — local UI state, NOT saved to Firestore
    let currentLayer = 1;
    let isOutsideView = false;

    /* ═══════════════════════════════
       Helpers
       ═══════════════════════════════ */
    const toastEl = document.getElementById('toast');
    let toastTimer = null;
    function showToast(msg, type) {
      toastEl.textContent = msg;
      toastEl.className = 'toast ' + (type || '') + ' show';
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2500);
    }

    // Pet instance helpers
    function getPet(id) { return roomData.pets.find(p => p.id === id); }
    function getActivePets() { return roomData.pets.filter(p => p.active); }
    function makePetId() { return 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4); }

    // Migrate old pet format (pet/pet2 + ownedPets) to new pets array
    function migratePets(d) {
      if (d.pets && d.pets.length) return d.pets;
      const pets = [];
      const addPet = (type, active) => {
        const def = PETS.find(p => p.id === type);
        pets.push({
          id: makePetId(),
          type: type,
          name: def ? def.name : type,
          hunger: (d.petHunger && d.petHunger[type]) ?? 100,
          thirst: 100,
          affection: (d.petAffection && d.petAffection[type]) ?? 0,
          color: (d.petColors && d.petColors[type]) || null,
          active: active,
          accessory: (d.petAccessories && d.petAccessories[type]) || null
        });
      };
      if (d.pet) addPet(d.pet, true);
      if (d.pet2 && d.pet2 !== d.pet) addPet(d.pet2, true);
      const equipped = [d.pet, d.pet2].filter(Boolean);
      for (const type of (d.ownedPets || [])) {
        if (!equipped.includes(type)) addPet(type, false);
      }
      return pets;
    }

    function userDocRef(uid) { return db.collection('rooms').doc(uid || currentUid); }

    /* ═══════════════════════════════
       Multi-Layer Helpers
       ═══════════════════════════════ */

    /** Returns the default wall pattern applied when a new layer is unlocked. */
    function getLayerDefaultWall(n) {
      const defaults = { 1: 'wall_default', 2: 'wall_brick', 3: 'wall_galaxy' };
      return defaults[n] || 'wall_default';
    }

    /** Returns the default window style applied when a new layer is unlocked. */
    function getLayerDefaultWindow(n) {
      const defaults = { 1: 'win_classic', 2: 'win_round', 3: 'win_arch' };
      return defaults[n] || 'win_classic';
    }

    /**
     * Writes the current in-memory wall/window/decors/plantPosition back into
     * roomData.layerData[currentLayer] so the data is always consistent before saving.
     */
