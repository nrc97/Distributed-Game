import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Canvas } from '../models/canvas.model';
import { Player } from '../models/player.model';
import { Lollipop } from '../models/lollipop.model';
import { GameService } from '../services/game.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatSnackBar } from '@angular/material';

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
  @ViewChild('canvas')
  canvasHtmlElement: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  canvas: Canvas = new Canvas();
  players: Player[] = [];
  lollipops: Lollipop[] = [];
  player: Player;
  timer;
  constructor(private gameService: GameService, private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer, private snackBar: MatSnackBar) {
      matIconRegistry.addSvgIcon('arrow_up', domSanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/keyboard_arrow_up-24px.svg'));
      // tslint:disable: max-line-length
      matIconRegistry.addSvgIcon('arrow_down', domSanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/keyboard_arrow_down-24px.svg'));
      matIconRegistry.addSvgIcon('arrow_left', domSanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/keyboard_arrow_left-24px.svg'));
      matIconRegistry.addSvgIcon('arrow_right', domSanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/keyboard_arrow_right-24px.svg'));
      matIconRegistry.addSvgIcon('stop', domSanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/stop-24px.svg'));
    }

  ngOnInit() {
    this.ctx = this.canvasHtmlElement.nativeElement.getContext('2d');
    this.canvas.ctx = this.ctx,
    this.player = new Player();
    this.gameService.canvasSubject.subscribe(data => {
      this.canvas = data;
      this.canvas.ctx = this.ctx;
      if (!data.enCours) {
        this.openSnackBar();
      }
    });
    this.gameService.dataSubject.subscribe(data => {
      this.lollipops = data.lollipops;
      this.players = data.players;
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
    this.draw();
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    // console.log(event);
    const keys = ['ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'Space'];
    if (keys.includes(event.code)) {
      this.move(event);

      /*clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.move(event);
      }, 200);*/
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

  // @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    clearInterval(this.timer);
  }
  draw() {
    setInterval(() => {
      this.canvas.cleanCanvas();
      this.canvas.drawPlayers(this.players);
      this.canvas.drawLollipops(this.lollipops);
    }, 50);
  }
  onEnterGame() {
    this.gameService.enterGame();
  }
  onNewGame() {
    this.gameService.newGame();
  }
  onResetScore() {
    this.gameService.resetScore();
  }
  onLeaveGame() {
    this.gameService.leaveGame();
  }
  getScore() {
    const players = this.players.filter(elt => elt.id === this.player.id);
    if (players.length !== 0) {
      return players[0].score;
    }
    return 0;
  }
  openSnackBar() {
    if (this.players.length === 0) {
      return;
    }
    const players = this.getSortedPlayers();
    console.log("comp: ", players[0], this.players[this.player.id]);
    const message = (players[0].id === this.player.id || players[0].score === this.players[this.player.id].score) ? 'vous êtes le grand vainqueur !' : 'joueur ' + players[0].id + ' (' + players[0].color + ') est le grand vainqueur ! (' + players[0].score + ')';
    this.snackBar.open('La partie est terminée: ' + message, 'OK', {duration: 10000});
  }
  getGameEnCours() {
    return this.canvas.enCours;
  }
  getSortedPlayers() {
    return this.players.slice()
    .filter(elt => elt.available === true)
    .sort((a, b) => {
      if (a.score > b.score) {
        return -1;
      } else if (a.score < b.score) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
