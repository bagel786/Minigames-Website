// script.js

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get the game area div
    const gameArea = document.getElementById('game-area');
    const messageBox = document.getElementById('message-box');

    // Function to display messages
    function showMessage(message, duration = 3000) {
        messageBox.textContent = message;
        messageBox.classList.add('show');
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, duration);
    }


    // --- Game Implementations ---

    // Tic Tac Toe Game (Keep as is from original script)
    function loadTicTacToe() {
        gameArea.innerHTML = `
            <h2 class="text-2xl font-semibold text-center mb-6 text-gray-800">Tic Tac Toe</h2>
            <div id="tic-tac-toe-board" class="mx-auto">
                <div class="tic-tac-toe-cell" data-index="0"></div>
                <div class="tic-tac-toe-cell" data-index="1"></div>
                <div class="tic-tac-toe-cell" data-index="2"></div>
                <div class="tic-tac-toe-cell" data-index="3"></div>
                <div class="tic-tac-toe-cell" data-index="4"></div>
                <div class="tic-tac-toe-cell" data-index="5"></div>
                <div class="tic-tac-toe-cell" data-index="6"></div>
                <div class="tic-tac-toe-cell" data-index="7"></div>
                <div class="tic-tac-toe-cell" data-index="8"></div>
            </div>
            <p id="tic-tac-toe-status" class="text-center mt-6 text-xl text-gray-700 font-semibold"></p>
             <button id="tic-tac-toe-reset" class="block mx-auto mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Reset Game</button>
        `;

        const cells = document.querySelectorAll('.tic-tac-toe-cell');
        const statusDisplay = document.getElementById('tic-tac-toe-status');
        const resetButton = document.getElementById('tic-tac-toe-reset');

        let board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';
        let gameActive = true; // Tic Tac Toe specific game active flag

        // Winning conditions
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        // Handle cell click
        function handleCellClick(event) {
            const clickedCell = event.target;
            const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

            // If the cell is already filled or game is inactive, do nothing
            if (board[clickedCellIndex] !== '' || !gameActive) {
                return;
            }

            // Update the board and display
            board[clickedCellIndex] = currentPlayer;
            clickedCell.textContent = currentPlayer;
             clickedCell.style.color = currentPlayer === 'X' ? '#ef4444' : '#3b82f6'; // Red for X, Blue for O

            // Check for win or draw
            checkResult();

            // Switch player
            if (gameActive) { // Only switch player if game is still active
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateStatus();
            }
        }

        // Check for win or draw
        function checkResult() {
            let roundWon = false;
            for (let i = 0; i < winningConditions.length; i++) {
                const winCondition = winningConditions[i];
                const a = board[winCondition[0]];
                const b = board[winCondition[1]];
                const c = board[winCondition[2]];

                if (a === '' || b === '' || c === '') {
                    continue;
                }
                if (a === b && b === c) {
                    roundWon = true;
                    // Highlight winning cells
                    winCondition.forEach(index => {
                        cells[index].style.backgroundColor = '#fde047'; // Yellow highlight
                    });
                    break;
                }
            }

            if (roundWon) {
                statusDisplay.textContent = `Player ${currentPlayer} wins!`;
                showMessage(`Player ${currentPlayer} wins!`);
                gameActive = false;
                return;
            }

            // Check for draw
            if (!board.includes('')) {
                statusDisplay.textContent = 'Draw!';
                showMessage('Draw!');
                gameActive = false;
                return;
            }
        }

        // Update the status display
        function updateStatus() {
            if (gameActive) {
                statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
            }
        }

        // Reset the game
        function resetGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            gameActive = true;
            currentPlayer = 'X';
            cells.forEach(cell => {
                cell.textContent = '';
                cell.style.backgroundColor = '#e2e8f0'; // Reset background color
                cell.style.color = '#2d3748'; // Reset text color
            });
            updateStatus();
             showMessage('Tic Tac Toe game reset.');
        }

        // Add event listeners
        cells.forEach(cell => cell.addEventListener('click', handleCellClick));
        resetButton.addEventListener('click', resetGame);

        // Initial status display
        updateStatus();
    }


    // Tetris Game (Corrected)
    function loadTetris() {
         gameArea.innerHTML = `
            <h2 class="text-2xl font-semibold text-center mb-6 text-gray-800">Tetris</h2>
            <canvas id="tetris-board"></canvas>
            <p id="tetris-score" class="text-center mt-4 text-xl text-gray-700 font-semibold font-['Press_Start_2P']">Score: 0</p>
            <div class="text-center mt-6 space-x-4">
                <button id="tetris-start" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">Start</button>
                <button id="tetris-pause" class="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">Pause</button>
            </div>
             <p class="text-center mt-4 text-gray-600 text-sm">Use Arrow Keys to move and rotate.</p>
        `;

        const canvas = document.getElementById('tetris-board');
        const context = canvas.getContext('2d');
        const scoreDisplay = document.getElementById('tetris-score');
        const startButton = document.getElementById('tetris-start');
        const pauseButton = document.getElementById('tetris-pause');

        // Tetris board dimensions
        const boardWidth = 10;
        const boardHeight = 20;
        const blockSize = 30;
        canvas.width = boardWidth * blockSize;
        canvas.height = boardHeight * blockSize;

        context.scale(blockSize, blockSize);

        // Board state
        let board; // Will be initialized in resetTetrisGame

        // Tetromino shapes and colors
        const tetrominoes = [
            [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
            [[2, 2], [2, 2]],                                        // O
            [[0, 3, 3], [3, 3, 0], [0, 0, 0]],                       // S
            [[4, 4, 0], [0, 4, 4], [0, 0, 0]],                       // Z
            [[0, 5, 0], [5, 5, 5], [0, 0, 0]],                       // T (Corrected T-shape)
            [[0, 0, 6], [6, 6, 6], [0, 0, 0]],                       // L (Corrected L-shape)
            [[7, 0, 0], [7, 7, 7], [0, 0, 0]]                        // J (Corrected J-shape)
        ];

        const colors = [
            null, '#06b6d4', '#facc15', '#84cc16', '#ef4444',
            '#a855f7', '#f97316', '#3b82f6'
        ];

        let currentPiece;
        let currentPosition;
        let score;
        let gameInterval = null;
        let dropSpeed;
        let isPaused;
        let gameOver; // Added game over flag

        // Function to reset game state
        function resetTetrisGame() {
            board = Array(boardHeight).fill(null).map(() => Array(boardWidth).fill(0));
            score = 0;
            dropSpeed = 1000;
            isPaused = false;
            gameOver = false; // Reset game over flag
            currentPiece = createPiece();
            currentPosition = { x: Math.floor(boardWidth / 2) - Math.floor(currentPiece[0].length / 2), y: 0 };
            updateScore();
            pauseButton.textContent = 'Pause'; // Reset pause button text
             if (gameInterval) {
                 clearInterval(gameInterval); // Clear any existing interval
                 gameInterval = null;
             }
            draw();
        }


        // Function to create a random piece
        function createPiece() {
            const randIndex = Math.floor(Math.random() * tetrominoes.length);
            // Deep copy is important here
            return JSON.parse(JSON.stringify(tetrominoes[randIndex].filter(row => row.some(cell => cell !== 0)))); // Filter empty rows for better rotation origin
        }


        // Function to draw the board and pieces
        function draw() {
            // Clear canvas
            context.fillStyle = '#1a202c';
            context.fillRect(0, 0, boardWidth, boardHeight);

            // Draw landed blocks
            board.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        context.fillStyle = colors[value];
                        context.fillRect(x, y, 1, 1);
                        context.strokeStyle = '#2d3748';
                        context.lineWidth = 0.05;
                        context.strokeRect(x, y, 1, 1);
                    }
                });
            });

            // Draw current piece
            if (currentPiece && !gameOver) { // Don't draw piece if game over
                currentPiece.forEach((row, y) => {
                    row.forEach((value, x) => {
                        if (value !== 0) {
                            context.fillStyle = colors[value];
                            context.fillRect(currentPosition.x + x, currentPosition.y + y, 1, 1);
                            context.strokeStyle = '#2d3748';
                            context.lineWidth = 0.05;
                            context.strokeRect(currentPosition.x + x, currentPosition.y + y, 1, 1);
                        }
                    });
                });
            }
        }

        // Function to merge the current piece into the board
        function merge() {
            currentPiece.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        const boardY = currentPosition.y + y;
                        const boardX = currentPosition.x + x;
                        // Ensure position is valid before merging
                        if (boardY >= 0 && boardY < boardHeight && boardX >= 0 && boardX < boardWidth) {
                            board[boardY][boardX] = value;
                        }
                    }
                });
            });
        }

        // Function to check for collisions (Corrected Check)
        function collide() {
            for (let y = 0; y < currentPiece.length; ++y) {
                for (let x = 0; x < currentPiece[y].length; ++x) {
                    if (currentPiece[y][x] !== 0) {
                        const boardX = currentPosition.x + x;
                        const boardY = currentPosition.y + y;

                        // Check boundaries and existing blocks
                        if (boardX < 0 || boardX >= boardWidth || boardY >= boardHeight ||
                            (boardY >= 0 && board[boardY] && board[boardY][boardX] !== 0)) { // Check against !== 0
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        // Function to rotate the piece
        function rotate(piece, dir) {
            // Simple rotation logic (transpose + reverse rows)
            const matrix = piece;
            const N = matrix.length;
            const M = matrix[0].length; // Handle non-square pieces if needed

            // Create a new rotated matrix
             const rotated = Array(M).fill(null).map(() => Array(N).fill(0));
             for (let i = 0; i < N; i++) {
                 for (let j = 0; j < M; j++) {
                     if (dir > 0) { // Clockwise
                         rotated[j][N - 1 - i] = matrix[i][j];
                     } else { // Counter-clockwise (not implemented here, assumed dir=1)
                         // rotated[M - 1 - j][i] = matrix[i][j];
                         // Simplified: just support clockwise
                          rotated[j][N - 1 - i] = matrix[i][j];
                     }
                 }
             }


            const originalPiece = currentPiece; // Save original state
            const originalPos = { ...currentPosition }; // Save original position

            currentPiece = rotated; // Try the rotation

            // Wall kick / collision adjustment after rotation
             let offset = 1;
             while (collide()) {
                 currentPosition.x += offset;
                 offset = -(offset + (offset > 0 ? 1 : -1));
                 if (Math.abs(offset) > Math.max(currentPiece[0].length, currentPiece.length)) { // Avoid infinite loop
                     currentPiece = originalPiece; // Revert piece
                     currentPosition = originalPos; // Revert position
                     return; // Rotation failed
                 }
             }

        }

        // Function to move the piece down
        function dropPiece() {
            if (isPaused || gameOver) return; // Don't drop if paused or game over

            currentPosition.y++;
            if (collide()) {
                currentPosition.y--; // Move back up
                merge();          // Merge into board
                removeLines();    // Check for completed lines
                currentPiece = createPiece(); // Get next piece
                currentPosition = { x: Math.floor(boardWidth / 2) - Math.floor(currentPiece[0].length / 2), y: 0 }; // Reset position

                // Check for game over
                if (collide()) {
                    gameOver = true; // Set game over flag
                    showMessage('Game Over!', 5000);
                    clearInterval(gameInterval);
                    gameInterval = null;
                    draw(); // Draw final board state
                }
            }
             if (!gameOver) draw(); // Only draw if not game over
        }

        // Function to remove completed lines
        function removeLines() {
            let linesRemoved = 0;
            outer: for (let y = board.length - 1; y >= 0; --y) {
                for (let x = 0; x < board[y].length; ++x) {
                    if (board[y][x] === 0) {
                        continue outer;
                    }
                }
                // Line is full
                const row = board.splice(y, 1)[0].fill(0);
                board.unshift(row);
                linesRemoved++;
                y++; // Recheck the same index
            }

            if (linesRemoved > 0) {
                // Scoring: 1 line: 100, 2 lines: 300, 3 lines: 500, 4 lines (Tetris): 800 (example scoring)
                score += linesRemoved === 1 ? 100 : linesRemoved === 2 ? 300 : linesRemoved === 3 ? 500 : linesRemoved === 4 ? 800 : 0;
                updateScore();

                // Optional: Increase speed
                // Example: Increase speed every 500 points
                if (Math.floor(score / 500) > Math.floor((score - (linesRemoved === 1 ? 100 : linesRemoved === 2 ? 300 : linesRemoved === 3 ? 500 : 800)) / 500)) {
                   if (dropSpeed > 100) { // Minimum speed limit
                       dropSpeed -= 50;
                       showMessage(`Speed Increased! Interval: ${dropSpeed}ms`);
                       // Restart interval with new speed if running
                       if (gameInterval && !isPaused) {
                            clearInterval(gameInterval);
                            gameInterval = setInterval(dropPiece, dropSpeed);
                       }
                   }
                }
            }
        }

        // Update the score display
        function updateScore() {
            scoreDisplay.textContent = `Score: ${score}`;
        }

        // Handle keyboard input
        function handleKeyPress(event) {
             if (!gameInterval || isPaused || gameOver) return; // Ignore input if not running, paused, or game over

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault(); // Prevent page scrolling
            }

            if (event.key === 'ArrowLeft') {
                currentPosition.x--;
                if (collide()) {
                    currentPosition.x++; // Revert if collision
                }
            } else if (event.key === 'ArrowRight') {
                currentPosition.x++;
                if (collide()) {
                    currentPosition.x--; // Revert if collision
                }
            } else if (event.key === 'ArrowDown') {
                dropPiece(); // Move down one step
                 // Optional: Score points for manual drop
                 // score += 1;
                 // updateScore();
            } else if (event.key === 'ArrowUp') {
                rotate(currentPiece, 1); // Rotate clockwise
            }
            draw(); // Redraw after move/rotate
        }

        // Start the game (Corrected Logic)
        startButton.addEventListener('click', () => {
            if (gameInterval) { // If interval exists (game running or paused)
                 showMessage('Game already running. Reset maybe?', 3000);
                 return; // Or maybe reset and start? Decided against auto-reset here.
            }
             resetTetrisGame(); // Reset state before starting
             showMessage('Tetris game started!');
             gameInterval = setInterval(dropPiece, dropSpeed); // Start the drop interval
        });

         // Pause/Resume the game (Corrected Logic)
        pauseButton.addEventListener('click', () => {
            if (!gameInterval && !gameOver) { // Cannot pause/resume if game hasn't started or is over
                showMessage('Start the game first!', 3000);
                return;
            }
            if (gameOver) { // Cannot pause/resume if game is over
                 showMessage('Game is over. Start a new game.', 3000);
                 return;
            }


            if (isPaused) {
                // Resume
                isPaused = false;
                pauseButton.textContent = 'Pause';
                showMessage('Tetris game resumed.');
                gameInterval = setInterval(dropPiece, dropSpeed); // Restart interval
            } else {
                // Pause
                isPaused = true;
                pauseButton.textContent = 'Resume';
                showMessage('Tetris game paused.');
                clearInterval(gameInterval); // Clear interval (important!)
                // Note: gameInterval reference is kept to know the game was running
            }
        });

        // Add keyboard event listener
        document.addEventListener('keydown', handleKeyPress);

         // Initial setup
         resetTetrisGame(); // Set up the initial board state

         // Clean up function when switching games
         return () => {
             if (gameInterval) {
                 clearInterval(gameInterval); // Clear the interval
             }
             document.removeEventListener('keydown', handleKeyPress); // Remove listener
             gameInterval = null; // Ensure interval is nullified
         };
    }

    // Card Matching Game (Keep as is from original script)
    function loadCardMatching() {
         gameArea.innerHTML = `
            <h2 class="text-2xl font-semibold text-center mb-6 text-gray-800">Card Matching</h2>
            <div id="card-matching-board" class="mx-auto">
                </div>
             <p id="card-matching-status" class="text-center mt-6 text-xl text-gray-700 font-semibold"></p>
             <button id="card-matching-reset" class="block mx-auto mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Reset Game</button>
        `;

        const boardElement = document.getElementById('card-matching-board');
        const statusDisplay = document.getElementById('card-matching-status');
        const resetButton = document.getElementById('card-matching-reset');

        // Array of letter identifiers for card pairs
        const cardIdentifiers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; // Using letters
        let cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let gameActive = true;
        let lockBoard = false; // To prevent flipping more than two cards at once

        // Function to create the cards
        function createCards() {
            // Use all identifiers for the game (8 pairs = 16 cards)
            cards = [...cardIdentifiers, ...cardIdentifiers]; // Create pairs
            shuffle(cards); // Shuffle the cards
            boardElement.innerHTML = ''; // Clear previous cards

            cards.forEach((identifier, index) => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card', 'rounded-lg', 'shadow-md');
                cardElement.setAttribute('data-identifier', identifier); // Store identifier for matching
                cardElement.setAttribute('data-index', index);

                 cardElement.innerHTML = `
                    <div class="card-inner">
                        <div class="card-back">?</div>
                        <div class="card-front">${identifier}</div>
                    </div>
                `;

                // Add event listener now, but clicks will be blocked by lockBoard during initial reveal
                cardElement.addEventListener('click', handleCardClick);
                boardElement.appendChild(cardElement);
            });

             statusDisplay.textContent = 'Memorize the pairs!';
             matchedPairs = 0; // Reset matched pairs
             gameActive = true; // Ensure game is active on reset/creation
             lockBoard = true; // Lock the board during the initial reveal

             // Set a timeout to reveal the cards, then flip them back
             setTimeout(() => {
                 // Reveal the cards (flip to show letters)
                 document.querySelectorAll('.card').forEach(card => {
                     card.classList.add('flipped');
                 });

                 // Set another timeout to flip the cards back and unlock the board
                 setTimeout(() => {
                     document.querySelectorAll('.card').forEach(card => {
                         // Only remove 'flipped' if the card hasn't been matched during the reveal time (unlikely but safe)
                         if (!card.classList.contains('matched')) {
                             card.classList.remove('flipped');
                         }
                     });
                     lockBoard = false; // Unlock the board after reveal
                     statusDisplay.textContent = 'Flip a card!';
                     showMessage('Go!'); // Indicate the game is ready
                 }, 2000); // Reveal duration (2 seconds)

             }, 500); // Short delay before initial reveal starts (optional, makes it smoother)
        }

        // Function to shuffle an array (Fisher-Yates algorithm)
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Swap elements
            }
            return array;
        }

        // Handle card click
        function handleCardClick(event) {
            const clickedCard = event.currentTarget;

            // If the board is locked, the card is already flipped or matched, do nothing
            if (lockBoard || clickedCard.classList.contains('flipped') || clickedCard.classList.contains('matched') || !gameActive) {
                return;
            }

            // Flip the card
            clickedCard.classList.add('flipped');
            flippedCards.push(clickedCard);

            // If two cards are flipped, check for a match
            if (flippedCards.length === 2) {
                lockBoard = true; // Lock the board while checking
                checkMatch();
            }
        }

        // Check if the two flipped cards match
        function checkMatch() {
            const [card1, card2] = flippedCards;
            const identifier1 = card1.getAttribute('data-identifier');
            const identifier2 = card2.getAttribute('data-identifier');

            if (identifier1 === identifier2) {
                // Match!
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                flippedCards = []; // Clear flipped cards
                lockBoard = false; // Unlock the board

                // Check if all pairs are matched
                if (matchedPairs === cardIdentifiers.length) { // Compare with the number of unique identifiers used
                    statusDisplay.textContent = 'You matched all pairs! You win!';
                     showMessage('You matched all pairs! You win!');
                    gameActive = false;
                } else {
                     statusDisplay.textContent = 'Match found! Keep going!';
                     showMessage('Match found!');
                }

            } else {
                // No match, flip back after a delay
                 statusDisplay.textContent = 'No match. Try again!';
                 showMessage('No match.');
                setTimeout(() => {
                    // Check if cards still exist before trying to remove class (important if reset is clicked quickly)
                    if(card1 && !card1.classList.contains('matched')) card1.classList.remove('flipped');
                    if(card2 && !card2.classList.contains('matched')) card2.classList.remove('flipped');
                    flippedCards = []; // Clear flipped cards
                    lockBoard = false; // Unlock the board
                     if (gameActive) statusDisplay.textContent = 'Flip a card!'; // Only update status if game still active
                }, 1000); // Flip back after 1 second
            }
        }

        // Reset the game
        function resetGame() {
            flippedCards = [];
            matchedPairs = 0;
            gameActive = true;
            lockBoard = false; // Ensure board is unlocked on reset
            createCards(); // Recreate and shuffle cards (which includes the initial reveal)
             showMessage('Card Matching game reset.');
        }

        // Add reset button event listener
        resetButton.addEventListener('click', resetGame);

        // Initial game setup
        createCards();

         // Card matching cleanup (if needed in future)
         // return () => { /* cleanup logic */ };
    }

    // Ping Pong Game (Keep as is from original script)
    function loadPingPong() {
        gameArea.innerHTML = `
            <h2 class="text-2xl font-semibold text-center mb-6 text-gray-800">Ping Pong</h2>
            <canvas id="ping-pong-board" width="600" height="400"></canvas>
            <div class="text-center mt-4 text-xl text-gray-700 font-semibold font-['Press_Start_2P']">
                <span id="ping-pong-player-score">0</span> - <span id="ping-pong-ai-score">0</span>
            </div>
            <div class="text-center mt-6 space-x-4">
                <button id="ping-pong-start" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">Start</button>
                <button id="ping-pong-reset" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Reset</button>
            </div>
             <p class="text-center mt-4 text-gray-600 text-sm">Use W and S keys to move your paddle.</p>
        `;

        const canvas = document.getElementById('ping-pong-board');
        const context = canvas.getContext('2d');
        const playerScoreDisplay = document.getElementById('ping-pong-player-score');
        const aiScoreDisplay = document.getElementById('ping-pong-ai-score');
        const startButton = document.getElementById('ping-pong-start');
        const resetButton = document.getElementById('ping-pong-reset');

        // Game variables
        const paddleWidth = 10;
        const paddleHeight = 80;
        let playerPaddleY = (canvas.height - paddleHeight) / 2;
        let aiPaddleY = (canvas.height - paddleHeight) / 2;
        const ballSize = 10;
        let ballX = canvas.width / 2;
        let ballY = canvas.height / 2;
        let ballSpeedX = 5;
        let ballSpeedY = 5;
        let playerScore = 0;
        let aiScore = 0;
        const winningScore = 5; // First to 5 wins
        let gameInterval = null;
        let gameActive = false;

        // Input handling
        let keysPressed = {};
        // Use named functions for event listeners for easier removal
        const handleKeyDown = (event) => { keysPressed[event.key.toLowerCase()] = true; }; // Use lower case keys
        const handleKeyUp = (event) => { keysPressed[event.key.toLowerCase()] = false; };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);


        // Draw elements
        function drawRect(x, y, width, height, color) {
            context.fillStyle = color;
            context.fillRect(x, y, width, height);
        }

        function drawCircle(x, y, radius, color) {
            context.fillStyle = color;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2, false);
            context.fill();
        }

        function draw() {
            // Background
            drawRect(0, 0, canvas.width, canvas.height, '#1a202c');

            // Paddles
            drawRect(0, playerPaddleY, paddleWidth, paddleHeight, '#e2e8f0'); // Player paddle
            drawRect(canvas.width - paddleWidth, aiPaddleY, paddleWidth, paddleHeight, '#e2e8f0'); // AI paddle

            // Ball
            drawCircle(ballX, ballY, ballSize / 2, '#fde047'); // Yellow ball

            // Center line (optional)
            for (let i = 0; i < canvas.height; i += 15) {
                drawRect(canvas.width / 2 - 1, i, 2, 10, '#4a5568');
            }
        }

        // Move elements
        function move() {
            if (!gameActive) return;

            // Move player paddle
            if (keysPressed['w'] && playerPaddleY > 0) {
                playerPaddleY -= 7;
            }
            if (keysPressed['s'] && playerPaddleY < canvas.height - paddleHeight) {
                playerPaddleY += 7;
            }

            // Move AI paddle (simple AI)
            const aiCenter = aiPaddleY + paddleHeight / 2;
            const aiSpeed = 4; // AI paddle speed
            if (aiCenter < ballY - 10) { // Add some buffer to prevent jittering
                aiPaddleY += aiSpeed;
            } else if (aiCenter > ballY + 10) {
                aiPaddleY -= aiSpeed;
            }
             // Keep AI paddle within bounds
             aiPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, aiPaddleY));


            // Move ball
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            // Ball collision with top/bottom walls
            if (ballY - ballSize / 2 < 0 || ballY + ballSize / 2 > canvas.height) {
                ballSpeedY *= -1;
                ballY = (ballY - ballSize / 2 < 0) ? ballSize / 2 : canvas.height - ballSize / 2; // Prevent sticking
            }

            // Ball collision with paddles
            // Player paddle
             if (ballX - ballSize / 2 <= paddleWidth && // Check <= paddleWidth
                 ballX - ballSize / 2 > 0 && // Ensure ball isn't already past the paddle
                 ballY + ballSize / 2 >= playerPaddleY &&
                 ballY - ballSize / 2 <= playerPaddleY + paddleHeight)
             {
                 ballSpeedX *= -1;
                 // Adjust Y speed based on hit location
                 const deltaY = ballY - (playerPaddleY + paddleHeight / 2);
                 ballSpeedY = deltaY * 0.25; // Adjusted multiplier
                 ballX = paddleWidth + ballSize / 2; // Prevent sticking
            }

            // AI paddle
             if (ballX + ballSize / 2 >= canvas.width - paddleWidth && // Check >= edge
                 ballX + ballSize / 2 < canvas.width && // Ensure ball isn't already past
                 ballY + ballSize / 2 >= aiPaddleY &&
                 ballY - ballSize / 2 <= aiPaddleY + paddleHeight)
             {
                 ballSpeedX *= -1;
                 // Adjust Y speed
                 const deltaY = ballY - (aiPaddleY + paddleHeight / 2);
                 ballSpeedY = deltaY * 0.25; // Adjusted multiplier
                 ballX = canvas.width - paddleWidth - ballSize / 2; // Prevent sticking
             }


            // Ball out of bounds (scoring)
            if (ballX + ballSize / 2 < 0) { // Changed condition slightly for safety
                aiScore++;
                updateScore();
                resetBall();
                if(checkWin()) return; // Stop if game ended
            } else if (ballX - ballSize / 2 > canvas.width) { // Changed condition slightly
                playerScore++;
                updateScore();
                resetBall();
                if(checkWin()) return; // Stop if game ended
            }
        }

        // Reset ball position and speed
        function resetBall() {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            // Reverse direction after scoring
            ballSpeedX = -ballSpeedX;
            // Randomize vertical speed slightly
            ballSpeedY = (Math.random() * 6) - 3; // Between -3 and 3, less extreme
        }

        // Update score display
        function updateScore() {
            playerScoreDisplay.textContent = playerScore;
            aiScoreDisplay.textContent = aiScore;
        }

        // Check for win condition
        function checkWin() {
             let winner = null;
             if (playerScore >= winningScore) {
                 winner = 'Player';
             } else if (aiScore >= winningScore) {
                 winner = 'AI';
             }

             if (winner) {
                 showMessage(`${winner} Wins!`, 5000);
                 stopGame();
                 return true; // Indicate game ended
             }
             return false; // Indicate game continues
        }

        // Game loop
        function gameLoop() {
            move();
            draw();
        }

         // Stop game function
         function stopGame() {
             if (gameInterval) {
                 clearInterval(gameInterval);
                 gameInterval = null;
             }
             gameActive = false;
         }

         // Reset game state function
         function resetGameState() {
              playerScore = 0;
              aiScore = 0;
              updateScore();
              playerPaddleY = (canvas.height - paddleHeight) / 2;
              aiPaddleY = (canvas.height - paddleHeight) / 2;
              resetBall();
              // Do not change gameActive or interval here, only reset positions/scores
              draw(); // Draw initial state
         }


        // Start game
        startButton.addEventListener('click', () => {
             if (!gameActive) { // Only start if not already active
                 resetGameState(); // Reset scores/positions
                 gameActive = true;
                 gameInterval = setInterval(gameLoop, 1000 / 60); // Run at 60 FPS
                 showMessage('Ping Pong game started!');
             } else {
                 showMessage('Ping Pong game is already running.');
             }
        });

        // Reset button action
        resetButton.addEventListener('click', () => {
            stopGame();
            resetGameState(); // Reset scores and positions
             showMessage('Ping Pong game reset.');
        });


        // Initial draw
        draw();

        // Cleanup function
        return () => {
            stopGame();
            // Remove the specific listeners added for this game
             document.removeEventListener('keydown', handleKeyDown);
             document.removeEventListener('keyup', handleKeyUp);
        };
    }


    // Projectile Launch Game (Keep as is from original script)
    function loadProjectileGame() {
        gameArea.innerHTML = `
            <h2 class="text-2xl font-semibold text-center mb-6 text-gray-800">Projectile Game</h2>
            <canvas id="projectile-board" width="800" height="400"></canvas>
            <div class="text-center mt-4">
                 <span id="level-display" class="text-gray-700 font-semibold mr-4">Level: 1</span>
                <label for="launch-angle" class="text-gray-700 font-semibold">Angle:</label>
                <input type="range" id="launch-angle" min="0" max="90" value="45">
                <span id="angle-value" class="text-gray-700">45°</span>

                <label for="launch-power" class="text-gray-700 font-semibold ml-4">Power:</label>
                <input type="range" id="launch-power" min="10" max="100" value="50">
                <span id="power-value" class="text-gray-700">50</span>
            </div>
            <div class="text-center mt-6 space-x-4">
                <button id="projectile-launch" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">Launch</button>
                <button id="projectile-reset-level" class="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">Reset Level</button> {/* Changed Reset to Reset Level */}
                <button id="projectile-reset-game" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Reset Game</button>
            </div>
             <p id="projectile-status" class="text-center mt-4 text-xl text-gray-700 font-semibold"></p>
        `;

        const canvas = document.getElementById('projectile-board');
        const context = canvas.getContext('2d');
        const angleInput = document.getElementById('launch-angle');
        const angleValueSpan = document.getElementById('angle-value');
        const powerInput = document.getElementById('launch-power');
        const powerValueSpan = document.getElementById('power-value');
        const launchButton = document.getElementById('projectile-launch');
        const resetLevelButton = document.getElementById('projectile-reset-level'); // Renamed variable
        const resetGameButton = document.getElementById('projectile-reset-game'); // New variable
        const statusDisplay = document.getElementById('projectile-status');
        const levelDisplay = document.getElementById('level-display');

        // Game variables
        const gravity = 0.4; // Adjusted gravity slightly
        const bounceDampening = 0.7; // Adjusted dampening
        const groundY = canvas.height - 30;
        const launcherX = 50;
        const launcherY = groundY - 20; // Start projectile slightly above ground line

        let projectile = { x: launcherX, y: launcherY, radius: 10, color: '#fde047', velocityX: 0, velocityY: 0 };
        let isProjectileLaunched = false;
        let animationFrameId = null; // To cancel animation frame

        // Level configurations (ensure coordinates are within canvas bounds)
        // Adjusted some levels for better playability
        const levels = [
            // Level 1
            {
                target: { x: canvas.width - 100, y: groundY, radius: 15, color: '#ef4444' },
                obstacles: []
            },
            // Level 2
            {
                target: { x: canvas.width - 150, y: groundY, radius: 15, color: '#ef4444' },
                obstacles: [ { x: 400, y: groundY - 100, width: 20, height: 100, color: '#4a5568' } ]
            },
            // Level 3
            {
                target: { x: canvas.width - 200, y: groundY, radius: 15, color: '#ef4444' },
                obstacles: [
                    { x: 350, y: groundY - 120, width: 20, height: 120, color: '#4a5568' },
                    { x: 550, y: groundY - 80, width: 20, height: 80, color: '#4a5568' }
                ]
            },
             // Level 4
             {
                 target: { x: canvas.width - 100, y: groundY - 50, radius: 15, color: '#ef4444' }, // Raised target slightly
                 obstacles: [
                     { x: 300, y: groundY - 80, width: 200, height: 20, color: '#4a5568' } // Horizontal obstacle
                 ]
             },
              // Level 5
             {
                 target: { x: canvas.width - 150, y: groundY, radius: 15, color: '#ef4444' },
                 obstacles: [
                     { x: 300, y: groundY - 150, width: 20, height: 150, color: '#4a5568' },
                     { x: 500, y: groundY - 100, width: 150, height: 20, color: '#4a5568' } // Horizontal
                 ]
             },
             // Level 6 - Target behind two walls
             {
                 target: { x: canvas.width - 100, y: groundY, radius: 15, color: '#ef4444' },
                 obstacles: [
                     { x: 300, y: groundY - 180, width: 20, height: 180, color: '#4a5568' },
                     { x: 500, y: groundY - 180, width: 20, height: 180, color: '#4a5568' },
                 ]
            },
             // Level 7 - Target on a platform
            {
                target: { x: 600, y: groundY - 100, radius: 15, color: '#ef4444' },
                obstacles: [
                     { x: 550, y: groundY - 100, width: 100, height: 20, color: '#4a5568' }, // Platform
                     { x: 300, y: groundY - 80, width: 20, height: 80, color: '#4a5568' } // Wall before
                ]
            },
             // Level 8 - Bouncing challenge
            {
                target: { x: canvas.width - 80, y: groundY, radius: 15, color: '#ef4444' },
                obstacles: [
                    { x: 250, y: groundY - 80, width: 100, height: 20, color: '#4a5568' }, // Low platform
                    { x: 450, y: groundY - 160, width: 100, height: 20, color: '#4a5568' } // Higher platform
                ]
            },
             // Level 9 - Through a gap
            {
                target: { x: canvas.width - 100, y: groundY, radius: 15, color: '#ef4444' },
                obstacles: [
                    { x: 400, y: 0, width: 20, height: groundY - 100, color: '#4a5568' }, // Upper part of wall
                    { x: 400, y: groundY - 50, width: 20, height: 50, color: '#4a5568' } // Lower part of wall (gap between)
                ]
            },
            // Level 10 (Final Level) - Complex
            {
                 target: { x: canvas.width - 50, y: groundY - 150, radius: 15, color: '#ef4444' }, // High target
                 obstacles: [
                     { x: 200, y: groundY - 100, width: 20, height: 100, color: '#4a5568' },
                     { x: 350, y: groundY - 180, width: 100, height: 20, color: '#4a5568' }, // Horizontal platform
                     { x: 500, y: groundY - 200, width: 20, height: 200, color: '#4a5568' },
                     { x: 650, y: groundY - 120, width: 100, height: 20, color: '#4a5568' } // Horizontal platform
                 ]
            }
        ];

        let currentLevelIndex = 0;
        let currentLevel = levels[currentLevelIndex];


        // Update angle and power displays
        angleInput.addEventListener('input', () => {
            angleValueSpan.textContent = `${angleInput.value}°`;
             if (!isProjectileLaunched) draw(); // Redraw launcher angle if not launched
        });
        powerInput.addEventListener('input', () => {
            powerValueSpan.textContent = powerInput.value;
             if (!isProjectileLaunched) draw(); // Redraw launcher power if not launched
        });


        // Draw elements
        function drawRect(x, y, width, height, color) {
            context.fillStyle = color;
            context.fillRect(x, y, width, height);
        }

        function drawCircle(x, y, radius, color) {
            context.fillStyle = color;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2, false);
            context.fill();
        }

        function drawLine(x1, y1, x2, y2, color, width) {
             context.strokeStyle = color;
             context.lineWidth = width;
             context.beginPath();
             context.moveTo(x1, y1);
             context.lineTo(x2, y2);
             context.stroke();
        }


        function draw() {
            // Background
            drawRect(0, 0, canvas.width, canvas.height, '#a0aec0'); // Lighter background

            // Ground
            drawRect(0, groundY, canvas.width, canvas.height - groundY, '#718096'); // Ground color

            // Launcher representation (simple circle)
            drawCircle(launcherX, launcherY, 5, '#2d3748');

            // Draw aiming line if not launched
             if (!isProjectileLaunched) {
                 const angle = parseInt(angleInput.value);
                 const power = parseInt(powerInput.value);
                 const radians = angle * Math.PI / 180;
                 const lineLength = power * 0.7; // Adjusted line length
                 const endX = launcherX + lineLength * Math.cos(radians);
                 const endY = launcherY - lineLength * Math.sin(radians); // Subtract because Y is inverted
                 drawLine(launcherX, launcherY, endX, endY, '#2d3748', 3);
             }

            // Projectile
            drawCircle(projectile.x, projectile.y, projectile.radius, projectile.color);

            // Target (Draw circle centered at target.x, target.y)
            drawCircle(currentLevel.target.x, currentLevel.target.y - currentLevel.target.radius, currentLevel.target.radius, currentLevel.target.color); // Draw target resting on its bottom


            // Obstacles
            currentLevel.obstacles.forEach(obstacle => {
                drawRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.color);
            });

             // Update level display
             levelDisplay.textContent = `Level: ${currentLevelIndex + 1}`;
        }

        // Update game state
        function update() {
            if (isProjectileLaunched) {
                // Apply gravity
                projectile.velocityY += gravity;

                // Update position
                projectile.x += projectile.velocityX;
                projectile.y += projectile.velocityY;

                 let hitTarget = false; // Flag to check if target was hit this frame

                // Check collision with ground
                if (projectile.y + projectile.radius >= groundY) {
                    projectile.y = groundY - projectile.radius; // Place on ground
                    projectile.velocityX *= bounceDampening; // Dampen horizontal velocity
                    projectile.velocityY *= -bounceDampening; // Reverse and dampen vertical velocity

                     // Stop if velocity is negligible
                     if (Math.abs(projectile.velocityY) < 1 && Math.abs(projectile.velocityX) < 1) {
                          stopProjectile('Landed!');
                          return; // Stop further updates this frame
                     }
                }

                // Check collision with target
                 const distanceToTargetCenter = Math.sqrt(Math.pow(projectile.x - currentLevel.target.x, 2) + Math.pow(projectile.y - (currentLevel.target.y - currentLevel.target.radius), 2));
                 if (distanceToTargetCenter < projectile.radius + currentLevel.target.radius) {
                     hitTarget = true; // Set the flag
                 }


                // Check collision with obstacles
                currentLevel.obstacles.forEach(obstacle => {
                    // Simple Axis-Aligned Bounding Box (AABB) collision detection
                    const projectileLeft = projectile.x - projectile.radius;
                    const projectileRight = projectile.x + projectile.radius;
                    const projectileTop = projectile.y - projectile.radius;
                    const projectileBottom = projectile.y + projectile.radius;

                    const obstacleLeft = obstacle.x;
                    const obstacleRight = obstacle.x + obstacle.width;
                    const obstacleTop = obstacle.y;
                    const obstacleBottom = obstacle.y + obstacle.height;

                    if (projectileRight > obstacleLeft && projectileLeft < obstacleRight &&
                        projectileBottom > obstacleTop && projectileTop < obstacleBottom)
                    {
                        // Collision detected, determine bounce direction (simple approach)
                        const prevProjectileX = projectile.x - projectile.velocityX;
                        const prevProjectileY = projectile.y - projectile.velocityY;

                        // Check horizontal collision
                         if (prevProjectileX + projectile.radius <= obstacleLeft || prevProjectileX - projectile.radius >= obstacleRight) {
                             projectile.velocityX *= -bounceDampening;
                              // Nudge out horizontally
                              projectile.x = (projectile.velocityX > 0) ? obstacleLeft - projectile.radius : obstacleRight + projectile.radius;

                         }
                         // Check vertical collision
                         if (prevProjectileY + projectile.radius <= obstacleTop || prevProjectileY - projectile.radius >= obstacleBottom) {
                             projectile.velocityY *= -bounceDampening;
                              // Nudge out vertically
                              projectile.y = (projectile.velocityY > 0) ? obstacleTop - projectile.radius : obstacleBottom + projectile.radius;
                         }
                    }
                });

                 // Check if projectile is out of bounds horizontally
                 if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width) {
                     stopProjectile('Out of Bounds!');
                     return; // Stop further updates this frame
                 }

                 // Handle hitting the target AFTER checking other collisions for the frame
                 if (hitTarget) {
                    if (currentLevelIndex === levels.length - 1) {
                        stopProjectile('You Win!', true); // Final level win
                    } else {
                        stopProjectile(`Level ${currentLevelIndex + 1} Complete!`, false, true); // Level complete, advance
                    }
                    return; // Stop further updates this frame
                 }

            }
        }

        // Function to stop projectile motion and animation
        function stopProjectile(message, isFinalWin = false, advanceLevel = false) {
             isProjectileLaunched = false;
             statusDisplay.textContent = message;
             showMessage(message, isFinalWin ? 5000 : 3000);

             if (animationFrameId) {
                 cancelAnimationFrame(animationFrameId);
                 animationFrameId = null;
             }

             if (advanceLevel) {
                  // Add a short delay before advancing for visual feedback
                  setTimeout(() => {
                      currentLevelIndex++;
                      currentLevel = levels[currentLevelIndex];
                      resetLevel(); // Reset for the next level
                  }, 1500); // 1.5 second delay
             }
        }


        // Game loop
        function gameLoop() {
            update();
            draw();
            if (isProjectileLaunched) { // Continue loop only if launched
                animationFrameId = requestAnimationFrame(gameLoop);
            }
        }

        // Launch projectile
        launchButton.addEventListener('click', () => {
            if (!isProjectileLaunched) {
                const angle = parseInt(angleInput.value);
                const power = parseInt(powerInput.value);
                const radians = angle * Math.PI / 180;

                // Reset projectile state before launch
                resetProjectileState();

                // Calculate initial velocity components
                const initialVelocityMultiplier = 0.18; // Adjusted multiplier
                projectile.velocityX = power * initialVelocityMultiplier * Math.cos(radians);
                projectile.velocityY = -power * initialVelocityMultiplier * Math.sin(radians); // Negative Y

                isProjectileLaunched = true;
                statusDisplay.textContent = 'Launching...';
                 if (animationFrameId) cancelAnimationFrame(animationFrameId); // Clear previous frame if any
                gameLoop(); // Start the animation loop
            } else {
                showMessage('Projectile already launched! Reset level to try again.', 3000);
            }
        });

        // Reset current level
         resetLevelButton.addEventListener('click', () => {
             resetLevel();
             showMessage(`Level ${currentLevelIndex + 1} reset.`);
         });

         // Reset entire game
         resetGameButton.addEventListener('click', () => {
             currentLevelIndex = 0;
             currentLevel = levels[currentLevelIndex];
             resetLevel();
             showMessage('Projectile game reset to Level 1.');
         });


        // Reset projectile state to start position
        function resetProjectileState() {
             projectile.x = launcherX;
             projectile.y = launcherY;
             projectile.velocityX = 0;
             projectile.velocityY = 0;
        }

        // Reset the current level state
        function resetLevel() {
            isProjectileLaunched = false;
            resetProjectileState();
            statusDisplay.textContent = '';
             // Cancel any ongoing animation frame
             if (animationFrameId) {
                 cancelAnimationFrame(animationFrameId);
                 animationFrameId = null;
             }
            draw(); // Draw initial state for the current level
        }

        // Initial game setup
        resetLevel(); // Start at level 1

        // Cleanup function
        return () => {
             // Cancel any ongoing animation frame when switching games
             if (animationFrameId) {
                 cancelAnimationFrame(animationFrameId);
                 animationFrameId = null;
             }
             // No document listeners to remove for this game
        };
    }


    // --- Game Loading Logic ---

    // Variable to store the cleanup function of the currently loaded game
    let currentGameCleanup = null;

    // Function to load a game
    function loadGame(gameName) {
         // Run cleanup for the previous game if it exists
        if (currentGameCleanup) {
            currentGameCleanup();
            currentGameCleanup = null; // Reset cleanup function
        }

        // Load the selected game
        switch (gameName) {
            case 'tic-tac-toe':
                loadTicTacToe();
                // No specific cleanup needed currently
                break;
            case 'tetris': // Corrected case to match data-game attribute
                currentGameCleanup = loadTetris(); // Tetris returns a cleanup function
                break;
            case 'card-matching':
                loadCardMatching();
                 // No specific cleanup needed currently
                break;
            case 'ping-pong':
                currentGameCleanup = loadPingPong(); // Ping Pong returns a cleanup function
                break;
            case 'projectile':
                currentGameCleanup = loadProjectileGame(); // Projectile Game returns a cleanup function
                break;
            default:
                gameArea.innerHTML = '<h2 class="text-2xl font-semibold text-center mb-4 text-gray-800">Select a game from the menu above!</h2>';
        }
    }

    // Add event listeners to game links
    document.querySelectorAll('.game-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const gameToLoad = event.target.getAttribute('data-game');
            loadGame(gameToLoad);
        });
    });

    // Load a default message on page load
    // Removed the initial message load from JS, handled by HTML default
    // showMessage('Welcome to the Minigame Arcade!');

}); // End of DOMContentLoaded listener