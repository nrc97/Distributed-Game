import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  users: number;
  counter: number;
  connected: boolean;

  usersSubject: Subject<number> = new Subject<number>();
  counterSubject: Subject<number> = new Subject<number>();
  connectedSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private socket: Socket) { }

  load() {
    this.receiveCounter().subscribe((data: number) => {
      this.counter = data;
    });
    this.receiveUsers().subscribe((data: number) => {
      this.users = data;
    });
    this.socket.connect();
    this.connected = true;
  }

  emitUsers() {
    this.usersSubject.next(this.users);
  }

  emitCounter() {
    this.counterSubject.next(this.counter);
  }

  emitConnected() {
    this.connectedSubject.next(this.connected);
  }

  connect() {
    this.socket.connect();
    this.connected = true;
    this.emitConnected();
  }

  disconnect() {
    this.socket.disconnect();
    this.connected = false;
    this.emitConnected();
  }

  increment() {
    this.socket.emit('counter' , 1);
    this.emitCounter();
  }

  decrement() {
    this.socket.emit('counter' , -1);
    this.emitCounter();
  }

  receiveCounter() {
    return this.socket.fromEvent('counter');
  }

  receiveUsers() {
    return this.socket.fromEvent('users');
  }
}
