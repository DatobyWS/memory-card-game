import { Game, Card } from "./boardgame.js";

export interface PowerUp {
    name: string; // Name of the power-up
    description: string; // Short description of the effect
    used: boolean;
    use(game: Game): void; // Effect of the power-up
}
