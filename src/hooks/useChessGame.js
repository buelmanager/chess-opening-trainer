import { useState, useCallback } from 'react';
import { INITIAL_POSITION } from '../components/Chessboard';

export function useChessGame() {
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [moveHistory, setMoveHistory] = useState([]);
  const [lastMove, setLastMove] = useState(null);

  const makeMove = useCallback((from, to) => {
    setPosition((prev) => {
      const newPosition = { ...prev };
      const piece = newPosition[from];

      if (!piece) return prev;

      delete newPosition[from];
      newPosition[to] = piece;

      return newPosition;
    });

    setMoveHistory((prev) => [...prev, { from, to }]);
    setLastMove({ from, to });
  }, []);

  const resetGame = useCallback(() => {
    setPosition(INITIAL_POSITION);
    setMoveHistory([]);
    setLastMove(null);
  }, []);

  const setPositionFromMoves = useCallback((moves) => {
    let newPosition = { ...INITIAL_POSITION };

    moves.forEach((move) => {
      const piece = newPosition[move.from];
      if (piece) {
        delete newPosition[move.from];
        newPosition[move.to] = piece;
      }
    });

    setPosition(newPosition);
    setMoveHistory(moves);
    setLastMove(moves.length > 0 ? moves[moves.length - 1] : null);
  }, []);

  const undoMove = useCallback(() => {
    if (moveHistory.length === 0) return;

    const newHistory = moveHistory.slice(0, -1);
    setPositionFromMoves(newHistory);
  }, [moveHistory, setPositionFromMoves]);

  return {
    position,
    moveHistory,
    lastMove,
    makeMove,
    resetGame,
    setPositionFromMoves,
    undoMove,
  };
}

export default useChessGame;
