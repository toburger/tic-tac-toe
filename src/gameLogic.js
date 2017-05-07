/**
 * All functions expect the following 2D array as input for 'field':
 * const field =
 *   [[null, null, null],
 *    [null, null, null],
 *    [null, null, null]];
 *
 * The field values can be either:
 * * "X": PlayerX
 * * "O": PlayerO
 * * null
*/

// This lib contains powerful functions for list transformations.
import R from "ramda";

/**
 * Helps debugging the field
*/
export const logField = field => {
  console.table(field);
  return field;
};

/**
 * Updates a single field value by x and y coordinates and returns the modified field.
 * Leaves the original field unchanged.
 */
export const updateField = (field, x, y, value) =>
  R.assocPath([x, y], value)(field);

/**
 * Gets a single field value by x and y coordinates
 */
export const getField = (field, x, y) => R.path([x, y])(field);

/**
 * Checks if a field value can be updated (simply checks if the field contains null)
 */
export const canUpdateField = (field, x, y) => getField(field, x, y) === null;

/**
 * Checks if all elements a row contain the same value 'v'.
 * Checks all three rows.
 */
const checkRowsForWinner = (field, v) => {
  const check = R.all(R.equals(v));
  return check(field[0]) || check(field[1]) || check(field[2]);
};

/**
 * Cheks if all elements of a column contain the same value 'v'.
 * Checks all three columns.
 * 
 * Uses a simple trick by transposing the field so that the whole field
 * gets rotated and the columns become rows. Then the "rows" can be passed
 * to checkRowsForWinner
 */
const checkColsForWinner = (field, v) => {
  const tfield = R.transpose(field);
  return checkRowsForWinner(tfield, v);
};

/**
 * Checks if all elements of a diagnola contain the same value 'v'.
 * Checks the two diagonals.
 */
const checkDiagonalsForWinner = (field, v) => {
  const diag1 = [field[0][0], field[1][1], field[2][2]];
  const diag2 = [field[2][0], field[1][1], field[0][2]];
  const check = R.all(R.equals(v));
  return check(diag1) || check(diag2);
};

/**
 * Checks if any one of the
 * * rows
 * * columns
 * * diagonals
 * of the field contain the same value 'v'.
 */
const checkForWinner = (field, v) =>
  checkRowsForWinner(field, v) ||
  checkColsForWinner(field, v) ||
  checkDiagonalsForWinner(field, v);

/**
 * Checks if the game is a draw
 *
 * It does check if all of the fields aren't null.
 */
const checkForDraw = field => {
  const check = R.all(x => x !== null);
  return check(R.flatten(field));
};

/**
 * Determines either the winner or a draw.
 * If null is returned the game continues.
 *
 * @returns "X" | "O" | "DRAW" | null
 */
export const getWinner = field => {
  if (checkForWinner(field, "X"))
    // player X wins!
    return "X";
  else if (checkForWinner(field, "O"))
    // player O wins!
    return "O";
  else if (checkForDraw(field))
    // it'a a draw!
    return "DRAW";
  else return null;
};
