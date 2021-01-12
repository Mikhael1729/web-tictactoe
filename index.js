// TicTacToe AI.
const { X, O, EMPTY } = CellState
const tic = new TicTacToe();

// Board.
const table = document.getElementById("board")
const cells = table.getElementsByTagName("td");

// Endgame section.
const endGameSectionElement = document.getElementById("end-game-section")
const resultElement = endGameSectionElement.getElementsByClassName("result")[0]
const restartGameButton = endGameSectionElement.getElementsByClassName("restart-game")[0]
restartGameButton.onclick = restartGameTicTacToe;

// Handle cell clicks.
for(const cell of cells) {
  cell.onclick = onCell;
}

async function onCell(e) {
  const element = e.toElement;

  const cellIsFree = !element.innerText;
  const isOpponentTurn = tic.nextPlayer() === O
  const gameIsOver = handleGameStatus();

  const moveIsAllowed = cellIsFree && !isOpponentTurn && !gameIsOver;
  if(moveIsAllowed) {
    // Represent move in the UI board.
    element.innerHTML = tic.nextPlayer();

    // Register move in the board.
    const action = [parseInt(element.id[0], 10), parseInt(element.id[1], 10)]
    tic.changeCurrentState(action)

    setTimeout(afterHuman, 300)
  }
}

// Make the AI move.
async function afterHuman() {
  const aiMove = tic.minimax()

  if(handleGameStatus())
    return;

  const id = `${aiMove[0]}${aiMove[1]}`
  const anotherElement = document.getElementById(id);
  anotherElement.innerHTML = tic.nextPlayer();

  tic.changeCurrentState(aiMove)

  handleGameStatus()
}

// Return a text depending on the board result.
function checkGameStatus() {
  if(!tic.isTerminal())
    return null;

  const utility = tic.utility()
  
  if (utility === 1) {
    return "Won X";
  } else if (utility === -1) {
    return "Won O";
  } else {
    return "Tie";
  }
}

function handleGameStatus() {
  const gameStatus = checkGameStatus();
  if(gameStatus) {
    indicateTheWinner(gameStatus)
    return gameStatus;
  }
}

function indicateTheWinner(gameStatus) {
  resultElement.innerText = gameStatus;
  endGameSectionElement.style.display = "flex"
}

function restartGameTicTacToe() {
  // Hide game over panel.
  endGameSectionElement.style.display = "none"

  // Restart panel.
  for(let cell of cells) {
    cell.innerText = ''
  }

  // Restart game.
  tic.resetGame();
}
