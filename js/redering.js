import * as PIXI from 'pixi.js';

export function setupRendering(gameData) {
    const { stage } = gameData;

    const scoreText = new PIXI.Text('Score: 0', { fill: 0xffffff });
    scoreText.position.set(10, 10);
    stage.addChild(scoreText);

    const pauseButton = new PIXI.Text('Pause', { fill: 0xffffff });
    pauseButton.position.set(10, 40);
    pauseButton.interactive = true;
    pauseButton.on('click', () => {
        gameData.isPaused = !gameData.isPaused;
        pauseButton.text = gameData.isPaused ? 'Resume' : 'Pause';
    });
    stage.addChild(pauseButton);

    const titleScreen = new PIXI.Container();
    const titleText = new PIXI.Text('Tile Matching Game', { fill: 0xffffff, fontSize: 36 });
    titleText.anchor.set(0.5);
    titleText.position.set(gameData.app.view.width / 2, gameData.app.view.height / 2);
    titleScreen.addChild(titleText);

    const gameEndScreen = new PIXI.Container();
    const endText = new PIXI.Text('Congratulations!\nYou Win!', { fill: 0xffffff, fontSize: 36 });
    endText.anchor.set(0.5);
    endText.position.set(gameData.app.view.width / 2, gameData.app.view.height / 2);
    gameEndScreen.addChild(endText);

    return { scoreText, pauseButton, titleScreen, gameEndScreen };
}

export function render(gameData, renderingData) {
    const { stage, grid, tileSize, colors } = gameData;
    const { scoreText } = renderingData;

    scoreText.text = `Score: ${gameData.score}`;

    stage.removeChildren();

    for (let x = 0; x < gameData.gridWidth; x++) {
        for (let y = 0; y < gameData.gridHeight; y++) {
            const color = grid[x][y];
            if (color !== null) {
                const tileSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
                tileSprite.tint = colors[color];
                tileSprite.width = tileSize;
                tileSprite.height = tileSize;
                tileSprite.position.set(x * tileSize, y * tileSize);
                stage.addChild(tileSprite);
            }
        }
    }
}
