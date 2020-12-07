const gameBoard = (() => {

  // board is represented as an array with 9 elements, each = ''
  let board = [];
  for (i = 0; i < 9; i++) {
    board.push('')
  }

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
    if (game.turnsLeft !== 0) {
      const squares = document.querySelectorAll(".square:not(.clicked)");
      squares.forEach(square => square.addEventListener('click', userPlay));
    }
  };

  // function to remove event listeners e.g. when a player wins
  const removeEventListeners = () => {
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.removeEventListener('click', userPlay);
    });
  };

  // This function determines what to do when the user clicks a given square.
  // The clicked square is passed via "index"
  const clicked = (index) => {
    // game.getPlayerTurn returns 1 if player 1, or 2 if player 2
    const player = game.getPlayerTurn();

    // set the element in the board to 1 or 2 depending on whose turn it was
    board[index] = (player === '1') ? '1' : '2';

    // check winner
    game.checkWinner(index);

    // decrement turn counter
    game.changeTurn();
    display();
  };

  const getSquare = (index) => {
    return board[index];
  };

  return {
    display,
    clicked,
    getSquare,
    removeEventListeners,
  };
})();

const game = (() => {
  let turnsLeft = 9;

  // identify whose turn it is by seeing how many turns are left in the game
  // if even number of turns, it must be player 2's turn
  // If odd, it must be player 1's turn
  const getPlayerTurn = () => {
    player = (turnsLeft % 2 === 0) ? '2' : '1';
    return player;
  };

  // decrement turn counter and change the "current player" marker
  const changeTurn = () => {
    turnsLeft -= 1;

    // put ">" next to player whose turn it is. First, clear the ">" div
    const playerMarkers = document.querySelectorAll("div[id^='playerMarker']");
    playerMarkers.forEach((marker) => {
      marker.textContent = "";
    });

    // then, add the ">" next to player's name
    const player = getPlayerTurn();
    document.querySelector(`#playerMarker${player}`).textContent = ">";

    // console.log("turns left: " + turnsLeft);
    // console.log("--------------------")
  };

  // displays elements that show who has won
  const showWinner = (winner) => {
    // place a crown next to the winning player
    document.querySelector("#playerWinner" + winner).textContent = "👑";

    // set winner <div> message above the board
    const winnerName = document.querySelector(`#playerName${winner}`).value;
    const winMessage = document.querySelector(".winMessage");
    winMessage.textContent = `${winnerName} has won!`;
    winMessage.style.visibility = "visible";
  }

  const checkWinner = () => {
    let winner = "";

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
      // console.log(`result: ${sum}`);
      // console.log(`** empty square? ${emptySquareExists}`)

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
          winner = sum / 3;

          // display elements to show who has won
          showWinner(winner);

          // change turns left to zero because game is over!
          game.turnsLeft = 0;

          // users can no longer click remaining squares because game is over!
          gameBoard.removeEventListeners();
        }
      }
    }
  };

  return {
    getPlayerTurn,
    changeTurn,
    checkWinner,
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
  gameBoard.clicked(clickedSquare);
}

gameBoard.display();