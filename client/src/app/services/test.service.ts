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
      console.log('counter signal');
      this.emitCounter();
    });
    this.receiveUsers().subscribe((data: number) => {
      this.users = data;
      console.log('users signal');
      this.emitUsers();
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
    this.users -= 1;
    this.emitConnected();
  }

  increment() {
    this.socket.emit('counter' , 1);
  }

  decrement() {
    this.socket.emit('counter' , -1);
  }

  receiveCounter() {
    return this.socket.fromEvent('counter');
  }

  receiveUsers() {
    return this.socket.fromEvent('users');
  }
}
