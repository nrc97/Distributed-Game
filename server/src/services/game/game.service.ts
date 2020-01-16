import { Injectable } from '@nestjs/common';
import { Player } from 'src/models/player.model';
import { Lollipop } from 'src/models/lollipop.model';
import { Canvas } from 'src/models/canvas.model';

@Injectable()
export class GameService {
    counter = 0;
    players: Player[] = [];
    lollipops: Lollipop[] = [];
    canvas: Canvas = new Canvas();
    colors: string[] = ['red', 'blue', 'cyan', 'black', 'gray', 'purple', 'indigo', 'green', 'orange'];
    
    getPlayers(): Player[] {
        return this.players;
    }

    getLollipops(): Lollipop[] {
        return this.lollipops;
    }

    newPlayer(): Player {
        const player: Player = new Player();
        player.id = this.counter;
        this.counter++;
        player.color = this.colors[player.id % 9];
        Math.floor(Math.floor(Math.random() * 600) / (20)) * (20)
        this.players.push(player);
        return player;
    }

}
