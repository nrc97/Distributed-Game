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
  canvas: Canvas = new Canvas();
  player: Player = new Player();
  players: Player[] = [];
  lollipops: Lollipop[] = [];
  canvasSubject: Subject<Canvas> = new Subject<Canvas>();
  playerSubject: Subject<Player> = new Subject<Player>();
  lollipopsSubject: Subject<Lollipop[]> = new Subject<Lollipop[]>();
  playersSubject: Subject<Player[]> = new Subject<Player[]>();
  constructor(private socket: Socket, private httpClient: HttpClient) { }

  load() {
    this.reload().subscribe((data: {players: Player[], lollipops: Lollipop[]}) => {
      this.lollipops = data.lollipops;
      this.players = data.lollipops;
      this.emitLollipops();
      this.emitPlayers();
    });
    this.reloadPlayers().subscribe((data: Player[]) => {
      this.players = data;
      this.emitPlayers();
    });
    this.reloadLollipops().subscribe((data: Lollipop[]) => {
      this.lollipops = data;
      this.emitLollipops();
    });

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

  newPlayer() {
    if (this.player.id !== -1) {
      this.httpClient.post('http://192.168.137.1:3000/api/players', JSON.stringify(new Player())).subscribe((data: Player) => {
      this.player = data;
      this.emitPlayer();
      this.socket.emit('new-player');
      });
    }
  }
  newGame() {
    this.socket.emit('new-game');
  }
}
