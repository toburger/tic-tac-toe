import React from "react";
import { withReducer, onlyUpdateForKeys } from "recompose";
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

const PlayerX = props => (
  <img {...props} alt="PlayerX" src={PlayerXImage} className="PlayerX" />
);
const PlayerO = props => (
  <img {...props} alt="PlayerO" src={PlayerOImage} className="PlayerO" />
);
const NoPlayer = props => <span {...props} className="NoPlayer" />;

const Cell = onlyUpdateForKeys(["value"])(({ field, value, x, y, onMove }) => {
  const Child = () => {
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
    >
      <Child />
    </button>
  );
});

const DispatchPlayer = ({ player }) =>
  player === "X"
    ? <PlayerX style={{ height: "10px" }} />
    : <PlayerO style={{ height: "10px" }} />;

const CurrentPlayer = ({ currentPlayer }) => (
  <div className="CurrentPlayer">
    <span className="CurrentPlayer__text">
      Player:
      <DispatchPlayer player={currentPlayer} />
    </span>
  </div>
);

const GameBoard = ({ field, onMove }) => (
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

const PlayField = ({ field, onMove, currentPlayer }) => (
  <div>
    <GameBoard field={field} onMove={onMove} />
    <CurrentPlayer currentPlayer={currentPlayer} />
  </div>
);

const GameOver = ({ winner, onRestart }) => (
  <div className="GameOver">
    <img
      className="GameOver__image"
      onClick={e => onRestart()}
      src={RestartImage}
      alt="Restart"
    />
    <p className="GameOver__text">
      {winner === "DRAW"
        ? "It's a draw!"
        : <span>
            Player
            <DispatchPlayer player={winner} />
            wins!
          </span>}
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
          currentPlayer={state.currentPlayer}
          onMove={(x, y) => dispatch({ type: "MOVE", x, y })}
        />}
  </div>
));

export default App;
