import { initializeGame } from './gameLogic.js';
import { setupRendering, render } from './rendering.js';
import { setupInputHandling } from './inputHandling.js';

class GameApp {
    constructor(app) {
        this.app = app;
        this.gameData = initializeGame(app);
        this.setupGame();
    }

    setupGame() {
        setupRendering(this.gameData);
        setupInputHandling(this.gameData);
    }

    setupGameLoop() {
        this.app.ticker.add((delta) => {
            render(this.gameData);
        });
    }
}

const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb
});

document.body.appendChild(app.view);

new GameApp(app);
