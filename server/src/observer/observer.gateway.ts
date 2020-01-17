import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { GameService } from 'src/services/game/game.service';
import { Player } from 'src/models/player.model';
import { Lollipop } from 'src/models/lollipop.model';
import { Subscription } from 'rxjs';

@WebSocketGateway()
export class ObserverGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;
    users: number = 0;
    counter: number = 0;
    data: {lollipops: Lollipop[], players: Player[]} = {lollipops: [], players: []};
    lollipopsSubscription: Subscription;
    playersSubscription: Subscription;
    constructor(private gameService: GameService) {
        this.lollipopsSubscription = this.gameService.lollipopsSubject.subscribe(data => {
            this.data.lollipops = data;
        });

        this.playersSubscription = this.gameService.playersSubject.subscribe(data => {
            this.data.players = data;
        });
    }

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

    reload() {
        this.server.emit('reload', this.data);
    }

    reloadPlayers() {
        this.server.emit('reload-players', this.data.players);
    }

    reloadLollipops() {
        this.server.emit('reload-lollipops', this.data.lollipops);
    }

    @SubscribeMessage('move')
    async onMovement(@MessageBody() data: {player: Player, movement: string}) {
        await this.gameService.move(data.player, data.movement);
        this.reload();
    }

    @SubscribeMessage('new-game')
    async onNewGame(@MessageBody() nombreDeLollipops: number) {
        await this.gameService.newGame(nombreDeLollipops);
        this.reload();
    }

    @SubscribeMessage('new-player')
    async onNewPlayer() {
        this.reloadPlayers();
    }

    @SubscribeMessage('counter')
    async onCounter(@MessageBody() nombre: number) {
        // console.log('compteur: ', nombre);
        this.counter += nombre;
        this.server.emit('counter', this.counter);
    }
}
