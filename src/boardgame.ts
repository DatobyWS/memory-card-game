export interface Card {
    value: string;
    shape: string; 
    color: string; 
    flipped: boolean;
    matched: boolean;
}

export interface GameState {
    gridSize: number;
    cards: Card[];
    moves: number;
    remainingTime: number;
}

export class Game {
    private gridSize: number = 4;
    private cards: Card[] = [];
    private moves: number = 0;
    private timeElapsed: number = 0;
    public extraTimeUsed: boolean = false;
    public extraTimeAlerted: boolean = false;
    public isProcessing: boolean = false;
    public countdownTime: number = 0;
    public isMultiSelectMode: boolean = false;
    public timerInterval: number = 0;
    public remainingTime: number = 0;

    constructor() {
        this.initializeDeck();
        this.timerInterval
    }

    private generateColors(numPairs: number): string[] {
        const colors = [
            "Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Brown",
            "Cyan", "Magenta", "Lime", "Teal", "Lavender", "Maroon", "Navy", "Olive",
            "Coral", "Turquoise", "Silver", "Gold", "Beige", "Mint", "Salmon", "Indigo",
            "Violet", "Crimson", "Khaki", "Plum", "Chocolate", "Tan", "Orchid", "Azure"
        ];
    
        if (numPairs > colors.length) {
            throw new Error("Not enough unique colors available.");
        }
    
        return colors.slice(0, numPairs);
    }

    private generateValues(numPairs: number): string[] {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (numPairs > alphabet.length) {
            throw new Error("Not enough unique values available.");
        }
        return alphabet.slice(0, numPairs).split('');
    }

    private generateShapes(numPairs: number): string[] {
        const shapes = [
            "fa-circle", "fa-square", "fa-star", "fa-heart", "fa-diamond", "fa-leaf", "fa-bell", "fa-moon",
            "fa-cloud", "fa-sun", "fa-mountain", "fa-tree", "fa-star-of-life", "fa-anchor", "fa-rocket", "fa-umbrella",
            "fa-paw", "fa-fish", "fa-feather", "fa-snowflake", "fa-fire", "fa-water", "fa-wind", "fa-earth",
            "fa-lightning", "fa-wave", "fa-shell", "fa-butterfly", "fa-bird", "fa-dragon", "fa-unicorn", "fa-owl"
        ];
    
        if (numPairs > shapes.length) {
            throw new Error("Not enough unique shapes available.");
        }
    
        return shapes.slice(0, numPairs);
    }

    private initializeDeck(): void {
        const numPairs = (this.gridSize * this.gridSize) / 2;
        const values = this.generateValues(numPairs);
        const shapes = this.generateShapes(numPairs);
        const colors = this.generateColors(numPairs);

        const doubledValues = values.concat(values).map((value, index) => ({
            value,
            shape: shapes[index % numPairs],
            color: colors[index % numPairs],
            flipped: false,
            matched: false,
        }));

        this.cards = doubledValues.sort(() => Math.random() - 0.5);
        const gameBoard = document.getElementById('game-board')
            if (gameBoard) {
                gameBoard.style.gridTemplateColumns = `repeat(${this.gridSize}, 100px)`;
                console.log("Increasing grid size to " + (this.gridSize ));
            }
    }

    public isGameOver(): boolean {
        return this.cards.every(card => card.matched);
    }

    public getGridSize(): number {
        return this.gridSize;
    }

    public setGridSize(size: number): void {
        this.gridSize = size;
    }

    public getCards(): Card[] {
        return this.cards;
    }

    public setCards(cards: Card[]): void {
        this.cards = cards;
    }

    public getCountdownTime(): number {
        return this.countdownTime;
    }

    public getMoves(): number {
        return this.moves;
    }

    public setMoves(moves: number): void {
        this.moves = moves;
    }

    public getTimeElapsed(): number {
        return this.timeElapsed;
    }

    public getTimerInverval(): number {
        return this.timerInterval
    }

    public setTimeElapsed(time: number): void {
        this.timeElapsed = time;
    }


    public getRemainingTime(): number {
        return this.remainingTime;
    }

    public setRemainingTime(remainingTime : number){
        this.remainingTime = remainingTime;
    }


    public incrementMoves(): void {
        this.moves++;
    }

    public toggleMultiSelectMode(): void {
        this.isMultiSelectMode = !this.isMultiSelectMode;
    }

    public setCountdownTime(time: number = 0): void {
        this.countdownTime = time;
    }

    public addExtraTime(): number {
        if (this.timeElapsed !== null) {
            this.timeElapsed = this.timeElapsed + 30;
            return this.timeElapsed;
        }
        return 0;
    }

    private incrementGridSize(): void {
        if (this.gridSize < 6) {
            this.gridSize = this.gridSize + 2;
        }
    }
    
    public handleWin(): void {
        this.cards.forEach((card) => {
            card.matched = false;
            card.flipped = false;
        });
        const flippedCards = document.querySelectorAll('.card.flipped');
        flippedCards.forEach(cardElement => {
            cardElement.classList.remove('flipped');
        });
        this.incrementGridSize();
        this.timerInterval = this.timerInterval + 30 ;
        this.initializeDeck();
    }

    public shuffleCards(): void {
        const matchedCards = this.cards.filter((card) => card.matched);
        const unmatchedCards = this.cards.filter((card) => !card.matched);

        const shuffledUnmatchedCards = unmatchedCards.sort(() => Math.random() - 0.5);

        this.cards = [...matchedCards, ...shuffledUnmatchedCards];
    }

    public reset(): void {
        this.moves = 0;
        this.timeElapsed = 0;
        this.extraTimeUsed = false;
        this.isProcessing = false;
        this.extraTimeAlerted = false;
        this.initializeDeck();
        this.setGridSize(4);
    }
}
