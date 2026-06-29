import SteamBridge from './steam-bridge.js';
import { transitionToGame } from './transition.js';

export { SteamBridge };

export function openPanel(id) {
    closePanels();
    const panel = document.getElementById(id);
    if (panel) panel.style.display = 'block';
}

export function closePanels() {
    document.querySelectorAll('.ui-panel').forEach(p => p.style.display = 'none');
}

export function startNewGame() {
    transitionToGame(() => {
        if (window.GameEngine) window.GameEngine.init();
    });
}

export function loadSavedGame() {
    const saved = SteamBridge.loadGame();
    if (saved) {
        transitionToGame(() => {
            if (window.GameEngine) window.GameEngine.loadFromState(saved);
        });
    } else {
        alert('Kayıtlı arşiv odası bulunamadı! Yeni Hikaye başlatılıyor...');
        startNewGame();
    }
}

export function initLightningEffect() {
    function triggerLightning() {
        const flashLayer = document.getElementById('lightningFlash');
        if (flashLayer) {
            flashLayer.classList.add('flash-active');
            setTimeout(() => { flashLayer.classList.remove('flash-active'); }, 450);
            setTimeout(triggerLightning, Math.random() * 6000 + 4000);
        }
    }
    setTimeout(triggerLightning, 2000);
}
