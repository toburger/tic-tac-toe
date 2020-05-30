import React, { memo, useReducer } from "react";
import * as GameLogic from "./gameLogic";
import PlayerXImage from "./assets/PlayerX.svg";
import PlayerOImage from "./assets/PlayerO.svg";
import RestartImage from "./assets/restart.png";
import "./App.css";

const initialState = {
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  currentPlayer: "X",
  winner: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "MOVE":
      if (!GameLogic.canUpdateBoard(state.board, action.x, action.y))
        return state;
      const newBoard = GameLogic.updateBoard(
        state.board,
        action.x,
        action.y,
        state.currentPlayer
      );
      const winner = GameLogic.getWinner(newBoard);
      return {
        ...state,
        board: newBoard,
        currentPlayer: state.currentPlayer === "X" ? "O" : "X",
        winner,
      };
    case "RESTART":
      return initialState;
    default:
      return state;
  }
};

const prefetchImages = () =>
  [PlayerXImage, PlayerOImage, RestartImage].map((img) => (
    <link key={img} rel="prefetch" href={img} />
  ));

const PlayerX = ({ className, ...props }) => (
  <img
    {...props}
    alt="PlayerX"
    src={PlayerXImage}
    className={["PlayerX", className].join(" ")}
  />
);
const PlayerO = ({ className, ...props }) => (
  <img
    {...props}
    alt="PlayerO"
    src={PlayerOImage}
    className={["PlayerO", className].join(" ")}
  />
);
const NoPlayer = (props) => <span {...props} className="NoPlayer" />;

const Cell = memo(function Cell({ value, x, y, onMove }) {
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
      onClick={(e) => onMove(x, y)}
    >
      <Child />
    </button>
  );
});

const DispatchPlayer = ({ player }) =>
  player === "X" ? (
    <PlayerX className="PlayerX--Small" />
  ) : (
    <PlayerO className="PlayerO--Small" />
  );

const CurrentPlayer = ({ currentPlayer }) => (
  <div className="CurrentPlayer">
    <span className="CurrentPlayer__Text">
      Player:
      <DispatchPlayer player={currentPlayer} />
    </span>
  </div>
);

const Board = ({ board, onMove }) => (
  <div>
    {board.map((ys, x) => (
      <div key={`${x}`} className="Board__Row">
        {ys.map((v, y) => (
          <Cell key={`${x}-${y}`} {...{ board, value: v, x, y, onMove }} />
        ))}
      </div>
    ))}
  </div>
);

const Game = ({ board, onMove, currentPlayer }) => (
  <div>
    <Board board={board} onMove={onMove} />
    <CurrentPlayer currentPlayer={currentPlayer} />
  </div>
);

const GameOver = ({ winner, onRestart }) => (
  <div className="GameOver">
    <img
      className="GameOver__Image"
      onClick={(e) => onRestart()}
      src={RestartImage}
      alt="Restart"
    />
    <p className="GameOver__Text">
      {winner === "DRAW" ? (
        "It's a draw!"
      ) : (
        <span>
          Player
          <DispatchPlayer player={winner} />
          wins!
        </span>
      )}
    </p>
  </div>
);

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="App">
      {prefetchImages()}
      {state.winner ? (
        <GameOver
          winner={state.winner}
          onRestart={() => dispatch({ type: "RESTART" })}
        />
      ) : (
        <Game
          board={state.board}
          currentPlayer={state.currentPlayer}
          onMove={(x, y) => dispatch({ type: "MOVE", x, y })}
        />
      )}
    </div>
  );
};

export default App;
