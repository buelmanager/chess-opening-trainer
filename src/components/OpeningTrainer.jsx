import { useState, useCallback, useEffect } from 'react';
import Chessboard from './Chessboard';
import { useChessGame } from '../hooks/useChessGame';
import openings from '../data/openings';
import './OpeningTrainer.css';

export default function OpeningTrainer() {
  const [selectedOpening, setSelectedOpening] = useState(openings[0]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [mode, setMode] = useState('learn'); // 'learn' or 'practice'
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

  const {
    position,
    lastMove,
    makeMove,
    resetGame,
    setPositionFromMoves,
  } = useChessGame();

  const currentMove = selectedOpening.moves[currentMoveIndex];
  const isComplete = currentMoveIndex >= selectedOpening.moves.length;
  const isUserTurn = currentMoveIndex % 2 === 0; // 백(사용자)의 차례

  useEffect(() => {
    resetGame();
    setCurrentMoveIndex(0);
    setFeedback(null);
    setShowHint(false);
  }, [selectedOpening, resetGame]);

  const handleMove = useCallback((from, to) => {
    if (isComplete) return;

    if (mode === 'learn') {
      // 학습 모드: 올바른 수만 허용
      if (from === currentMove.from && to === currentMove.to) {
        makeMove(from, to);
        setCurrentMoveIndex((prev) => prev + 1);
        setFeedback({ type: 'success', message: currentMove.comment });
        setShowHint(false);
      } else {
        setFeedback({ type: 'error', message: '다른 수를 시도해보세요. 힌트를 확인하세요!' });
      }
    } else {
      // 연습 모드
      if (isUserTurn) {
        if (from === currentMove.from && to === currentMove.to) {
          makeMove(from, to);
          setCurrentMoveIndex((prev) => prev + 1);
          setFeedback({ type: 'success', message: '정답입니다! ' + currentMove.comment });
          setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
          setShowHint(false);
        } else {
          setFeedback({ type: 'error', message: `틀렸습니다. 정답: ${currentMove.notation}` });
          setStats((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
        }
      }
    }
  }, [currentMove, isComplete, isUserTurn, makeMove, mode]);

  // 연습 모드에서 상대방(흑)의 자동 응수
  useEffect(() => {
    if (mode === 'practice' && !isUserTurn && !isComplete) {
      const timer = setTimeout(() => {
        makeMove(currentMove.from, currentMove.to);
        setCurrentMoveIndex((prev) => prev + 1);
        setFeedback({ type: 'info', message: `상대방: ${currentMove.notation}` });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mode, isUserTurn, isComplete, currentMove, makeMove]);

  const handleOpeningChange = (e) => {
    const opening = openings.find((o) => o.id === e.target.value);
    setSelectedOpening(opening);
    setStats({ correct: 0, wrong: 0 });
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetGame();
    setCurrentMoveIndex(0);
    setFeedback(null);
    setShowHint(false);
    setStats({ correct: 0, wrong: 0 });
  };

  const handleReset = () => {
    resetGame();
    setCurrentMoveIndex(0);
    setFeedback(null);
    setShowHint(false);
  };

  const showMoveUpTo = (index) => {
    const moves = selectedOpening.moves.slice(0, index + 1);
    setPositionFromMoves(moves);
    setCurrentMoveIndex(index + 1);
    setFeedback({ type: 'info', message: selectedOpening.moves[index].comment });
  };

  const highlightedSquares = showHint && currentMove
    ? [currentMove.from, currentMove.to]
    : [];

  return (
    <div className="opening-trainer">
      <div className="trainer-sidebar">
        <h1>♟ 체스 오프닝 트레이너</h1>

        <div className="control-section">
          <label>오프닝 선택:</label>
          <select value={selectedOpening.id} onChange={handleOpeningChange}>
            {openings.map((opening) => (
              <option key={opening.id} value={opening.id}>
                {opening.name}
              </option>
            ))}
          </select>
        </div>

        <div className="opening-info">
          <h3>{selectedOpening.name}</h3>
          <p>{selectedOpening.description}</p>
        </div>

        <div className="mode-buttons">
          <button
            className={mode === 'learn' ? 'active' : ''}
            onClick={() => handleModeChange('learn')}
          >
            📖 학습 모드
          </button>
          <button
            className={mode === 'practice' ? 'active' : ''}
            onClick={() => handleModeChange('practice')}
          >
            🎯 연습 모드
          </button>
        </div>

        <div className="move-list">
          <h4>수순:</h4>
          {selectedOpening.moves.map((move, index) => (
            <button
              key={index}
              className={`move-item ${index < currentMoveIndex ? 'played' : ''} ${
                index === currentMoveIndex ? 'current' : ''
              }`}
              onClick={() => mode === 'learn' && showMoveUpTo(index)}
              disabled={mode === 'practice'}
            >
              {index % 2 === 0 ? `${Math.floor(index / 2) + 1}. ` : ''}
              {move.notation}
            </button>
          ))}
        </div>

        {mode === 'practice' && (
          <div className="stats">
            <span className="correct">✓ {stats.correct}</span>
            <span className="wrong">✗ {stats.wrong}</span>
          </div>
        )}

        <div className="action-buttons">
          <button onClick={handleReset}>🔄 다시 시작</button>
          {mode === 'learn' && !isComplete && (
            <button onClick={() => setShowHint(!showHint)}>
              {showHint ? '💡 힌트 숨기기' : '💡 힌트 보기'}
            </button>
          )}
        </div>
      </div>

      <div className="trainer-main">
        <Chessboard
          position={position}
          onMove={handleMove}
          highlightedSquares={highlightedSquares}
          lastMove={lastMove}
        />

        {feedback && (
          <div className={`feedback ${feedback.type}`}>
            {feedback.message}
          </div>
        )}

        {isComplete && (
          <div className="completion-message">
            🎉 오프닝 완료! 잘 하셨습니다!
          </div>
        )}

        {!isComplete && mode === 'learn' && (
          <div className="instruction">
            {currentMoveIndex % 2 === 0 ? '백' : '흑'}의 차례입니다.
            {currentMove && ` 다음 수: ${currentMove.notation}`}
          </div>
        )}

        {!isComplete && mode === 'practice' && isUserTurn && (
          <div className="instruction">
            당신의 차례입니다. 올바른 수를 두세요!
          </div>
        )}
      </div>
    </div>
  );
}
