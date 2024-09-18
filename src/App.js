import React, { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={"square" + " " + `${highlight}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export function Board({ xIsNext, squares, onPlay }) {
  const [lastIndex, setLastIndex] = useState(0);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    setLastIndex(i);

    const col = (i % 3) + 1;
    const row = Math.floor(i / 3) + 1;

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "○";
    }
    onPlay(nextSquares, col, row);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (lastIndex === 8) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "○");
  }

  const boardRow = [];
  // for (let i = 0; i < 9; i += 3) {
  //   let rows = [];
  //   for (let j = 0; j < 3; j++) {
  //     rows.push(
  //       <Square
  //         key={i + j}
  //         value={squares[i + j]}
  //         onSquareClick={() => handleClick(i + j)}
  //       />
  //     );
  //   }
  //   boardRow.push(<div className="board-row">{rows}</div>);
  // }
  let rows = [];
  let highlight = "";
  for (let i = 0; i < 9; i++) {
    if (i % 3 === 0) {
      rows = [];
    }
    if (winner && lastIndex === i) {
      highlight = "highlight";
    } else {
      highlight = "";
    }

    rows.push(
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        highlight={highlight}
      />
    );
    if (i % 3 === 2) {
      boardRow.push(
        <div key={"div" + i} className="board-row">
          {rows}
        </div>
      );
    }
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRow}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortMoves, setSortMoves] = useState([]);
  const [isAscending, setIsAscending] = useState(true);
  const [position, setPosition] = useState({ col: 0, row: 0 });
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, col, row) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setSortMoves(sortMoves);
    setPosition({ col, row });
  }

  let moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      let message = move === currentMove ? "You are at move #" : "Go to move #";
      description =
        message + "(col:" + position.col + ", row:" + position.row + ")";
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleSortMoves() {
    setIsAscending(!isAscending);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          <button className="sort-button" onClick={handleSortMoves}>
            sort
          </button>
        </div>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
