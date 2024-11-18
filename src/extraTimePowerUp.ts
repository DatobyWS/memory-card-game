import { PowerUp } from "./powerUp.js";
import { Game } from "./boardgame.js";

export class ExtraTimePowerUp implements PowerUp {
    private render: () => void
    readonly name = "Extra Time"
    readonly description = "Adds 30 seconds to the remaining time"
    used = false

    constructor(render: () => void) {
        this.render = render
    }

    use(game: Game): void {
        // Add 30 seconds to remaining time
        game.addExtraTime();
        console.log("heyy")
        this.used = true;
        this.render();
    }
}

