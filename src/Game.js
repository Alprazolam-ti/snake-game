import { Food } from './Food.js';
import { Snake } from './Snake.js';

export class Game {
    constructor(app, mode, updateScore) {
        this.app = app;
        this.gridSize = 20;
        this.totalSize = this.gridSize + 2;
        this.cellSize = this.app.view.width / this.totalSize;
        this.snake = null;
        this.food = null;
        this.walls = []; //In a good way i need to divide walls into 2 types, but I won't do it
        this.mode = mode;
        this.updateScore = updateScore;
        this.interval = 300;
        this.elapsed = 0;

        this.currentScore = 0;

        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;

        this.gameLoop = null;
        this.handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp': this.snake.setDirection('UP'); break;
                case 'ArrowDown': this.snake.setDirection('DOWN'); break;
                case 'ArrowLeft': this.snake.setDirection('LEFT'); break;
                case 'ArrowRight': this.snake.setDirection('RIGHT'); break;
            }
        };
    }

    update(delta) {
        this.elapsed += this.app.ticker.deltaMS;

        if (this.elapsed >= this.interval) {
            this.snake.move();
            this.checkCollision();
            this.elapsed = 0;
        }
    }

    start() {
        this.updateScore(this.currentScore, this.bestScore);
        this.snake = new Snake(this.cellSize, 5, 10, this.app.stage);

        this.createWalls();

        if (this.mode !== 'Portal') {
            this.food = new Food(
                this.cellSize,
                Math.floor(Math.random() * this.gridSize) + 1,
                Math.floor(Math.random() * this.gridSize) + 1
            );
            this.app.stage.addChild(this.food.graphics);
        }

        if (this.mode === 'Portal') {
            let pos1, pos2;

            do {
                pos1 = { x: Math.floor(Math.random() * this.gridSize) + 1, y: Math.floor(Math.random() * this.gridSize) + 1 };
            } while (this.snake.segments.some(s => s.x === pos1.x && s.y === pos1.y));

            do {
                pos2 = { x: Math.floor(Math.random() * this.gridSize) + 1, y: Math.floor(Math.random() * this.gridSize) + 1 };
            } while (this.snake.segments.some(s => s.x === pos2.x && s.y === pos2.y) || (pos2.x === pos1.x && pos2.y === pos1.y));

            this.food1 = new Food(this.cellSize, pos1.x, pos1.y);
            this.food2 = new Food(this.cellSize, pos2.x, pos2.y);
            this.app.stage.addChild(this.food1.graphics);
            this.app.stage.addChild(this.food2.graphics);
        }

        window.addEventListener('keydown', this.handleKeyDown);
        this.app.ticker.add(this.update, this);
    }

    createWalls() {
        if (this.wallGraphics) {
            this.app.stage.removeChild(this.wallGraphics);
        }

        this.walls = [];

        for (let x = 0; x < this.totalSize; x++) {
            this.walls.push({ x: x, y: 0 });
            this.walls.push({ x: x, y: this.totalSize - 1 });
        }

        for (let y = 1; y < this.totalSize - 1; y++) {
            this.walls.push({ x: 0, y: y });
            this.walls.push({ x: this.totalSize - 1, y: y });
        }

        this.wallGraphics = new PIXI.Container();
        this.app.stage.addChild(this.wallGraphics);

        this.walls.forEach(pos => {
            const g = new PIXI.Graphics();
            g.beginFill(0xffa500);
            g.drawRect(0, 0, this.cellSize, this.cellSize);
            g.endFill();
            g.x = pos.x * this.cellSize;
            g.y = pos.y * this.cellSize;
            this.wallGraphics.addChild(g);
        });
    }

    checkCollision() {
        const head = this.snake.segments[0];

        if (this.mode !== 'God' && this.walls.some(w => w.x === head.x && w.y === head.y)) {
            this.gameOver();
            return;
        }

        if ((this.mode === 'Classic' || this.mode === 'Walls' || this.mode === 'Speed') &&
            this.walls.some(w => w.x === head.x && w.y === head.y)) {
            this.gameOver();
            return;
        }

        if ((this.mode === 'Classic' || this.mode === 'Walls' || this.mode === 'Speed') &&
            this.snake.segments.slice(1).some(seg => seg.x === head.x && seg.y === head.y)) {
            this.gameOver();
            return;
        }

        if (this.mode === 'God') {
            if (head.x < 1) this.snake.setHead(this.gridSize, head.y);
            if (head.x > this.gridSize) this.snake.setHead(1, head.y);
            if (head.y < 1) this.snake.setHead(head.x, this.gridSize);
            if (head.y > this.gridSize) this.snake.setHead(head.x, 1);
        }

        if (this.mode === 'Portal') {
            const head = this.snake.segments[0];

            if (head.x === this.food1.x && head.y === this.food1.y) {
                this.snake.setHead(this.food2.x, this.food2.y);
                this.snake.grow();
                this.currentScore += 1;
                if (this.currentScore > this.bestScore) this.bestScore = this.currentScore;
                this.updateScore(this.currentScore, this.bestScore);
                this.food1.respawn(this.gridSize, this.snake.segments, this.walls);
                this.food2.respawn(this.gridSize, this.snake.segments, this.walls);

                return;
            }
            else if (head.x === this.food2.x && head.y === this.food2.y) {
                this.snake.setHead(this.food1.x, this.food1.y);
                this.snake.grow();
                this.currentScore += 1;
                if (this.currentScore > this.bestScore) this.bestScore = this.currentScore;
                this.updateScore(this.currentScore, this.bestScore);
                this.food1.respawn(this.gridSize, this.snake.segments, this.walls);
                this.food2.respawn(this.gridSize, this.snake.segments, this.walls);

                return;
            }
        }

        if (this.mode !== 'Portal' && head.x === this.food.x && head.y === this.food.y) {
            this.snake.grow();
            this.currentScore += 1;

            if (this.currentScore > this.bestScore) {
                this.bestScore = this.currentScore;
                localStorage.setItem('bestScore', this.bestScore);
            }

            this.updateScore(this.currentScore, this.bestScore);

            if (this.mode === 'Speed') {
                this.interval *= 0.9;
            }

            if (this.mode === 'Walls') {
                this.addRandomWall();
            }

            this.food.respawn(this.gridSize, this.snake.segments, this.walls);
        }

    }

    gameOver() {
        this.app.ticker.remove(this.update, this);
        window.removeEventListener('keydown', this.handleKeyDown);
        alert('Game Over!');
    }

    addRandomWall() {
        let x, y;
        do {
            x = Math.floor(Math.random() * this.gridSize) + 1;
            y = Math.floor(Math.random() * this.gridSize) + 1;
        } while (this.snake.segments.some(s => s.x === x && s.y === y) ||
        (this.food && this.food.x === x && this.food.y === y) ||
            this.walls.some(w => w.x === x && w.y === y));

        this.walls.push({ x, y });
        const g = new PIXI.Graphics();
        g.beginFill(0xffa500);
        g.drawRect(0, 0, this.cellSize, this.cellSize);
        g.endFill();
        g.x = x * this.cellSize;
        g.y = y * this.cellSize;
        this.wallGraphics.addChild(g);
    }
}