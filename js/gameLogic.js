
const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const TILE_SIZE = 40;
const MAX_LINES_ADDED = 100;


export function initializeGame(app) {
    const stage = app.stage;

    const grid = createEmptyGrid();

    const tileSize = TILE_SIZE;
    
    const colors = [0xFF0000, 0x00FF00, 0x0000FF];
    
    let selectedTiles = [];
    let score = 0;
    let linesAdded = 0;
    let isPaused = false;

    return { app, stage, grid, colors, tileSize, selectedTiles, score, linesAdded, isPaused };
}

function createEmptyGrid() {
    const gridWidth = GRID_WIDTH;
    const gridHeight = GRID_HEIGHT;

    const grid = [];

    for (let x = 0; x < gridWidth; x++) {
        grid[x] = [];
        for (let y = 0; y < gridHeight; y++) {
            grid[x][y] = null;
        }
    }

    return grid;
}

export function applyGravity(gameData) {
    const { grid, gridWidth, gridHeight, tileSize, stage } = gameData;

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

export function findMatches(gameData) {
    const { grid, gridWidth, gridHeight } = gameData;
    const matchedTiles = [];

    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            const color = grid[x][y];
            if (color !== null) {
                const connectedTiles = [];
                findConnectedTiles(x, y, color, connectedTiles, gameData);
                if (connectedTiles.length >= 3) {
                    matchedTiles.push(...connectedTiles);
                }
            }
        }
    }

    return matchedTiles;
}

export function addRandomTile(gameData) {
    const { grid, gridHeight, colors, stage, tileSize } = gameData;

    const x = Math.floor(Math.random() * grid[0].length);
    const color = Math.floor(Math.random() * colors.length);

    grid[x][gridHeight - 1] = color;

    const tileSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    tileSprite.tint = colors[color];
    tileSprite.width = tileSize;
    tileSprite.height = tileSize;
    tileSprite.position.set(x * tileSize, (gridHeight - 1) * tileSize);
    stage.addChild(tileSprite);

    gameData.linesAdded++;
    if (gameData.linesAdded >= MAX_LINES_ADDED) {
        stage.removeChild(gameData.titleScreen);
        stage.removeChild(gameData.gameEndScreen);
    }
}

export function findConnectedTiles(x, y, color, gameData) {
    const { grid, gridWidth, gridHeight } = gameData;
    const connectedTiles = [];

    function recursiveFind(x, y) {
        if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return;
        if (grid[x][y] !== color || connectedTiles.some(tile => tile.x === x && tile.y === y)) return;

        connectedTiles.push({ x, y });

        recursiveFind(x + 1, y);
        recursiveFind(x - 1, y);
        recursiveFind(x, y + 1);
        recursiveFind(x, y - 1);
    }

    recursiveFind(x, y);
    return connectedTiles;
}

export function removeTiles(tilesToRemove, gameData) {
    const { stage, gridWidth, grid } = gameData;

    for (const tile of tilesToRemove) {
        const { x, y } = tile;
        stage.removeChildAt(y * gridWidth + x);
        grid[x][y] = null;
    }
}