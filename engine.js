//Images
const blob1 = "./assets/images/blobs/blob1.png"
const blob2 = "./assets/images/blobs/blob2.png"
const blob3 = "./assets/images/blobs/blob3.png"
const blob4 = "./assets/images/blobs/blob4.png"
const blob5 = "./assets/images/blobs/blob5.png"
const blobImages = [blob1, blob2, blob3, blob4, blob5]

//Elements
const playerObject = document.getElementById("playerObject")
const gameArea = document.getElementById("gameArea")
const pauseBanner = document.getElementById("pauseBanner")
const pauseBtn = document.getElementById("pauseBtn")
const resultBanner = document.getElementById("resultBanner")
const resultBannerCurrent = document.getElementById("resultBannerCurrent")
const resultBannerHigh = document.getElementById("resultBannerHigh")
const scoreBoard = document.getElementById("scoreBoard")

//Colors
var color = {
    lightShade: "#6E85B2",
    mediumLightShade: "#5C527F",
    mediumDarkShade: "#3E2C41",
    darkShade: "#261C2C",
}

//Default Window Values
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const topLane = 60
const middleLane = 260
const bottomLane = 460

//Default Gameplay Values
let blockSpeed = 10;
const accel = 0.1;
let playerPos = middleLane
let gameStates = {Active: "Active", Paused: "Paused", Over: "Over"}
let currentGameState = gameStates.Active
let blockList = [];
let playerScore = 1;

//Gameplay Values
const nitro = 0
let playerStates = {Normal: "Normal", Boosting: "Boosting", Stuck: "Stuck"}
let currentPlayerState = playerStates.Normal;

function startGame() {
    playerPos = middleLane;
    playerObject.style.top = `${playerPos}px`;
    playerObject.style.opacity = "1"
    playerScore = 1;
    currentPlayerState = playerStates.Normal;
    resultBanner.style.left = "100vw";
    currentGameState = gameStates.Active;
    blockList.forEach((block) => {
        block.remove();
    })
    blockSpeed = 10;
}

// function createTrailSpark() {
//     let newTrailSpark = document.createElement("div")
//     newTrailSpark.classList.add("trailSpark")
//     newTrailSpark.style.left = 100 + "px"
//     newTrailSpark.style.top = playerPos + "px";

//     return newTrailSpark
// }

function getObjProp(obj, prop) {
    return(parseInt(window.getComputedStyle(obj).getPropertyValue(prop)))
}

function isColliding(object1, object2) {
    return (
        getObjProp(object1, "left") >= getObjProp(object2, "left")
        && getObjProp(object1, "left") <= getObjProp(object2, "left") + getObjProp(object2, "width")
    )
    && (
        getObjProp(object1, "top") >= getObjProp(object2, "top")
        && getObjProp(object1, "top") <= getObjProp(object2, "top") + getObjProp(object2, "height")
    )
}

function moveShip() {
    if (currentGameState === gameStates.Active && currentPlayerState === playerStates.Normal) {
        playerObject.style.top = `${playerPos}px`
    }
}

function keyListener(event) {
    if (event.key === "ArrowUp") {
        event.preventDefault()
        if (playerPos !== topLane) playerPos -= 200;
        moveShip()
    }
    if (event.key === "ArrowDown") {
        event.preventDefault()
        if (playerPos !== bottomLane) playerPos += 200;
        moveShip()
    }
    if (event.key === "Escape") {
        event.preventDefault()
        pauseGame()
    }
    if (event.key === "Enter" && currentGameState === gameStates.Over) {
        startGame()
    }
}

function spawnBlock() {
    if (currentGameState === gameStates.Active) {
        let block = createBlock()
        blockList.push(block)
        gameArea.appendChild(block)

        blockSpeed += 0.2;
    }
}

function spawnPoint() {
    let point = windowWidth + 300;
    blockList.forEach((block) => {
        if (Math.abs(point - (getObjProp(block, "left") + getObjProp(block, "width"))) < 200) {
            point += Math.floor(Math.random() * 400)
        }
    })
    return point
}

function createBlock() {
    let newBlock = document.createElement("div")
    newBlock.style.width = [180, 280, 380][Math.floor(Math.random() * 3)] + "px";
    newBlock.classList.add("block")
    newBlock.style.left = spawnPoint() + "px"
    newBlock.style.top = [10, 210, 410][Math.floor(Math.random() * 3)] + "px";
    return newBlock
}

function moveBlock() {
    if (currentGameState === gameStates.Active) {
        blockList.forEach((block) => {
            let xPos = getObjProp(block, "left")
            let blockWidth = getObjProp(block, "width")
            if (xPos <= -blockWidth) {block.remove()}
            else {
                block.style.left = `${xPos - blockSpeed}px`
            }
            if (isColliding(playerObject, block)) destroyPlayer()
        })
    }
}

function pauseGame() {
    if (currentGameState === gameStates.Paused) {
        currentGameState = gameStates.Active;
        pauseBanner.style.top = "100vh";
    }
    else {
        currentGameState = gameStates.Paused;
        pauseBanner.style.top = "0px";
    }
}

function destroyPlayer() {
    playerObject.style.opacity = "0";

    let newExplosion = document.createElement("div")
    newExplosion.className = "explosion"
    newExplosion.style.left = getObjProp(playerObject, "left") + (getObjProp(playerObject, "width") * 0.5)
    newExplosion.style.top = getObjProp(playerObject, "top") + (getObjProp(playerObject, "height") * 0.5)
    gameArea.appendChild(newExplosion)
    setTimeout(() => gameOver(), 3000);
}

function gameOver() {
    // alert("Hello")
    if (currentGameState !== gameStates.Over) {
        currentGameState = gameStates.Over;

        let highScore = localStorage.getItem("blockstacleHighScore")
        if (playerScore > highScore) {
            localStorage.setItem("blockstacleHighScore", Math.floor(playerScore))
            highScore = Math.floor(playerScore)
        }
        resultBannerHigh.innerHTML = highScore
        resultBannerCurrent.innerHTML = Math.floor(playerScore)
        resultBanner.style.left = "0px";
    }
}

function updateScore() {
    if (currentGameState === gameStates.Active) {
        playerScore += 0.5;
        scoreBoard.innerHTML = Math.floor(playerScore);
    }
}

window.addEventListener("keydown", keyListener);

let blockSpawn = setInterval(() => {spawnBlock()}, 1000 * (5 / blockSpeed));

let blockMotor = setInterval(() => moveBlock(), 20);

let creditWHereItsDue = setInterval(() => updateScore(), 100);