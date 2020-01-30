export class Player {
    id: number;
    coordx: number;
    coordy: number;
    color: string;
    size: number;
    available: boolean;
    score: number;
    constructor() {
        this.id = -1;
        this.coordx = 0;
        this.coordy = 0;
        this.color = 'red';
        this.size = 20;
        this.score = 0;
    }
}
