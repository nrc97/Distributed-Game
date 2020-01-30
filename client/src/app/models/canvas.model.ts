import { Player } from './player.model';
import { Lollipop } from './lollipop.model';
import { Event } from '@angular/router';

export class Canvas {
    id: number;
    width: number;
    height: number;
    enCours: boolean;
    ctx: CanvasRenderingContext2D;
    constructor() {
        this.id = 1;
        this.height = 400;
        this.width = 600;
        this.enCours = false;
    }
    cleanCanvas() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    drawPlayers(players: Player[]) {
        players.slice().forEach(player => {
            if (player.available) {
                this.ctx.fillStyle = player.color;
                this.ctx.fillRect(player.coordx, player.coordy, player.size, player.size);
                this.ctx.fillStyle = 'white';
                this.ctx.fillText(player.id + '', player.coordx + player.size / 2, player.coordy + player.size / 2);
                /*const image = new Image(20, 20);
                image.addEventListener('onload', (event: CustomEvent) => {
                    this.ctx.drawImage(image, player.coordx, player.coordy + player.size);
                });
                image.src = '../..assets/img/android.svg';*/
            }
        });
    }
    drawLollipops(lollipops: Lollipop[]) {
        lollipops.slice().forEach(lollipop => {
            if (lollipop.available) {
                this.ctx.fillStyle = lollipop.color;
                this.ctx.beginPath();
                this.ctx.arc(lollipop.coordx + lollipop.size / 2, lollipop.coordy + lollipop.size / 2, lollipop.size / 2, 0, 2 * Math.PI);
                this.ctx.closePath();
                this.ctx.fill();
            }
        });
    }
}
