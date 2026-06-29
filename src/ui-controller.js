// --- STEAM & DURUM ENTEGRASYON KÖPRÜSÜ ---
export const SteamBridge = {
    saveGame(stateData) {
        try {
            localStorage.setItem("golgelerin_yetimhanesi_save", JSON.stringify(stateData));
        } catch(e) {
            console.warn("Kayıt hatası:", e.message);
        }
    },
    loadGame() {
        try {
            const data = localStorage.getItem("golgelerin_yetimhanesi_save");
            if (!data) return null;
            const parsed = JSON.parse(data);
            return SteamBridge.validateState(parsed) ? parsed : null;
        } catch(e) {
            console.warn("Yükleme hatası:", e.message);
            return null;
        }
    },
    validateState(s) {
        if (!s || typeof s !== 'object') return false;
        if (typeof s.sceneId !== 'string') return false;
        if (!Array.isArray(s.inventory)) return false;
        if (!s.flags || typeof s.flags !== 'object') return false;
        const allowedItems = ['mum','çakmak','pusula','yardım fişeği','gizli harita','eski günlük','çocuk dosyaları','ayin odası anahtarı','gizli belgeler'];
        if (!s.inventory.every(i => allowedItems.includes(i))) return false;
        return true;
    },
    unlockAchievement(name) {
        console.log(`🏆 Başarım Açıldı -> [${name}]`);
    }
};

// --- ANA MENÜ KONTROLLERİ ---
export function openPanel(id) {
    closePanels();
    const panel = document.getElementById(id);
    if (panel) panel.style.display = 'block';
}

export function closePanels() {
    document.querySelectorAll('.ui-panel').forEach(p => p.style.display = 'none');
}

export function startNewGame() {
    const mainMenu = document.getElementById('mainMenu');
    if (mainMenu) {
        mainMenu.style.opacity = '0';
        setTimeout(() => {
            mainMenu.style.visibility = 'hidden';
            document.body.classList.add('in-game');
            const compass = document.getElementById('gameCompassHUD');
            if (compass) compass.style.display = 'block';
            const content = document.getElementById('gameContent');
            if (content) content.style.display = 'block';
            
            // GameEngine'i başlat (global olacak)
            if (window.GameEngine) window.GameEngine.init();
        }, 1000);
    }
}

export function loadSavedGame() {
    const saved = SteamBridge.loadGame();
    if (saved) {
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.opacity = '0';
            setTimeout(() => {
                mainMenu.style.visibility = 'hidden';
                document.body.classList.add('in-game');
                const compass = document.getElementById('gameCompassHUD');
                if (compass) compass.style.display = 'block';
                const content = document.getElementById('gameContent');
                if (content) content.style.display = 'block';
                
                if (window.GameEngine) window.GameEngine.loadFromState(saved);
            }, 1000);
        }
    } else {
        alert('Kayıtlı arşiv odası bulunamadı! Yeni Hikaye başlatılıyor...');
        startNewGame();
    }
}

// Yıldırım Efekti Mekaniği
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
