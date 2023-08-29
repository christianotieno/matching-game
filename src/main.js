import * as PIXI from 'pixi.js';

const TILE_COLORS_ARRAY = [
    0xFF0000, // Red
    0x00FF00, // Green
    0x0000FF, // Blue
];

class GameApp {
    constructor() {
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0xAAAAAA,
        });

        document.body.appendChild(this.app.view);

        this.initialize();
    }

    initialize() {
        this.playScene = new PlayScene(this.app);
    }
}

class PlayScene {
    constructor(app) {
        this.app = app;
        this.tileSize = 50;
        this.score = 0;
        this.gridWidth = Math.floor(app.screen.width / this.tileSize);
        this.gridHeight = Math.floor(app.screen.height / this.tileSize);

        this.scoreText = new PIXI.Text(`Score: ${this.score}`, { fontSize: 24, fill: 0xFFFFFF });
        this.scoreText.position.set(10, 10);
        this.app.stage.addChild(this.scoreText);

        this.score = 0;
        this.isPaused = true; 
        this.gameOver = false;
        this.playTime = 0; 

        this.startButton = this.createButton("Start", 10, 50);
        this.pauseButton = this.createButton("Pause", 10, 100);
        this.endButton = this.createButton("End", 10, 150);
        this.restartButton = this.createButton("Restart", 10, 200);

        this.timerText = new PIXI.Text(`Time: ${this.playTime}`, { fontSize: 24, fill: 0xFFFFFF });
        this.timerText.anchor.set(1, 0); 
        this.timerText.position.set(this.app.screen.width - 10, 10); 
        this.app.stage.addChild(this.timerText);

        this.gameContainer = new PIXI.Container();
        this.tileGrid = Array.from({ length: this.gridHeight }, () => []);

        this.app.stage.addChild(this.gameContainer);

        this.addInitialRows();

        this.gameContainer.interactive = true;
        this.gameContainer.on('click', this.onClick.bind(this));
    }

    updateTimer() {
        this.playTime++;
        this.timerText.text = `Time: ${this.playTime}`;
    }

    createTile(color, borderColor = 0x000000) {
        const tile = new PIXI.Graphics();
        tile.lineStyle(2, borderColor);
        tile.beginFill(color);
        tile.drawRect(0, 0, this.tileSize, this.tileSize);
        tile.endFill();
        return tile;
    }

    createButton(label, x, y) {
        const button = new PIXI.Text(label, {fontSize: 24, fill: 0xFFFFFF});
        button.position.set(x,y);
        button.interactive = true;
        button.buttonMode = true;
        button.on("pointerdown", () => this.handleButtonClick(label));
        this.app.stage.addChild(button);
        return button;
    }

    handleButtonClick(label) {
        switch (label) {
            case "Start":
                this.startGame();
                break;
            case "Pause":
                this.togglePause();
                break;
            case "Restart":
                this.restartGame();
                break;
            case "End":
                this.endGame();
                break;
        }
    }

    startGame() {
        if (!this.isPaused || this.gameOver) return;

        this.isPaused = false;
        this.startButton.visible = false;
        this.restartButton.visible = false;
        this.pauseButton.visible = true; 
        this.endButton.visible = true; 

        this.playTime = 0;
        this.timerInterval = setInterval(() => this.updateTimer(), 1000); 

        this.clearTileGrid();
        this.addInitialRows();
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }

    restartGame() {
        this.isPaused = false; 
        this.gameOver = false; 
        this.playTime = 0; 

        this.restartButton.visible = false;

        this.timerText.text = `Time: ${this.playTime}`;

        this.clearTileGrid();
        this.addInitialRows();
    }

    endGame() {
        this.gameOver = true;
        this.isPaused = true;
        
  
        this.pauseButton.visible = false;
        this.endButton.visible = false;

        this.restartButton.visible = true;

        clearInterval(this.timerInterval);

        const endGameText = new PIXI.Text("Game Over", { fontSize: 36, fill: 0xFF0000 });
        endGameText.anchor.set(0.5);
        endGameText.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
        this.app.stage.addChild(endGameText);
    }

    addInitialRows() {
        const startRow = Math.floor(this.gridHeight / 2);
        for (let row = startRow; row < this.gridHeight; row++) {
            this.addRandomRow(row);
        }
    }

    addRandomRow(row) {
        const newRow = [];
        for (let col = 0; col < this.gridWidth; col++) {
            const color = TILE_COLORS_ARRAY[Math.floor(Math.random() * TILE_COLORS_ARRAY.length)];
            const tile = this.createTile(color);
            tile.x = col * this.tileSize;
            tile.y = row * this.tileSize;
            this.gameContainer.addChild(tile);
            newRow.push({ sprite: tile, color: color, posY: row }); 
        }
        this.tileGrid[row] = newRow;
    }

    onClick(event) {
        const { x, y } = event.data.global;
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);

        if (row >= 0 && row < this.gridHeight && col >= 0 && col < this.gridWidth) {
            const targetColor = this.tileGrid[row][col].color;
            if (targetColor !== undefined && targetColor !== -1) {
                this.removeAdjacentTiles(row, col, targetColor);
                this.clearColumns();
            }
        }
    }

    clearColumns() {
        const tilesToFall = [];

        for (let col = 0; col < this.gridWidth; col++) {
            let emptySpaces = 0;
            const tilesInColumn = [];

            for (let row = this.gridHeight - 1; row >= 0; row--) {
                const tile = this.tileGrid[row][col].sprite;

                if (this.tileGrid[row][col].color === -1) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    tilesInColumn.push({ tile, originalRow: row });
                }
            }

            tilesToFall[col] = tilesInColumn;
        }

        this.animateTilesFalling(tilesToFall);
    }

    animateTilesFalling(tilesToFall) {
        const fallingSpeed = 5;
        const tileSize = this.tileSize;
        let framesPassed = 0;

        const animation = () => {
            if (framesPassed >= tileSize / fallingSpeed) {
                this.app.ticker.remove(animation);

                // After falling animation is complete, update the tileGrid with new positions
                tilesToFall.forEach((column, col) => {
                    column.forEach(({ tile, originalRow }) => {
                        const newRow = originalRow + column.length;
                        const newY = newRow * tileSize;
                        tile.y = newY;
                        this.tileGrid[newRow][col] = { sprite: tile, color: tile.color, posY: newRow };
                    });
                });
            }

            tilesToFall.forEach((column, col) => {
                column.forEach(({ tile, originalRow }) => {
                    if (framesPassed >= (this.gridHeight - originalRow) * tileSize / fallingSpeed) {
                        const newY = (originalRow + column.length) * tileSize;
                        tile.y = newY - (this.gridHeight - originalRow) * tileSize + framesPassed * fallingSpeed;
                    }
                });
            });

            framesPassed++;
        };

        this.app.ticker.add(animation);
    }

    removeAdjacentTiles(row, col, targetColor) {
        if (row < 0 || row >= this.gridHeight || col < 0 || col >= this.gridWidth || this.tileGrid[row][col].color !== targetColor) {
            return;
        }

        const tile = this.tileGrid[row][col].sprite;
        tile.visible = false;
        this.tileGrid[row][col].color = -1;

        this.removeAdjacentTiles(row + 1, col, targetColor);
        this.removeAdjacentTiles(row - 1, col, targetColor);
        this.removeAdjacentTiles(row, col + 1, targetColor);
        this.removeAdjacentTiles(row, col - 1, targetColor);

        if (tile.visible === false) {
            this.score += 10; 
            this.updateScoreText(); 
        }
    }

    updateScoreText() {
        this.scoreText.text = `Score: ${this.score}`;
    }
}

const appInstance = new GameApp();
