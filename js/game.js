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
}

setInterval(addRandomTile, 1000);


function removeTiles(selectedTiles) {
    for (const tile of selectedTiles) {
        const { x, y } = tile;
        grid[x][y] = null;
    }
}

// Add event listener for clicks
app.view.addEventListener('click', (event) => {
    const x = Math.floor(event.clientX / tileSize);
    const y = Math.floor(event.clientY / tileSize);

    // Logic to find and remove matching tiles
});


function applyGravity() {
    for (let x = 0; x < gridWidth; x++) {
        for (let y = gridHeight - 1; y >= 0; y--) {
            if (grid[x][y] !== null) {
                // Logic to make the tile fall
            }
        }
    }
}

