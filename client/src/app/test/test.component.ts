import { Component, OnInit } from '@angular/core';
import { TestService } from '../services/test.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  users: number;
  counter: number;
  connected: boolean;

  usersSubscription: Subscription;
  counterSubscription: Subscription;
  connectedSubscription: Subscription;
  constructor(private testService: TestService) { }

  ngOnInit() {
    this.usersSubscription = this.testService.usersSubject.subscribe((data) => {
      this.users = data;
    });

    this.counterSubscription = this.testService.counterSubject.subscribe((data) => {
      this.counter = data;
    });

    this.connectedSubscription = this.testService.connectedSubject.subscribe((data) => {
      this.connected = data;
    });
    this.testService.load();
    this.testService.emitCounter();
    this.testService.emitUsers();
    this.testService.emitConnected();

  }

  onConnect() {
    this.testService.connect();
  }

  onDisconnect() {
    this.testService.disconnect();
  }

  onIncrement() {
    this.testService.increment();
  }

  onDecrement() {
    this.testService.decrement();
  }


}
