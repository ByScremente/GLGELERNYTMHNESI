import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SteamBridge, openPanel, closePanels, startNewGame, loadSavedGame, initLightningEffect } from '../ui-controller.js';

describe('SteamBridge', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveGame', () => {
    it('should save state data to localStorage as JSON', () => {
      const stateData = { sceneId: 'intro_1', inventory: ['mum'] };
      SteamBridge.saveGame(stateData);

      const stored = localStorage.getItem('golgelerin_yetimhanesi_save');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual(stateData);
    });

    it('should overwrite previous save data', () => {
      SteamBridge.saveGame({ sceneId: 'intro_1' });
      SteamBridge.saveGame({ sceneId: 'intro_2' });

      const stored = JSON.parse(localStorage.getItem('golgelerin_yetimhanesi_save'));
      expect(stored.sceneId).toBe('intro_2');
    });
  });

  describe('loadGame', () => {
    it('should return null when no save exists', () => {
      expect(SteamBridge.loadGame()).toBeNull();
    });

    it('should return parsed state when save exists', () => {
      const stateData = { sceneId: 'mezarlik', inventory: ['mum', 'pusula'] };
      localStorage.setItem('golgelerin_yetimhanesi_save', JSON.stringify(stateData));

      const loaded = SteamBridge.loadGame();
      expect(loaded).toEqual(stateData);
    });
  });

  describe('unlockAchievement', () => {
    it('should log achievement name to console', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      SteamBridge.unlockAchievement('Kayıp Gerçekler');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Kayıp Gerçekler')
      );
      consoleSpy.mockRestore();
    });
  });
});

describe('openPanel', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="ui-panel" id="settingsPanel" style="display:none"></div>
      <div class="ui-panel" id="creditsPanel" style="display:none"></div>
    `;
  });

  it('should display the specified panel', () => {
    openPanel('settingsPanel');
    expect(document.getElementById('settingsPanel').style.display).toBe('block');
  });

  it('should close other panels before opening the target one', () => {
    document.getElementById('creditsPanel').style.display = 'block';
    openPanel('settingsPanel');

    expect(document.getElementById('settingsPanel').style.display).toBe('block');
    expect(document.getElementById('creditsPanel').style.display).toBe('none');
  });

  it('should not throw when panel id does not exist', () => {
    expect(() => openPanel('nonExistentPanel')).not.toThrow();
  });
});

describe('closePanels', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="ui-panel" id="settingsPanel" style="display:block"></div>
      <div class="ui-panel" id="creditsPanel" style="display:block"></div>
    `;
  });

  it('should hide all ui-panel elements', () => {
    closePanels();

    const panels = document.querySelectorAll('.ui-panel');
    panels.forEach(p => {
      expect(p.style.display).toBe('none');
    });
  });
});

describe('startNewGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <div id="mainMenu" style="opacity:1; visibility:visible"></div>
      <div id="gameCompassHUD" style="display:none"></div>
      <div id="gameContent" style="display:none"></div>
    `;
    document.body.classList.remove('in-game');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should set mainMenu opacity to 0 immediately', () => {
    startNewGame();
    expect(document.getElementById('mainMenu').style.opacity).toBe('0');
  });

  it('should hide mainMenu and show game elements after timeout', () => {
    startNewGame();
    vi.advanceTimersByTime(1000);

    expect(document.getElementById('mainMenu').style.visibility).toBe('hidden');
    expect(document.body.classList.contains('in-game')).toBe(true);
    expect(document.getElementById('gameCompassHUD').style.display).toBe('block');
    expect(document.getElementById('gameContent').style.display).toBe('block');
  });

  it('should call GameEngine.init if available on window', () => {
    const mockInit = vi.fn();
    window.GameEngine = { init: mockInit };

    startNewGame();
    vi.advanceTimersByTime(1000);

    expect(mockInit).toHaveBeenCalled();
    delete window.GameEngine;
  });

  it('should not throw when mainMenu element is missing', () => {
    document.body.innerHTML = '';
    expect(() => startNewGame()).not.toThrow();
  });
});

describe('loadSavedGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    document.body.innerHTML = `
      <div id="mainMenu" style="opacity:1; visibility:visible"></div>
      <div id="gameCompassHUD" style="display:none"></div>
      <div id="gameContent" style="display:none"></div>
    `;
    document.body.classList.remove('in-game');
  });

  afterEach(() => {
    vi.useRealTimers();
    delete window.GameEngine;
  });

  it('should alert and start new game when no save exists', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    loadSavedGame();

    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining('Kayıtlı arşiv odası bulunamadı')
    );
    alertSpy.mockRestore();
  });

  it('should transition to game view when save exists', () => {
    const savedState = { sceneId: 'mezarlik', inventory: ['mum'] };
    localStorage.setItem('golgelerin_yetimhanesi_save', JSON.stringify(savedState));

    loadSavedGame();
    expect(document.getElementById('mainMenu').style.opacity).toBe('0');

    vi.advanceTimersByTime(1000);
    expect(document.getElementById('mainMenu').style.visibility).toBe('hidden');
    expect(document.body.classList.contains('in-game')).toBe(true);
  });

  it('should call GameEngine.loadFromState with saved data', () => {
    const savedState = { sceneId: 'ada_hub', inventory: ['pusula'] };
    localStorage.setItem('golgelerin_yetimhanesi_save', JSON.stringify(savedState));
    const mockLoadFromState = vi.fn();
    window.GameEngine = { loadFromState: mockLoadFromState };

    loadSavedGame();
    vi.advanceTimersByTime(1000);

    expect(mockLoadFromState).toHaveBeenCalledWith(savedState);
  });
});

describe('initLightningEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `<div id="lightningFlash"></div>`;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should add flash-active class after initial delay', () => {
    initLightningEffect();
    vi.advanceTimersByTime(2000);

    const flashLayer = document.getElementById('lightningFlash');
    expect(flashLayer.classList.contains('flash-active')).toBe(true);
  });

  it('should remove flash-active class after 450ms', () => {
    initLightningEffect();
    vi.advanceTimersByTime(2000);

    const flashLayer = document.getElementById('lightningFlash');
    expect(flashLayer.classList.contains('flash-active')).toBe(true);

    vi.advanceTimersByTime(450);
    expect(flashLayer.classList.contains('flash-active')).toBe(false);
  });

  it('should not throw when lightningFlash element is missing', () => {
    document.body.innerHTML = '';
    expect(() => {
      initLightningEffect();
      vi.advanceTimersByTime(2000);
    }).not.toThrow();
  });
});
