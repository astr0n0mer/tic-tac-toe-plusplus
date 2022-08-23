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
var playerNames = [];
var playerSymbols = [];

function updatePlayerSymbols() {
  playerSymbols = [];
  for (let sd of symbolDropdowns)
    playerSymbols.push(sd.children[sd.selectedIndex].text);
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
        // for (let option of symbolDropdowns[i].children)
        //   if (option.text == selectedOption.text)
        //     symbolDropdowns[i].removeChild(option);
      }
    }
    updatePlayerSymbols();
  };
}

function initialSymbolDataLoad() {
  for (let sd of symbolDropdowns) sd.innerHTML = "";
  for (let i = 0; i < symbolDropdowns.length; i++) {
    for (let j = 0; j < symbols.length; j++) {
      if (i == j || j >= symbolDropdowns.length) {
        let option = document.createElement("option");
        option.text = option.value = symbols[j];
        symbolDropdowns[i].appendChild(option);
      }
    }
  }
}

// function updateSymbolDropdowns(symbolDropdowns) {
//   let usedSymbols = [];
//   for (let sd in symbolDropdowns)
//     if (sd.childElementCount > 0)
//       usedSymbols.push(sd.children[sd.selectedIndex].text);
// }
window.onload = () => {
  initialSymbolDataLoad();
  updatePlayerSymbols();
  //   for (let sd of symbolDropdowns) {
  //     sd.innerHTML = "";
  //     for (let j = 0; j < symbols.length; j++) {
  //       let option = document.createElement("option");
  //       option.textContent = symbols[j];
  //       sd.appendChild(option);
  //     }
  //   }
};
