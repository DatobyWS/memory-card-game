import { PowerUp } from "./powerUp.js"; // Interface for PowerUps
import { Game } from "./boardgame.js"; // Core game logic

export class PowerUpManager {
    private powerUps: Map<string, PowerUp> = new Map(); // Stores power-ups by name

    constructor(private game: Game) {}

    register(powerUp: PowerUp): void {
        if (this.powerUps.has(powerUp.name)) {
            console.warn(`Power-up "${powerUp.name}" is already registered.`);
            return;
        }
        this.powerUps.set(powerUp.name, powerUp);
    }

    use(name: string): void {
        const powerUp = this.powerUps.get(name);
        if (!powerUp) {
            console.error(`Power-up "${name}" not found.`);
            return;
        }
        if (powerUp.used) {
            console.warn(`Power-up "${name}" has already been used.`);
            return;
        }
        powerUp.use(this.game); // Trigger the power-up effect
    }

    getPowerUp(name: string): PowerUp | undefined {
        return this.powerUps.get(name);
    }
    
    list(): PowerUp[] {
        return Array.from(this.powerUps.values());
    }
}
