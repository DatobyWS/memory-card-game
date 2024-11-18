import { PowerUp } from "./powerUp.js";
import { Game } from "./boardgame.js";

export class ShufflePowerUp implements PowerUp {
    name = "Shuffle";
    description = "Shuffles all unmatched cards, keeping matched cards in place.";
    used = false;

    use(game: Game): void {
        if (this.used || game.isProcessing) {
            console.warn(`Power-up "${this.name}" is unavailable.`);
            return;
        }

        this.used = true; // Mark as used

        // Cancel active effects like Peek
        if (game.isProcessing) {
            game.isProcessing = false; // Unlock immediately
        }

        const matchedCards = game.getCards().filter((card) => card.matched);
        const unmatchedCards = game.getCards().filter((card) => !card.matched);

        // Shuffle unmatched cards
        const shuffledUnmatched = unmatchedCards.sort(() => Math.random() - 0.5);

        // Combine matched and shuffled unmatched cards
        game.setCards([...matchedCards, ...shuffledUnmatched]);
    }
}
