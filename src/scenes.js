// --- OYUN SAHNELERİ VE VERİLER ---

export const ITEM_LABELS = {
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

export const COMPASS_DIRECTIONS = {
    intro_1: { angle: 0, label: 'KUZEY' },
    intro_2: { angle: 45, label: 'KUZEYDOĞU' },
    yetimhane_1: { angle: 90, label: 'DOĞU' },
    yetimhane_kapi: { angle: 180, label: 'GÜNEY' },
    harita_bulundu: { angle: 270, label: 'BATI' },
    ada_hub: { angle: 0, label: 'MERKEZ' },
    mezarlik: { angle: 315, label: 'KUZEYBATI' },
    mahzen: { angle: 135, label: 'GÜNEYDOĞU' },
    final_good: { angle: 90, label: 'DOĞU' },
    final_bad: { angle: 180, label: 'KAYIP' },
    final_twist: { angle: 270, label: 'GERİ DÖNÜŞ' }
};

export const ART = {
    yetimhane: `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="90" fill="#1a1430"/><rect x="0" y="0" width="160" height="55" fill="#241c3d"/><rect x="10" y="15" width="30" height="25" fill="#0a0810"/><rect x="50" y="15" width="30" height="25" fill="#0a0810"/><rect x="90" y="15" width="30" height="25" fill="#0a0810"/><rect x="120" y="15" width="30" height="25" fill="#0a0810"/><line x1="0" y1="60" x2="160" y2="60" stroke="#3d2e5f" stroke-width="2"/></svg>`,
    
    mezarlik: `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="90" fill="#0f0c1f"/><rect x="0" y="0" width="160" height="60" fill="#181430"/><polygon points="20,60 30,40 40,60" fill="#2a1f4a"/><polygon points="60,60 70,40 80,60" fill="#2a1f4a"/><polygon points="100,60 110,40 120,60" fill="#2a1f4a"/><line x1="0" y1="65" x2="160" y2="65" stroke="#1a1a2e" stroke-width="1"/></svg>`,
    
    mahzen: `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="90" fill="#0a0810"/><rect x="0" y="0" width="160" height="90" fill="#1d1626"/><rect x="72" y="8" width="16" height="30" fill="#3d3d5c" stroke="#5a4a7a" stroke-width="1"/><circle cx="80" cy="25" r="3" fill="#8a0303"/></svg>`,
    
    vapur_final: `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="90" fill="#0a0814"/><rect x="0" y="0" width="160" height="58" fill="#100c20"/><rect x="0" y="58" width="160" height="32" fill="#1a1a3e"/><polygon points="50,35 80,15 110,35" fill="#3a3a5a"/></svg>`
};

export const SCENES = {
    intro_1: {
        label: 'ÖNSÖZ',
        title: 'İsimsiz Mektup',
        progress: 1,
        forceDay: true,
        text: `Gazetecilik kariyerinin en sessiz dönemindesin. Editörün sana "ilginç ama önemsiz" diye iade ettiği haberlerin arasında, bir sabah kapının altından isimsiz bir zarf çıkar.

İçinde tek bir kağıt var. Adı yazılı değil. Sadece bu:

"Issız adada bir yetimhane var.
Orada kaybolan çocukları bul.
Kapının üzerindeki resmi bul.
Harita seni gerçeğe götürecek."

Mektubun geri kalanı çatlamış, okunamaz. Ama sesin titriyor ve ellerinde terleme başlıyor. Bunu yayınlasan, kariyerin kurtulur... ya da unutulmaya devam edersin.`,
        note: 'Bu hikaye seninle birlikte ilerleyecek. Her seçim bir kapı açar — bazıları seni gerçeğe, bazıları karanlığa götürür.',
        choices: [{ text: 'Çantanı hazırla ve vapura bin.', next: 'intro_2' }]
    },

    intro_2: {
        label: 'YOLCULUK',
        title: 'Issız Adaya Doğru',
        progress: 1,
        text: `Vapur seni adanın taş rıhtımına bırakır ve hemen geri döner — kaptan gece kalmayacağını söylemişti zaten, sormaya bile gerek kalmadı.

Çantanda gerekli olabilecek şeyler var: Bir mum. Çakmak. Eski bir pusula. Güvenlik için bir yardım fişeği. Başka ne gerekir ki?

Ada sessiz. Sadece rüzgar sesi ve uzaktan gelen, anlamadığın bir mırıltı...`,
        choices: [{ text: 'Yetimhaneye doğru yürü.', next: 'yetimhane_1' }]
    },

    yetimhane_1: {
        label: 'YETİMHANE',
        title: 'Çatlak Duvarlar',
        progress: 2,
        art: 'yetimhane',
        text: `Yetimhane harabe halinde — çatı kısmen çökmüş, pencereler kırık. Ama içeriden, olmaması gereken bir ses geliyor: alçak, ritmik bir mırıltı. Şarkı mı, dua mı, anlamadığın bir dil mi?

İki yol var sana: İçeriye doğru ilerlemek ve sesi takip etmek... ya da dışarıdan binayı, özellikle de kapıyı incelemek.`,
        choices: [
            { text: 'İçeriye doğru ilerle, sesi takip et.', next: 'mahzen' },
            { text: 'Önce dışarıdan binayı incele.', next: 'yetimhane_kapi' }
        ]
    },

    yetimhane_kapi: {
        label: 'YETİMHANE',
        title: 'Kapının Üzerindeki Resim',
        progress: 2,
        text: `Mektubu hatırlıyorsun: "Kapının üzerindeki resmi bul." Ana girişin üstünde, çatlamış bir çerçeve içinde solgun bir tablo asılı — yetimhanenin kurucusu olduğu yazılı, ancak yüzü kara mürekkeple karalanmış. 

Çerçevenin arkasında... bir harita. Eski, solmuş, ama okunabilir. Tüm adanın haritalanması, bazı yerleri işaretli.`,
        choices: [{ text: 'Haritayı al ve incele.', next: 'harita_bulundu' }]
    },

    harita_bulundu: {
        label: 'KEŞİF',
        title: 'Gizli Harita',
        progress: 2,
        text: `Harita kabaca çizilmiş ama net: adanın kritik noktaları işaretli.

— Eski mezarlık
— Kapalı mahzenler

Elin titriyor. Bu bir çocuk oyunu değil — biri, yıllar önce, yetimhaneyi haritaya döktü. Neden? Neyi gizlemek için?`,
        onEnter: (s) => {
            s.flags.haritaBulundu = true;
            return 'gizli harita';
        },
        choices: [{ text: 'Haritayı çantaya at ve adayı keşfet.', next: 'ada_hub' }]
    },

    ada_hub: {
        label: 'KEŞİF',
        title: 'Ada Patikaları',
        progress: 3,
        text: `Zaman hızla ilerliyor. Rüzgar sertleşti ve hava kararmaya başladı. Haritana göre adada gidebileceğin iki ana bölge var. Ne yapmak istersen hızlı olmalısın.`,
        onEnter: (s) => {
            s.flags.hubVisits++;
            if (s.flags.hubVisits >= 2) {
                s.flags.isNight = true;
            }
        },
        choices: [
            { text: 'Eski Mezarlık patikasına sap.', next: 'mezarlik' },
            { text: 'Yetimhanenin altındaki Mahzen Kapısına git.', next: 'mahzen' }
        ]
    },

    mezarlik: {
        label: 'MEZARLIK',
        title: 'Suskun Taşlar',
        progress: 4,
        art: 'mezarlik',
        text: `Yosun tutmuş mezar taşları arasında yürüyorsun. Dikkatini çeken büyük bir aile mezarlığının üzerinde bir demir anahtar ve eski bir defter duruyor. Birileri sanki onları orada bırakmasını istemiş gibi.

Defterin üzerinde: "Ayin Odası Anahtarı - Altındaki kapı açılacak"`,
        onEnter: (s) => {
            s.flags.gunlukOkundu = true;
            s.flags.anahtarBulundu = true;
            return ['eski günlük', 'ayin odası anahtarı'];
        },
        choices: [{ text: 'Bulduklarını alıp Merkez Patikaya dön.', next: 'ada_hub' }]
    },

    mahzen: {
        label: 'MAHZEN',
        title: 'Karanlık Merdivenler',
        progress: 4,
        art: 'mahzen',
        text: `Ağır demir kapı kapalı. Kapının üzerinde devasa bir antik kilit mekanizması var. Sadece doğru anahtara sahip olanlar buraya girebilir.`,
        onEnter: (s) => {
            s.flags.mahzenGorundu = true;
        },
        dynamicChoices: (s) => {
            let list = [];
            if (s.inventory.includes('ayin odası anahtarı')) {
                list.push({ text: 'Ayin Odası Anahtarını kullanarak kapıyı aç.', next: 'final_good' });
            } else {
                list.push({ text: 'Kapı kilitli. İncelemek için başka bir yol ara.', next: 'ada_hub' });
            }
            list.push({ text: 'Zorlamayı bırak ve risk alarak yardım fişeğini ateşle.', next: 'final_bad' });
            return list;
        }
    },

    final_good: {
        label: 'SON',
        title: 'Kayıp Gerçekler',
        progress: 5,
        art: 'vapur_final',
        isEnding: true,
        endingType: 'good',
        text: `Anahtar kilide tam oturuyor. İçerideki gizli dosyalarda çocukların aslında nereye gönderildiği yazıyor: Her şey kurgulanmış bir kaçış operasyonuydu! 

Sahile ulaşıp adadan çıktığında, bulduklarını yayınlıyorsun. Dünya haberler yapıyor. Çocuklar bulunuyor — hepsi yaşıyor, güvende.

Ama en garip kısım: Her zaman yanında, senin geri dönüşün için adı belirtilmemiş bir not vardı.

"Biliyordum bulacağını. Çocuklar özgür olacak."`,
        quote: '"Işık, en derin karanlığın içinden doğar."'
    },

    final_bad: {
        label: 'SON',
        title: 'Gölgede Kalanlar',
        progress: 5,
        isEnding: true,
        endingType: 'bad',
        text: `Yardım fişeği gökyüzünü kırmızıya boyuyor ama adanın derinliklerinden gelen o ritmik mırıltı birden çığlıklara dönüşüyor. Arkana baktığında gölgelerin etrafını sardığını görüyorsun.

Vapuru aramasına rağmen, kimse gelmiyor.

Ada, seni aldı. Artık senin de hikayensin — çocuklarla birlikte, karanlıkta.`,
        quote: '"Karanlık, sabırsız olanları ilk yutandır."'
    },

    final_twist: {
        label: 'SON',
        title: 'Adaya Dönüş',
        progress: 5,
        isEnding: true,
        endingType: 'twist',
        text: `Oyuncu adadan ayrıldığını sanır ama...

Vapurdan çıkarken iskelede siyah kediyi görürsün. Kedi birkaç saniye boyunca hareketsizce sana bakar ve sonra ortadan kaybolur.

Vapurun camında, yıllar önce ölen kayıp çocuğun solgun yüzü belirmiştir.

Çocuğun dudakları yavaşça hareket eder:

"Beni buldun... ama ben hâlâ özgür değilim."

Bir anda cam çatlar, ışıklar söner ve ekran kararmıştır.

Son yazı:

"Sen adadan ayrıldığını sandın... ama ada seni bırakmadı."`,
        quote: '"Gölgeler, bir kez içine girdiğinde, asla bırakmaz."'
    }
};
