import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatIconModule, MatSnackBarModule, MatChipsModule } from '@angular/material';
import { SocketIoModule, SocketIoConfig}  from 'ngx-socket-io';
import { CanvasComponent } from './canvas/canvas.component'
import { HttpClientModule } from '@angular/common/http';

const config: SocketIoConfig = {url: 'http://192.168.137.1:3000', options: {}};

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    CanvasComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
