// --- STEAM & DURUM ENTEGRASYON KÖPRÜSÜ ---
export const SteamBridge = {
    saveGame(stateData) {
        try {
            localStorage.setItem("golgelerin_yetimhanesi_save", JSON.stringify(stateData));
            console.log("💾 Oyun durumu yerel belleğe yedeklendi.");
        } catch (err) {
            console.error("Oyun durumu kaydedilemedi:", err);
        }
    },
    loadGame() {
        try {
            const data = localStorage.getItem("golgelerin_yetimhanesi_save");
            return data ? JSON.parse(data) : null;
        } catch (err) {
            console.error("Kayıtlı oyun verisi okunamadı:", err);
            return null;
        }
    },
    unlockAchievement(name) {
        console.log(`🏆 Başarım Açıldı -> [${name}]`);
    }
};

// --- ANA MENÜ KONTROLLERİ ---
export function openPanel(id) {
    closePanels();
    const panel = document.getElementById(id);
    if (panel) {
        panel.style.display = 'block';
    } else {
        console.warn(`Panel bulunamadı: "${id}"`);
    }
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
        if (!saved.sceneId || !saved.inventory || !saved.flags) {
            console.error("Kayıt verisi bozuk, gerekli alanlar eksik.");
            alert('Kayıt verisi bozuk! Yeni Hikaye başlatılıyor...');
            startNewGame();
            return;
        }
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
                
                if (window.GameEngine) {
                    window.GameEngine.loadFromState(saved);
                } else {
                    console.error("GameEngine yüklenemedi, oyun başlatılamıyor.");
                }
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
