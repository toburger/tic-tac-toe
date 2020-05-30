/**
 * All functions expect the following 2D array as input for 'board':
 * const board =
 *   [[null, null, null],
 *    [null, null, null],
 *    [null, null, null]];
 *
 * The board values can be either:
 * * "X": PlayerX
 * * "O": PlayerO
 * * null
 */

// This lib contains powerful functions for list transformations.
import * as R from "ramda";

/**
 * Helps debugging the board
 */
export const logBoard = (board) => {
  console.table(board);
  return board;
};

/**
 * Updates a single board value by x and y coordinates and returns the modified board.
 * Leaves the original board unchanged.
 */
export const updateBoard = (board, x, y, value) =>
  R.assocPath([x, y], value)(board);

/**
 * Gets a single board value by x and y coordinates
 */
export const getBoard = (board, x, y) => R.path([x, y])(board);

/**
 * Checks if a board value can be updated (simply checks if the board contains null)
 */
export const canUpdateBoard = (board, x, y) => getBoard(board, x, y) === null;

/**
 * Checks if all elements a row contain the same value 'v'.
 * Checks all three rows.
 */
const checkRowsForWinner = (board, v) => {
  const check = R.all(R.equals(v));
  return check(board[0]) || check(board[1]) || check(board[2]);
};

/**
 * Cheks if all elements of a column contain the same value 'v'.
 * Checks all three columns.
 *
 * Uses a simple trick by transposing the board so that the whole board
 * gets rotated and the columns become rows. Then the "rows" can be passed
 * to checkRowsForWinner
 */
const checkColsForWinner = (board, v) => {
  const transposedBoard = R.transpose(board);
  return checkRowsForWinner(transposedBoard, v);
};

/**
 * Checks if all elements of a diagnola contain the same value 'v'.
 * Checks the two diagonals.
 */
const checkDiagonalsForWinner = (board, v) => {
  const diag1 = [board[0][0], board[1][1], board[2][2]];
  const diag2 = [board[2][0], board[1][1], board[0][2]];
  const check = R.all(R.equals(v));
  return check(diag1) || check(diag2);
};

/**
 * Checks if any one of the
 * * rows
 * * columns
 * * diagonals
 * of the board contain the same value 'v'.
 */
const checkForWinner = (board, v) =>
  checkRowsForWinner(board, v) ||
  checkColsForWinner(board, v) ||
  checkDiagonalsForWinner(board, v);

/**
 * Checks if the game is a draw
 *
 * It does check if all of the boards aren't null.
 */
const checkForDraw = (board) => {
  const check = R.all((x) => x !== null);
  return check(R.flatten(board));
};

/**
 * Determines either the winner or a draw.
 * If null is returned the game continues.
 *
 * @returns "X" | "O" | "DRAW" | null
 */
export const getWinner = (board) => {
  if (checkForWinner(board, "X"))
    // player X wins!
    return "X";
  else if (checkForWinner(board, "O"))
    // player O wins!
    return "O";
  else if (checkForDraw(board))
    // it'a a draw!
    return "DRAW";
  else return null;
};
