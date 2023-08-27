import { findConnectedTiles, removeTiles, applyGravity } from './gameLogic';

export function setupInputHandling(gameData) {
    const { app, grid, tileSize } = gameData;

    app.view.addEventListener('click', (event) => {
        const canvasRect = app.view.getBoundingClientRect();
        const x = Math.floor((event.clientX - canvasRect.left) / tileSize);
        const y = Math.floor((event.clientY - canvasRect.top) / tileSize);

        if (grid[x][y] !== null) {
            gameData.selectedTiles = [];
            findConnectedTiles(x, y, grid[x][y], gameData.selectedTiles, gameData);
            if (gameData.selectedTiles.length >= 3) {
                removeTiles(gameData.selectedTiles, gameData);
                applyGravity(gameData);
            }
        }
    });
}
