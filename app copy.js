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
var playerNames = [];
var playerSymbols = [];
var playerWeights = [];
var selectedWeights = [];
var currentPlayerIndex = null;
let board = document.getElementById("board");
let gameMode = "Standard";

let symbolDropdowns = document.getElementsByClassName("symbol-input");
function loadSymbols() {
  // let symbolDropdowns = document.getElementsByClassName("symbol-input");
  for (let sd of symbolDropdowns) sd.innerHTML = "";

  // Only load the symbols where symbolDropdown index and symbol index match, or when symbol index > symbolDropdowns.length,
  // this loads only one symbol in each dropdown that matches its index in the symbols array,
  // when we are done loading 1 symbol in each dropdowns, we need to load the remaining symbols from

  // the following approach can be optimized later
  // for(let i=0; i<symbolDropdowns.length; i++){
  //   let option = document.createElement("option");
  //   option.text = symbols[i];
  //       option.value = i;
  //       symbolDropdowns[i].appendChild(option);
  // }
  // for(let i=symbolDropdowns.length; i<symbols.length; i++){

  // }
  for (let i = 0; i < symbolDropdowns.length; i++)
    for (let j = 0; j < symbols.length; j++)
      if (i == j || j >= symbolDropdowns.length) {
        let option = document.createElement("option");
        option.text = symbols[j];
        option.value = j;
        symbolDropdowns[i].appendChild(option);
      }
}

let gameModeButtons = document.querySelectorAll(
  "#game-mode-options input[type=button]"
);
for (let mode of gameModeButtons) {
  mode.onclick = () => {
    let oldMode = document.getElementById("mode-selected");
    oldMode.setAttribute("id", "");
    mode.setAttribute("id", "mode-selected");
    gameMode = mode.value;
  };
}

let addPlayerButton = document.getElementById("add-player");
addPlayerButton.onclick = () => {
  if (symbolDropdowns.length < 8) {
    // if (true) {
    let userInputs = document.getElementById("players-menu");

    let playerDetails = document.createElement("fieldset");
    playerDetails.classList.add("player-details");

    let nameInput = document.createElement("input");
    nameInput.classList.add("name-input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("onfocus", "this.select()");
    nameInput.value = "Player " + (symbolDropdowns.length + 1);

    let symbolInput = document.createElement("select");
    symbolInput.classList.add("symbol-input");

    playerDetails.append(nameInput, symbolInput);
    userInputs.append(playerDetails);
    loadSymbols();
  }
};

let removePlayerButton = document.getElementById("remove-player");
removePlayerButton.onclick = () => {
  if (symbolDropdowns.length > 2) {
    let userInputs = document.getElementById("players-menu");
    userInputs.removeChild(userInputs.children[symbolDropdowns.length - 1]);
    loadSymbols();
  }
};

// for (let sd of symbolDropdowns) {
//   sd.onchange = (e) => {
//     let selectedOption = e.children[e.selectedIndex].value;
//     let deselectedOption = document.createElement("option");
//     for (let i = 0; i < symbolDropdowns.length; i++) {
//       if (symbolDropdowns[i] === sd)
//         deselectedOption.text = deselectedOption.value = playerSymbols[i];
//     }
//     for (let i = 0; i < symbolDropdowns.length; i++) {
//       if (symbolDropdowns[i] === sd) continue;
//       else {
//         symbolDropdowns[i].appendChild(deselectedOption);
//         for (let op of symbolDropdowns[i].children)
//           if (op.outerHTML == selectedOption.outerHTML)
//             symbolDropdowns[i].removeChild(op);
//       }
//     }
//     updatePlayerSymbols();
//   };
// }

let startButton = document.getElementById("start-game");
startButton.onclick = () => {
  getPlayerNames();
  updatePlayerSymbols();
  restartButton.onclick();
  window.scrollTo({
    top: document.body.scrollHeight,
    left: 0,
    behavior: "smooth",
  });
};

let restartButton = document.getElementById("restart-game");
restartButton.onclick = () => {
  // let symbolDropdowns = document.getElementsByClassName("symbol-input");
  getPlayerWeights();
  createBoard(symbolDropdowns.length);
  currentPlayerIndex = 0;
  createGameStatusBoard();
  // updateGameStatusBoard();
  // updateGameStatus("");
};

function getPlayerNames() {
  playerNames.length = 0;
  let nameInputs = document.getElementsByClassName("name-input");
  for (let name of nameInputs) playerNames.push(name.value);
}

// could probably simplify/optimize
function updatePlayerSymbols() {
  playerSymbols.length = 0;
  // let symbolDropdowns = document.getElementsByClassName("symbol-input");
  for (let sd of symbolDropdowns)
    playerSymbols.push(sd.children[sd.selectedIndex].value);
}

function getPlayerWeights() {
  let weight0 = 0;
  let weight1 = 0;
  let weight2 = Math.ceil(Math.pow(2 * symbolDropdowns.length - 1, 2) / 2);
  if (gameMode == "Stack") {
    weight0 = Math.ceil(Math.pow(2 * symbolDropdowns.length - 1, 2) / 2) - 4; // Need to subtract 4 because of the below 2 weights
    weight1 = 2;
    weight2 = 2;
  }
  let weightArray = [weight0, weight1, weight2];
  playerWeights = [];
  for (let i = 0; i < symbolDropdowns.length; i++) {
    playerWeights.push(weightArray);
    if (gameMode == "Stack") {
      setSelectedWeights(i, 0);
    } else {
      setSelectedWeights(i, 2);
    }
  }
}

function setSelectedWeights(playerIndex, weightIndex) {
  selectedWeights[playerIndex] = weightIndex;
}

function disableCell(cell) {
  cell.disabled = true;
  cell.classList.remove("board-cell-hover");
}

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

function createMiniBoard(playerCount, miniBoardNumber) {
  let miniBoardSize = 2 * playerCount - 1;
  let miniBoard = document.createElement("span");
  miniBoard.classList.add("mini-board");
  miniBoard.style.gridTemplateColumns = "repeat(" + miniBoardSize + ", 1fr)";

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
      button.setAttribute("data-miniboard", miniBoardNumber);
      button.setAttribute("data-miniboard-row", i);
      button.setAttribute("data-miniboard-col", j);

      // Adding onclick event for button here
      button.onclick = () => {
        // button.innerText = symbols[playerSymbols[currentPlayerIndex]];
        button.value = symbols[playerSymbols[currentPlayerIndex]];
        disableCell(button);
        if (isGameFinished(button)) {
          disableBoard();
          // will come back here later
          // updateGameStatus(
          //   symbols[playerSymbols[currentPlayerIndex]] + " wins"
          // );
        } else {
          currentPlayerIndex = (currentPlayerIndex + 1) % playerSymbols.length;
          updateGameStatusBoard();
        }
      };
      // miniBoardRow.appendChild(button);
      miniBoard.appendChild(button);
    }
    // miniBoard.appendChild(miniBoardRow);
  }
  return miniBoard;
}

function createBoard(playerCount) {
  let board = document.getElementById("board");
  board.innerHTML = "";

  if (gameMode == "Square") {
    for (let i = 0; i < 9; i++)
      board.appendChild(createMiniBoard(playerCount, i));
    // board.style.gridTemplateRows = "repeat(3, 1fr)";
    // board.style.gridTemplateColumns = "repeat(3, 1fr)";
    board.classList.add("board-square");
  } else {
    board.appendChild(createMiniBoard(playerCount, 0));
    board.classList.remove("board-square");
  }

  // let miniBoardSize = 2 * playerCount - 1;

  // for (let i = 0; i < boardSize; i++) {
  //   let boardRow = document.createElement("span");
  //   boardRow.classList.add("board-row");

  //   for (let j = 0; j < boardSize; j++) {
  //     let button = document.createElement("button");
  //     button.classList.add("board-cell", "board-cell-hover");
  //     button.value = i + "," + j;

  //     // Adding onclick event for button here
  //     button.onclick = () => {
  //       button.innerText = symbols[playerSymbols[currentPlayerIndex]];
  //       disableCell(button);
  //       if (isGameFinished(button)) {
  //         disableBoard();
  //         updateGameStatus(
  //           symbols[playerSymbols[currentPlayerIndex]] + " wins"
  //         );
  //       } else
  //         currentPlayerIndex = (currentPlayerIndex + 1) % playerSymbols.length;
  //     };
  //     boardRow.appendChild(button);
  //   }
  //   board.appendChild(boardRow);
  // }
}

function createGameStatusBoard() {
  let gameStatus = document.getElementById("game-status");
  gameStatus.innerHTML = "";

  let currentPlayerP = document.createElement("p");
  currentPlayerP.innerText = "Current player";
  let currentPlayerDiv = document.createElement("div");
  currentPlayerDiv.setAttribute("id", "current-player");
  gameStatus.append(currentPlayerP, currentPlayerDiv);

  let nextPlayerP = document.createElement("p");
  nextPlayerP.innerText = "Next player";
  let nextPlayerDiv = document.createElement("div");
  nextPlayerDiv.setAttribute("id", "next-player");
  gameStatus.append(nextPlayerP, nextPlayerDiv);

  updateGameStatusBoard();
}

function updateGameStatusBoard() {
  let currentPlayer = document.getElementById("current-player");
  // currentPlayer.innerHTML = "";
  let nextPlayer = document.getElementById("next-player");
  // nextPlayer.innerHTML = "";
  // let players = [currentPlayer, nextPlayer];

  // let i = 0;
  // for (let player of players) {
  currentPlayer.innerHTML =
    '<span class="player-name">' + playerNames[currentPlayerIndex] + "</span>";

  if (gameMode == "Stack") {
    currentPlayer.innerHTML +=
      '<span class="weight-0">' +
      symbols[playerSymbols[currentPlayerIndex]] +
      "</span>" +
      '<span class="pieces-left">x' +
      playerWeights[currentPlayerIndex][0] +
      "</span>" +
      '<span class="weight-1">' +
      symbols[playerSymbols[currentPlayerIndex]] +
      "</span>" +
      '<span class="pieces-left">x' +
      playerWeights[currentPlayerIndex][1] +
      "</span>";
  }

  currentPlayer.innerHTML +=
    '<span class="weight-2">' +
    symbols[playerSymbols[currentPlayerIndex]] +
    "</span>";
  if (gameMode == "Stack") {
    currentPlayer.innerHTML +=
      '<span class="pieces-left">x' +
      playerWeights[currentPlayerIndex][2] +
      "</span>";
    let selectedWeight = document.querySelector(
      "#current-player .weight-" + selectedWeights[currentPlayerIndex]
    );
    selectedWeight.classList.add("selected-weight");
  }

  nextPlayer.innerHTML =
    '<span class="player-name">' +
    playerNames[(currentPlayerIndex + 1) % playerSymbols.length] +
    "</span>";
  if (gameMode == "Stack") {
    nextPlayer.innerHTML +=
      '<span class="weight-0">' +
      symbols[playerSymbols[(currentPlayerIndex + 1) % playerSymbols.length]] +
      "</span>" +
      '<span class="pieces-left">x' +
      playerWeights[(currentPlayerIndex + 1) % playerSymbols.length][0] +
      "</span>" +
      '<span class="weight-1">' +
      symbols[playerSymbols[(currentPlayerIndex + 1) % playerSymbols.length]] +
      "</span>" +
      '<span class="pieces-left">x' +
      playerWeights[(currentPlayerIndex + 1) % playerSymbols.length][1] +
      "</span>";
  }
  nextPlayer.innerHTML +=
    '<span class="weight-2">' +
    symbols[playerSymbols[(currentPlayerIndex + 1) % playerSymbols.length]] +
    "</span>";
  if (gameMode == "Stack") {
    nextPlayer.innerHTML +=
      '<span class="pieces-left">x' +
      playerWeights[(currentPlayerIndex + 1) % playerSymbols.length][2] +
      "</span>";
    let selectedWeight = document.querySelector(
      "#next-player .weight-" +
        selectedWeights[(currentPlayerIndex + 1) % playerSymbols.length]
    );
    selectedWeight.classList.add("selected-weight");
  }

  let currentWeights = document.querySelectorAll(
    '#current-player span[class^="weight"'
  );
  for (let weight in currentWeights) {
    weight.onclick = () => {
      selectedWeights[currentPlayerIndex] = weight.classList[0].substring(7, 8);
    };
  }
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
