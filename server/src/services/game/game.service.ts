import { Injectable } from '@nestjs/common';
import { Player } from 'src/models/player.model';
import { Lollipop } from 'src/models/lollipop.model';
import { Canvas } from 'src/models/canvas.model';
import { Subject } from 'rxjs';

@Injectable()
export class GameService {
    // tslint:disable: max-line-length
    playersCounter = 0;
    lollipopsCounter = 0;
    players: Player[] = [];
    lollipops: Lollipop[] = [];
    playersSubject: Subject<Player[]> = new Subject<Player[]>();
    lollipopsSubject: Subject<Lollipop[]> = new Subject<Lollipop[]>();
    canvasSubject: Subject<Canvas> = new Subject<Canvas>();
    canvas: Canvas = new Canvas();
    colors: string[] = ['red', 'blue', 'orange', 'purple', 'indigo', 'gold', 'silver', 'brown', 'cyan', 'black', 'gray'];

    async newGame(lollipopsQte: number) {
        this.lollipopsCounter = 0;
        this.lollipops = [];
        await this.generateLollipops(lollipopsQte);
        this.canvas.enCours = true;
        this.emitCanvas();
    }

    async move(playerID: number, movement: string): Promise<string> {
        let player: Player = new Player();
        if (playerID < this.players.length) {
            player = this.players[playerID];
        } else {
            return '';
        }
        let result = '';
        if (movement === 'up' && player.coordy > 0) {
            if (!this.coordinatesConflict(this.players, player.coordx, player.coordy - 20, false)) {
                player.coordy -= 20;
                result = 'players';
            }
        } else if (movement === 'down' && player.coordy + 20 < this.canvas.height) {
            if (!this.coordinatesConflict(this.players, player.coordx, player.coordy + 20, false)) {
                player.coordy += 20;
                result = 'players';
            }
        } else if (movement === 'right' && player.coordx + 20 < this.canvas.width - 20 / 2) {
            if (!this.coordinatesConflict(this.players, player.coordx + 20, player.coordy, false)) {
                player.coordx += 20;
                result = 'players';
            }
        } else if (movement === 'left' && player.coordx > 0) {
            if (!this.coordinatesConflict(this.players, player.coordx - 20, player.coordy, false)) {
                player.coordx -= 20;
                result = 'players';
            }
        }
        let exScore = player.score;
        player = await this.winLollipop(player); // retourne le joueur avec son nouveau score (+1) s'il gagne un nouveau bonbon
        if (exScore < player.score) {
            result = 'all';
        }
        this.players[playerID] = player;
        this.emitPlayers();
        if (this.lollipopsCounter === 0) {
            this.canvas.enCours = false;
            this.emitCanvas();
        }
        return result;
    }

    getPlayers(): Player[] {
        return this.players;
    }

    getLollipops(): Lollipop[] {
        return this.lollipops;
    }

    async newPlayer(): Promise<Player> {
        const indice = this.players.push(new Player()) - 1;
        this.players[indice].id = this.playersCounter;
        this.playersCounter++;
        this.players[indice].color = this.colors[this.players[indice].id % this.colors.length];
        do {
            this.players[indice].coordx = Math.floor(Math.floor(Math.random() * this.canvas.width) / (20)) * (20);
            this.players[indice].coordy = Math.floor(Math.floor(Math.random() * this.canvas.height) / (20)) * (20);
        } while (this.coordinatesConflict(this.players.filter(elt => elt.id !== this.players[indice].id), this.players[indice].coordx, this.players[indice].coordy, true));
        this.emitPlayers();
        return this.players[indice];
    }
    coordinatesConflict(container: any[], coordx: number, coordy: number, firstTime: boolean): boolean {
        if (firstTime) {
            if (this.lollipops.filter(elt => elt.coordx === coordx && elt.coordy === coordy && elt.available === true).length !== 0 && this.players.filter(elt => elt.coordx === coordx && elt.coordy === coordy && elt.available === true).length !== 0) {
                return true;
            }
            return false;
        }
        return container.filter(elt => elt.coordx === coordx && elt.coordy === coordy && elt.available === true).length !== 0;
    }

    async winLollipop(player: Player): Promise<Player> {
        const lollipops = this.lollipops.filter(elt => elt.available === true && elt.coordx === player.coordx && elt.coordy === player.coordy).slice();
        if (lollipops.length !== 0) {
            this.lollipops[lollipops[0].id].available = false;
            player.score += 1;
            this.lollipopsCounter--;
            this.emitLollipops();
        }
        return player;
    }

    async generateLollipops(quantite: number) {
        this.lollipops = [];
        for (let i = 0; i < quantite; i++) {
            const lollipop = new Lollipop();
            lollipop.id = this.lollipopsCounter;
            // lollipop.color = this.colors[this.lollipopsCounter % this.colors.length];
            this.lollipopsCounter++;
            do {
                lollipop.coordx = Math.floor(Math.floor(Math.random() * this.canvas.width) / (20)) * (20);
                lollipop.coordy = Math.floor(Math.floor(Math.random() * this.canvas.height) / (20)) * (20);
            } while (this.coordinatesConflict(this.lollipops, lollipop.coordx, lollipop.coordy, true));
            this.lollipops.push(lollipop);
        }
        this.emitLollipops();
    }

    async disableAllPlayers() {
        this.players.forEach((player, i) => {
            this.players[i].available = false;
        });
        this.emitPlayers();
    }

    async enablePlayer(data: {id: number, available: boolean}) {
        this.players[data.id].available = data.available;
        while (this.coordinatesConflict(this.players.filter(elt => elt.id !== data.id), this.players[data.id].coordx, this.players[data.id].coordy, true)) {
            this.players[data.id].coordx = Math.floor(Math.floor(Math.random() * this.canvas.width) / (20)) * (20);
            this.players[data.id].coordy = Math.floor(Math.floor(Math.random() * this.canvas.height) / (20)) * (20);
        }
        this.emitPlayers();
    }

    async resetScores() {
        this.players.forEach((elt, i) => {
            this.players[i].score = 0;
        });
        this.emitPlayers();
    }

    emitPlayers() {
        this.playersSubject.next(this.players.slice());
    }

    emitLollipops() {
        this.lollipopsSubject.next(this.lollipops.slice());
    }
    emitCanvas() {
        this.canvasSubject.next(this.canvas);
    }
}
