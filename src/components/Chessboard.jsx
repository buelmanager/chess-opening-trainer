import { useState, useCallback } from 'react';
import './Chessboard.css';

const INITIAL_POSITION = {
  a8: 'r', b8: 'n', c8: 'b', d8: 'q', e8: 'k', f8: 'b', g8: 'n', h8: 'r',
  a7: 'p', b7: 'p', c7: 'p', d7: 'p', e7: 'p', f7: 'p', g7: 'p', h7: 'p',
  a2: 'P', b2: 'P', c2: 'P', d2: 'P', e2: 'P', f2: 'P', g2: 'P', h2: 'P',
  a1: 'R', b1: 'N', c1: 'B', d1: 'Q', e1: 'K', f1: 'B', g1: 'N', h1: 'R',
};

const PIECE_SYMBOLS = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export default function Chessboard({
  position = INITIAL_POSITION,
  onMove,
  highlightedSquares = [],
  lastMove = null,
  orientation = 'white',
  disabled = false
}) {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [draggedPiece, setDraggedPiece] = useState(null);

  const files = orientation === 'white' ? FILES : [...FILES].reverse();
  const ranks = orientation === 'white' ? RANKS : [...RANKS].reverse();

  const isWhitePiece = (piece) => piece === piece.toUpperCase();

  const handleSquareClick = useCallback((square) => {
    if (disabled) return;
    const piece = position[square];

    if (selectedSquare) {
      if (selectedSquare !== square) {
        onMove?.(selectedSquare, square);
      }
      setSelectedSquare(null);
    } else if (piece) {
      setSelectedSquare(square);
    }
  }, [selectedSquare, position, onMove, disabled]);

  const handleDragStart = useCallback((e, square) => {
    if (disabled) return;
    const piece = position[square];
    if (!piece) return;

    setDraggedPiece({ square, piece });
    setSelectedSquare(square);
    e.dataTransfer.effectAllowed = 'move';
  }, [position, disabled]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e, targetSquare) => {
    e.preventDefault();
    if (draggedPiece && draggedPiece.square !== targetSquare) {
      onMove?.(draggedPiece.square, targetSquare);
    }
    setDraggedPiece(null);
    setSelectedSquare(null);
  }, [draggedPiece, onMove]);

  const handleDragEnd = useCallback(() => {
    setDraggedPiece(null);
    setSelectedSquare(null);
  }, []);

  const getSquareClass = (square, file, rank) => {
    const classes = ['square'];
    const isLight = (FILES.indexOf(file) + RANKS.indexOf(rank)) % 2 === 0;
    classes.push(isLight ? 'light' : 'dark');

    if (selectedSquare === square) {
      classes.push('selected');
    }
    if (highlightedSquares.includes(square)) {
      classes.push('highlighted');
    }
    if (lastMove && (lastMove.from === square || lastMove.to === square)) {
      classes.push('last-move');
    }

    return classes.join(' ');
  };

  return (
    <div className="chessboard-container">
      <div className="chessboard">
        {ranks.map((rank) => (
          files.map((file) => {
            const square = `${file}${rank}`;
            const piece = position[square];

            return (
              <div
                key={square}
                className={getSquareClass(square, file, rank)}
                onClick={() => handleSquareClick(square)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, square)}
              >
                {file === files[0] && (
                  <span className="rank-label">{rank}</span>
                )}
                {rank === ranks[ranks.length - 1] && (
                  <span className="file-label">{file}</span>
                )}
                {piece && (
                  <span
                    className={`piece ${isWhitePiece(piece) ? 'white' : 'black'}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, square)}
                    onDragEnd={handleDragEnd}
                  >
                    {PIECE_SYMBOLS[piece]}
                  </span>
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
}

export { INITIAL_POSITION };
