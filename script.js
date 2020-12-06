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

  return {
    display,
    clicked
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
  };

  const checkWinner = () => {
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