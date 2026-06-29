const STORAGE_KEY = "golgelerin_yetimhanesi_save";

const SteamBridge = {
    saveGame(stateData) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateData));
        console.log("Steam Cloud: Oyun durumu yerel belleğe yedeklendi.");
    },
    loadGame() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    },
    unlockAchievement(name) {
        console.log(`Steam API: Başarım Açıldı -> [${name}]`);
    }
};

export default SteamBridge;
