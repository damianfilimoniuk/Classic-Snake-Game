/* HTML ELEMENTS INITIALIZATION */
const gameCanvas = document.getElementById("game-canvas");
const context = gameCanvas.getContext("2d");
const scoreLabel = document.getElementById("score-label");
const gameLabel = document.getElementById("game-label");


/* IMAGES INITIALIZATION */
const backgroundImage = new Image();
backgroundImage.src = "img/background.png";

const appleImage = new Image();
appleImage.src = "img/apple.png";

const snakeImage = new Image();
snakeImage.src = "img/snake.png";


/* EVENT LISTENERS INITIALIZATION */
backgroundImage.addEventListener("load", init);
document.addEventListener("keydown", input);


/* GLOBAL VARIABLES */
const tileSize = 32;

let snake;
let direction = [1, 0];
let snakeMovement;
let apple;

let highScore;
let score = 0;

let isRunning = false;
let isFeed = false;
let canTurn = true;


/* WINDOW INITIALIZATION */
function init() {
    context.drawImage(backgroundImage, 0, 0, 640, 640);
    loadHighScore();
    updateGameLabel();
}


/* GAME LOGIC */
function startGame() {
    if (isRunning === true) {
        return;
    }

    // Game variables initialization
    snake = [[0, 0]];
    score = 0;
    direction = [1, 0];
    canTurn = true;
    isRunning = true;
    isFeed = false;
    updateGameLabel();

    // Run game logic
    drawSnake()
    snakeMovement = setInterval(moveSnake, 125);
    generateApple();
}

function drawSnake() {
    for (let i = (snake.length - 1); i >= 0; i--) {
        let fragment = snake.at(i);

        context.drawImage(snakeImage, fragment[0] * tileSize, fragment[1] * tileSize, tileSize, tileSize);
    }
}

function moveSnake() {
    let lastFragment = snake.at(-1);
    snake.push([lastFragment[0] + direction[0], lastFragment[1] + direction[1]]);
    if (isFeed === false){
        snake.shift();
    } else {
        isFeed = false;
    }
    canTurn = true;

    context.drawImage(backgroundImage, 0, 0, 640, 640);
    drawSnake();
    checkCollision();
    if (isRunning === true){
        drawApple();
    }
}

function checkCollision() {
    let head = snake.at(-1);

    // Apple collision
    if (head[0] === apple[0] && head[1] === apple[1]){
        isFeed = true;
        score += 1;
        generateApple();
        updateGameLabel();
    }
    
    // Boundaries collision
    if (head[0] < 0 || head [0] >= 20 || head[1] < 0 || head[1] >= 20) {
        gameOver();
        return;
    }

    // Self collission
    for (let i = 0; i < (snake.length - 1); i++)  {
        if (head[0] === snake.at(i)[0] && head[1] === snake.at(i)[1]) {
            gameOver();
            return;
        }
    }

}

function input(event) {
    if (event.code === "Space"){
        event.preventDefault();
        startGame();
    } else if ((event.key === "ArrowDown" || event.key.toLowerCase() === "s") && direction[0] !== 0 && (canTurn === true)) {
        direction = [0, 1];
        canTurn = false;
    } else if ((event.key === "ArrowRight" || event.key.toLowerCase() === "d") && direction[1] !== 0 && (canTurn === true)) {
        direction = [1, 0];
        canTurn = false;
    } else if ((event.key === "ArrowUp" || event.key.toLowerCase() === "w") && direction[0] !== 0 && (canTurn === true)) {
        direction = [0, -1];
        canTurn = false;
    } else if ((event.key === "ArrowLeft" || event.key.toLowerCase() === "a") && direction[1] !== 0 && (canTurn === true)) {
        direction = [-1, 0];
        canTurn = false;
    } else {return;}
}

function generateApple() {
    // Apple logic
    let randomX;
    let randomY; 
    do {
        randomX = Math.floor(Math.random() * 20);
        randomY = Math.floor(Math.random() * 20);
        apple = [randomX, randomY];
    } while (snake.some(fragment => (fragment[0] === apple[0] && fragment[1] === apple[1])));

    drawApple();
}

function drawApple() {
    context.drawImage(appleImage, apple[0] * tileSize, apple[1] * tileSize, tileSize, tileSize);
}

function gameOver() {
    // Disable game logic
    isRunning = false;
    clearInterval(snakeMovement);
    context.drawImage(backgroundImage, 0, 0, 640, 640);
    updateGameLabel();

    // Update high score 
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("high-score", score);
        scoreLabel.textContent = highScore;
    }
}

function loadHighScore() {
    highScore = Number(localStorage.getItem("high-score")) || 0;
    scoreLabel.textContent = highScore;
}

function updateGameLabel() {
    if (isRunning === false) {
        gameLabel.textContent = `Space to start`;
    } else {
        gameLabel.textContent = ` Score: ${score}`;
    }
}

