// --- OYUN MOTORU (MANTIKSAL AKIŞ) ---
import { SteamBridge } from './ui-controller.js';

const ART = {
  yetimhane: `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="90" fill="#1a1430"/></svg>`,
  mezarlik: `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="90" fill="#0f0c1f"/></svg>`,
  mahzen: `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="90" fill="#0a0810"/></svg>`,
  vapur_final: `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="90" fill="#0a0814"/></svg>`
};

const ITEM_LABELS = {
  'mum': 'Mum',
  'çakmak': 'Çakmak',
  'pusula': 'Pusula',
  'yardım fişeği': 'Yardım Fişeği',
  'gizli harita': 'Gizli Harita',
  'eski günlük': 'Eski Günlük',
  'çocuk dosyaları': 'Çocuk Dosyaları',
  'ayin odası anahtarı': 'Ayin Odası Anahtarı',
  'gizli belgeler': 'Gizli Belgeler'
};

const COMPASS_DIRECTIONS = {
  intro_1: { angle: 0, label: 'KUZEY' },
  intro_2: { angle: 45, label: 'KUZEYDOĞU' },
  yetimhane_1: { angle: 90, label: 'DOĞU' },
  yetimhane_kapi: { angle: 180, label: 'GÜNEY' },
  harita_bulundu: { angle: 270, label: 'BATI' },
  ada_hub: { angle: 0, label: 'MERKEZ' },
  mezarlik: { angle: 315, label: 'KUZEYBATI' },
  mahzen: { angle: 135, label: 'GÜNEYDOĞU' },
  final_good: { angle: 90, label: 'DOĞU' },
  final_bad: { angle: 180, label: 'KAYIP' }
};

function createInitialState() {
  return {
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

let state = createInitialState();

export function getState() {
  return state;
}

export function addItem(item) {
  if (!state.inventory.includes(item)) {
    state.inventory.push(item);
    state.newItemFlash = item;
    showToast('+ ' + (ITEM_LABELS[item] || item));
  }
}

export function hasItem(item) {
  return state.inventory.includes(item);
}

export function showToast(msg) {
  const t = document.getElementById('toast');
  if (t) {
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
  }
}

export function getItemLabel(item) {
  return ITEM_LABELS[item] || item;
}

export function getCompassDirection(sceneId) {
  return COMPASS_DIRECTIONS[sceneId] || null;
}

export function getScene(sceneId) {
  return SCENES[sceneId] || null;
}

export function getChoicesForScene(sceneId) {
  const scene = SCENES[sceneId];
  if (!scene) return [];
  return scene.dynamicChoices ? scene.dynamicChoices() : (scene.choices || []);
}

const SCENES = {
  intro_1: {
    label: 'ÖNSÖZ', title: 'İsimsiz Mektup', progress: 1, forceDay: true,
    text: `Gazetecilik kariyerinin en sessiz dönemindesin...`,
    note: 'Bu hikaye seninle birlikte ilerleyecek.',
    choices: [{ text: 'Çantanı hazırla ve vapura bin.', next: 'intro_2' }]
  },
  intro_2: {
    label: 'YOLCULUK', title: 'Issız Adaya Doğru', progress: 1,
    text: `Vapur seni adanın taş rıhtımına bırakır...`,
    choices: [{ text: 'Yetimhaneye doğru yürü.', next: 'yetimhane_1' }]
  },
  yetimhane_1: {
    label: 'YETİMHANE', title: 'Çatlak Duvarlar', progress: 2, art: 'yetimhane',
    text: `Yetimhane harabe halinde...`,
    choices: [
      { text: 'İçeriye doğru ilerle, sesi takip et.', next: 'mahzen' },
      { text: 'Önce dışarıdan binayı incele.', next: 'yetimhane_kapi' }
    ]
  },
  yetimhane_kapi: {
    label: 'YETİMHANE', title: 'Kapının Üzerindeki Resim', progress: 2,
    text: `Mektubu hatırlıyorsun...`,
    choices: [{ text: 'Haritayı al ve incele.', next: 'harita_bulundu' }]
  },
  harita_bulundu: {
    label: 'KEŞİF', title: 'Gizli Harita', progress: 2,
    text: `Harita kabaca çizilmiş ama net...`,
    onEnter: () => {
      state.flags.haritaBulundu = true;
      addItem('gizli harita');
    },
    choices: [{ text: 'Haritayı çantaya at ve adayı keşfet.', next: 'ada_hub' }]
  },
  ada_hub: {
    label: 'KEŞİF', title: 'Ada Patikaları', progress: 3,
    text: `Zaman hızla ilerliyor...`,
    onEnter: () => {
      state.flags.hubVisits++;
      if (state.flags.hubVisits >= 2) {
        state.flags.isNight = true;
      }
    },
    choices: [
      { text: 'Eski Mezarlık patikasına sap.', next: 'mezarlik' },
      { text: 'Yetimhanenin altındaki Mahzen Kapısına git.', next: 'mahzen' }
    ]
  },
  mezarlik: {
    label: 'MEZARLIK', title: 'Suskun Taşlar', progress: 4, art: 'mezarlik',
    text: `Yosun tutmuş mezar taşları arasında yürüyorsun...`,
    onEnter: () => {
      state.flags.gunlukOkundu = true;
      state.flags.anahtarBulundu = true;
      addItem('eski günlük');
      addItem('ayin odası anahtarı');
    },
    choices: [{ text: 'Bulduklarını alıp Merkez Patikaya dön.', next: 'ada_hub' }]
  },
  mahzen: {
    label: 'MAHZEN', title: 'Karanlık Merdivenler', progress: 4, art: 'mahzen',
    text: `Ağır demir kapı kapalı...`,
    onEnter: () => {
      state.flags.mahzenGorundu = true;
    },
    dynamicChoices: () => {
      let list = [];
      if (hasItem('ayin odası anahtarı')) {
        list.push({ text: 'Ayin Odası Anahtarını kullanarak kapıyı aç.', next: 'final_good' });
      } else {
        list.push({ text: 'Kapı kilitli. İncelemek için başka bir yol ara.', next: 'ada_hub' });
      }
      list.push({ text: 'Zorlamayı bırak ve risk alarak yardım fişeğini ateşle.', next: 'final_bad' });
      return list;
    }
  },
  final_good: {
    label: 'SON', title: 'Kayıp Gerçekler', progress: 5, art: 'vapur_final',
    isEnding: true, endingType: 'good',
    text: `Anahtar kilide tam oturuyor...`,
    quote: '"Işık, en derin karanlığın içinden doğar."'
  },
  final_bad: {
    label: 'SON', title: 'Gölgede Kalanlar', progress: 5,
    isEnding: true, endingType: 'bad',
    text: `Yardım fişeği gökyüzünü kırmızıya boyuyor...`,
    quote: '"Karanlık, sabırsız olanları ilk yutandır."'
  }
};

export function renderScene() {
  const scene = SCENES[state.sceneId];
  if (!scene) return;

  if (scene.onEnter) scene.onEnter(scene);

  const body = document.body;
  const dayLabel = document.getElementById('dayLabel');
  if (scene.forceDay) {
    state.flags.isNight = false;
  }
  if (state.flags.isNight) {
    body.classList.add('is-night');
    if (dayLabel) dayLabel.textContent = "GECE";
  } else {
    body.classList.remove('is-night');
    if (dayLabel) dayLabel.textContent = "GÜNDÜZ";
  }

  const compass = document.getElementById('compass');
  const needle = document.getElementById('compassNeedle');
  const compLabel = document.getElementById('compassLabel');

  if (COMPASS_DIRECTIONS[state.sceneId]) {
    const cData = COMPASS_DIRECTIONS[state.sceneId];
    if (needle) needle.style.transform = `translate(-50%, -100%) rotate(${cData.angle}deg)`;
    if (compLabel) compLabel.textContent = cData.label;
    if (state.flags.isNight && compass) {
      compass.classList.add('glitching');
      body.classList.add('is-glitching');
    } else if (compass) {
      compass.classList.remove('glitching');
      body.classList.remove('is-glitching');
    }
  }

  const progTrack = document.getElementById('progressTrack');
  if (progTrack) {
    progTrack.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      let seg = document.createElement('div');
      seg.className = 'seg' + (i <= scene.progress ? ' done' : '');
      progTrack.appendChild(seg);
    }
  }

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

  if (scene.isEnding) {
    let bannerClass = scene.endingType === 'good' ? 'good' : 'bad';
    let bannerText = scene.endingType === 'good' ? 'BAŞARILI BAŞARIM: GERÇEĞE ULAŞILDI' : 'KÖTÜ SON: ADADA KAYBOLDUN';
    html += `<div class="ending-banner ${bannerClass}">${bannerText}</div>`;
    if (scene.quote) html += `<div class="final-quote">${scene.quote}</div>`;
    html += `<button class="restart-btn" onclick="GameEngine.restart()">HİKAYEYE YENİDEN BAŞLA</button>`;
    SteamBridge.unlockAchievement(scene.title);
  } else {
    html += `<div class="choices">`;
    let choicesList = scene.dynamicChoices ? scene.dynamicChoices() : scene.choices;
    if (choicesList) {
      choicesList.forEach((c, idx) => {
        html += `<button class="choice-btn" onclick="GameEngine.makeChoice(${idx})">${c.text}</button>`;
      });
    }
    html += `</div>`;
  }

  const sceneRoot = document.getElementById('sceneRoot');
  if (sceneRoot) sceneRoot.innerHTML = html;
  renderInventory();
  SteamBridge.saveGame(state);
}

export function renderInventory() {
  const container = document.getElementById('inventoryItems');
  if (!container) return;
  container.innerHTML = '';
  state.inventory.forEach(item => {
    let chip = document.createElement('div');
    chip.className = 'item-chip' + (state.newItemFlash === item ? ' new' : '');
    chip.textContent = ITEM_LABELS[item] || item;
    container.appendChild(chip);
  });
  state.newItemFlash = null;
}

export function init() {
  state = createInitialState();
  renderScene();
  const vig = document.getElementById('vignette');
  if (vig) vig.classList.add('active');
}

export function makeChoice(index) {
  const scene = SCENES[state.sceneId];
  let choicesList = scene.dynamicChoices ? scene.dynamicChoices() : scene.choices;
  if (choicesList && choicesList[index]) {
    state.sceneId = choicesList[index].next;
    renderScene();
  }
}

export function loadFromState(savedState) {
  state = savedState;
  renderScene();
  const vig = document.getElementById('vignette');
  if (vig) vig.classList.add('active');
}

export function restart() {
  const bo = document.getElementById('blackout');
  if (bo) {
    bo.classList.add('active');
    setTimeout(() => {
      bo.classList.remove('active');
      document.body.classList.remove('in-game');
      const compassHUD = document.getElementById('gameCompassHUD');
      if (compassHUD) compassHUD.style.display = 'none';
      const gameContent = document.getElementById('gameContent');
      if (gameContent) gameContent.style.display = 'none';
      const mainMenu = document.getElementById('mainMenu');
      if (mainMenu) {
        mainMenu.style.visibility = 'visible';
        mainMenu.style.opacity = '1';
      }
    }, 1500);
  }
}

export { ART, ITEM_LABELS, COMPASS_DIRECTIONS, SCENES, createInitialState };
