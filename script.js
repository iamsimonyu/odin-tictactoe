const gameBoard = (() => {

  // initialise gameboard
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
      const square = document.createElement('div');
      square.classList.add('square');
      square.setAttribute('data-index', key);
      // if square has been clicked already, add 'clicked' class
      (board[key] !== '') ? square.classList.add('clicked') : null;
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

    // add event listeners to squares
    const squares = document.querySelectorAll(".square:not(.clicked)");
    squares.forEach((square) => {
      square.addEventListener('click', () => {
        userPlay(square);
      });
    });
  };

  const clicked = (index) => {
    const player = game.getPlayerTurn();
    board[index] = (player === '1') ? '1' : '2';
    game.checkWinner(index);
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
  };
})();

const game = (() => {
  let turnsLeft = 9;

  const getPlayerTurn = () => {
    player = (turnsLeft % 2 === 0) ? '2' : '1';
    return player;
  };

  const changeTurn = () => {
    turnsLeft -= 1;

    // clear all textContent. [id^='xx'] matches all ids starting xx
    const playerMarkers = document.querySelectorAll("div[id^='playerMarker']");
    playerMarkers.forEach((marker) => {
      marker.textContent = "";
    });

    // "player" returns whose turn it is (1 or 2)
    const player = getPlayerTurn();
    document.querySelector(`#playerMarker${player}`).textContent = ">";
    console.log("turns left: " + turnsLeft);
    console.log("--------------------")
  };

  const checkWinner = () => {
    let winner = "";

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

    for (let i = 0; i < winningAxes.length; i++) {
      let sum = 0;
      let emptySquareExists = false;
      for (let j = 0; j < winningAxes[i].length; j++) {
        const square = Number(gameBoard.getSquare(winningAxes[i][j]));
        console.log(`checking combo ${i} -> cell ${winningAxes[i][j]}: ${square}`);
        sum += square;
        // if a square in one of the 3 positions is empty, set the flag to true
        if (square === 0) {emptySquareExists = true};
      }
      console.log(`result: ${sum}`);
      console.log(`** empty square? ${emptySquareExists}`)

      if (!emptySquareExists) {
        // if no empty square, then check for sum (winner)
        // important to check for empty squares b/c possible to get sum of 3
        // by e.g. 2-1-(null) not just 1-1-1
        // i.e     O-X-(null) not just X-X-X
        if (sum === 6 || sum === 3) {
          winner = sum % 2;
          console.log(`!!!! WINNER ---> Player ${winner}`);
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

const userPlay = (square) => {
  const clicked = square.dataset.index;
  gameBoard.clicked(clicked);  
}

gameBoard.display();