import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Canvas } from '../models/canvas.model';
import { Player } from '../models/player.model';
import { Lollipop } from '../models/lollipop.model';
import { GameService } from '../services/game.service';

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
  players: Player[] = [];
  lollipops: Lollipop[] = [];
  player: Player;
  timer;
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.canvas = new Canvas();
    this.canvas.ctx = this.canvasHtmlElement.nativeElement.getContext('2d');
    this.player = new Player();
    this.gameService.canvasSubject.subscribe(data => {
      data.ctx = this.canvasHtmlElement.nativeElement.getContext('2d');
      this.canvas = data;
    });
    this.gameService.playerSubject.subscribe(data => {
      this.player = data;
    });
    this.gameService.lollipopsSubject.subscribe(data => {
      this.lollipops = data;
    });
    this.gameService.playersSubject.subscribe(data => {
      this.players = data;
    });
    this.gameService.load();
    this.gameService.newPlayer();
    this.gameService.newGame();
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    console.log(event);
    const keys = ['ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'Space'];
    if (keys.includes(event.code)) {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.move(event);
      }, 100);
    }
  }

  move(event: KeyboardEvent) {
    if (event.code === 'ArrowRight') {// && this.timer !== undefined) {
      this.gameService.move('right');
    } else if (event.code === 'ArrowLeft') {
      this.gameService.move('left');
    } else if (event.code === 'ArrowUp') {
      this.gameService.move('up');
    } else if (event.code === 'ArrowDown') {
      this.gameService.move('down');
    } else if (event.code === 'Space') {
      clearInterval(this.timer);
    }
  }

  //@HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    clearInterval(this.timer);
  }
  draw() {
    this.canvas.cleanCanvas();
    this.canvas.drawLollipops(this.lollipops);
    this.canvas.drawPlayers(this.players);
  }
}
