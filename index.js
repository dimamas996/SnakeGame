export class SnakeGame {
  constructor(isMobile = true) {
    this.isMobile = isMobile;
    this.CNVS = document.querySelector(".canvas");
    this.CNVS_WRAPPER = document.querySelector(".canvas-wrapper");
    this.CTX = this.CNVS.getContext("2d");
    this.MODAl = document.querySelector(".modal");
    this.BTN = document.querySelector(".modal-button");
    this.sizeOfSq = 0;
    this.quantityOfSqInRow = 21;
    this.sizeOfSqVisible = 0;
    this.score = 0;
    this.preventAction = false;
    this.gameOver = false;
    this.gameStarted = false;
    this.gameSpeed = 5;
    this.message = "Press any arrow button to start the game.";
    this.snakeDirection = {
      prevECode: null,
      x: 0,
      y: 0,
      reverse: {
        ArrowUp: "ArrowDown",
        ArrowDown: "ArrowUp",
        ArrowRight: "ArrowLeft",
        ArrowLeft: "ArrowRight",
      },
    };
    this.snakeHeadPos = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    };
    this.snakeBody = [];
    this.targets = [];
    this.action = null;
  }

  init() {
    window.addEventListener("resize", () => {

      if (this.isMobile) {
        Array.from(document.querySelectorAll("button")).forEach((btn) => {
          btn.addEventListener("touchstart", () => {
            btn.style.opacity = "0.7";
            btn.style.transform = "scale(0.9)";
          });
          btn.addEventListener("touchend", () => {
            btn.style.opacity = "1";
            btn.style.transform = "scale(1)";
          });
        });
      }
    
      this.CNVS.width = this.CNVS_WRAPPER.getBoundingClientRect().width;
      this.CNVS.height = this.CNVS_WRAPPER.getBoundingClientRect().height;
      this.sizeOfSq = this.CNVS.width / this.quantityOfSqInRow;
      this.sizeOfSqVisible = this.sizeOfSq - 2;
    });
    
    this.BTN.addEventListener("click", () => window.location.reload());

    this.snakeBody.push(this.makeSnakePiece(this.snakeHeadPos.x, this.snakeHeadPos.y));

    for (let btn of document.querySelectorAll(".button")) {
      if (!btn.classList.contains("modal-button")) {
        btn.addEventListener("click", () => {
          this.mobileKeyPress(btn.id);
        });
      }
    }

    window.addEventListener("keydown", (e) => {
      console.log('first');
      this.mobileKeyPress(e.code);
    });

    window.dispatchEvent(new Event("resize"));
    this.drawingAll();
    this.action = setTimeout(this.gameAction.bind(this), Math.floor(1000 / this.gameSpeed));
  }

  gameAction() {
    this.snakeBody.shift();
    this.snakeBody.push(this.makeSnakePiece(this.snakeHeadPos.x, this.snakeHeadPos.y));

    this.snakeHeadPos.x += this.snakeDirection.x;
    this.snakeHeadPos.y += this.snakeDirection.y;

    if (this.snakeDirection.prevECode) {
      if (!this.targets.length) {
        let target = this.makeTarget();
        if (!this.snakeBody.some((piece) => piece.x === target.x && piece.y === target.y))
          this.targets.push(target);
      }

      for (let piece of this.snakeBody) {
        if (piece.x === this.snakeHeadPos.x && piece.y === this.snakeHeadPos.y) {
          console.log("here1");
          this.endGame();
          break;
        }
      }
    }

    for (let target of this.targets) {
      if (target.x === this.snakeHeadPos.x && target.y === this.snakeHeadPos.y) {
        this.targets.pop();
        this.snakeBody.push(this.makeSnakePiece(this.snakeHeadPos.x, this.snakeHeadPos.y));
        this.score++;
        this.gameSpeed = Math.ceil(4.976 * Math.pow(this.score, 0.362));
      }
    }

    /*   if (
      this.snakeHeadPos.x < 0 ||
      this.snakeHeadPos.x > 20 ||
      this.snakeHeadPos.y < 0 ||
      this.snakeHeadPos.y > 20
    ) {
      console.log("here2");
      endGame();
    } */

    if (this.snakeHeadPos.x > 20) this.snakeHeadPos.x = 0;
    if (this.snakeHeadPos.x < 0) this.snakeHeadPos.x = 20;
    if (this.snakeHeadPos.y > 20) this.snakeHeadPos.y = 0;
    if (this.snakeHeadPos.y < 0) this.snakeHeadPos.y = 20;

    if (!this.gameOver) {
      console.log('11111');
      this.drawingAll();
      this.action = setTimeout(this.gameAction.bind(this), Math.floor(1000 / this.gameSpeed));
    }

    this.preventAction = false;
  }

  makeSnakePiece(x, y) {
    return { x: x, y: y };
  }

  makeTarget() {
    return {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    };
  }

  drawSquare(x, y, color) {
    this.CTX.fillStyle = color;
    this.CTX.fillRect(x * this.sizeOfSq + 1, y * this.sizeOfSq + 1, this.sizeOfSqVisible, this.sizeOfSqVisible);
  }

  endGame() {
    this.gameOver = true;
    this.MODAl.style.display = "flex";
  }

  drawingAll() {
    this.CTX.clearRect(0, 0, this.CNVS.width, this.CNVS.height);
  
    for (let piece of this.snakeBody) {
      this.drawSquare(piece.x, piece.y, "#C4B9B6");
    }
    for (let target of this.targets) {
      this.drawSquare(target.x, target.y, "red");
    }
    this.drawSquare(this.snakeHeadPos.x, this.snakeHeadPos.y, "#998F07");
  
    this.CTX.fillStyle = "#c4b9b6";
    this.CTX.font = `${this.sizeOfSq}px Arial`;
    this.CTX.textAlign = "right";
    this.CTX.fillText(`Score: ${this.score}`, this.CNVS.width * 0.95, this.CNVS.height * 0.05);
  
    this.CTX.fillStyle = "#c4b9b6";
    this.CTX.font = `${this.sizeOfSq}px Arial`;
    this.CTX.textAlign = "center";
    this.CTX.fillText(`${this.message}`, this.CNVS.width / 2, this.CNVS.height * 0.35);
  }

  mobileKeyPress(code) {
    console.log('second');
    if (this.preventAction) return;
    this.preventAction = true;
    if (code === this.snakeDirection.prevECode) return;
    if (this.snakeDirection.prevECode === this.snakeDirection.reverse[code]) return;
    console.log('third');
    switch (code) {
      case "ArrowUp":
        this.snakeDirection.x = 0;
        this.snakeDirection.y = -1;
        break;
      case "ArrowRight":
        this.snakeDirection.x = 1;
        this.snakeDirection.y = 0;
        break;
      case "ArrowDown":
        this.snakeDirection.x = 0;
        this.snakeDirection.y = 1;
        break;
      case "ArrowLeft":
        this.snakeDirection.x = -1;
        this.snakeDirection.y = 0;
        break;
      default:
        return;
    }
  
    this.message = "";
    this.snakeDirection.prevECode = code;
  }
}

/* const CNVS = document.querySelector(".canvas");
const CNVS_WRAPPER = document.querySelector(".canvas-wrapper");
const CTX = CNVS.getContext("2d");
const MODAl = document.querySelector(".modal");
const BTN = document.querySelector(".modal-button");
const mobileDetection = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      this.Android() ||
      this.BlackBerry() ||
      this.iOS() ||
      this.Opera() ||
      this.Windows()
    );
  },
};
let isMobile = mobileDetection.any();

window.addEventListener("resize", () => {
  isMobile = mobileDetection.any();
  try {
    if (isMobile) {
      document.querySelector("#desktop").remove();
      Array.from(document.querySelectorAll("button")).forEach((btn) => {
        btn.addEventListener("touchstart", () => {
          btn.style.opacity = "0.7";
          btn.style.transform = "scale(0.9)";
        });
        btn.addEventListener("touchend", () => {
          btn.style.opacity = "1";
          btn.style.transform = "scale(1)";
        });
      });
    } else {
      document.querySelector("#mobile").remove();
    }
  } catch (e) {
    console.log(e);
  }

  CNVS.width = CNVS_WRAPPER.getBoundingClientRect().width;
  CNVS.height = CNVS_WRAPPER.getBoundingClientRect().height;
  sizeOfSq = CNVS.width / quantityOfSqInRow;
  sizeOfSqVisible = sizeOfSq - 2;
});

BTN.addEventListener("click", () => window.location.reload());

let sizeOfSq = 0;
let quantityOfSqInRow = 21;
let sizeOfSqVisible = 0;
let centerPos = 10;
let score = 0;
let preventAction = false;
let gameover = false;
let message = "Press any arrow button to start the game.";
let gameStarted = false;

let gameSpeed = 5;

let snakeHeadPos = {
  x: Math.floor(Math.random() * 20),
  y: Math.floor(Math.random() * 20),
};

let snakeDirection = {
  prevECode: null,
  x: 0,
  y: 0,
  reverse: {
    ArrowUp: "ArrowDown",
    ArrowDown: "ArrowUp",
    ArrowRight: "ArrowLeft",
    ArrowLeft: "ArrowRight",
  },
};

class SnakePiece {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Target {
  constructor() {
    this.x = Math.floor(Math.random() * 20);
    this.y = Math.floor(Math.random() * 20);
  }
}

let snakeBody = [];
snakeBody.push(new SnakePiece(snakeHeadPos.x, snakeHeadPos.y));

let targets = [];

function gameAction() {
  snakeBody.shift();
  snakeBody.push(new SnakePiece(snakeHeadPos.x, snakeHeadPos.y));

  snakeHeadPos.x += snakeDirection.x;
  snakeHeadPos.y += snakeDirection.y;

  if (snakeDirection.prevECode) {
    if (!targets.length) {
      let target = new Target();
      if (
        !snakeBody.some((piece) => piece.x === target.x && piece.y === target.y)
      )
        targets.push(target);
    }

    for (let piece of snakeBody) {
      if (piece.x === snakeHeadPos.x && piece.y === snakeHeadPos.y) {
        console.log("here1");
        endGame();
        break;
      }
    }
  }

  for (let target of targets) {
    if (target.x === snakeHeadPos.x && target.y === snakeHeadPos.y) {
      targets.pop();
      snakeBody.push(new SnakePiece(snakeHeadPos.x, snakeHeadPos.y));
      score++;
      gameSpeed = Math.ceil(4.976 * Math.pow(score, 0.362));
    }
  }

    if (
    snakeHeadPos.x < 0 ||
    snakeHeadPos.x > 20 ||
    snakeHeadPos.y < 0 ||
    snakeHeadPos.y > 20
  ) {
    console.log("here2");
    endGame();
  }

  if (snakeHeadPos.x > 20) snakeHeadPos.x = 0;
  if (snakeHeadPos.x < 0) snakeHeadPos.x = 20;
  if (snakeHeadPos.y > 20) snakeHeadPos.y = 0;
  if (snakeHeadPos.y < 0) snakeHeadPos.y = 20;

  if (!gameover) {
    drawingAll();
    action = setTimeout(gameAction, Math.floor(1000 / gameSpeed));
  }

  preventAction = false;
}

function drawSquare(x, y, color) {
  CTX.fillStyle = color;
  CTX.fillRect(
    x * sizeOfSq + 1,
    y * sizeOfSq + 1,
    sizeOfSqVisible,
    sizeOfSqVisible
  );
}

function drawingAll() {
  CTX.clearRect(0, 0, CNVS.width, CNVS.height);

  for (let piece of snakeBody) {
    drawSquare(piece.x, piece.y, "#C4B9B6");
  }
  for (let target of targets) {
    drawSquare(target.x, target.y, "red");
  }
  drawSquare(snakeHeadPos.x, snakeHeadPos.y, "#998F07");

  CTX.fillStyle = "#c4b9b6";
  CTX.font = `${sizeOfSq}px Arial`;
  CTX.textAlign = "right";
  CTX.fillText(`Score: ${score}`, CNVS.width * 0.95, CNVS.height * 0.05);

  CTX.fillStyle = "#c4b9b6";
  CTX.font = `${sizeOfSq}px Arial`;
  CTX.textAlign = "center";
  CTX.fillText(`${message}`, CNVS.width / 2, CNVS.height * 0.35);
}

function endGame() {
  gameover = true;
  MODAl.style.display = "flex";
}

for (let btn of document.querySelectorAll(".button")) {
  if (!btn.classList.contains("modal-button")) {
    btn.addEventListener("click", () => {
      mobileKeyPress(btn.id);
    });
  }
}

function mobileKeyPress(code) {
  if (preventAction) return;
  preventAction = true;
  if (code === snakeDirection.prevECode) return;
  if (snakeDirection.prevECode === snakeDirection.reverse[code]) return;

  switch (code) {
    case "ArrowUp":
      snakeDirection.x = 0;
      snakeDirection.y = -1;
      break;
    case "ArrowRight":
      snakeDirection.x = 1;
      snakeDirection.y = 0;
      break;
    case "ArrowDown":
      snakeDirection.x = 0;
      snakeDirection.y = 1;
      break;
    case "ArrowLeft":
      snakeDirection.x = -1;
      snakeDirection.y = 0;
      break;
    default:
      return;
  }

  message = "";
  snakeDirection.prevECode = code;
}

window.addEventListener("keydown", (e) => {
  mobileKeyPress(e.code);
});

window.dispatchEvent(new Event("resize"));
drawingAll();
let action = setTimeout(gameAction, Math.floor(1000 / gameSpeed)); */

/*#282A31 #6F6878 #C4B9B6 #998F07 #35361D Цветовая палитра №4498*/
