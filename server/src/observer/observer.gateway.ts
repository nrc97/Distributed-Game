import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

@WebSocketGateway()
export class ObserverGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;
    users: number = 0;
    counter: number = 0;

    async handleConnection() {
        // A client has connected
        this.users++;

        // Notify connected clients of current users
        this.server.emit('users', this.users);
        this.server.emit('counter', this.counter);
    }

    async handleDisconnect() {

        // A client has disconnected
        this.users--;

        // Notify connected clients of current users
        this.server.emit('users', this.users);
        this.server.emit('counter', this.counter);
    }

    @SubscribeMessage('counter')
    async onCounter(client, nombre: number) {
        console.log('compteur: ', nombre);
        this.counter += nombre;
        this.server.emit('counter', this.counter);
    }
}
