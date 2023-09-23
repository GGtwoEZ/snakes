// Constants
var blockSize = 25;
var rows = 20;
var cols = 20;

// Variables
var board;
var context;

// Snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

// Food
var foodX;
var foodY;

// Enemies
var enemies = []; // Array to store enemy objects
var enemyCount = 3; // Number of enemies on the board

// Game state
var gameOver = false;

// Initialize the game
window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); // Used for drawing on the board

    initializeGame();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 100); // 100 milliseconds

    var resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", resetGame);
}

function resetGame() {
    gameOver = false;
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    placeFood();
    placeEnemies();
}

function initializeGame() {
    initializeEnemies();
    placeFood();
    draw();
}

function initializeEnemies() {
    for (let i = 0; i < enemyCount; i++) {
        spawnEnemy();
    }
}

function spawnEnemy() {
    var enemyX, enemyY;
    do {
        // Randomly generate enemy coordinates within the board
        enemyX = Math.floor(Math.random() * cols) * blockSize;
        enemyY = Math.floor(Math.random() * rows) * blockSize;
    } while (
        (enemyX === foodX && enemyY === foodY) ||
        isCollidingWithSnake(enemyX, enemyY) ||
        isCollidingWithEnemy(enemyX, enemyY)
    );

    enemies.push({ x: enemyX, y: enemyY });
}

function isCollidingWithEnemy(x, y) {
    for (let i = 0; i < enemies.length; i++) {
        if (x === enemies[i].x && y === enemies[i].y) {
            return true;
        }
    }
    return false;
}

var prevX = snakeX;
var prevY = snakeY;

function update() {
    if (gameOver) {
        return;
    }

    prevX = snakeX;
    prevY = snakeY;

    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    // Collision detection with enemies (reduce length if hit)
    for (let i = 0; i < enemies.length; i++) {
        if (snakeX === enemies[i].x && snakeY === enemies[i].y && !enemies[i].touched) {
            // Mark the enemy as touched
            enemies[i].touched = true;

            // Remove the last segment of the snake's body
            snakeBody.pop();

            // Remove the enemy that was hit
            enemies.splice(i, 1);

            // Spawn a new enemy
            spawnEnemy();
        }
    }

    // Check for game over conditions
    if (snakeX < 0 || snakeX >= cols * blockSize || snakeY < 0 || snakeY >= rows * blockSize) {
        gameOver = true;
        alert("Game Over");
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            gameOver = true;
            alert("Game Over");
        }
    }

    // Update the snake's body
    updateSnakeBody(prevX, prevY);

    // Update the game state and redraw
    draw();
}

function updateSnakeBody(prevX, prevY) {
    // Add the previous head position as a new segment to the body
    snakeBody.unshift([prevX, prevY]);

    // If the snake ate the food, generate a new food position
    if (snakeX === foodX && snakeY === foodY) {
        placeFood();
    } else {
        // If not, remove the last segment to keep the same length
        snakeBody.pop();
    }
}


function isCollidingWithSnake(x, y) {
    for (let i = 0; i < snakeBody.length; i++) {
        if (x === snakeBody[i][0] && y === snakeBody[i][1]) {
            return true;
        }
    }
    return false;
}

function draw() {
    // Clear the canvas
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // Render the food
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    // Render the snake head
    context.fillStyle = "lime";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);

    // Render the snake body
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // Render the enemies
    context.fillStyle = "blue";
    for (let i = 0; i < enemies.length; i++) {
        context.fillRect(enemies[i].x, enemies[i].y, blockSize, blockSize);
    }
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function placeFood() {
    //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function placeEnemies() {
    //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}
