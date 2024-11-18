import { Game , Card , GameState} from "./boardgame.js";
import { PowerUpManager } from "./powerUpManager.js";
import { WinningManager } from "./winningManager.js";
import { PeekPowerUp } from "./peekPowerUp.js";
import { ExtraTimePowerUp } from "./extraTimePowerUp.js";
import { ShufflePowerUp } from "./ShufflePowerUp.js";


const gameBoard = document.getElementById("game-board");
const resetButton = document.getElementById("reset-button");
const movesCounter = document.getElementById("moves-counter");
const timer = document.getElementById("timer");
const timeSelect = document.getElementById("time-select") as HTMLSelectElement;
const startGameButton = document.getElementById("start-game-button") as HTMLButtonElement;
const setupScreen = document.getElementById("setup-screen") as HTMLElement;
const gameContainer = document.getElementById("game-container") as HTMLElement;

let countdownTime: number | null = null; 
let flippedCards: { index: number; card: Card }[] = [];
let isProcessing: boolean = false; 
let remainingTime: number = 0;
let timerInterval: number = 0;


const game = new Game();
const powerUpManager = new PowerUpManager(game);
const winningManager = new WinningManager(game, render);


powerUpManager.register(new PeekPowerUp(render));
powerUpManager.register(new ExtraTimePowerUp(render));
powerUpManager.register(new ShufflePowerUp());

document.addEventListener('DOMContentLoaded', () => {
    loadGameState(game);
    render();
});

document.getElementById("reset-button")?.addEventListener("click", () => {
    resetGame();
});

document.getElementById("peek-button")?.addEventListener("click", () => {
    powerUpManager.use("Peek");
    const button = document.getElementById("peek-button") as HTMLButtonElement;
    button.disabled = true; 
    saveGameState(game);
    render();
});

document.getElementById("extra-time-button")?.addEventListener("click", () => {
    powerUpManager.use("Extra Time");
    remainingTime += 30; // Directly add to the remainingTime variable
    const button = document.getElementById("extra-time-button") as HTMLButtonElement;
    button.disabled = true;
    saveGameState(game);
    render();
});

document.getElementById("winning-button")?.addEventListener("click", () => {
    const cards = game.getCards();
    cards.forEach(card => {
        card.flipped = true;
        card.matched = true;
    });
    const peek_button = document.getElementById("peek-button") as HTMLButtonElement;
    peek_button.disabled = false
    const extra_button = document.getElementById("extra-time-button") as HTMLButtonElement;
    extra_button.disabled = false
    const shuffle_button = document.getElementById("shuffle-button") as HTMLButtonElement;
    shuffle_button.disabled = false
    const flippedCards = document.querySelectorAll('.card');
    flippedCards.forEach(cardElement => {
        cardElement.classList.add('flipped');
    });
    winningManager.handleWin();
    loadGameState(game);
});

document.getElementById("pick-5-sec-button")?.addEventListener("click", () => {
    const flippedCards = document.querySelectorAll('.card');
    flippedCards.forEach(cardElement => {
        cardElement.classList.add('flipped');
    });
    setTimeout(() => {
        flippedCards.forEach(cardElement => {
            cardElement.classList.remove('flipped');
        });
    }, 5000);
});

document.getElementById("shuffle-button")?.addEventListener("click", () => {
    powerUpManager.use("Shuffle");
    const button = document.getElementById("shuffle-button") as HTMLButtonElement;
    button.disabled = true; 
    render();
});

document.getElementById("shuffle-button")?.addEventListener("click", () => {
    powerUpManager.use("Shuffle");
    const button = document.getElementById("shuffle-button") as HTMLButtonElement;
    button.disabled = true; 
    render();
});

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "p": // "Peek" power-up
            powerUpManager.use("Peek");
            render();
            break;
        case "e": // "Extra Time" power-up
            powerUpManager.use("Extra Time");
            render();
            break;
        case "s": // "Shuffle" power-up
            powerUpManager.use("Shuffle");
            render();
            break;
        default:
            console.log("No power-up mapped to this key.");
    }
});

// Function to start the timer
function startTimer(time: number = 60): void {
    if (game.timerInterval) clearInterval(game.timerInterval); // Clear existing timer

    remainingTime = countdownTime !== null ? countdownTime : time; // Initialize remaining time

    game.timerInterval = window.setInterval(() => {
        if (timer) {
            if (countdownTime !== null) {
                // Countdown mode
                if (remainingTime > 0) {
                    remainingTime--;
                    game.setRemainingTime(remainingTime)
                    timer.textContent = `Time: ${game.remainingTime}s`;
                } else {
                    if (game.isGameOver()) {
                        clearInterval(game.timerInterval); // Stop the timer
                        alert("Time's up! Game Over.");
                        resetGame(); // Reset the game
                    }
                }
            } else {
                // Normal timer mode
                timer.textContent = `Time: ${game.getTimeElapsed()}s`;
            }
        }
    }, 1000); // Update every second
}


startGameButton?.addEventListener("click", () => {
    const selectedTime = parseInt(timeSelect.value, 10);
    countdownTime = selectedTime > 0 ? selectedTime : null; // Null if "No Timer" is selected

    // Hide setup screen and show game container
    setupScreen.style.display = "none";
    gameContainer.style.display = "block";

    // Start the game
    startGame(countdownTime);
});


// Function to render the game board and UI
function render(): void {
    if (!gameBoard || !movesCounter || !timer) return;

    gameBoard.innerHTML = ""; // Clear the game board

    game.getCards().forEach((card: Card, index: number) => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";

        if (card.flipped || card.matched) {
            cardElement.classList.add("flipped");
        }

        const cardInner = document.createElement("div");
        cardInner.className = "card-inner";

        const cardFront = document.createElement("div");
        cardFront.className = "card-front";
        cardFront.textContent = "?";

        const cardBack = document.createElement("div");
        cardBack.className = "card-back";
        cardBack.style.backgroundColor = card.color;

        const iconElement = document.createElement("i");
        iconElement.className = `fas ${card.shape}`;
        cardBack.appendChild(iconElement);


        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);

        // Attach power-up buttons to UI
        

        // Handle click event
        cardElement.addEventListener("click", () => {
            if (card.flipped || card.matched || isProcessing || cardElement.classList.contains("flipped")) return;
            
            const flipSound = document.getElementById("flip-sound") as HTMLAudioElement;
            flipSound.play()
            
            cardElement.classList.add("flipped");
            flippedCards.push({ index, card });

            const requiredMatches = game.isMultiSelectMode ? 3 : 2;
            
            if (flippedCards.length === requiredMatches) {
                // Check if all cards match by comparing to the first card

                const allMatch = flippedCards.every(card => 
                    card.card.value === flippedCards[0].card.value &&
                    card.card.shape === flippedCards[0].card.shape &&
                    card.card.color === flippedCards[0].card.color
                );
                
                if (allMatch) {
                    setTimeout(() => {
                        flippedCards.forEach(({index}) => {
                            game.getCards()[index].matched = true;
                        });
                        flippedCards = [];
                        render();
                        onMove();
                        winningManager.handleWin();
                    }, 500);
                } else {
                    isProcessing = true;
                    setTimeout(() => {
                        const flipBackSound = document.getElementById("flip-back-sound") as HTMLAudioElement;
                        flipBackSound.play();
                        flipBackSound.play();
                        flippedCards.forEach(({index}) => {
                            game.getCards()[index].flipped = false;
                        });
                        onMove();

                        document.querySelectorAll(".card").forEach((el, idx) => {
                            if (flippedCards.some(card => card.index === idx)) {
                                el.classList.remove("flipped");
                            }
                        });

                        flippedCards = [];
                        isProcessing = false;
                    }, 600);
                }
            }
        });

        gameBoard.appendChild(cardElement);
    });

    // Update move counter and timer
    movesCounter.textContent = `Moves: ${game.getMoves()}`;
}


function resetGame(): void {
    clearInterval(game.timerInterval); // Stop the timer
    game.reset(); // Reset the game state
    resetGameState(game);
    render(); // Re-render the game board
    const peek_button = document.getElementById("peek-button") as HTMLButtonElement;
    peek_button.disabled = false
    const extra_button = document.getElementById("extra-time-button") as HTMLButtonElement;
    extra_button.disabled = false
    const shuffle_button = document.getElementById("shuffle-button") as HTMLButtonElement;
    shuffle_button.disabled = false
    // Show the setup screen again
    setupScreen.style.display = "block";
    gameContainer.style.display = "none";
}

// Start the game
function startGame(countdownTime: number | null): void {
    if (game.timerInterval !== null) {
        game.setCountdownTime(game.timerInterval);
    } else {
        console.warn("Starting game without a timer.");
    }

    render(); // Render the initial game board

    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        // Check if the button already exists
        let modeToggleButton = document.getElementById('mode-toggle-button') as HTMLButtonElement;
        if (!modeToggleButton) {
            modeToggleButton = document.createElement('button');
            modeToggleButton.id = 'mode-toggle-button'; // Assign an ID to the button
            modeToggleButton.textContent = 'Toggle Multi-Select Mode';
            modeToggleButton.addEventListener('click', () => {
                game.toggleMultiSelectMode();
                modeToggleButton.textContent = game.isMultiSelectMode ? 'Switch to Normal Mode' : 'Switch to Multi-Select Mode';
            });
            gameContainer.appendChild(modeToggleButton);
        }
    }
    startTimer(); // Start the game timer
}

function saveGameState(game: Game): void {
    const gameState: GameState = {
        gridSize: game.getGridSize(),
        cards: game.getCards(),
        moves: game.getMoves(),
        remainingTime: game.getRemainingTime(),
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGameState(game: Game): void {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const gameState: GameState = JSON.parse(savedState);
        game.setGridSize(gameState.gridSize);
        game.setCards(gameState.cards);
        game.setMoves(gameState.moves);
        game.setRemainingTime(gameState.remainingTime);
    }
}

function resetGameState(game: Game): void {
    game.setGridSize(4); // Reset to default grid size
    game.setMoves(0); // Reset moves
    game.setTimeElapsed(0); // Reset timer
    saveGameState(game); // Save the reset state
}

function onMove() {
    game.incrementMoves();
    saveGameState(game);
}