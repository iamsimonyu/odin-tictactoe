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

    // render board
    Object.keys(board).forEach(function(key) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.setAttribute('data-index', key);
      const text = document.createElement('div');
      text.textContent = board[key];
      square.appendChild(text);
      boardContainer.appendChild(square);
    });

    // add event listeners to squares
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener('click', () => {
        userPlay(square);
      });
    });
  };

  const clicked = (index) => {
    board[index] = 'x';
    console.log(board);
    display();
  };

  return {
    display,
    clicked
  };
})();

const userPlay = (square) => {
  const clicked = square.dataset.index;
  console.log("you clicked: " + clicked);
  gameBoard.clicked(clicked);
}

gameBoard.display();