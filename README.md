# Card Game with Power-Ups

This project is a browser-based card game where players can use various power-ups to enhance their gameplay experience. The game is built using TypeScript and provides an engaging way to test your memory and strategic skills.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Technical Decisions](#technical-decisions)
- [Assumptions and Trade-offs](#assumptions-and-trade-offs)
- [Implemented Features](#implemented-features)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/card-game.git

Copy

Apply

Navigate to the project directory:

cd card-game

Copy

Execute

Install dependencies:

npm install

Copy

Execute

Build the project: Compile the TypeScript files:

npx tsc

Copy

Execute

Run the project: Use live-server to start a local development server:

live-server

Copy

Execute

This will open your default web browser to the project.

Technical Decisions
TypeScript: Chosen for its static typing and ability to catch errors at compile time, improving code quality and maintainability.
Modular Design: The codebase is organized into modules, such as boardgame.ts and powerUpManager.ts, to separate concerns and enhance readability.
DOM Manipulation: Direct DOM manipulation is used for rendering the game board and updating the UI, providing fine-grained control over the game interface.
Assumptions and Trade-offs
Single-Player Focus: The game is designed for single-player use, prioritizing simplicity and ease of use over multiplayer capabilities.
Browser Environment: Assumes a modern browser environment, leveraging features like setInterval for timing and localStorage for state persistence.
Performance vs. Complexity: Chose straightforward algorithms for card shuffling and matching, prioritizing performance and simplicity over complex features.
Implemented Features
Card Matching: Players can flip cards to find matching pairs.
Power-Ups: Includes Peek, Extra Time, and Shuffle power-ups to enhance gameplay.
Timer and Move Counter: Tracks the time and number of moves taken by the player.
Multi-Select Mode: Allows players to toggle between normal and multi-select modes for increased difficulty.
Future Improvements
Responsive Design: Enhance the UI to be fully responsive across different devices and screen sizes.
Sound Effects: Add more sound effects for different game actions to improve user engagement.
Leaderboard: Implement a leaderboard to track high scores and encourage competition.
Multiplayer Mode: Explore adding a multiplayer mode for competitive play.
Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

License
This project is licensed under the MIT License. See the LICENSE file for details.