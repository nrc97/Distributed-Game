export class Player {
    id: number;
    coordx: number;
    coordy: number;
    color: string;
    size: number;
    constructor(private ctx: CanvasRenderingContext2D) {
        this.id = 0;
        this.coordx = 0;
        this.coordy = 0;
        this.color = 'red';
        this.size = 20;
    }

    moveRight() {
        if (this.coordx + 20 < this.ctx.canvas.width) {
            this.ctx.clearRect(this.coordx, this.coordy, this.size, this.size);
            this.coordx += this.size;
            this.draw();
        }
    }

    moveLeft() {
        if (this.coordx - 20 >= 0) {
            this.ctx.clearRect(this.coordx, this.coordy, this.size, this.size);
            this.coordx -= this.size;
            this.draw();
        }
    }

    moveUp() {
        if (this.coordy - 20 >= 0) {
            this.ctx.clearRect(this.coordx, this.coordy, this.size, this.size);
            this.coordy -= this.size;
            this.draw();
        }
    }

    moveDown() {
        if (this.coordy + 20 < this.ctx.canvas.height) {
            this.ctx.clearRect(this.coordx, this.coordy, this.size, this.size);
            this.coordy += this.size;
            this.draw();
        }
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.coordx, this.coordy, this.size, this.size);
    }
}
