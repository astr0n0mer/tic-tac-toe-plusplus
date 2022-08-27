let symbols = [
  "❌",
  "⭕",
  "⚡",
  "🔥",
  "🍀",
  "🍁",
  "⚔️",
  "🛡️",
  "🎯",
  "📎",
  "💪",
  "🦾",
  "☠️",
  "👻",
  "👽",
];
let symbolDropdowns = document.getElementsByClassName("symbol-input");
var playerNames = [];
var playerSymbols = [];
var currentPlayerIndex = null;
let board = document.getElementById("board");

function loadSymbols() {
  // let symbolDropdowns = document.getElementsByClassName("symbol-input");
  for (let sd of symbolDropdowns) sd.innerHTML = "";

  for (let i = 0; i < symbolDropdowns.length; i++)
    for (let j = 0; j < symbols.length; j++)
      if (i == j || j >= symbolDropdowns.length) {
        let option = document.createElement("option");
        option.text = symbols[j];
        option.value = j;
        symbolDropdowns[i].appendChild(option);
      }
}

function getPlayerNames() {
  playerNames.length = 0;
  let nameInputs = document.getElementsByClassName("name-input");
  for (let name of nameInputs) playerNames.push(name.value);
}

function updatePlayerSymbols() {
  playerSymbols.length = 0;
  // let symbolDropdowns = document.getElementsByClassName("symbol-input");
  for (let sd of symbolDropdowns)
    playerSymbols.push(sd.children[sd.selectedIndex].value);
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
  let position = cell.value.split(",").map(Number);
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

function createBoard(playerCount) {
  let boardSize = 2 * playerCount - 1;
  let board = document.getElementById("board");
  board.innerHTML = "";

  for (let i = 0; i < boardSize; i++) {
    let boardRow = document.createElement("span");
    boardRow.classList.add("board-row");

    for (let j = 0; j < boardSize; j++) {
      let button = document.createElement("button");
      button.classList.add("board-cell", "board-cell-hover");
      button.value = i + "," + j;

      // Adding onclick event for button here
      button.onclick = () => {
        button.innerText = symbols[playerSymbols[currentPlayerIndex]];
        disableCell(button);
        if (isGameFinished(button)) {
          disableBoard();
          console.log(symbols[playerSymbols[currentPlayerIndex]] + " wins.");
        } else
          currentPlayerIndex = (currentPlayerIndex + 1) % playerSymbols.length;
      };
      boardRow.appendChild(button);
    }
    board.appendChild(boardRow);
  }
}

let addPlayerButton = document.getElementById("add-player");
addPlayerButton.onclick = () => {
  if (symbolDropdowns.length < 8) {
    let inputForm = document.getElementById("input-form");

    let playerDetails = document.createElement("fieldset");
    playerDetails.classList.add("player-details");

    let nameInput = document.createElement("input");
    nameInput.classList.add("name-input");
    nameInput.setAttribute("type", "text");
    nameInput.placeholder = "Player " + (symbolDropdowns.length + 1);

    let symbolInput = document.createElement("select");
    symbolInput.classList.add("symbol-input");

    playerDetails.append(nameInput, symbolInput);
    inputForm.insertBefore(
      playerDetails,
      inputForm.children[symbolDropdowns.length]
    );
    loadSymbols();
    console.log(symbolDropdowns.length);
  }
};

let removePlayerButton = document.getElementById("remove-player");
removePlayerButton.onclick = () => {
  if (symbolDropdowns.length > 2) {
    let inputForm = document.getElementById("input-form");
    inputForm.removeChild(inputForm.children[symbolDropdowns.length - 1]);
    symbolDropdowns = document.getElementsByClassName("symbol-input");
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
  createBoard(symbolDropdowns.length);
  currentPlayerIndex = 0;
};

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
