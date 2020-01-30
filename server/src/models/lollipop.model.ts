export class Lollipop {
    id: number;
    coordx: number;
    coordy: number;
    color: string;
    size: number;
    available: boolean; // deja mangé ou pas
    constructor() {
        this.id = 0;
        this.coordx = 100;
        this.coordy = 100;
        this.color = 'green';
        this.size = 15;
        this.available = true;
    }
}
