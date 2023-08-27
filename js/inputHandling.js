import { findConnectedTiles, removeTiles, applyGravity } from './gameLogic';

function calculateGridPosition(event, tileSize) {
    const canvasRect = event.target.getBoundingClientRect();
    const x = Math.floor((event.clientX - canvasRect.left) / tileSize);
    const y = Math.floor((event.clientY - canvasRect.top) / tileSize);
    return { x, y };
}

function handleClick(event, gameData) {
    const { grid, selectedTiles } = gameData;
    const { x, y } = calculateGridPosition(event, gameData.tileSize);

    if (grid[x][y] !== null) {
        selectedTiles.length = 0;
        findConnectedTiles(x, y, grid[x][y], selectedTiles, gameData);
        if (selectedTiles.length >= 3) {
            removeTiles(selectedTiles, gameData);
            applyGravity(gameData);
        }
    }
}

export function setupInputHandling(gameData) {
    gameData.app.view.addEventListener('click', (event) => {
        handleClick(event, gameData);
    });
}
