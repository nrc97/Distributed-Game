import { Player } from './player.model';
import { Lollipop } from './lollipop.model';

export class Canvas {
    id: number;
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
    constructor() {
        this.id = 1;
        this.height = 400;
        this.width = 600;
    }
    cleanCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    drawPlayers(players: Player[]) {
        players.forEach(elt => {
            this.ctx.fillStyle = elt.color;
            this.ctx.fillRect(elt.coordx, elt.coordy, elt.size, elt.size);
        });
    }
    drawLollipops(lollipops: Lollipop[]) {
        lollipops.forEach(elt => {
            this.ctx.fillStyle = elt.color;
            this.ctx.beginPath();
            this.ctx.arc(elt.coordx + elt.size / 2, elt.coordy + elt.size / 2, elt.size / 2, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }
}
