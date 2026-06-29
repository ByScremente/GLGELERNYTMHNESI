import SteamBridge from './steam-bridge.js';
import { transitionToMenu } from './transition.js';

const ART = {
    yetimhane: `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="90" fill="#1a1430"/><rect x="0" y="0" width="160" height="55" fill="#241c3d"/><rect x="0" y="55" width="160" height="35" fill="#100c1d"/><rect x="128" y="10" width="14" height="14" fill="#e8e2c0"/><rect x="124" y="14" width="4" height="6" fill="#e8e2c0"/><rect x="142" y="14" width="4" height="6" fill="#e8e2c0"/><rect x="30" y="34" width="100" height="46" fill="#3a3050"/><rect x="30" y="34" width="100" height="6" fill="#4a3e64"/><rect x="22" y="26" width="116" height="8" fill="#241c3d"/><rect x="34" y="18" width="92" height="8" fill="#241c3d"/><rect x="46" y="10" width="68" height="8" fill="#241c3d"/><rect x="44" y="44" width="12" height="14" fill="#0c0a14" stroke="#1a1430" stroke-width="2"/><rect x="48" y="48" width="3" height="6" fill="#e8b339" opacity="0.8"/><rect x="74" y="44" width="12" height="14" fill="#0c0a14"/><rect x="104" y="44" width="12" height="14" fill="#0c0a14"/><rect x="70" y="56" width="20" height="24" fill="#0c0a14" stroke="#1a1430" stroke-width="2"/><rect x="74" y="50" width="12" height="9" fill="#5a4a30"/><rect x="76" y="52" width="8" height="5" fill="#2a2418"/><rect x="75" y="46" width="4" height="10" fill="#0c0a14"/><rect x="76" y="47" width="2" height="3" fill="#4ecca3" opacity="0.5"/><rect x="0" y="80" width="160" height="10" fill="#0a0814"/></svg>`,
    mezarlik: `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="90" fill="#0f0c1f"/><rect x="0" y="0" width="160" height="60" fill="#181430"/><rect x="20" y="10" width="10" height="10" fill="#e8e2c0" opacity="0.85"/><rect x="0" y="60" width="160" height="30" fill="#0a0814"/><rect x="0" y="52" width="160" height="6" fill="#5444a0" opacity="0.18"/><rect x="20" y="48" width="14" height="20" fill="#2a2444"/><rect x="23" y="44" width="8" height="6" fill="#2a2444"/><rect x="60" y="52" width="14" height="16" fill="#332c52"/><rect x="63" y="48" width="8" height="6" fill="#332c52"/><rect x="100" y="50" width="14" height="18" fill="#2a2444"/><rect x="103" y="46" width="8" height="6" fill="#2a2444"/><rect x="130" y="54" width="12" height="14" fill="#241f3d"/><rect x="42" y="56" width="12" height="14" fill="#3a3258"/><rect x="44" y="52" width="8" height="6" fill="#3a3258"/><rect x="46" y="60" width="4" height="3" fill="#e8b339" opacity="0.7"/><rect x="4" y="30" width="10" height="28" fill="#0a0814"/><rect x="146" y="26" width="10" height="32" fill="#0a0814"/></svg>`,
    mahzen: `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="90" fill="#0a0810"/><rect x="0" y="0" width="160" height="90" fill="#1d1626"/><rect x="72" y="8" width="4" height="26" fill="#a13030"/><rect x="62" y="24" width="24" height="4" fill="#a13030"/><rect x="20" y="58" width="4" height="10" fill="#e8e2c0"/><rect x="21" y="52" width="2" height="6" fill="#e8b339"/><rect x="34" y="60" width="4" height="8" fill="#e8e2c0"/><rect x="35" y="54" width="2" height="6" fill="#e8b339"/><rect x="122" y="58" width="4" height="10" fill="#e8e2c0"/><rect x="123" y="52" width="2" height="6" fill="#e8b339"/><rect x="136" y="60" width="4" height="8" fill="#e8e2c0"/><rect x="137" y="54" width="2" height="6" fill="#e8b339"/><circle cx="22" cy="50" r="14" fill="#e8b339" opacity="0.08"/><circle cx="124" cy="50" r="14" fill="#e8b339" opacity="0.08"/><rect x="74" y="44" width="12" height="30" fill="#000"/><rect x="76" y="38" width="8" height="8" fill="#000"/><rect x="70" y="60" width="20" height="14" fill="#000"/><rect x="0" y="78" width="160" height="12" fill="#050408"/><rect x="0" y="76" width="160" height="2" fill="#3a3258" opacity="0.5"/></svg>`,
    vapur_final: `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="90" fill="#0a0814"/><rect x="0" y="0" width="160" height="58" fill="#100c20"/><rect x="0" y="58" width="160" height="32" fill="#06070d"/><rect x="0" y="58" width="160" height="33" fill="#1a1f33"/><rect x="20" y="10" width="12" height="12" fill="#d8d2b8" opacity="0.7"/><rect x="60" y="48" width="50" height="14" fill="#1f1c30"/><rect x="68" y="38" width="10" height="12" fill="#1f1c30"/><rect x="70" y="40" width="3" height="4" fill="#e8b339" opacity="0.7"/><rect x="90" y="40" width="3" height="4" fill="#e8b339" opacity="0.7"/><rect x="100" y="32" width="4" height="18" fill="#15121f"/><rect x="76" y="40" width="10" height="8" fill="#0c0a14"/><rect x="78" y="41" width="6" height="6" fill="#4ecca3" opacity="0.55"/><rect x="79" y="43" width="1.5" height="1.5" fill="#0a0a0a"/><rect x="83" y="43" width="1.5" height="1.5" fill="#0a0a0a"/><rect x="0" y="60" width="36" height="6" fill="#1a1626"/><rect x="4" y="66" width="4" height="14" fill="#100c1d"/><rect x="26" y="66" width="4" height="14" fill="#100c1d"/><rect x="14" y="56" width="6" height="5" fill="#050308"/><rect x="13" y="53" width="2" height="3" fill="#050308"/><rect x="19" y="53" width="2" height="3" fill="#050308"/><rect x="14" y="61" width="2" height="3" fill="#050308"/><rect x="17" y="61" width="2" height="3" fill="#050308"/><rect x="13" y="57" width="1" height="1" fill="#4ecca3"/><rect x="60" y="62" width="50" height="3" fill="#1f1c30" opacity="0.3"/></svg>`
};

const TOTAL_PROGRESS_STEPS = 5;

const ITEM_LABELS = {
    'mum': 'Mum', 'çakmak': 'Çakmak', 'pusula': 'Pusula', 'yardım fişeği': 'Yardım Fişeği',
    'gizli harita': 'Gizli Harita', 'eski günlük': 'Eski Günlük', 'çocuk dosyaları': 'Çocuk Dosyaları',
    'ayin odası anahtarı': 'Ayin Odası Anahtarı', 'gizli belgeler': 'Gizli Belgeler'
};

const DEFAULT_INVENTORY = ['mum', 'çakmak', 'pusula', 'yardım fişeği'];

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

function createDefaultFlags() {
    return {
        haritaBulundu: false,
        gunlukOkundu: false,
        belgelerBulundu: false,
        anahtarBulundu: false,
        cocugunAkibetiOgrenildi: false,
        mahzenGorundu: false,
        hubVisits: 0,
        isNight: false,
    };
}

const GameEngine = (function () {
    let state = {
        sceneId: 'intro_1',
        inventory: [...DEFAULT_INVENTORY],
        flags: createDefaultFlags(),
        newItemFlash: null,
    };

    function addItem(item) {
        if (!state.inventory.includes(item)) {
            state.inventory.push(item);
            state.newItemFlash = item;
            showToast('+ ' + (ITEM_LABELS[item] || item));
        }
    }

    function hasItem(item) {
        return state.inventory.includes(item);
    }

    function showToast(msg) {
        const t = document.getElementById('toast');
        if (t) {
            t.textContent = msg;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 2400);
        }
    }

    const SCENES = {
        intro_1: {
            label: 'ÖNSÖZ', title: 'İsimsiz Mektup', progress: 1, forceDay: true,
            text: `Gazetecilik kariyerinin en sessiz dönemindesin. Editörün sana "ilginç ama önemsiz" diye iade ettiği haberlerin arasında, bir sabah kapının altından isimsiz bir zarf çıkar.\n\nEl yazısı titrek, mürekkep eski:\n\n"Kapının üzerindeki resmi bul. Harita seni gerçeğe götürecek."\n\nAdres yok. İmza yok. Sadece ıssız bir adanın koordinatları ve yıllar önce kapatılmış bir yetimhanenin adı: Aziz Lazarus Yetimhanesi.`,
            note: 'Bu hikaye seninle birlikte ilerleyecek. Her seçim bir kapı açar — bazıları seni gerçeğe, bazıları karanlığa götürür.',
            choices: [{ text: 'Çantanı hazırla ve vapura bin.', next: 'intro_2' }]
        },
        intro_2: {
            label: 'YOLCULUK', title: 'Issız Adaya Doğru', progress: 1,
            text: `Vapur seni adanın taş rıhtımına bırakır ve hemen geri döner — kaptan gece kalmayacağını söylemişti zaten, sormaya bile gerek kalmadı.\n\nÇantanda gerekli olabilecek her şey var: bir mum, bir çakmak, eski bir pusula, bir yardım fişeği. Önünde, ağaçların arasından zar zor görünen taş bir bina yükseliyor: Aziz Lazarus Yetimhanesi.\n\nRüzgar tuhaf bir şekilde sessiz. Sanki ada, nefesini tutuyor.`,
            choices: [{ text: 'Yetimhaneye doğru yürü.', next: 'yetimhane_1' }]
        },
        yetimhane_1: {
            label: 'YETİMHANE', title: 'Çatlak Duvarlar', progress: 2, art: 'yetimhane',
            text: `Yetimhane harabe halinde — çatı kısmen çökmüş, pencereler kırık. Ama içeriden, olmaması gereken bir ses geliyor: alçak, ritmik bir mırıltı. Şarkı mı, dua mı, anlayamıyorsun.\n\nKırık bir pencereden içeri göz attığın anda, camın ardında bir anlığına bir siluet belirir — uzun, hareketsiz, sonra yok olur. Kalbin hızlanır.`,
            choices: [
                { text: 'İçeriye doğru ilerle, sesi takip et.', next: 'mahzen' },
                { text: 'Önce dışarıdan binayı incele.', next: 'yetimhane_kapi' }
            ]
        },
        yetimhane_kapi: {
            label: 'YETİMHANE', title: 'Kapının Üzerindeki Resim', progress: 2,
            text: `Mektubu hatırlıyorsun: "Kapının üzerindeki resmi bul." Ana girişin üstünde, çatlamış bir çerçeve içinde solgun bir tablo asılı — yetimhanenin kurucusu olduğu yazılan bir rahip.\n\nTabloyu dikkatle çerçevesinden çıkarıyorsun. Arkasında, kurumuş tutkalla yapıştırılmış eski bir kağıt var: el çizimi bir harita.`,
            choices: [{ text: 'Haritayı al ve incele.', next: 'harita_bulundu' }]
        },
        harita_bulundu: {
            label: 'KEŞİF', title: 'Gizli Harita', progress: 2,
            text: `Harita kabaca çizilmiş ama net: adanın kritik noktaları işaretli.\n\n— Eski mezarlık\n— Kapalı mahzenler\n\nElin titriyor. Bu bir çocuk oyunu değil — biri, yıllar önce, birilerinin bunu bulmasını istemiş.`,
            onEnter: () => {
                state.flags.haritaBulundu = true;
                addItem('gizli harita');
            },
            choices: [{ text: 'Haritayı çantaya at ve adayı keşfet.', next: 'ada_hub' }]
        },
        ada_hub: {
            label: 'KEŞİF', title: 'Ada Patikaları', progress: 3,
            text: `Zaman hızla ilerliyor. Rüzgar sertleşti ve hava kararmaya başladı. Haritana göre adada gidebileceğin iki ana bölge var. Ne yapmak istersen hızlı olmalısın.`,
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
            text: `Yosun tutmuş mezar taşları arasında yürüyorsun. Dikkatini çeken büyük bir aile mezarlığının üzerinde bir demir anahtar ve eski bir defter duruyor. Birileri sanki onları buraya senin için bırakmış gibi.`,
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
            text: `Ağır demir kapı kapalı. Kapının üzerinde devasa bir antik kilit mekanizması var. Sadece doğru anahtara sahip olanlar buraya girebilir.`,
            onEnter: () => {
                state.flags.mahzenGorundu = true;
            },
            dynamicChoices: () => {
                const list = [];
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
            text: `Anahtar kilide tam oturuyor. İçerideki gizli dosyalarda çocukların aslında nereye gönderildiği yazıyor: Her şey kurgulanmış bir kaçış operasyonuydu! Sahile ulaşıp adadan uzaklaşan ilk vapura biniyorsun. Gerçek artık elinde.`,
            quote: '"Işık, en derin karanlığın içinden doğar."'
        },
        final_bad: {
            label: 'SON', title: 'Gölgede Kalanlar', progress: 5,
            isEnding: true, endingType: 'bad',
            text: `Yardım fişeği gökyüzünü kırmızıya boyuyor ama adanın derinliklerinden gelen o ritmik mırıltı birden çığlıklara dönüşüyor. Arkana baktığında gölgelerin etrafını sardığını görüyorsun. Sesler yaklaşırken her şey kararıyor...`,
            quote: '"Karanlık, sabırsız olanları ilk yutandır."'
        }
    };

    function updateDayCycle(scene) {
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
    }

    function updateCompass() {
        const compass = document.getElementById('compass');
        const needle = document.getElementById('compassNeedle');
        const compLabel = document.getElementById('compassLabel');

        const cData = COMPASS_DIRECTIONS[state.sceneId];
        if (!cData) return;

        if (needle) needle.style.transform = `translate(-50%, -100%) rotate(${cData.angle}deg)`;
        if (compLabel) compLabel.textContent = cData.label;

        if (state.flags.isNight && compass) {
            compass.classList.add('glitching');
            document.body.classList.add('is-glitching');
        } else if (compass) {
            compass.classList.remove('glitching');
            document.body.classList.remove('is-glitching');
        }
    }

    function updateProgressTrack(progress) {
        const progTrack = document.getElementById('progressTrack');
        if (!progTrack) return;

        progTrack.innerHTML = '';
        for (let i = 1; i <= TOTAL_PROGRESS_STEPS; i++) {
            const seg = document.createElement('div');
            seg.className = 'seg' + (i <= progress ? ' done' : '');
            progTrack.appendChild(seg);
        }
    }

    function buildSceneHTML(scene) {
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
            const bannerClass = scene.endingType === 'good' ? 'good' : 'bad';
            const bannerText = scene.endingType === 'good'
                ? 'BAŞARILI BAŞARIM: GERÇEĞE ULAŞILDI'
                : 'KÖTÜ SON: ADADA KAYBOLDUN';

            html += `<div class="ending-banner ${bannerClass}">${bannerText}</div>`;
            if (scene.quote) html += `<div class="final-quote">${scene.quote}</div>`;
            html += `<button class="restart-btn" onclick="GameEngine.restart()">HİKAYEYE YENİDEN BAŞLA</button>`;

            SteamBridge.unlockAchievement(scene.title);
        } else {
            html += `<div class="choices">`;
            const choicesList = scene.dynamicChoices ? scene.dynamicChoices() : scene.choices;
            if (choicesList) {
                choicesList.forEach((c, idx) => {
                    html += `<button class="choice-btn" onclick="GameEngine.makeChoice(${idx})">${c.text}</button>`;
                });
            }
            html += `</div>`;
        }

        return html;
    }

    function renderInventory() {
        const container = document.getElementById('inventoryItems');
        if (!container) return;

        container.innerHTML = '';
        state.inventory.forEach(item => {
            const chip = document.createElement('div');
            chip.className = 'item-chip' + (state.newItemFlash === item ? ' new' : '');
            chip.textContent = ITEM_LABELS[item] || item;
            container.appendChild(chip);
        });
        state.newItemFlash = null;
    }

    function renderScene() {
        const scene = SCENES[state.sceneId];
        if (!scene) return;

        if (scene.onEnter) scene.onEnter();

        updateDayCycle(scene);
        updateCompass();
        updateProgressTrack(scene.progress);

        document.getElementById('sceneRoot').innerHTML = buildSceneHTML(scene);
        renderInventory();

        SteamBridge.saveGame(state);
    }

    return {
        init() {
            state.sceneId = 'intro_1';
            state.inventory = [...DEFAULT_INVENTORY];
            state.flags = createDefaultFlags();
            renderScene();
            const vig = document.getElementById('vignette');
            if (vig) vig.classList.add('active');
        },
        makeChoice(index) {
            const scene = SCENES[state.sceneId];
            const choicesList = scene.dynamicChoices ? scene.dynamicChoices() : scene.choices;
            if (choicesList && choicesList[index]) {
                state.sceneId = choicesList[index].next;
                renderScene();
            }
        },
        loadFromState(savedState) {
            state = savedState;
            renderScene();
            const vig = document.getElementById('vignette');
            if (vig) vig.classList.add('active');
        },
        restart() {
            transitionToMenu();
        }
    };
})();

export default GameEngine;
