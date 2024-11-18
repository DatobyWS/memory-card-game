import { PowerUp } from "./powerUp.js";
import { Game } from "./boardgame.js";

export class PeekPowerUp implements PowerUp {
    name = "Peek";
    description = "Reveals all cards for 1 second, costs 1 move.";
    used = false;
    private render: () => void;

    constructor(render: () => void) {
        this.render = render; // Store the render function
    }

    use(game: Game): void {
        if (this.used || game.isProcessing) {
            console.warn(`Power-up "${this.name}" is unavailable.`);
            return;
        }

        this.used = true; // Mark the power-up as used
        game.isProcessing = true; // Lock game interactions
        game.incrementMoves(); // Increment move counter

        // Temporarily reveal all cards
        game.getCards().forEach((card) => (card.flipped = true));
        this.render(); // Render the updated state

        // Hide unmatched cards after 1 second
        setTimeout(() => {
            game.getCards().forEach((card) => {
                if (!card.matched) {
                    card.flipped = false; // Flip back unmatched cards
                }
            });
            game.isProcessing = false; // Unlock interactions
            this.render(); // Render the updated state again
        }, 1000); // 1-second delay
    }
}



