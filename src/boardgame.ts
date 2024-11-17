export interface Card {
    value: string;
    flipped: boolean;
    matched: boolean;
}

export class Game {
    private cards: Card[] = [];
    private moves: number = 0;
    private startTime: number = Date.now();

    constructor() {
        this.initializeDeck();
    }

    private initializeDeck(): void {
        const values = ["A", "B", "C", "D", "E", "F", "G", "H"];
        const doubledValues = values.concat(values);
        this.cards = doubledValues.sort(() => Math.random() - 0.5).map(value => ({
            value,
            flipped: false,
            matched: false,
        }));
    }

    public getCards(): Card[] {
        return this.cards;
    }

    public makeAMove(index: number): void {
        this.moves++;       
    }

    public getMoves(): number {
        return this.moves;
    }

    public getTimeElapsed(): number {
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    public reset(): void {
        this.moves = 0;
        this.startTime = Date.now();
        this.initializeDeck();
    }
}
