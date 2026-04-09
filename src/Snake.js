export class Snake {
    constructor(cellSize, startX, startY, stage) {
        this.cellSize = cellSize;
        this.stage = stage;

        this.container = new PIXI.Container();
        this.stage.addChild(this.container);

        this.segments = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];

        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
    }

    setHead(x, y) {
        this.segments[0].x = x;
        this.segments[0].y = y;
        this.draw();
    }

    setDirection(dir) {
        const opposite = { LEFT: 'RIGHT', RIGHT: 'LEFT', UP: 'DOWN', DOWN: 'UP' };
        if (dir !== opposite[this.direction]) this.nextDirection = dir;
    }

    move() {
        this.direction = this.nextDirection;

        const head = { ...this.segments[0] };
        switch (this.direction) {
            case 'LEFT': head.x -= 1; break;
            case 'RIGHT': head.x += 1; break;
            case 'UP': head.y -= 1; break;
            case 'DOWN': head.y += 1; break;
        }

        this.segments.unshift(head);
        this.segments.pop();

        this.draw();
    }

    getNextHeadPosition() {
        const head = this.segments[0];
        let x = head.x;
        let y = head.y;

        switch (this.direction) {
            case 'UP': y -= 1; break;
            case 'DOWN': y += 1; break;
            case 'LEFT': x -= 1; break;
            case 'RIGHT': x += 1; break;
        }
        return { x, y };
    }

    grow() {
        const tail = this.segments[this.segments.length - 1];
        this.segments.push({ x: tail.x, y: tail.y });
    }

    draw() {
        this.container.removeChildren();
        this.segments.forEach(seg => {
            const g = new PIXI.Graphics();
            g.beginFill(0x00ff00);
            g.drawRect(0, 0, this.cellSize, this.cellSize);
            g.endFill();
            g.x = seg.x * this.cellSize;
            g.y = seg.y * this.cellSize;
            this.container.addChild(g);
        });
    }
}