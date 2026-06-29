import './styles.css';
import { openPanel, closePanels, startNewGame, loadSavedGame, initLightningEffect } from './ui-controller.js';
import GameEngine from './game-engine.js';

window.GameEngine = GameEngine;
window.openPanel = openPanel;
window.closePanels = closePanels;
window.startNewGame = startNewGame;
window.loadSavedGame = loadSavedGame;

initLightningEffect();
