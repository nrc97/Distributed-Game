export class Player {
    id: number;
    coordx: number;
    coordy: number;
    color: string;
    size: number;
    score: number;
    available: boolean;
    constructor() {
        this.id = 0;
        this.coordx = 0;
        this.coordy = 0;
        this.color = 'red';
        this.size = 18;
        this.score = 0;
        this.available = true;
    }
}
