import { Injectable } from '@nestjs/common';
import { Player } from 'src/models/player.model';
import { Lollipop } from 'src/models/lollipop.model';
import { Canvas } from 'src/models/canvas.model';
import { Subject } from 'rxjs';

@Injectable()
export class GameService {
    playersCounter = 0;
    lollipopsCounter = 0;
    players: Player[] = [];
    lollipops: Lollipop[] = [];
    playersSubject: Subject<Player[]> = new Subject<Player[]>();
    lollipopsSubject: Subject<Lollipop[]> = new Subject<Lollipop[]>();
    canvas: Canvas = new Canvas();
    colors: string[] = ['red', 'blue', 'cyan', 'black', 'gray', 'purple', 'indigo', 'green', 'orange'];

    async newGame(lollipopsQte: number) {
        this.lollipopsCounter = 0;
        this.lollipops = [];
        this.generateLollipops(lollipopsQte);
    }

    async move(playerID: number, movement: string) {
        let player: Player = new Player();
        this.players.forEach(elt => {
            if (elt.id === playerID) {
                player = elt;
            }
        });
        if (movement === 'up' && player.coordy > 0) {
            if (!this.coordinatesConflict(this.players, player.coordx, player.coordy - 20)) {
                player.coordy -= 20;
            }
        } else if (movement === 'down' && player.coordy < this.canvas.height) {
            if (!this.coordinatesConflict(this.players, player.coordx, player.coordy + 20)) {
                player.coordy += 20;
            }
        } else if (movement === 'right' && player.coordx < this.canvas.width) {
            if (!this.coordinatesConflict(this.players, player.coordx + 20, player.coordy)) {
                player.coordx += 20;
            }
        } else if (movement === 'left' && player.coordx < 0) {
            if (!this.coordinatesConflict(this.players, player.coordx - 20, player.coordy)) {
                player.coordx -= 20;
            }
        }
        player = this.winLollipop(player); // retourne le joueur avec son nouveau score (+1) s'il gagne un nouveau bonbon
        for (let i = 0; i < this.playersCounter; i++) {
            if (this.players[i].id === player.id) {
                this.players[i] = player;
                this.emitPlayers();
                break;
            }
        }
    }

    getPlayers(): Player[] {
        return this.players;
    }

    getLollipops(): Lollipop[] {
        return this.lollipops;
    }

    async newPlayer(): Promise<Player> {
        const player: Player = new Player();
        player.id = this.playersCounter;
        this.playersCounter++;
        player.color = this.colors[player.id % 9];
        do {
            player.coordx = Math.floor(Math.floor(Math.random() * this.canvas.width) / (20)) * (20);
            player.coordy = Math.floor(Math.floor(Math.random() * this.canvas.height) / (20)) * (20);
        } while (this.coordinatesConflict(this.players, player.coordx, player.coordy));
        this.players.push(player);
        this.emitPlayers();
        return player;
    }
    coordinatesConflict(container: any[], coordx: number, coordy: number): boolean {
        container.forEach(elt => {
            if (elt.coordx === coordx && elt.coordy === coordy) {
                return true;
            }
        });
        return false;
    }

    winLollipop(player: Player): Player {
        for (let i = 0; i < this.lollipops.length; i++) {
            if (this.lollipops[i].coordx === player.coordx && this.lollipops[i].coordy === player.coordy) {
                this.lollipops = this.lollipops.slice(0, i).concat(this.lollipops.slice(i + 1));
                player.score += 1;
                this.emitLollipops();
                break;
            }
        }
        return player;
    }

    async generateLollipops(quantite: number) {
        this.lollipops = [];
        for (let i = 0; i < quantite; i++) {
            const lollipop = new Lollipop();
            lollipop.id = this.lollipopsCounter;
            this.lollipopsCounter++;
            do {
                lollipop.coordx = Math.floor(Math.floor(Math.random() * this.canvas.width) / (20)) * (20);
                lollipop.coordy = Math.floor(Math.floor(Math.random() * this.canvas.height) / (20)) * (20);
            } while (this.coordinatesConflict(this.lollipops, lollipop.coordx, lollipop.coordy));
            this.lollipops.push(lollipop);
        }
        this.emitLollipops();
    }

    emitPlayers() {
        this.playersSubject.next(this.players.slice());
    }

    emitLollipops() {
        this.lollipopsSubject.next(this.lollipops.slice());
    }
}
