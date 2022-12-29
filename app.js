class Player {
  static currentPlayerIndex = 0;
  static lengthOfPlayersArray = 0;
  constructor(name, symbol) {
    this.name = name;
    this.symbol = symbol;
  }
  setAvailableWeights(availableWeights) {
    this.availableWeights = availableWeights;
  }
  setSelectedWeight(selectedWeight) {
    this.selectedWeight = selectedWeight;
  }

  static getCurrentPlayerIndex() {
    return this.currentPlayerIndex;
  }
  static getNextPlayerIndex() {
    return (this.currentPlayerIndex + 1) % this.lengthOfPlayersArray;
  }
  static resetCurrentPlayerIndex() {
    this.currentPlayerIndex = 0;
  }
  static incrementCurrentPlayerIndex() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.lengthOfPlayersArray;
    return this.currentPlayerIndex;
  }
  static setLengthOfPlayersArray(lengthOfPlayersArray) {
    this.lengthOfPlayersArray = lengthOfPlayersArray;
  }
}

let symbols = [
  "❌",
  "⭕",
  "🔥",
  "💧",
  "⚡",
  "❄️",
  "🌈",
  "🍀",
  "🍁",
  "⚔️",
  "🛡️",
  "🎯",
  "💪",
  "🦾",
  "☢️",
  "☠️",
  "👻",
  "🎃",
  "👽",
];
let symbolDropdowns = document.getElementsByClassName("symbol-input");
let gameMode = "standard";
let players = null;
let boardArray = null;

// Setting onclick for game mode buttons
let gameModeButtons = document.querySelectorAll(
  "#game-mode-options input[type=button]"
);
for (let mode of gameModeButtons) {
  mode.onclick = () => {
    let oldMode = document.getElementById("mode-selected");
    oldMode.setAttribute("id", "");
    mode.setAttribute("id", "mode-selected");
    gameMode = mode.value.toLowerCase();
  };
}

function loadSymbols() {
  for (let sd of symbolDropdowns) sd.innerHTML = "";

  for (let i = 0; i < symbolDropdowns.length; i++)
    for (let j = 0; j < symbols.length; j++)
      if (i == j || j >= symbolDropdowns.length) {
        let option = document.createElement("option");
        option.text = symbols[j];
        // option.value = j;
        symbolDropdowns[i].appendChild(option);
      }
}

// Setting onclick for add and remove player buttons
document.getElementById("add-player").onclick = () => {
  if (symbolDropdowns.length < 8) {
    let playersMenu = document.getElementById("players-menu");

    let playerDetails = document.createElement("fieldset");
    playerDetails.classList.add("player-details");

    let nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.classList.add("name-input");
    nameInput.setAttribute("onfocus", "this.select()");
    nameInput.value = "Player " + (symbolDropdowns.length + 1);

    let symbolInput = document.createElement("select");
    symbolInput.classList.add("symbol-input");

    playerDetails.append(nameInput, symbolInput);
    playersMenu.append(playerDetails);
    loadSymbols();
  }
};

document.getElementById("remove-player").onclick = () => {
  if (symbolDropdowns.length > 2) {
    let playersMenu = document.getElementById("players-menu");
    playersMenu.removeChild(playersMenu.children[symbolDropdowns.length - 1]);
    loadSymbols();
  }
};

// Setting onclick for start-game button
document.getElementById("start-game").onclick = () => {
  createPlayersArray();
  Player.setLengthOfPlayersArray(symbolDropdowns.length);
  createGameStatusBoard();
  restartButton.onclick();

  window.scrollTo({
    top: document.body.scrollHeight,
    left: 0,
    behavior: "smooth",
  });
};

function createPlayersArray() {
  players = [];
  let nameInputs = document.getElementsByClassName("name-input");
  for (let i = 0; i < symbolDropdowns.length; i++) {
    players.push(
      new Player(
        nameInputs[i].value,
        symbolDropdowns[i].children[symbolDropdowns[i].selectedIndex].value
      )
    );
  }
}

function createGameStatusBoard() {
  let gameStatus = document.getElementById("game-status");

  let playerTypeInnerHTML =
    '<span class="player-name"></span>' +
    '<span class="weight-0" data-weight="0"></span>' +
    '<span class="pieces-left"></span>' +
    '<span class="weight-1" data-weight="1"></span>' +
    '<span class="pieces-left"></span>' +
    '<span class="weight-2" data-weight="2"></span>' +
    '<span class="pieces-left"></span>';

  gameStatus.innerHTML =
    "<p>Current player</p>" +
    '<div id="current-player">' +
    playerTypeInnerHTML +
    "</div>" +
    "<p>Next player</p>" +
    '<div id="next-player">' +
    playerTypeInnerHTML +
    "</div>";

  // if game mode == stack then set 0 as the default weight and set up onclick to enable user to change selected weight
  if (gameMode == "stack") {
    let playerSymbols = document.querySelectorAll(
      "#game-status span[class^=weight-]"
    );
    for (let symbol of playerSymbols) {
      // the following 2 lines are needed for initially loading .selected-weight for weight-0 in case of stack game mode
      if (symbol.getAttribute("data-weight") == 0)
        symbol.classList.add("selected-weight");
      symbol.onclick = () => {
        let oldSelectedWeight = document.querySelector(
          "#" + symbol.parentNode.id + " > .selected-weight"
        );
        oldSelectedWeight.classList.remove("selected-weight");
        let playerIndex =
          symbol.parentNode.id == "current-player"
            ? Player.getCurrentPlayerIndex()
            : Player.getNextPlayerIndex();
        players[playerIndex].setSelectedWeight(
          symbol.getAttribute("data-weight")
        );
        symbol.classList.add("selected-weight");

        refreshClickableCells();
      };
    }
  }
}

function refreshClickableCells() {
  let selectedWeight = players[Player.getCurrentPlayerIndex()].selectedWeight;
  let cellsWithWeights = "";
  for (let i = 0; i < 3; i++)
    // 3 is the limit as the maximum weight is 2
    cellsWithWeights += ".mini-board > .weight-" + i + ",";

  let cells = document.querySelectorAll(cellsWithWeights.slice(0, -1)); // slicing is done to ignore the last , in cellsWithWeights
  for (let cell of cells)
    if (cell.getAttribute("data-weight") < selectedWeight) enableCell(cell);
    else disableCell(cell);
}

function enableCell(cell) {
  cell.disabled = false;
  cell.classList.add("board-cell-hover");
}

function disableCell(cell) {
  cell.disabled = true;
  cell.classList.remove("board-cell-hover");
}

let restartButton = document.getElementById("restart-game");
restartButton.onclick = () => {
  Player.resetCurrentPlayerIndex();

  resetAvailableWeights();
  resetSelectedWeights();

  updateGameStatusBoard();
  createBoard();
  // createGameStatusBoard();
};

function resetAvailableWeights() {
  let piecesPerPlayer = Math.ceil(
    Math.pow(2 * players.length - 1, 2) / players.length
  );
  let weights = [0, 0, piecesPerPlayer];

  if (gameMode == "stack") {
    weights = [piecesPerPlayer - 4, 2, 2];
  }

  for (let player of players) {
    player.setAvailableWeights(new Array(weights[0], weights[1], weights[2]));
  }
}

function resetSelectedWeights() {
  for (let player of players) {
    if (gameMode == "stack") player.setSelectedWeight(0);
    else player.setSelectedWeight(2);
  }
}

function updateGameStatusBoard() {
  let playerTypes = document.querySelectorAll("#current-player, #next-player");

  for (let i = 0; i < playerTypes.length; i++) {
    let playerIndex = Player.getCurrentPlayerIndex();
    if (i == 1) playerIndex = Player.getNextPlayerIndex();

    document.querySelector(
      "#" + playerTypes[i].id + " > .player-name"
    ).innerText = players[playerIndex].name;

    for (let j = 0; j < 3; j++) {
      // 3 is the limit because we only have 3 levels of stacking pieces
      if (gameMode == "stack" || j == 2) {
        let symbolSpan = document.querySelector(
          "#" + playerTypes[i].id + " > .weight-" + j
        );
        symbolSpan.innerText = players[playerIndex].symbol;

        // if game mode == stack and if this is a selected weight then call onclick to update the outline of the selected weight
        if (gameMode == "stack" && players[playerIndex].selectedWeight == j)
          symbolSpan.onclick();
      }

      if (gameMode == "stack") {
        let symbolCountSpan = document.querySelectorAll(
          "#" + playerTypes[i].id + " > .pieces-left"
        );
        symbolCountSpan[j].innerText =
          "x" + players[playerIndex].availableWeights[j];
      }
    }
  }
  // let currentWeights = document.querySelectorAll(
  //   '#current-player span[class^="weight"'
  // );
  // for (let weight in currentWeights) {
  //   weight.onclick = () => {
  //     selectedWeights[currentPlayerIndex] = weight.classList[0].substring(7, 8);
  //   };
  // }
}

function createBoard() {
  let boardSize = 3; // this can be set to players.length for dynamic arrays
  boardArray = [];
  for (let i = 0; i < boardSize; i++)
    boardArray[i] = Array.from("*".repeat(boardSize));

  let board = document.getElementById("board");
  board.innerHTML = "";

  if (gameMode == "square") {
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        boardArray[i][j] = "";
        board.appendChild(createMiniBoard(i, j));
      }
    }
    // board.style.gridTemplateRows = "repeat(3, 1fr)";
    // board.style.gridTemplateColumns = "repeat(3, 1fr)";
    board.classList.add("board-square");
  } else {
    // setting the central miniboard as an unfinished game
    boardArray[0][0] = "";
    board.appendChild(createMiniBoard(0, 0));
    board.classList.remove("board-square");
  }
}

function createMiniBoard(miniBoardX, miniBoardY) {
  let miniBoardSize = 2 * players.length - 1;
  let miniBoard = document.createElement("span");
  miniBoard.classList.add("mini-board");
  miniBoard.style.gridTemplateColumns = "repeat(" + miniBoardSize + ", 1fr)";
  miniBoard.setAttribute("data-miniboard-x", miniBoardX);
  miniBoard.setAttribute("data-miniboard-y", miniBoardY);

  for (let i = 0; i < miniBoardSize; i++) {
    // let miniBoardRow = document.createElement("span");
    // miniBoardRow.classList.add("board-row");

    for (let j = 0; j < miniBoardSize; j++) {
      // let button = document.createElement("button");
      let button = document.createElement("input");
      button.type = "button";
      button.classList.add("board-cell", "board-cell-hover");
      // remove the following 1 line later
      // button.value = i + "," + j;
      button.setAttribute("data-miniboard-row", i);
      button.setAttribute("data-miniboard-col", j);

      button.onclick = () => {
        button.value = players[Player.getCurrentPlayerIndex()].symbol;
        button.setAttribute(
          "data-weight",
          players[Player.getCurrentPlayerIndex()].selectedWeight
        );
        button.classList.add(
          "weight-" + players[Player.getCurrentPlayerIndex()].selectedWeight
        );
        players[Player.getCurrentPlayerIndex()].availableWeights[
          players[Player.getCurrentPlayerIndex()].selectedWeight
        ] -= 1;
        if (isMiniGameFinished(button.parentNode, button)) {
          // disable current board
          if (isGameFinished()) {
            // disable all mini boards and display winner
          } else {
            // only enable the mini board corresponding to the current played position
          }
        }
        // if selected weight pieces count goes to 0, call the onclick of the lower weight symbol in the createStatusBoard()
        // implement the check to see if the game has finished or not
        Player.incrementCurrentPlayerIndex();
        updateGameStatusBoard();
        refreshClickableCells();

        // if (isGameFinished(button)) {
        //   disableBoard();
        //   // will come back here later
        //   // updateGameStatus(
        //   //   symbols[playerSymbols[currentPlayerIndex]] + " wins"
        //   // );
        // } else {
        //   currentPlayerIndex = (currentPlayerIndex + 1) % playerSymbols.length;
        //   updateGameStatusBoard();
        // }
      };
      // miniBoardRow.appendChild(button);
      miniBoard.appendChild(button);
    }
    // miniBoard.appendChild(miniBoardRow);
  }
  return miniBoard;
}

function isMiniGameFinished(miniBoard, cell) {}

// =================================== below code is not refactroed ===================================
function disableBoard() {
  let boardCells = document.getElementsByClassName("board-cell");
  for (let cell of boardCells) disableCell(cell);
}

function countSymbols(cell, direction) {
  let count = 0;
  // let position = cell.value.split(",").map(Number);
  let position = [
    cell.getAttribute("data-miniboard-row"),
    cell.getAttribute("data-miniboard-col"),
  ];
  let x = position[0] + direction[0];
  let y = position[1] + direction[1];
  let xincr = direction[0];
  let yincr = direction[1];
  while (
    x >= 0 &&
    x < board.childElementCount &&
    y >= 0 &&
    y < board.childElementCount
  ) {
    if (board.children[x].children[y].innerText == cell.innerText) {
      count++;
      x += xincr;
      y += yincr;
    } else break;
  }
  console.log("count", count);
  return count;
}

function isGameFinished(cell) {
  let topBottom = countSymbols(cell, [-1, 0]) + countSymbols(cell, [1, 0]);
  let leftRight = countSymbols(cell, [0, -1]) + countSymbols(cell, [0, 1]);
  let topleftBottomright =
    countSymbols(cell, [-1, -1]) + countSymbols(cell, [1, 1]);
  let toprightBottomleft =
    countSymbols(cell, [-1, 1]) + countSymbols(cell, [1, -1]);
  console.log(
    Math.max(topBottom, leftRight, topleftBottomright, toprightBottomleft) + 1
  );
  if (
    Math.max(topBottom, leftRight, topleftBottomright, toprightBottomleft) +
      1 ==
    playerSymbols.length + 1
  )
    return true;
  return false;
}

let mainMenuButton = document.getElementById("main-menu");
mainMenuButton.onclick = () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

loadSymbols();
updatePlayerSymbols();
window.onload = () => {
  mainMenuButton.onclick();
};
