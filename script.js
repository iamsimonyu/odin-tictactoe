const gameBoard = (() => {

  // initialise gameboard
  let board = [];

  for (i = 0; i < 9; i++) {
    board.push('')
  }

  const getBoard = () => board;

  const display = () => {
    const board = document.querySelector("#board");

    // clear existing board
    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }

    // render board
    Object.keys(gameBoard.getBoard()).forEach(function(key) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.setAttribute('data-index', key);
      const text = document.createElement('div');
      square.appendChild(text);
      board.appendChild(square);
    });

    // add event listeners to squares
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener('click', () => {
        userPlay(square);
      });
    });
  }

  return {
    getBoard,
    display
  };
})();

const userPlay = (square) => {
  const clicked = square.dataset.index;
  console.log("you clicked: " + clicked);
}

gameBoard.display();