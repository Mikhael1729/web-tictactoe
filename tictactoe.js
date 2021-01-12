const CellState = { X: 'X', O: 'O', EMPTY: null }
Object.freeze(CellState);

class TicTacToe {
  constructor(board = null) {
    this.currentState = !board ? TicTacToe.initialState : board;
  }

  changeCurrentState(action) {
    const playerTurn = this.nextPlayer();
    const allowedActions = this.allowedActions();

    const isValidAction = allowedActions.find(
      (a) => a[0] === action[0] && a[1] === action[1]
    );

    if (!isValidAction)
      throw `The given action "${action}" is not allowed for the board ${this.currentState}`;

    this.currentState[action[0]][action[1]] = playerTurn;

    return this;
  }

  /**
   * Return the initial state of the board.
   */
  static get initialState() {
    const { EMPTY, X, O } = CellState;

    const emptyBoard = [
      [EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY]
    ]
    
    return emptyBoard;
  }

  /**
   * Return which player should play for the next move on the board.
   * @return {String} The player O or X that can take place for the next move.
   */
  nextPlayer() {
    const { X, O } = CellState;

    const matchIsNotYetStarted = this.currentState === TicTacToe.initialState;
    if(matchIsNotYetStarted)
      return X;
  
    let xCount = 0, oCount = 0;
    for(let row of this.currentState) {
      for(let column of row) {
        if(column === X) xCount += 1;
        if(column === O) oCount += 1;
      }
    }

    const movesCount = xCount - oCount;

    const turnIsForX = movesCount === 0;
    if(turnIsForX)
      return X;
    else
      return O
  }

  /**
   * Return the actions or coordinates that the current player can use to
   * make a move on the board.
   *
   * @return {int[][]} The list of coordinates i, j, that represent the allowed
   * movements on the board for the current player.
   */
  allowedActions() {
    const allowedActions = [];
    const boardSize = this.currentState.length;

    for(let i = 0; i < boardSize; i++) {
      for(let j = 0; j < boardSize; j++) {
        const cell = this.currentState[i][j];
        if(!cell) {
          allowedActions.push([i, j]);
        }
      }
    }

    return allowedActions;
  }

  /**
   * Compute the resulting board of aplying to the current state a given action.
   *
   * @return {Array<Array<string | null>>} The resulting board after aplying the given action to the current state.
   */
  makeMove(action) {
    const playerTurn = this.nextPlayer();
    const allowedActions = this.allowedActions();

    const isValidAction = allowedActions.find(a => a[0] === action[0] && a[1] === action[1]);
    if(!isValidAction)
      throw `The given action "${action}" is not allowed for the board ${this.currentState}`

    const resultingBoard = this.currentState.map((row) => row.slice());
    resultingBoard[action[0]][action[1]] = playerTurn;

    const newTicTacToe = new TicTacToe(resultingBoard)

    return newTicTacToe;
  }

  playerHasWon() {
    const { X, O } = CellState;
    const boardSize = this.currentState.length;
    const lastPlayer = this.nextPlayer() === X ? O : X;

    let i = 0, j = 0;
    const left = 0;
    const center = Math.floor(boardSize / 2);
    const right = boardSize - 1;

    const count = [0, [0, 0, 0], { [left]: 0, [right]: 0 }];
    for(; i < boardSize; i++) {
      const evaluatingLastRow = i === right;
      for(j = 0; j < boardSize; j++) {
        const playerMove = this.currentState[i][j];
        if(playerMove === lastPlayer) {
          // Track horizontal movements.
          count[0] += 1;

          // Track vertical movements.
          count[1][j] += 1;

          // Track diagonally movements.
          if(i === j && (i !== center && j !== center)) {
            count[2][0] += 1;
          }
          else if(Math.abs(i - j) >= 2) {
            count[2][right] += 1;
          }
          else if(i === center && j === center) {
            count[2][0] += 1
            count[2][right] += 1;
          }
        }

        // Evaluate vertically and diagonally.
        if(evaluatingLastRow) {
          const verticalMatch = count[1][j] === boardSize;
          let diagonalMatch = false;

          const evaluatingLastColumn = j === right;
          if(evaluatingLastColumn)
            diagonalMatch = count[2][left] === boardSize || count[2][right] == boardSize

          if(verticalMatch || diagonalMatch)
            return lastPlayer;
        }
      }

      // Evaluate horizontally.
      const horizontalMatch = count[0] === boardSize;
      if(horizontalMatch)
        return lastPlayer;

      count[0] = 0; // Restar the horizontal counting.
    }

    return null;
  }

  /**
   * Return true if the game is over, false otherwise.
   */
  isTerminal() {
    if(this.playerHasWon())
      return true;

    const { EMPTY } = CellState;

    let emptyCount = 0
    for(let row of this.currentState) {
      for(let column of row) {
        if(column === EMPTY)
          emptyCount += 1;
      }
    }

    const boardIsFilled = emptyCount === 0;
    if(boardIsFilled)
      return true;

    return false;
  }

  /**
   * Given a terminal board, reutrns 1 if X has won the game, -1 if O has
   * won, 0 otherwise.
   */
  utility() {
    const { X, O } = CellState;
    const winner = this.playerHasWon();
    
    if(winner === X)
      return 1;
    else if(winner === O)
      return -1;
    else
      return 0
  } 

  /**
   * Returns the optimal action for the current player on the board.
   */
  minimax() {
    const playerTurn = this.nextPlayer()
    const { X, O } = CellState

    if(playerTurn === CellState.X)
      return TicTacToe.bestMove(this, -Infinity, Math.max, O)
    else
      return TicTacToe.bestMove(this, Infinity, Math.min, X)
  }

  static bestMove(board, initialValue, evaluationFunction, opponent) {
    const { O } = CellState
    let bestMove = null
    let value = initialValue

    for(let action of board.allowedActions()) {
      const previous = value
      const game = board.makeMove(action)
      const opponnetValue = opponent === O ? game.maxValue() : game.minValue()

      value = evaluationFunction(value, opponnetValue)
      if(value !== previous) {
        bestMove = action
      }
    }

    return bestMove
  }

  maxValue() {
    if(this.isTerminal())
      return this.utility()

    let value = -Infinity
    for(let action of this.allowedActions()) {
      const newBoard = this.makeMove(action)
      const minimizerBestMove = newBoard.minValue()

      value = Math.max(value, minimizerBestMove)
    }

    return value;
  }

  minValue() {
    if(this.isTerminal())
      return this.utility()

    let value = Infinity
    for(let action of this.allowedActions()) {
      const newTicTacToe = this.makeMove(action)
      const maximizerBestMove = newTicTacToe.maxValue()

      value = Math.min(value, maximizerBestMove)
    }

    return value;
  }
}
