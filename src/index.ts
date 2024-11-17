import { Game, Card } from "./boardgame.js";


const gameBoard = document.getElementById("game-board");
const resetButton = document.getElementById("reset-button");
const movesCounter = document.getElementById("moves-counter");
const timer = document.getElementById("timer");
const timeSelect = document.getElementById("time-select") as HTMLSelectElement;
const startGameButton = document.getElementById("start-game-button") as HTMLButtonElement;
const setupScreen = document.getElementById("setup-screen") as HTMLElement;
const gameContainer = document.getElementById("game-container") as HTMLElement;


let countdownTime: number | null = null; 
let timerInterval: number  = 0; // For managing the timer interval
let flippedCards: { index: number; card: Card }[] = [];
let isProcessing: boolean = false; 

const game = new Game();

// Function to start the timer
function startTimer(): void {
    if (timerInterval) clearInterval(timerInterval); // Clear existing timer

    let remainingTime = countdownTime !== null ? countdownTime : 0; // Initialize remaining time

    timerInterval = window.setInterval(() => {
        if (timer) {
            if (countdownTime !== null) {
                // Countdown mode
                if (remainingTime > 0) {
                    remainingTime--;
                    timer.textContent = `Time: ${remainingTime}s`;
                } else {
                    clearInterval(timerInterval); // Stop the timer
                    alert("Time's up! Game Over.");
                    resetGame(); // Reset the game
                }
            } else {
                // Normal timer mode
                timer.textContent = `Time: ${game.getTimeElapsed()}s`;
            }
        }
    }, 1000); // Update every second
}

function checkWinCondition(): void {
    if (game.getCards().every((card) => card.matched)) {
        clearInterval(timerInterval); // Stop the timer
        displayWinCelebration(); // Update card values
    }
}

function displayWinCelebration(): void {
    const cards = document.querySelectorAll(".card");

    // Prepare cards for the explosion animation
    cards.forEach((card) => {
        const cardElement = card as HTMLElement;

        // Set initial positions to ensure the transition works
        const rect = cardElement.getBoundingClientRect();
        cardElement.style.position = "absolute";
        cardElement.style.left = `${rect.left}px`;
        cardElement.style.top = `${rect.top}px`;
        cardElement.style.transition = "transform 1.5s ease, opacity 1.5s ease"; // Smooth animation
    });

    // Force reflow to register initial positions
    void document.body.offsetHeight;

    // Trigger explosion effect
    cards.forEach((card) => {
        const cardElement = card as HTMLElement;

        // Generate random directions for the explosion
        const angle = Math.random() * 360; // Random angle in degrees
        const distance = Math.random() * 500 + 200; // Distance (200px to 700px)
        const x = Math.cos((angle * Math.PI) / 180) * distance; // X translation
        const y = Math.sin((angle * Math.PI) / 180) * distance; // Y translation
        const rotation = Math.random() * 720 - 360; // Rotation angle (-360 to 360 degrees)

        // Apply the explosion transformation
        cardElement.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        cardElement.classList.add("explode"); // Add fade-out effect
    });

    // Display a congratulatory message
    const winMessage = document.createElement("div");
    winMessage.id = "win-message";
    winMessage.innerHTML = `
        <h1>🎉 Congratulations! 🎉</h1>
        <p>You completed the game !</p>
        <button id="play-again">Play Again</button>
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

    // Add event listener to "Play Again" button
    document.getElementById("play-again")?.addEventListener("click", () => {
        document.body.removeChild(winMessage); // Remove the message
        resetGame(); // Reset the game
    });
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
        cardBack.textContent = card.value;

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);

        // Handle click event
        cardElement.addEventListener("click", () => {
            if (card.flipped || card.matched || isProcessing || cardElement.classList.contains("flipped")) return;

            
            cardElement.classList.add("flipped");
            flippedCards.push({ index, card });

            if (flippedCards.length === 2) {
                const [first, second] = flippedCards;

                if (first.card.value === second.card.value) {
                    setTimeout(() => {
                        first.card.matched = true;
                        second.card.matched = true;
                        flippedCards = [];
                        render();
                        game.makeAMove(index);
                        checkWinCondition();
                    }, 500);
                } else {
                    isProcessing = true;
                    setTimeout(() => {
                        game.getCards()[first.index].flipped = false;
                        game.getCards()[second.index].flipped = false;
                        game.makeAMove(index);

                        document.querySelectorAll(".card").forEach((el, idx) => {
                            if (idx === first.index || idx === second.index) {
                                el.classList.remove("flipped");
                            }
                        });

                        flippedCards = [];
                        isProcessing = false;
                        render();
                    }, 600);
                }
            }

            movesCounter.textContent = `Moves: ${game.getMoves()}`;
        });

        gameBoard.appendChild(cardElement);
    });

    // Update move counter and timer
    movesCounter.textContent = `Moves: ${game.getMoves()}`;
}


function resetGame(): void {
    clearInterval(timerInterval); // Stop the timer
    game.reset(); // Reset the game state
    render(); // Re-render the game board

    // Show the setup screen again
    setupScreen.style.display = "block";
    gameContainer.style.display = "none";
}

// Start the game
function startGame(countdownTime: number | null): void {
    render(); // Render the initial game board
    startTimer(); // Start the game timer
}