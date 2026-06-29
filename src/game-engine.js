import { SteamBridge, openPanel, closePanels, startNewGame, loadSavedGame, initLightningEffect } from './ui-controller.js';
import { SCENES, ITEM_LABELS, COMPASS_DIRECTIONS, ART } from './scenes.js';

// --- OYUN MOTORU ---
class GameEngine {
    constructor() {
        this.state = {
            sceneId: 'intro_1',
            inventory: ['mum', 'çakmak', 'pusula', 'yardım fişeği'],
            flags: {
                haritaBulundu: false,
                gunlukOkundu: false,
                belgelerBulundu: false,
                anahtarBulundu: false,
                cocugunAkibetiOgrenildi: false,
                mahzenGorundu: false,
                hubVisits: 0,
                isNight: false,
            },
            newItemFlash: null,
        };
    }

    addItem(item) {
        if (!this.state.inventory.includes(item)) {
            this.state.inventory.push(item);
            this.state.newItemFlash = item;
            this.showToast('+ ' + (ITEM_LABELS[item] || item));
        }
    }

    hasItem(item) {
        return this.state.inventory.includes(item);
    }

    showToast(msg) {
        const t = document.getElementById('toast');
        if (t) {
            t.textContent = msg;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 2400);
        }
    }

    renderScene() {
        const scene = SCENES[this.state.sceneId];
        if (!scene) return;

        // Enter Hook Tetikleme
        if (scene.onEnter) {
            const result = scene.onEnter(this.state);
            if (result) {
                if (Array.isArray(result)) {
                    result.forEach(item => this.addItem(item));
                } else if (typeof result === 'string') {
                    this.addItem(result);
                }
            }
        }

        // Gece/Gündüz Döngüsü Kontrolü
        const body = document.body;
        const dayLabel = document.getElementById('dayLabel');
        if (scene.forceDay) {
            this.state.flags.isNight = false;
        }
        if (this.state.flags.isNight) {
            body.classList.add('is-night');
            if (dayLabel) dayLabel.textContent = "GECE";
        } else {
            body.classList.remove('is-night');
            if (dayLabel) dayLabel.textContent = "GÜNDÜZ";
        }

        // HUD - Pusula Güncelleme
        const compass = document.getElementById('compass');
        const needle = document.getElementById('compassNeedle');
        const compLabel = document.getElementById('compassLabel');

        if (COMPASS_DIRECTIONS[this.state.sceneId]) {
            const cData = COMPASS_DIRECTIONS[this.state.sceneId];
            if (needle) needle.style.transform = `translate(-50%, -100%) rotate(${cData.angle}deg)`;
            if (compLabel) compLabel.textContent = cData.label;
            if (this.state.flags.isNight && compass) {
                compass.classList.add('glitching');
                body.classList.add('is-glitching');
            } else if (compass) {
                compass.classList.remove('glitching');
                body.classList.remove('is-glitching');
            }
        }

        // Progress Track Oluşturma
        const progTrack = document.getElementById('progressTrack');
        if (progTrack) {
            progTrack.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                let seg = document.createElement('div');
                seg.className = 'seg' + (i <= scene.progress ? ' done' : '');
                progTrack.appendChild(seg);
            }
        }

        // HTML İçerik İnşası
        let html = '';
        
        if (scene.art && ART[scene.art]) {
            html += `<div class="illust-frame">${ART[scene.art]}</div>`;
        }

        html += `<div class="scene-label">${scene.label}</div>`;
        html += `<h2 class="scene-title">${scene.title}</h2>`;
        html += `<div class="scene-text fade-in">${scene.text}</div>`;

        if (scene.note) {
            html += `<div class="scene-note">${scene.note}</div>`;
        }

        // Son Ekran Değerlendirmesi
        if (scene.isEnding) {
            let bannerClass = scene.endingType === 'good' ? 'good' : scene.endingType === 'twist' ? 'twist' : 'bad';
            let bannerText = 
                scene.endingType === 'good' ? 'BAŞARILI BAŞARIM: GERÇEĞE ULAŞILDI' :
                scene.endingType === 'twist' ? 'GİZLİ SON: GÖLGELER KALDI' :
                'KÖTÜ SON: ADADA KAYBOLDUN';
            
            html += `<div class="ending-banner ${bannerClass}">${bannerText}</div>`;
            if (scene.quote) html += `<div class="final-quote">${scene.quote}</div>`;
            html += `<button class="restart-btn" onclick="window.gameEngine.restart()">HİKAYEYE YENİDEN BAŞLA</button>`;
            
            SteamBridge.unlockAchievement(scene.title);
        } else {
            // Seçenekleri Listeleme
            html += `<div class="choices">`;
            let choicesList = scene.dynamicChoices ? scene.dynamicChoices(this.state) : scene.choices;
            
            if (choicesList) {
                choicesList.forEach((c, idx) => {
                    html += `<button class="choice-btn" onclick="window.gameEngine.makeChoice(${idx})">${c.text}</button>`;
                });
            }
            html += `</div>`;
        }

        document.getElementById('sceneRoot').innerHTML = html;
        this.renderInventory();
        
        // Otomatik Kaydet
        SteamBridge.saveGame(this.state);
    }

    renderInventory() {
        const container = document.getElementById('inventoryItems');
        if (!container) return;
        container.innerHTML = '';
        this.state.inventory.forEach(item => {
            let chip = document.createElement('div');
            chip.className = 'item-chip' + (this.state.newItemFlash === item ? ' new' : '');
            chip.textContent = ITEM_LABELS[item] || item;
            container.appendChild(chip);
        });
        this.state.newItemFlash = null;
    }

    init() {
        this.state.sceneId = 'intro_1';
        this.state.inventory = ['mum', 'çakmak', 'pusula', 'yardım fişeği'];
        this.state.flags = {
            haritaBulundu: false,
            gunlukOkundu: false,
            belgelerBulundu: false,
            anahtarBulundu: false,
            cocugunAkibetiOgrenildi: false,
            mahzenGorundu: false,
            hubVisits: 0,
            isNight: false,
        };
        this.renderScene();
        const vig = document.getElementById('vignette');
        if (vig) vig.classList.add('active');
    }

    makeChoice(index) {
        const scene = SCENES[this.state.sceneId];
        let choicesList = scene.dynamicChoices ? scene.dynamicChoices(this.state) : scene.choices;
        if (choicesList && choicesList[index]) {
            this.state.sceneId = choicesList[index].next;
            this.renderScene();
        }
    }

    loadFromState(savedState) {
        this.state = savedState;
        this.renderScene();
        const vig = document.getElementById('vignette');
        if (vig) vig.classList.add('active');
    }

    restart() {
        this.init();
    }
}

// Global'e eriş
window.gameEngine = new GameEngine();

// Export için
export default GameEngine;
export { openPanel, closePanels, startNewGame, loadSavedGame, initLightningEffect, SteamBridge };
