# odin-tictactoe

(https://www.theodinproject.com/courses/javascript/lessons/tic-tac-toe-javascript)[https://www.theodinproject.com/courses/javascript/lessons/tic-tac-toe-javascript]

The factory function "Player" is used to create two player objects ("player1", "player2")
- Each player object has a "score" property that records how many games that player has won so far

Two modules, "game" and "gameBoard", wrap functions that manage the game state, and the game board respectively. For example:
- game:
  - turnsLeft: holds number of turns left in game (if there are no turns left, and no winner, it's a tie)
  - takeTurn: this is called each time a player clicks a square. It places the marker (X / O), decrements the turn counter, and determines if there's a winner.
  - checkIfWinner: this is the function that checks win conditions to see if one has been met (i.e. is there 3-in-a-row)
  - showGameOutcome: if there's a winner, this function displays a banner stating who the winner is and shows a crown next to the winning player's name
  - reset: resets turn counter, initiates clearing of board, resets player scores (if user wants to reset whole game)
- gameBoard:
  - board[]: this is a 9-element array that holds the state of the current round. '' = empty (unclicked), 1 = player 1 has clicked (= 'X'), 2 = player 2 has clicked (= 'O')
  - reset: clears board array (resets all elements to '')
  - display: draws tic-tac-toe board as a 3x3 grid, with content of each square determined based on the board array contents
  - setSquare: set a given board element to 1 (X) or 2 (O)
  - removeEventListeners: if a game is won by either player, this removes the "click" event listeners from any remaining squares