import * as PIXI from 'pixi.js';
import { initializeGame } from './gameLogic.js';
import { setupRendering, render } from './rendering.js';
import { setupInputHandling } from './inputHandling.js';

const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb
});

document.body.appendChild(app.view);

const gameData = initializeGame(app);
setupRendering(gameData);
setupInputHandling(gameData);

function gameLoop(delta) {
    render(gameData);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
