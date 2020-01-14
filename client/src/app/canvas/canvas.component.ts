import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Canvas } from '../models/canvas.model';
import { Player } from '../models/player.model';
import { interval } from 'rxjs';
import { Lollipop } from '../models/lollipop.model';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  DOWN_ARROW = 40
}
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  canvas: Canvas;
  @ViewChild('canvas')
  canvasHtmlElement: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  players: Player[] = [];
  lollipops: Lollipop[] = [];
  player: Player;
  player2: Lollipop;
  timer;
  constructor() { }

  ngOnInit() {
    this.canvas = new Canvas();
    this.ctx = this.canvasHtmlElement.nativeElement.getContext('2d');
    this.player = new Player(this.ctx);
    this.player2 = new Lollipop(this.ctx);
    /*this.player2.moveRight();
    this.player2.moveRight();
    this.player2.moveDown();
    this.player2.moveDown();*/
    this.player2.draw();
    this.player.draw();
    this.generateLollipops(20);
  }

  generateLollipops(quantite: number) {
    this.lollipops = [];
    const colors = ['red', 'blue', 'cyan', 'pink', 'pink', 'black', 'gray', 'purple', 'indigo', 'green', 'orange'];
    for (let i = 0; i < quantite; i++) {
      const lollipop = new Lollipop(this.ctx);
      lollipop.coordx = Math.floor(Math.random() * 600);
      lollipop.coordy = Math.floor(Math.random() * 400);
      while (lollipop.coordx % 20 !== 0 || lollipop.coordy % 20 !== 0) {
        if (lollipop.coordx % 20 !== 0) {
          lollipop.coordx += 1;
        }
        if (lollipop.coordx >= 600) {
          lollipop.coordx = 0;
        }
        if (lollipop.coordy % 20 !== 0) {
          lollipop.coordy += 1;
        }
        if (lollipop.coordy >= 400) {
          lollipop.coordy = 0;
        }
      }
      console.log('Bonbon: ', i, ' (', lollipop.coordx, ', ', lollipop.coordy, ')');
      this.lollipops.push(lollipop);
      lollipop.color = colors[Math.round(Math.random() * (colors.length - 1))];
      lollipop.draw();
    }
  }

  draw(x: number, y: number, z: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, z, z);
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    console.log(event);
    const keys = ['ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'Space'];
    if (keys.includes(event.code)) {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.move(event);
      }, 50);
    }
  }

  move(event: KeyboardEvent) {
    if (event.code === 'ArrowRight') {// && this.timer !== undefined) {
      this.player.moveRight();
    } else if (event.code === 'ArrowLeft') {
      this.player.moveLeft();
    } else if (event.code === 'ArrowUp') {
      this.player.moveUp();
    } else if (event.code === 'ArrowDown') {
      this.player.moveDown();
    } else if (event.code === 'Space') {
      clearInterval(this.timer);
    }
  }

  //@HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    clearInterval(this.timer);
  }

}
