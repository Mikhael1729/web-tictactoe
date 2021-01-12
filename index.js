const tic = new TicTacToe();
//console.log(tic.currentState);
//console.log(tic.currentPlayer);
//console.log(tic.allowedActions);
//console.log(tic.playerHasWon())
//console.log(tic.isTerminal())
console.log(tic.utility())

function onCell() {
  console.log('Hello, world!');
}

const X = 'X';
const O = 'O';
const EMPTY = '';
let currentPlayer = X;

const table = document.getElementById("board")

const cells = table.getElementsByTagName("td");
for(const cell of cells) {
  cell.onclick = onCell;
}

function onCell(e) {
  const element = e.toElement;

  const cellIsFree = !element.innerText;
  if(cellIsFree) {
    element.innerHTML = currentPlayer;
  }
}
