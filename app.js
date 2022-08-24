var symbols = [
  "❌",
  "⭕",
  "⚡",
  "🔥",
  "🍀",
  "🍁",
  // "📎",
  // "⚔️",
  // "🛡️",
  // "🎯",
  // "💪",
  // "🦾",
  // "☠️",
  // "👻",
  // "👽",
];

let symbolDropdowns = document.getElementsByClassName("input-symbol");
var startButton = document.getElementById("start-game");
var mainMenuButton = document.getElementById("main-menu");
var playerNames = [];
var playerSymbols = [];

function initialSymbolDataLoad() {
  for (let sd of symbolDropdowns) sd.innerHTML = "";
  for (let i = 0; i < symbolDropdowns.length; i++)
    for (let j = 0; j < symbols.length; j++)
      if (i == j || j >= symbolDropdowns.length) {
        let option = document.createElement("option");
        option.text = option.value = symbols[j];
        symbolDropdowns[i].appendChild(option);
      }
}

function updatePlayerSymbols() {
  playerSymbols = [];
  for (let sd of symbolDropdowns)
    playerSymbols.push(sd.children[sd.selectedIndex].text);
}

function createBoard(n) {
  let board = document.getElementById("board");
  board.innerHTML = "";
  for (let i = 0; i <= n; i++) {
    let boardRow = document.createElement("span");
    boardRow.classList.add("board-row");
    for (let j = 0; j <= n; j++) {
      let button = document.createElement("button");
      boardRow.appendChild(button);
    }
    board.appendChild(boardRow);
  }
}

for (let sd of symbolDropdowns) {
  sd.onchange = () => {
    let selectedOption = sd.children[sd.selectedIndex];
    let deselectedOption = document.createElement("option");
    for (let i = 0; i < symbolDropdowns.length; i++) {
      if (symbolDropdowns[i] === sd)
        deselectedOption.text = deselectedOption.value = playerSymbols[i];
    }
    for (let i = 0; i < symbolDropdowns.length; i++) {
      if (symbolDropdowns[i] === sd) continue;
      else {
        symbolDropdowns[i].appendChild(deselectedOption);
        for (let op of symbolDropdowns[i].children)
          if (op.outerHTML == selectedOption.outerHTML)
            symbolDropdowns[i].removeChild(op);
      }
    }
    updatePlayerSymbols();
  };
}

startButton.onclick = () => {
  window.scroll({
    top: document.body.scrollHeight,
    left: 0,
    behavior: "smooth",
  });
  createBoard(symbolDropdowns.length);
};

mainMenuButton.onclick = () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

initialSymbolDataLoad();
updatePlayerSymbols();
