const FADE_DURATION = 1000;

export function transitionToGame(onReady) {
    const mainMenu = document.getElementById('mainMenu');
    if (!mainMenu) return;

    mainMenu.style.opacity = '0';
    setTimeout(() => {
        mainMenu.style.visibility = 'hidden';
        document.body.classList.add('in-game');

        const compass = document.getElementById('gameCompassHUD');
        if (compass) compass.style.display = 'block';

        const content = document.getElementById('gameContent');
        if (content) content.style.display = 'block';

        if (onReady) onReady();
    }, FADE_DURATION);
}

export function transitionToMenu() {
    const blackout = document.getElementById('blackout');
    if (!blackout) return;

    blackout.classList.add('active');
    setTimeout(() => {
        blackout.classList.remove('active');
        document.body.classList.remove('in-game');

        const compass = document.getElementById('gameCompassHUD');
        if (compass) compass.style.display = 'none';

        const content = document.getElementById('gameContent');
        if (content) content.style.display = 'none';

        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.visibility = 'visible';
            mainMenu.style.opacity = '1';
        }
    }, 1500);
}
