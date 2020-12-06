const gameBoard = (() => {

  // initialise gameboard
  let board = [];

  for (i = 0; i < 9; i++) {
    board.push('x')
  }

  const getBoard = () => board;

  return {
    getBoard
  };
})();

document.querySelector("#click").addEventListener('click', () => {console.log(gameBoard.getBoard())});

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
      const text = document.createElement('div');
      text.textContent = key;
      square.appendChild(text);
      board.appendChild(square);
    });
}

display();