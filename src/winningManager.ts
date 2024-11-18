import { Game } from "./boardgame.js";

export class WinningManager {
    private render: () => void;
    private game: Game;
    constructor(game: Game, render: () => void) {
        this.game = game;
        this.render = render; // Initialize the render function
    }

    

    checkWin(): boolean {
        // Check if all cards are matched
        return this.game.getCards().every((card) => card.matched);
    }

    handleWin(): void {
        if (this.checkWin()) {
            const winSound = document.getElementById("win-sound") as HTMLAudioElement;
            const winSound2 = document.getElementById("win-sound2") as HTMLAudioElement;
            winSound2.play();
            winSound.play();
            this.triggerCelebration();
            setTimeout(() => {
                this.game.handleWin();
                this.stopTimer();
                // this.keepPlay();
                this.render(); // Render the updated state
            }, 4000); // 2-second delay
        }
    }

    private stopTimer(): void {
        if (this.game.timerInterval) {
            clearInterval(this.game.timerInterval);
            this.game.timerInterval = 0; // Reset the interval ID
        }
    }

    // private keepPlay(): void {
    //     const setupScreen = document.getElementById("setup-screen") as HTMLElement;
    //     const gameContainer = document.getElementById("game-container") as HTMLElement;

    //     // Hide the game container and show the setup screen
    //     gameContainer.style.display = "block";
    //     setupScreen.style.display = "none";
    // }

    triggerCelebration(): void {
        const cards = document.querySelectorAll(".card");

        // Trigger explosion effect
        cards.forEach((card) => {
            const cardElement = card as HTMLElement;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Generate random directions for the explosion
            const angle = Math.random() * 360;
            const distance = Math.random() * 620 + 200;
            const x = Math.cos((angle * Math.PI) / 180) * distance;
            const y = Math.sin((angle * Math.PI) / 180) * distance;
            const rotation = Math.random() * 720 - 360;

            cardElement.style.position = "absolute";
            cardElement.style.left = `${centerX}px`;
            cardElement.style.top = `${centerY}px`;

            cardElement.style.position = "absolute";
            cardElement.style.transition = "transform 1.5s ease, opacity 1.5s ease";
            cardElement.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        });

        // Display a congratulatory message
        const winMessage = document.createElement("div");
        winMessage.id = "win-message";
        winMessage.innerHTML = `
            <h1>🎉 Congratulations! 🎉</h1>
            <p>You completed the game, lets see how about now !</p>
        `;
        document.body.appendChild(winMessage);

        // Style the congratulatory message
        winMessage.style.position = "fixed";
        winMessage.style.top = "50%";
        winMessage.style.left = "50%";
        winMessage.style.transform = "translate(-50%, -50%)";
        winMessage.style.background = "rgba(0, 0, 0, 0.8)";
        winMessage.style.color = "white";
        winMessage.style.padding = "20px";
        winMessage.style.borderRadius = "10px";
        winMessage.style.textAlign = "center";
        winMessage.style.zIndex = "1000";

        setTimeout(() => {
            document.getElementById("win-message")?.remove();
        }, 4000); // 2-second delay
    }
}
