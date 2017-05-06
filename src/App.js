import React from "react";
import { withReducer } from "recompose";
import * as GameLogic from "./gameLogic";
import PlayerXImage from "./PlayerX.svg";
import PlayerOImage from "./PlayerO.svg";
import RestartImage from "./restart.png";
import "./App.css";

const initialState = {
  field: [[null, null, null], [null, null, null], [null, null, null]],
  currentPlayer: "X",
  winner: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "MOVE":
      const nField = GameLogic.updateField(
        state.currentPlayer,
        action.x,
        action.y,
        state.field
      );
      const winner = GameLogic.getWinner(nField);
      return {
        ...state,
        field: nField,
        currentPlayer: state.currentPlayer === "X" ? "O" : "X",
        winner
      };
    case "RESTART":
      return initialState;
    default:
      return state;
  }
};

const PlayerX = () => (
  <img alt="PlayerX" src={PlayerXImage} className="PlayerX" />
);
const PlayerO = () => (
  <img alt="PlayerY" src={PlayerOImage} className="PlayerY" />
);
const NoPlayer = () => <span className="NoPlayer" />;

const Cell = ({ field, value, x, y, onMove }) => {
  const C = () => {
    switch (value) {
      case "X":
        return <PlayerX />;
      case "O":
        return <PlayerO />;
      default:
        return <NoPlayer />;
    }
  };
  return (
    <button
      className="Cell"
      disabled={value !== null}
      onClick={e => onMove(x, y)}
      className="Cell"
    >
      <C />
    </button>
  );
};

const PlayField = ({ field, onMove }) => (
  <div>
    {field.map((ys, x) => (
      <div key={`${x}`} className="PlayField__row">
        {ys.map((v, y) => (
          <Cell key={`${x}-${y}`} {...{ field, value: v, x, y, onMove }} />
        ))}
      </div>
    ))}
  </div>
);

const GameOver = ({ winner, onRestart }) => (
  <div className="GameOver">
    <img
      className="GameOver__image"
      onClick={e => onRestart()}
      src={RestartImage}
    />
    <p className="GameOver__text">
      {winner === "DRAW" ? "It's a draw!" : `Player ${winner} wins!`}
    </p>
  </div>
);

const enhance = withReducer("state", "dispatch", reducer, initialState);

const App = enhance(({ state, dispatch }) => (
  <div className="App">
    {state.winner
      ? <GameOver
          winner={state.winner}
          onRestart={() => dispatch({ type: "RESTART" })}
        />
      : <PlayField
          field={state.field}
          onMove={(x, y) => dispatch({ type: "MOVE", x, y })}
        />}
  </div>
));

export default App;
