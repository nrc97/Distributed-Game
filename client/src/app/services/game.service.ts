import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Player } from '../models/player.model';
import { Lollipop } from '../models/lollipop.model';
import { Subject } from 'rxjs';
import { Canvas } from '../models/canvas.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  gameEnded = true;
  code: number = Math.floor(Math.random() * 1000000);
  canvas: Canvas = new Canvas();
  player: Player = new Player();
  players: Player[] = [];
  lollipops: Lollipop[] = [];
  canvasSubject: Subject<Canvas> = new Subject<Canvas>();
  playerSubject: Subject<Player> = new Subject<Player>();
  lollipopsSubject: Subject<Lollipop[]> = new Subject<Lollipop[]>();
  playersSubject: Subject<Player[]> = new Subject<Player[]>();
  dataSubject: Subject<{players: Player[], lollipops: Lollipop[]}> = new Subject<{players: Player[], lollipops: Lollipop[]}>();
  constructor(private socket: Socket, private httpClient: HttpClient) { }

  load() {
    this.reload().subscribe((data: {players: Player[], lollipops: Lollipop[]}) => {
      this.lollipops = data.lollipops;
      this.players = data.players;
      this.emitData();
      // console.log('data reloaded', data);
    }, error => {
      console.log(error);
    });
    this.reloadPlayers().subscribe((data: Player[]) => {
      this.players = data;
      this.emitPlayers();
      // console.log('players emiited', this.players);
    }, error => {
      console.log(error);
    });
    this.reloadLollipops().subscribe((data: Lollipop[]) => {
      this.lollipops = data;
      this.emitLollipops();
    }, error => {
      console.log(error);
    });
    this.playerAdded().subscribe((data: {code: number, player: Player}) => {
      if (this.code === data.code) {
        this.player = data.player;
        this.emitPlayer();
        console.log('player added and emitted', this.player);
      }
      this.emitPlayers();
    });
    this.reloadCanvas().subscribe((data: Canvas) => {
      this.canvas.enCours = data.enCours;
      this.canvas.height = data.height;
      this.canvas.id = data.id;
      this.canvas.width = data.width;
      this.emitCanvas();
      console.log('canvas emitted', this.canvas);
    });
    this.onGameEnded().subscribe(() => {
      this.gameEnded = true;
    });
    this.onDeclareStatus().subscribe(() => {
      this.declareStatus();
    });
    this.socket.connect();
    this.emitCanvas();
    this.emitData();
    this.emitPlayer();
    this.getGameStatus();

  }

  move(direction: string) {
    this.socket.emit('move', {player: this.player.id, movement: direction});
  }

  reload() {
    return this.socket.fromEvent('reload');
  }
  reloadPlayers() {
    return this.socket.fromEvent('reload-players');
  }
  reloadLollipops() {
    return this.socket.fromEvent('reload-lollipops');
  }

  reloadCanvas() {
    return this.socket.fromEvent('reload-canvas');
  }

  playerAdded() {
    return this.socket.fromEvent('player-added');
  }

  onDeclareStatus() {
    return this.socket.fromEvent('declare-status');
  }

  onGameEnded() {
    return this.socket.fromEvent('game-ended');
  }

  emitCanvas() {
    this.canvasSubject.next(this.canvas);
  }
  emitPlayer() {
    this.playerSubject.next(this.player);
  }
  emitPlayers() {
    this.playersSubject.next(this.players.slice());
  }
  emitLollipops() {
    this.lollipopsSubject.next(this.lollipops.slice());
  }

  emitData() {
    this.dataSubject.next({players: this.players.slice(), lollipops: this.lollipops.slice()});
  }

  enterGame() {
    console.log('on enter game');
    if (this.player.id === -1) {
      this.socket.emit('new-player', this.code);
    } else {
      this.player.available = true;
      this.emitPlayer();
      this.declareStatus();
    }
  }
  newGame() {
    console.log('on new game');
    this.socket.emit('new-game', 20);
    this.gameEnded = false;
  }
  resetScore() {
    console.log('RàZ');
    this.socket.emit('reset-scores');
  }
  getGameStatus() {
    this.socket.emit('game-status');
  }
  leaveGame() {
    this.player.available = false;
    this.emitPlayer();
    this.declareStatus();
  }
  declareStatus() {
    this.socket.emit('status-declared', {id: this.player.id, available: this.player.available});
    console.log('status-declared', this.player.available);
  }
}
