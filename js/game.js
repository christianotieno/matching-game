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
}

setInterval(addRandomTile, 1000);


function removeTiles(selectedTiles) {
    for (const tile of selectedTiles) {
        const { x, y } = tile;
        grid[x][y] = null;
    }
}

let selectedTiles = [];

app.view.addEventListener('click', (event) => {
    const x = Math.floor(event.clientX / tileSize);
    const y = Math.floor(event.clientY / tileSize);

    if (grid[x][y] !== null) {
        selectedTiles = [];
        findConnectedTiles(x, y, grid[x][y]);
        if (selectedTiles.length >= 3) {
            removeTiles(selectedTiles);
            applyGravity();
        }
    }
});

function findConnectedTiles(x, y, color) {
    if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return;
    if (grid[x][y] !== color || selectedTiles.some(tile => tile.x === x && tile.y === y)) return;

    selectedTiles.push({ x, y });

    findConnectedTiles(x + 1, y, color);
    findConnectedTiles(x - 1, y, color);
    findConnectedTiles(x, y + 1, color);
    findConnectedTiles(x, y - 1, color);
}

function removeTiles(tilesToRemove) {
    for (const tile of tilesToRemove) {
        const { x, y } = tile;
        stage.removeChildAt(y * gridWidth + x);
        grid[x][y] = null;
    }
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
