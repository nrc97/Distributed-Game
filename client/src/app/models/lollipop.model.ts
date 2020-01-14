export class Lollipop {
    id: number;
    coordx: number;
    coordy: number;
    color: string;
    size: number;
    constructor(private ctx: CanvasRenderingContext2D) {
        this.id = 0;
        this.coordx = 100;
        this.coordy = 100;
        this.color = 'red';
        this.size = 20;
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.coordx + this.size / 2, this.coordy + this.size / 2, this.size / 2, 0, 2 * Math.PI);
        this.ctx.fill();
    }
}
