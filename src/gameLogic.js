import R from "ramda";

/**
 * given the data structure:
 * const field =
 *   [[null, null, null],
 *    [null, null, null],
 *    [null, null, null]];
*/

export const logField = field => {
  console.table(field);
  return field;
};

export const updateField = (value, x, y, field) =>
  R.assocPath([x, y], value)(field);
export const getField = (x, y) => R.path([x, y]);
export const canUpdateField = (x, y) => getField(x, y) === null;

const checkRowsForWinner = (field, v) => {
  const check = R.all(R.equals(v));
  return check(field[0]) || check(field[1]) || check(field[2]);
};

const checkColsForWinner = (field, v) => {
  const tfield = R.transpose(field);
  return checkRowsForWinner(tfield, v);
};

const checkDiagonalsForWinner = (field, v) => {
  const diag1 = [field[0][0], field[1][1], field[2][2]];
  const diag2 = [field[2][0], field[1][1], field[0][2]];
  const check = R.all(R.equals(v));
  return check(diag1) || check(diag2);
};

const checkForWinner = (field, v) =>
  checkRowsForWinner(field, v) ||
  checkColsForWinner(field, v) ||
  checkDiagonalsForWinner(field, v);

const checkForDraw = field => {
  const check = R.all(x => x !== null);
  return check(R.flatten(field));
};

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
