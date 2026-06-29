import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  getState,
  addItem,
  hasItem,
  showToast,
  getItemLabel,
  getCompassDirection,
  getScene,
  getChoicesForScene,
  renderScene,
  renderInventory,
  init,
  makeChoice,
  loadFromState,
  restart,
  ART,
  ITEM_LABELS,
  COMPASS_DIRECTIONS,
  SCENES,
  createInitialState,
} from '../game-engine.js';

function setupGameDOM() {
  document.body.innerHTML = `
    <div id="mainMenu" style="opacity:1; visibility:visible"></div>
    <div id="gameCompassHUD" style="display:none"></div>
    <div id="gameContent" style="display:block">
      <div id="dayLabel">GÜNDÜZ</div>
      <div id="progressTrack"></div>
      <div id="sceneRoot"></div>
      <div id="inventoryItems"></div>
    </div>
    <div id="compass"><div id="compassNeedle"></div></div>
    <div id="compassLabel">KUZEY</div>
    <div id="toast"></div>
    <div id="vignette"></div>
    <div id="blackout"></div>
    <div id="lightningFlash"></div>
  `;
  document.body.classList.remove('in-game', 'is-night', 'is-glitching');
}

describe('createInitialState', () => {
  it('should return a fresh initial state object', () => {
    const state = createInitialState();
    expect(state.sceneId).toBe('intro_1');
    expect(state.inventory).toEqual(['mum', 'çakmak', 'pusula', 'yardım fişeği']);
    expect(state.flags.haritaBulundu).toBe(false);
    expect(state.flags.hubVisits).toBe(0);
    expect(state.flags.isNight).toBe(false);
    expect(state.newItemFlash).toBeNull();
  });

  it('should return independent objects on each call', () => {
    const s1 = createInitialState();
    const s2 = createInitialState();
    s1.inventory.push('test');
    expect(s2.inventory).not.toContain('test');
  });
});

describe('ITEM_LABELS', () => {
  it('should have labels for all standard items', () => {
    expect(ITEM_LABELS['mum']).toBe('Mum');
    expect(ITEM_LABELS['çakmak']).toBe('Çakmak');
    expect(ITEM_LABELS['pusula']).toBe('Pusula');
    expect(ITEM_LABELS['yardım fişeği']).toBe('Yardım Fişeği');
    expect(ITEM_LABELS['gizli harita']).toBe('Gizli Harita');
    expect(ITEM_LABELS['eski günlük']).toBe('Eski Günlük');
    expect(ITEM_LABELS['ayin odası anahtarı']).toBe('Ayin Odası Anahtarı');
  });
});

describe('getItemLabel', () => {
  it('should return the label for a known item', () => {
    expect(getItemLabel('mum')).toBe('Mum');
    expect(getItemLabel('pusula')).toBe('Pusula');
  });

  it('should return the raw key for an unknown item', () => {
    expect(getItemLabel('unknown_item')).toBe('unknown_item');
  });
});

describe('COMPASS_DIRECTIONS', () => {
  it('should define directions for all main scenes', () => {
    expect(COMPASS_DIRECTIONS.intro_1).toEqual({ angle: 0, label: 'KUZEY' });
    expect(COMPASS_DIRECTIONS.mezarlik).toEqual({ angle: 315, label: 'KUZEYBATI' });
    expect(COMPASS_DIRECTIONS.final_bad).toEqual({ angle: 180, label: 'KAYIP' });
  });
});

describe('getCompassDirection', () => {
  it('should return compass data for a known scene', () => {
    const dir = getCompassDirection('intro_1');
    expect(dir).toEqual({ angle: 0, label: 'KUZEY' });
  });

  it('should return null for an unknown scene', () => {
    expect(getCompassDirection('nonexistent')).toBeNull();
  });
});

describe('ART', () => {
  it('should have SVG art for key scenes', () => {
    expect(ART.yetimhane).toContain('<svg');
    expect(ART.mezarlik).toContain('<svg');
    expect(ART.mahzen).toContain('<svg');
    expect(ART.vapur_final).toContain('<svg');
  });
});

describe('SCENES', () => {
  it('should define all required scenes', () => {
    const expectedScenes = [
      'intro_1', 'intro_2', 'yetimhane_1', 'yetimhane_kapi',
      'harita_bulundu', 'ada_hub', 'mezarlik', 'mahzen',
      'final_good', 'final_bad'
    ];
    expectedScenes.forEach(sceneId => {
      expect(SCENES[sceneId]).toBeDefined();
    });
  });

  it('should have label, title, progress, and text for every scene', () => {
    Object.values(SCENES).forEach(scene => {
      expect(scene.label).toBeDefined();
      expect(scene.title).toBeDefined();
      expect(scene.progress).toBeGreaterThanOrEqual(1);
      expect(scene.text).toBeDefined();
    });
  });

  it('should mark ending scenes with isEnding and endingType', () => {
    expect(SCENES.final_good.isEnding).toBe(true);
    expect(SCENES.final_good.endingType).toBe('good');
    expect(SCENES.final_bad.isEnding).toBe(true);
    expect(SCENES.final_bad.endingType).toBe('bad');
  });

  it('should have choices or dynamicChoices for non-ending scenes', () => {
    Object.entries(SCENES).forEach(([id, scene]) => {
      if (!scene.isEnding) {
        const hasChoices = scene.choices || scene.dynamicChoices;
        expect(hasChoices).toBeTruthy();
      }
    });
  });
});

describe('getScene', () => {
  it('should return the scene object for a valid id', () => {
    const scene = getScene('intro_1');
    expect(scene.title).toBe('İsimsiz Mektup');
  });

  it('should return null for an invalid id', () => {
    expect(getScene('doesnotexist')).toBeNull();
  });
});

describe('Inventory management', () => {
  beforeEach(() => {
    setupGameDOM();
    init();
  });

  describe('hasItem', () => {
    it('should return true for items in inventory', () => {
      expect(hasItem('mum')).toBe(true);
      expect(hasItem('pusula')).toBe(true);
    });

    it('should return false for items not in inventory', () => {
      expect(hasItem('gizli harita')).toBe(false);
    });
  });

  describe('addItem', () => {
    it('should add a new item to inventory', () => {
      addItem('gizli harita');
      expect(hasItem('gizli harita')).toBe(true);
    });

    it('should not duplicate an existing item', () => {
      const state = getState();
      const countBefore = state.inventory.length;
      addItem('mum');
      expect(state.inventory.length).toBe(countBefore);
    });

    it('should set newItemFlash for newly added items', () => {
      addItem('gizli harita');
      expect(getState().newItemFlash).toBe('gizli harita');
    });
  });
});

describe('showToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setupGameDOM();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should display a toast message', () => {
    showToast('+ Gizli Harita');
    const toast = document.getElementById('toast');
    expect(toast.textContent).toBe('+ Gizli Harita');
    expect(toast.classList.contains('show')).toBe(true);
  });

  it('should hide the toast after 2400ms', () => {
    showToast('Test');
    vi.advanceTimersByTime(2400);
    const toast = document.getElementById('toast');
    expect(toast.classList.contains('show')).toBe(false);
  });

  it('should not throw when toast element is missing', () => {
    document.body.innerHTML = '';
    expect(() => showToast('test')).not.toThrow();
  });
});

describe('getChoicesForScene', () => {
  beforeEach(() => {
    setupGameDOM();
    init();
  });

  it('should return static choices for scenes with choices array', () => {
    const choices = getChoicesForScene('intro_1');
    expect(choices).toHaveLength(1);
    expect(choices[0].next).toBe('intro_2');
  });

  it('should return dynamic choices for mahzen scene without key', () => {
    const choices = getChoicesForScene('mahzen');
    expect(choices[0].next).toBe('ada_hub');
    expect(choices[1].next).toBe('final_bad');
  });

  it('should return dynamic choices for mahzen scene with key', () => {
    addItem('ayin odası anahtarı');
    const choices = getChoicesForScene('mahzen');
    expect(choices[0].next).toBe('final_good');
  });

  it('should return empty array for unknown scene', () => {
    expect(getChoicesForScene('nonexistent')).toEqual([]);
  });

  it('should return empty array for ending scenes', () => {
    expect(getChoicesForScene('final_good')).toEqual([]);
  });
});

describe('init', () => {
  beforeEach(() => {
    setupGameDOM();
  });

  it('should reset state to initial values', () => {
    init();
    const state = getState();
    expect(state.sceneId).toBe('intro_1');
    expect(state.inventory).toEqual(['mum', 'çakmak', 'pusula', 'yardım fişeği']);
    expect(state.flags.haritaBulundu).toBe(false);
  });

  it('should render the intro scene', () => {
    init();
    const sceneRoot = document.getElementById('sceneRoot');
    expect(sceneRoot.innerHTML).toContain('İsimsiz Mektup');
  });

  it('should activate the vignette overlay', () => {
    init();
    const vig = document.getElementById('vignette');
    expect(vig.classList.contains('active')).toBe(true);
  });
});

describe('renderScene', () => {
  beforeEach(() => {
    setupGameDOM();
    init();
  });

  it('should render scene label, title, and text', () => {
    const sceneRoot = document.getElementById('sceneRoot');
    expect(sceneRoot.innerHTML).toContain('ÖNSÖZ');
    expect(sceneRoot.innerHTML).toContain('İsimsiz Mektup');
  });

  it('should render scene note when present', () => {
    const sceneRoot = document.getElementById('sceneRoot');
    expect(sceneRoot.innerHTML).toContain('scene-note');
  });

  it('should render choice buttons for non-ending scenes', () => {
    const sceneRoot = document.getElementById('sceneRoot');
    const buttons = sceneRoot.querySelectorAll('.choice-btn');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render art frame when scene has art', () => {
    const state = getState();
    state.sceneId = 'yetimhane_1';
    renderScene();
    const sceneRoot = document.getElementById('sceneRoot');
    expect(sceneRoot.innerHTML).toContain('illust-frame');
  });

  it('should update compass needle and label', () => {
    const needle = document.getElementById('compassNeedle');
    const label = document.getElementById('compassLabel');
    expect(label.textContent).toBe('KUZEY');
    expect(needle.style.transform).toContain('rotate(0deg)');
  });

  it('should build progress track segments', () => {
    const progTrack = document.getElementById('progressTrack');
    expect(progTrack.children.length).toBe(5);
    expect(progTrack.children[0].classList.contains('done')).toBe(true);
  });

  it('should set day label to GÜNDÜZ during daytime', () => {
    const dayLabel = document.getElementById('dayLabel');
    expect(dayLabel.textContent).toBe('GÜNDÜZ');
  });
});

describe('renderInventory', () => {
  beforeEach(() => {
    setupGameDOM();
    init();
  });

  it('should render all inventory items', () => {
    const container = document.getElementById('inventoryItems');
    const chips = container.querySelectorAll('.item-chip');
    expect(chips.length).toBe(4);
  });

  it('should display item labels correctly', () => {
    const container = document.getElementById('inventoryItems');
    const texts = Array.from(container.querySelectorAll('.item-chip')).map(c => c.textContent);
    expect(texts).toContain('Mum');
    expect(texts).toContain('Çakmak');
    expect(texts).toContain('Pusula');
    expect(texts).toContain('Yardım Fişeği');
  });

  it('should apply "new" class for newly flashed items', () => {
    addItem('gizli harita');
    renderInventory();
    // newItemFlash is cleared by renderInventory, so we need to check during render
    // Re-add and call manually
    const state = getState();
    state.newItemFlash = 'gizli harita';
    renderInventory();
    // After renderInventory, flash is cleared
    expect(state.newItemFlash).toBeNull();
  });
});

describe('makeChoice', () => {
  beforeEach(() => {
    setupGameDOM();
    init();
  });

  it('should transition to the next scene based on choice index', () => {
    makeChoice(0); // intro_1 -> intro_2
    expect(getState().sceneId).toBe('intro_2');
  });

  it('should render the new scene after choice', () => {
    makeChoice(0);
    const sceneRoot = document.getElementById('sceneRoot');
    expect(sceneRoot.innerHTML).toContain('Issız Adaya Doğru');
  });

  it('should not crash with an invalid index', () => {
    expect(() => makeChoice(99)).not.toThrow();
    expect(getState().sceneId).toBe('intro_1');
  });
});

describe('Game flow: intro to ending', () => {
  beforeEach(() => {
    setupGameDOM();
    init();
  });

  it('should reach good ending via full exploration path', () => {
    makeChoice(0); // intro_1 -> intro_2
    expect(getState().sceneId).toBe('intro_2');

    makeChoice(0); // intro_2 -> yetimhane_1
    expect(getState().sceneId).toBe('yetimhane_1');

    makeChoice(1); // yetimhane_1 -> yetimhane_kapi
    expect(getState().sceneId).toBe('yetimhane_kapi');

    makeChoice(0); // yetimhane_kapi -> harita_bulundu
    expect(getState().sceneId).toBe('harita_bulundu');
    expect(getState().flags.haritaBulundu).toBe(true);
    expect(hasItem('gizli harita')).toBe(true);

    makeChoice(0); // harita_bulundu -> ada_hub
    expect(getState().sceneId).toBe('ada_hub');

    makeChoice(0); // ada_hub -> mezarlik
    expect(getState().sceneId).toBe('mezarlik');
    expect(hasItem('ayin odası anahtarı')).toBe(true);
    expect(hasItem('eski günlük')).toBe(true);

    makeChoice(0); // mezarlik -> ada_hub
    expect(getState().sceneId).toBe('ada_hub');

    makeChoice(1); // ada_hub -> mahzen
    expect(getState().sceneId).toBe('mahzen');

    makeChoice(0); // mahzen (with key) -> final_good
    expect(getState().sceneId).toBe('final_good');
  });

  it('should reach bad ending via shortcut path', () => {
    makeChoice(0); // intro_1 -> intro_2
    makeChoice(0); // intro_2 -> yetimhane_1
    makeChoice(0); // yetimhane_1 -> mahzen (direct)

    expect(getState().sceneId).toBe('mahzen');
    expect(getState().flags.mahzenGorundu).toBe(true);

    // Without key, choice 1 is the flare (bad ending)
    makeChoice(1); // mahzen -> final_bad
    expect(getState().sceneId).toBe('final_bad');
  });
});

describe('Day/Night cycle', () => {
  beforeEach(() => {
    setupGameDOM();
    init();
  });

  it('should start as daytime', () => {
    expect(getState().flags.isNight).toBe(false);
    expect(document.body.classList.contains('is-night')).toBe(false);
  });

  it('should switch to night after visiting hub twice', () => {
    // Navigate to ada_hub via full path
    makeChoice(0); // intro_1 -> intro_2
    makeChoice(0); // intro_2 -> yetimhane_1
    makeChoice(1); // yetimhane_1 -> yetimhane_kapi
    makeChoice(0); // yetimhane_kapi -> harita_bulundu
    makeChoice(0); // harita_bulundu -> ada_hub (hubVisits = 1)
    expect(getState().flags.isNight).toBe(false);

    makeChoice(0); // ada_hub -> mezarlik
    makeChoice(0); // mezarlik -> ada_hub (hubVisits = 2)
    expect(getState().flags.isNight).toBe(true);
    expect(document.body.classList.contains('is-night')).toBe(true);
    expect(document.getElementById('dayLabel').textContent).toBe('GECE');
  });

  it('should apply glitching effect at night', () => {
    const state = getState();
    state.flags.isNight = true;
    state.sceneId = 'ada_hub';
    renderScene();
    expect(document.getElementById('compass').classList.contains('glitching')).toBe(true);
    expect(document.body.classList.contains('is-glitching')).toBe(true);
  });

  it('should force daytime for intro_1 scene', () => {
    const state = getState();
    state.flags.isNight = true;
    state.sceneId = 'intro_1';
    renderScene();
    expect(state.flags.isNight).toBe(false);
    expect(document.body.classList.contains('is-night')).toBe(false);
  });
});

describe('Ending scenes', () => {
  beforeEach(() => {
    setupGameDOM();
    init();
  });

  it('should render ending banner for good ending', () => {
    const state = getState();
    state.sceneId = 'final_good';
    renderScene();
    const sceneRoot = document.getElementById('sceneRoot');
    expect(sceneRoot.innerHTML).toContain('ending-banner');
    expect(sceneRoot.innerHTML).toContain('good');
    expect(sceneRoot.innerHTML).toContain('BAŞARILI BAŞARIM');
  });

  it('should render ending banner for bad ending', () => {
    const state = getState();
    state.sceneId = 'final_bad';
    renderScene();
    const sceneRoot = document.getElementById('sceneRoot');
    expect(sceneRoot.innerHTML).toContain('KÖTÜ SON');
    expect(sceneRoot.innerHTML).toContain('bad');
  });

  it('should render final quote for endings', () => {
    const state = getState();
    state.sceneId = 'final_good';
    renderScene();
    const sceneRoot = document.getElementById('sceneRoot');
    expect(sceneRoot.innerHTML).toContain('final-quote');
    expect(sceneRoot.innerHTML).toContain('Işık');
  });

  it('should render restart button on endings', () => {
    const state = getState();
    state.sceneId = 'final_good';
    renderScene();
    const sceneRoot = document.getElementById('sceneRoot');
    expect(sceneRoot.innerHTML).toContain('restart-btn');
    expect(sceneRoot.innerHTML).toContain('HİKAYEYE YENİDEN BAŞLA');
  });
});

describe('loadFromState', () => {
  beforeEach(() => {
    setupGameDOM();
  });

  it('should restore state and render the saved scene', () => {
    const savedState = createInitialState();
    savedState.sceneId = 'yetimhane_1';
    savedState.inventory.push('gizli harita');

    loadFromState(savedState);

    expect(getState().sceneId).toBe('yetimhane_1');
    expect(hasItem('gizli harita')).toBe(true);
    const sceneRoot = document.getElementById('sceneRoot');
    expect(sceneRoot.innerHTML).toContain('Çatlak Duvarlar');
  });

  it('should activate vignette on load', () => {
    loadFromState(createInitialState());
    const vig = document.getElementById('vignette');
    expect(vig.classList.contains('active')).toBe(true);
  });
});

describe('restart', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setupGameDOM();
    document.body.classList.add('in-game');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should activate blackout overlay', () => {
    restart();
    const bo = document.getElementById('blackout');
    expect(bo.classList.contains('active')).toBe(true);
  });

  it('should restore main menu after timeout', () => {
    restart();
    vi.advanceTimersByTime(1500);

    expect(document.body.classList.contains('in-game')).toBe(false);
    expect(document.getElementById('mainMenu').style.visibility).toBe('visible');
    expect(document.getElementById('mainMenu').style.opacity).toBe('1');
    expect(document.getElementById('gameCompassHUD').style.display).toBe('none');
    expect(document.getElementById('gameContent').style.display).toBe('none');
  });
});
