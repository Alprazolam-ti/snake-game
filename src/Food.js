export class Food {
    constructor(cellSize, x, y) {
        this.cellSize = cellSize;
        this.x = x;
        this.y = y;

        this.graphics = new PIXI.Graphics();
        this.draw();
    }

    draw() {
        this.graphics.clear();
        this.graphics.beginFill(0xff0000);
        this.graphics.drawRect(0, 0, this.cellSize, this.cellSize);
        this.graphics.endFill();

        this.graphics.x = this.x * this.cellSize;
        this.graphics.y = this.y * this.cellSize;
    }

    respawn(gridSize, snakeSegments, walls = []) {
        let x, y;
        do {
            x = Math.floor(Math.random() * gridSize) + 1;
            y = Math.floor(Math.random() * gridSize) + 1;
        } while (snakeSegments.some(s => s.x === x && s.y === y) || walls.some(w => w.x === x && w.y === y));
        this.x = x;
        this.y = y;
        this.draw();
    }
}