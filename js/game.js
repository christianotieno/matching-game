const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xAAAAAA,
});
document.body.appendChild(app.view);

const TILE_WIDTH = 50;
const TILE_HEIGHT = 50;
const TILE_COLORS_ARRAY = [0xFF0000, 0x00FF00, 0x0000FF];

const NUM_ROWS = Math.floor(app.screen.height / TILE_HEIGHT);
const NUM_COLS = Math.floor(app.screen.width / TILE_WIDTH);

const gameContainer = new PIXI.Container();
app.stage.addChild(gameContainer);

const tileGrid = Array.from({ length: NUM_ROWS }, () => []);

function createTile(color, borderColor = 0x000000) {
    const tile = new PIXI.Graphics();
    tile.lineStyle(2, borderColor);
    tile.beginFill(color);
    tile.drawRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
    tile.endFill();
    return tile;
}

function addInitialRows() {
    for (let row = 0; row < NUM_ROWS; row++) {
        addRandomRow(row);
    }
}

function addRandomRow(row) {
    const newRow = [];
    for (let col = 0; col < NUM_COLS; col++) {
        const color = TILE_COLORS_ARRAY[Math.floor(Math.random() * TILE_COLORS_ARRAY.length)];
        const tile = createTile(color);
        tile.x = col * TILE_WIDTH;
        tile.y = row * TILE_HEIGHT;
        gameContainer.addChild(tile);
        newRow.push({ sprite: tile, color: color });
    }
    tileGrid[row] = newRow;
}

addInitialRows();

gameContainer.interactive = true;
gameContainer.on('click', onClick);

function onClick(event) {
    const { x, y } = event.data.global;
    const col = Math.floor(x / TILE_WIDTH);
    const row = Math.floor(y / TILE_HEIGHT);

    if (row >= 0 && row < NUM_ROWS && col >= 0 && col < NUM_COLS) {
        const targetColor = tileGrid[row][col].color;
        if (targetColor !== undefined && targetColor !== -1) {
            removeAdjacentTiles(row, col, targetColor);
            clearColumns();
        }
    }
}


function clearColumns() {
    for (let col = 0; col < NUM_COLS; col++) {
        let isColumnFull = true;
        for (let row = 0; row < NUM_ROWS; row++) {
            if (tileGrid[row][col].color !== -1) {
                isColumnFull = false;
                break;
            }
        }
        if (isColumnFull) {
            for (let row = 0; row < NUM_ROWS; row++) {
                const tile = tileGrid[row][col].sprite;
                if (tile.visible) {
                    gameContainer.removeChild(tile);
                }
                tileGrid[row][col].color = -1;
            }
        }
    }
}

function clearColumns() {
    for (let col = 0; col < NUM_COLS; col++) {
        let isColumnFull = true;
        for (let row = 0; row < NUM_ROWS; row++) {
            if (tileGrid[row][col].color !== -1) {
                isColumnFull = false;
                break;
            }
        }
        if (isColumnFull) {
            for (let row = 0; row < NUM_ROWS; row++) {
                const tile = tileGrid[row][col].sprite;
                if (tile.visible) {
                    gameContainer.removeChild(tile); 
                }
                tileGrid[row][col].color = -1;
            }
        }
    }
}


function removeAdjacentTiles(row, col, targetColor) {
    if (row < 0 || row >= NUM_ROWS || col < 0 || col >= NUM_COLS || tileGrid[row][col].color !== targetColor) {
        return;
    }

    const tile = tileGrid[row][col].sprite;
    tile.visible = false;
    tileGrid[row][col].color = -1;

    removeAdjacentTiles(row + 1, col, targetColor);
    removeAdjacentTiles(row - 1, col, targetColor);
    removeAdjacentTiles(row, col + 1, targetColor);
    removeAdjacentTiles(row, col - 1, targetColor);
}