import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { GameService } from 'src/services/game/game.service';
import { Player } from 'src/models/player.model';
import { Lollipop } from 'src/models/lollipop.model';
import { Subscription } from 'rxjs';
import { Canvas } from 'src/models/canvas.model';

@WebSocketGateway(8082, {transports: ['websocket']})
export class ObserverGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;
    users: number = 0;
    counter: number = 0;
    canvas: Canvas = new Canvas();
    data: {lollipops: Lollipop[], players: Player[]} = {lollipops: [], players: []};
    actions: Array<{player: number, movement: string}> = [];
    actionsCompleting: boolean = false;
    actionsCounter: number = 0;
    lollipopsSubscription: Subscription;
    playersSubscription: Subscription;
    canvasSubscription: Subscription;
    constructor(private gameService: GameService) {
        this.lollipopsSubscription = this.gameService.lollipopsSubject.subscribe(data => {
            this.data.lollipops = data;
        });

        this.playersSubscription = this.gameService.playersSubject.subscribe(data => {
            this.data.players = data;
        });

        this.canvasSubscription = this.gameService.canvasSubject.subscribe(data => {
            this.canvas = data;
            this.reloadCanvas();
        });
        this.gameService.emitPlayers();
        this.gameService.emitLollipops();
        this.gameService.emitCanvas();
    }

    async handleConnection() {
        // A client has connected
        this.users++;

        // Notify connected clients of current users
        this.reloadCanvas();
        this.reload();
        this.server.emit('users', this.users);
        this.server.emit('counter', this.counter);
    }

    async handleDisconnect() {

        // A client has disconnected
        this.users--;
        // Notify connected clients of current users
        this.server.emit('users', this.users);
        this.server.emit('counter', this.counter);
        await this.gameService.disableAllPlayers();
        this.reloadPlayers();
        this.declareStatus();
    }

    async actionsComplete() {
        this.actionsCompleting = true;
        let toReload = '';
        do {
            try {
                toReload = await this.gameService.move(this.actions[this.actionsCounter].player, this.actions[this.actionsCounter].movement);
            } catch (err) {
                console.log(err);
            };
            // console.log('to be reloaded', toReload);
            if (toReload === 'players') {
                this.reloadPlayers();
            } else if (toReload === 'all') {
                this.reload();
                if (this.gameService.lollipopsCounter === 0) {
                    this.gameService.canvas.enCours = false;
                    this.gameService.emitCanvas();
                }
            }
            this.actionsCounter++;
        } while (this.actionsCounter < this.actions.length);
        this.actionsCompleting = false;
    }

    async reloadCanvas() {
        try {
            this.server.emit('reload-canvas', this.canvas);
        } catch (e) {
            console.log('unable to reload canvas');
        }
    }

    async reload() {
        this.server.emit('reload', this.data);
    }

    async reloadPlayers() {
        this.server.emit('reload-players', this.data.players);
    }

    async reloadLollipops() {
        this.server.emit('reload-lollipops', this.data.lollipops);
    }
    async declareStatus() {
        this.server.emit('declare-status');
    }
    @SubscribeMessage('move')
    async onMovement(@MessageBody() data: {player: number, movement: string}) {
        if (!this.canvas.enCours) {
            return;
        }
        if (['left', 'right', 'up', 'down'].includes(data.movement)) {
            this.actions.push(data);
            if (!this.actionsCompleting) {
                this.actionsComplete();
            }
            // console.log(data.movement);
            // await this.gameService.move(data.player, data.movement);
            // this.reload();
        }
    }

    @SubscribeMessage('new-game')
    async onNewGame(@MessageBody() nombreDeLollipops: number) {
        console.log('new-game');
        await this.gameService.disableAllPlayers();
        await this.gameService.newGame(nombreDeLollipops);
        this.reloadCanvas();
        this.declareStatus();
        this.reload();
    }

    @SubscribeMessage('reset-scores')
    async onResetScores() {
        await this.gameService.resetScores();
        this.reloadPlayers();
    }

    @SubscribeMessage('new-player')
    async onNewPlayer(@MessageBody() code: number) {
        // tslint:disable: object-literal-shorthand
        console.log('new player')
        let player: Player;
        await this.gameService.newPlayer().then(data => {
            player = data;
        });
        this.server.emit('player-added', {code: code, player: player});
        this.reloadPlayers();
    }
    @SubscribeMessage('status-declared')
    async onDeclareStatus(@MessageBody() data: {id: number, available: boolean}) {
        await this.gameService.enablePlayer(data);
        this.reloadPlayers();
    }

    @SubscribeMessage('game-status')
    async onGameStatusAsked() {
        this.reloadCanvas();
        this.reload();
    }

    @SubscribeMessage('counter')
    async onCounter(@MessageBody() nombre: number) {
        // console.log('compteur: ', nombre);
        this.counter += nombre;
        this.server.emit('counter', this.counter);
    }
}

