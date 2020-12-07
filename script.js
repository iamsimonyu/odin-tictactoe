const gameBoard = (() => {

  // board is represented as an array with 9 elements, each = ''
  let board = [];
  for (i = 0; i < 9; i++) {
    board.push('')
  }

  const reset = () => {
    // change all board array elements to '' (empty) i.e. reset the board
    for (i = 0; i < 9; i++) {
      board[i] = '';
    }

    // redraw the board once reset
    display();
  };

  const display = () => {
    const boardContainer = document.querySelector("#board");

    // clear existing board
    while (boardContainer.firstChild) {
      boardContainer.removeChild(boardContainer.firstChild);
    }

    // render board (array)
    Object.keys(board).forEach(function(key) {
      // for each element in the board array, add a div element ("square")
      const square = document.createElement('div');
      // each square has the 'square' class
      square.classList.add('square');
      // each square has a 'data-index' key -- this is used to identify which
      // square is clicked by the user
      square.setAttribute('data-index', key);
      // if square has been clicked already (i.e. its element in the board array !== '')
      // add 'clicked' class -- this changes the user's cursor to "not allowed"
      (board[key] !== '') ? square.classList.add('clicked') : null;

      // each square should contain text that is either blank, X or O.
      // ternary operator: (if condition) ? (thing to do if true) : (thing to do if false)
      const text = document.createElement('div');
      text.textContent =
        (board[key] === '')
          ? ''
          : (board[key] === '1')
            ? 'X'
            : 'O';
      square.appendChild(text);
      boardContainer.appendChild(square);
    });

    // add 'click' event listeners to squares to allow users to place markers
    // unless game is over
    if (game.getTurnsLeft() !== 0) {
      const squares = document.querySelectorAll(".square:not(.clicked)");
      squares.forEach(square => square.addEventListener('click', userPlay));
    }
  };

  // set element in Board array to player (1 / 2)
  const setSquare = (index) => {
    // player = 1 if player 1; 2 if player 2
    const player = game.getPlayerTurn();

    // set element of board array to 1 or 2
    board[index] = (player === '1') ? '1' : '2';
  }

  // function to remove event listeners e.g. when a player wins
  const removeEventListeners = () => {
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.removeEventListener('click', userPlay);
    });
  };

  const getSquare = (index) => {
    return board[index];
  };

  return {
    reset,
    setSquare,
    display,
    getSquare,
    removeEventListeners,
  };
})();

const game = (() => {
  let turnsLeft = 9;

  const getTurnsLeft = () => turnsLeft;

  // identify whose turn it is by seeing how many turns are left in the game
  // if even number of turns, it must be player 2's turn
  // If odd, it must be player 1's turn
  const getPlayerTurn = () => {
    const player = (turnsLeft % 2 === 0) ? '2' : '1';
    return player;
  };

  // This function determines what to do when the user clicks a given square.
  // The clicked square is passed via "index"
  const takeTurn = (index) => {

    // set the element in the board to 1 or 2 depending on whose turn it was
    gameBoard.setSquare(index);

    // decrease # turns left; 0 = this was the final turn, board is now full
    turnsLeft -=1;

    // check if there's a winner OR if it's a tie
    // outcome = 1 if P1 has won; 2 if P2 has won; tie if game over
    const outcome = checkIfWinner(index);

    if (outcome === 1 || outcome === 2) {

      // increment player scores
      (outcome === 1) ? player1.incrementScore() : player2.incrementScore();
      updatePlayerScores();

      // display elements to show who has won
      showGameOutcome(outcome);

      // change turns left to zero because game is over!
      turnsLeft = 0;

      // users can no longer click remaining squares because game is over!
      gameBoard.removeEventListeners();
    } else if (turnsLeft === 0) {
      // No winner. And, if no turns left, then it must be a tie. Show tie msg.
      showGameOutcome("tie");

    }
    
    // change turn marker, unless there's no more turns left
    if (turnsLeft > 0) { changeTurnMarker() };

    gameBoard.display();
  };

  // change the "current player" marker (if there is another turn remaining)
  const changeTurnMarker = () => {

    // put ">" next to player whose turn it is. First, clear the ">" div
    const playerMarkers = document.querySelectorAll("div[id^='playerMarker']");
    playerMarkers.forEach((marker) => {
      marker.textContent = "";
    });

    // then, add the ">" next to player's name
    const player = getPlayerTurn();
    document.querySelector(`#playerMarker${player}`).textContent = ">";
  };

  // displays elements that show who has won
  const showGameOutcome = (outcome) => {

    // make banner visible
    const gameOutcome = document.querySelector("#gameOutcome");
    gameOutcome.style.visibility = "visible";

    if (outcome === "tie") {
      // set banner message above the board
      gameOutcome.textContent = `It's a tie!`;
      gameOutcome.classList.add('tie');
    } else {
      // if outcome isn't a tie, means there's a winner

      // set crown next to the winning player to visible
      document.querySelector("#playerWinner" + outcome).style.visibility = "visible";

      // set banner message above the board with winner's name, set class
      const winnerName = document.querySelector(`#playerName${outcome}`).value;
      gameOutcome.textContent = `${winnerName} has won!`;
      gameOutcome.classList.add('winner');
    }

  }

  // checks if a win condition has been met (3 in a row)
  // OR if it's a tie (no-one has won and there are no more turns left)
  const checkIfWinner = () => {

    // 8 ways to win (3 columns, 3 rows, 2 diagonals)
    const winningAxes = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ]

    // outer loop loops through each of the 8 ways to win
    for (let i = 0; i < winningAxes.length; i++) {
      // reset sum counter to zero
      let sum = 0;
      
      // reset flag for whether there's an empty square in this combo
      let emptySquareExists = false;

      // inner loop loops through each array element's 3 cells
      for (let j = 0; j < winningAxes[i].length; j++) {
        // get the value of each square; e.g. [0,1,2] will get the value of 
        // the square in the 0, 1, and 2 array position (i.e. top row)
        const square = Number(gameBoard.getSquare(winningAxes[i][j]));
        // console.log(`checking combo ${i} -> cell ${winningAxes[i][j]}: ${square}`);

        // add the square's value to this "combo's" total
        sum += square;
        // if a square in one of the 3 positions is empty, set the flag to true
        if (square === 0) {emptySquareExists = true};
      }

      // at this point, we know the sum of the winning axis.
      // if sum = 6, player 2 has won (since player 2's squares are represented with '2' in the 'board' array)
      // if sum = 3, player 1 MAY have won (since player 1's squares are represented with '1')
      // BUT, it's possible to make a sum of 3 from 3 cells by having one X (=1), one O (=2) and one empty square
      // Or more generally, to win tic-tac-toe, you have to have 3 completed squares with your marker. So, check
      // that there isn't an empty square.
      if (!emptySquareExists) {
        if (sum === 6 || sum === 3) {
          // if sum = 6 or 3, and all 3 squares are filled in, then either
          // player 1 has won (three 'X's = 3) or player 2 has won (three 'O's = 6)
          // can identify player number by just dividing by 3
          return sum / 3;
        }
      }
    }
  };

  const updatePlayerScores = () => {
    document.querySelector('#player1score').textContent = player1.getScore();
    document.querySelector('#player2score').textContent = player2.getScore();
  }

  const reset = (type) => {
    // reset turn counter
    turnsLeft = 9;

    // clear board array and redraw
    gameBoard.reset();

    // hide outcome message
    const gameOutcome = document.querySelector("#gameOutcome");
    gameOutcome.style.visibility = "hidden";

    // remove any crown "winning" indicators 
    const playerWinners = document.querySelectorAll(".crownMarker");
    playerWinners.forEach(item => item.style.visibility = "hidden");

    // if user has chosen to reset the whole game, reset player scores
    if (type === "game") {
      player1.resetScore();
      player2.resetScore();
      updatePlayerScores();
    }
  };

  return {
    getTurnsLeft,
    getPlayerTurn,
    takeTurn,
    reset,
  }
})();

// userPlay is triggered when the user selects a square
const userPlay = (event) => {
  // use event instead of passing square in userPlay so that we can remove the
  // event handler without needing argument
  // see https://medium.com/@DavideRama/removeeventlistener-and-anonymous-functions-ab9dbabd3e7b
  // "dataset" exposes the element's "data-" attribute, and "index" specifies
  // we want the "data-index" attribute set above
  const clickedSquare = event.target.dataset.index;
  // console.log(`You clicked: ${clicked}`)

  // pass the clicked square (i.e. 0-8) to the clicked function
  game.takeTurn(clickedSquare);
}

const player = (name) => {
  let score = 0;
  const getScore = () => score;
  const incrementScore = () => score++;
  const resetScore = () => { score = 0 };
  return {
    getScore,
    incrementScore,
    resetScore,
  }
};

const player1 = player("player1");
const player2 = player("player2");

// use () => functionName(param) because just functionName(param) results in function running immediately
document.querySelector("#resetRound").addEventListener('click', () => game.reset("round"));
document.querySelector("#resetGame").addEventListener('click', () => game.reset("game"));

gameBoard.display();