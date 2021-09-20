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
let globSpeed = 10;
const accel = 0.1;
let playerPos = middleLane
let gameStates = {Active: "Active", Paused: "Paused", Over: "Over"}
let currentGameState = gameStates.Active
let globList = [];
let playerScore = 1;

//Gameplay Values
const nitro = 0
let playerStates = {Normal: "Normal", Boosting: "Boosting", Stuck: "Stuck"}
let currentPlayerState = playerStates.Normal;

function startGame() {
    playerPos = middleLane;
    playerObject.style.top = `${playerPos}px`;
    playerObject.style.display = "block"
    playerScore = 1;
    currentPlayerState = playerStates.Normal;
    resultBanner.style.left = "100vw";
    currentGameState = gameStates.Active;
    globList.forEach((glob) => {
        glob.remove();
    })
    globSpeed = 10;
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
    let objectOneBox = {width: getObjProp(object1, "width"), height: getObjProp(object1, "height")}
    let objectTwoBox = {width: getObjProp(object2, "width"), height: getObjProp(object2, "width")}
    let objectOnePos = {x: getObjProp(object1, "left") + objectOneBox.width / 2, y: getObjProp(object1, "top") + objectOneBox.height / 2}
    let objectTwoPos = {x: getObjProp(object2, "left") + objectTwoBox.width / 2, y: getObjProp(object2, "top") + objectTwoBox.height / 2}

    if (
        Math.abs(objectOnePos.x - objectTwoPos.x) < (objectOneBox.width + objectTwoBox.width) * 0.3
        && Math.abs(objectOnePos.y - objectTwoPos.y) < (objectOneBox.height + objectTwoBox.height) * 0.3
    ) return true
    else return false
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
    if (event.key === "Enter" && currentGameState === gameStates.Over) {
        startGame()
    }
}

function spawnGlob() {
    if (currentGameState === gameStates.Active) {
        let glob = createGlob()
        globList.push(glob)
        gameArea.appendChild(glob)

        globSpeed += 0.2
    }
}

function createGlob() {
    let newGlob = document.createElement("img")
    newGlob.src = blobImages[Math.floor(Math.random() * 5)]
    newGlob.alt = "glob"
    newGlob.classList.add("glob")
    newGlob.style.left = windowWidth + 300 + "px"
    newGlob.style.top = [-50, 150, 320][Math.floor(Math.random() * 3)] + "px";
    newGlob.style.animation = `${["rotateLeft", "rotateRight"][Math.floor(Math.random() * 2)]} 20s infinite`

    return newGlob
}

function moveGlob() {
    if (currentGameState === gameStates.Active) {
        globList.forEach((glob) => {
            let xPos = parseInt(glob.style.left)
            if (xPos <= -300) {glob.remove()}
            else {
                glob.style.left = `${xPos - globSpeed}px`
            }

            if (isColliding(playerObject, glob)) destroyPlayer()
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
    playerObject.style.display = "none";
    setTimeout(() => gameOver(), 3000);
}

function gameOver() {
    // alert("Hello")
    currentGameState = gameStates.Over;

    let highScore = localStorage.getItem("globstacleHighScore")
    if (playerScore > highScore) {
        localStorage.setItem("globstacleHighScore", Math.floor(playerScore))
        highScore = Math.floor(playerScore)
    }
    resultBannerHigh.innerHTML = highScore
    resultBannerCurrent.innerHTML = Math.floor(playerScore)
    resultBanner.style.left = "0px";
}

function updateScore() {
    if (currentGameState === gameStates.Active) {
        playerScore += 0.5;
        scoreBoard.innerHTML = Math.floor(playerScore);
    }
}

window.addEventListener("keydown", keyListener);

let globSpawn = setInterval(() => {spawnGlob()}, 1000 * (5 / globSpeed));

let globMotor = setInterval(() => moveGlob(), 20);

let creditWHereItsDue = setInterval(() => updateScore(), 100);