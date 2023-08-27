const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb
});

document.body.appendChild(app.view);

const stage = app.stage;

const gridWidth = 10;
const gridHeight = 20;
const tileSize = 40;
const colors = [0xFF0000, 0x00FF00, 0x0000FF];

const grid = [];

for (let x = 0; x < gridWidth; x++) {
    grid[x] = [];
    for (let y = 0; y < gridHeight; y++) {
        grid[x][y] = null;
    }
}

let selectedTiles = [];
let score = 0;
let linesAdded = 0;

const scoreText = new PIXI.Text('Score: 0', { fill: 0xffffff });
scoreText.position.set(10, 10);
stage.addChild(scoreText);

const pauseButton = new PIXI.Text('Pause', { fill: 0xffffff });
pauseButton.position.set(10, 40);
pauseButton.interactive = true;
pauseButton.on('click', () => {
    isPaused = !isPaused;
    pauseButton.text = isPaused ? 'Resume' : 'Pause';
});
stage.addChild(pauseButton);

const titleScreen = new PIXI.Container();
const titleText = new PIXI.Text('Tile Matching Game', { fill: 0xffffff, fontSize: 36 });
titleText.anchor.set(0.5);
titleText.position.set(app.view.width / 2, app.view.height / 2);
titleScreen.addChild(titleText);

const gameEndScreen = new PIXI.Container();
const endText = new PIXI.Text('Congratulations!\nYou Win!', { fill: 0xffffff, fontSize: 36 });
endText.anchor.set(0.5);
endText.position.set(app.view.width / 2, app.view.height / 2);
gameEndScreen.addChild(endText);

let isPaused = false;

function gameLoop(delta) {
    if (!isPaused) {
        applyGravity();

        const matchedTiles = findMatches();
        if (matchedTiles.length > 0) {
            removeTiles(matchedTiles);
            score += matchedTiles.length * 10;
        }

        addRandomTile();

        if (linesAdded >= 100) {
            stage.removeChild(titleScreen);
            stage.addChild(gameEndScreen);
            isPaused = true;
        }
    }

    scoreText.text = `Score: ${score}`;
    pauseButton.text = isPaused ? 'Resume' : 'Pause';
}

function applyGravity() {
    for (let x = 0; x < gridWidth; x++) {
        for (let y = gridHeight - 1; y >= 0; y--) {
            if (grid[x][y] !== null) {
                let fallDistance = 0;
                while (y + fallDistance + 1 < gridHeight && grid[x][y + fallDistance + 1] === null) {
                    fallDistance++;
                }
                if (fallDistance > 0) {
                    grid[x][y + fallDistance] = grid[x][y];
                    grid[x][y] = null;
                    const tileSprite = stage.getChildAt(y * gridWidth + x);
                    tileSprite.y += fallDistance * tileSize;
                }
            }
        }
    }
}

function findMatches() {
    const matchedTiles = [];

    // Iterate through the grid to find matching tiles
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            const color = grid[x][y];
            if (color !== null) {
                const connectedTiles = [];
                findConnectedTiles(x, y, color, connectedTiles);
                if (connectedTiles.length >= 3) {
                    matchedTiles.push(...connectedTiles);
                }
            }
        }
    }

    return matchedTiles;
}

function removeTiles(tilesToRemove) {
    for (const tile of tilesToRemove) {
        const { x, y } = tile;
        stage.removeChildAt(y * gridWidth + x);
        grid[x][y] = null;
    }
}

function addRandomTile() {
    const x = Math.floor(Math.random() * gridWidth);
    const color = Math.floor(Math.random() * 3);

    grid[x][gridHeight - 1] = color;

    const tileSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    tileSprite.tint = colors[color];
    tileSprite.width = tileSize;
    tileSprite.height = tileSize;
    tileSprite.position.set(x * tileSize, (gridHeight - 1) * tileSize);
    stage.addChild(tileSprite);

    linesAdded++;
    if (linesAdded >= 100) {
        stage.removeChild(titleScreen);
        stage.removeChild(gameEndScreen);
    }
}

app.view.addEventListener('click', (event) => {
    const canvasRect = app.view.getBoundingClientRect();
    const x = Math.floor((event.clientX - canvasRect.left) / tileSize);
    const y = Math.floor((event.clientY - canvasRect.top) / tileSize);

    if (grid[x][y] !== null) {
        selectedTiles = [];
        findConnectedTiles(x, y, grid[x][y]);
        if (selectedTiles.length >= 3) {
            removeTiles(selectedTiles);
            applyGravity();
        }
    }
})

function findConnectedTiles(x, y, color, connectedTiles) {
    if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return;
    if (grid[x][y] !== color || connectedTiles.some(tile => tile.x === x && tile.y === y)) return;

    connectedTiles.push({ x, y });

    findConnectedTiles(x + 1, y, color, connectedTiles);
    findConnectedTiles(x - 1, y, color, connectedTiles);
    findConnectedTiles(x, y + 1, color, connectedTiles);
    findConnectedTiles(x, y - 1, color, connectedTiles);
}

requestAnimationFrame(gameLoop);