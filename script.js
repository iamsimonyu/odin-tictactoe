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

    Object.keys(gameBoard.board).forEach(function(key) {

    });
}