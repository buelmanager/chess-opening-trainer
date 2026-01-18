import { useState, useCallback, useEffect, useMemo } from 'react';
import Chessboard from './Chessboard';
import { useChessGame } from '../hooks/useChessGame';
import openings, { whiteOpenings, blackOpenings } from '../data/openings';
import './OpeningTrainer.css';

export default function OpeningTrainer() {
  const [playerColor, setPlayerColor] = useState('white'); // 'white' or 'black'
  const [selectedOpening, setSelectedOpening] = useState(whiteOpenings[0]);
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

  // 현재 색상에 맞는 오프닝 목록
  const availableOpenings = useMemo(() => {
    return playerColor === 'white' ? whiteOpenings : blackOpenings;
  }, [playerColor]);

  const currentMove = selectedOpening.moves[currentMoveIndex];
  const isComplete = currentMoveIndex >= selectedOpening.moves.length;

  // 사용자 차례인지 확인 (백 오프닝: 짝수 인덱스, 흑 오프닝: 홀수 인덱스)
  const isUserTurn = useMemo(() => {
    if (playerColor === 'white') {
      return currentMoveIndex % 2 === 0;
    } else {
      return currentMoveIndex % 2 === 1;
    }
  }, [playerColor, currentMoveIndex]);

  // 색상 변경 시 해당 색상의 첫 번째 오프닝 선택
  useEffect(() => {
    const newOpenings = playerColor === 'white' ? whiteOpenings : blackOpenings;
    setSelectedOpening(newOpenings[0]);
    resetGame();
    setCurrentMoveIndex(0);
    setFeedback(null);
    setShowHint(false);
    setStats({ correct: 0, wrong: 0 });
  }, [playerColor, resetGame]);

  // 오프닝 변경 시 리셋
  useEffect(() => {
    resetGame();
    setCurrentMoveIndex(0);
    setFeedback(null);
    setShowHint(false);
  }, [selectedOpening, resetGame]);

  // 흑 오프닝 선택 시 백의 첫 수 자동 실행
  useEffect(() => {
    if (playerColor === 'black' && currentMoveIndex === 0 && selectedOpening.moves.length > 0) {
      const timer = setTimeout(() => {
        const firstMove = selectedOpening.moves[0];
        makeMove(firstMove.from, firstMove.to);
        setCurrentMoveIndex(1);
        setFeedback({ type: 'info', message: `백: ${firstMove.notation} - ${firstMove.comment}` });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [playerColor, selectedOpening, currentMoveIndex, makeMove]);

  const handleMove = useCallback((from, to) => {
    if (isComplete || !currentMove) return;

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

  // 연습 모드에서 상대방의 자동 응수
  useEffect(() => {
    if (mode === 'practice' && !isUserTurn && !isComplete && currentMove) {
      const timer = setTimeout(() => {
        makeMove(currentMove.from, currentMove.to);
        setCurrentMoveIndex((prev) => prev + 1);
        const colorText = playerColor === 'white' ? '흑' : '백';
        setFeedback({ type: 'info', message: `${colorText}: ${currentMove.notation}` });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mode, isUserTurn, isComplete, currentMove, makeMove, playerColor]);

  const handleColorChange = (color) => {
    setPlayerColor(color);
    setMode('learn');
  };

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

    // 흑 오프닝의 경우 백의 첫 수 자동 실행
    if (playerColor === 'black' && selectedOpening.moves.length > 0) {
      setTimeout(() => {
        const firstMove = selectedOpening.moves[0];
        makeMove(firstMove.from, firstMove.to);
        setCurrentMoveIndex(1);
        setFeedback({ type: 'info', message: `백: ${firstMove.notation}` });
      }, 300);
    }
  };

  const handleReset = () => {
    resetGame();
    setCurrentMoveIndex(0);
    setFeedback(null);
    setShowHint(false);

    // 흑 오프닝의 경우 백의 첫 수 자동 실행
    if (playerColor === 'black' && selectedOpening.moves.length > 0) {
      setTimeout(() => {
        const firstMove = selectedOpening.moves[0];
        makeMove(firstMove.from, firstMove.to);
        setCurrentMoveIndex(1);
        setFeedback({ type: 'info', message: `백: ${firstMove.notation}` });
      }, 300);
    }
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

  const getTurnText = () => {
    if (isComplete) return '';
    const currentTurnColor = currentMoveIndex % 2 === 0 ? '백' : '흑';
    return currentTurnColor;
  };

  return (
    <div className="opening-trainer">
      <div className="trainer-sidebar">
        <h1>♟ 체스 오프닝 트레이너</h1>

        {/* 색상 선택 */}
        <div className="color-selector">
          <label>플레이할 색상:</label>
          <div className="color-buttons">
            <button
              className={`color-btn white ${playerColor === 'white' ? 'active' : ''}`}
              onClick={() => handleColorChange('white')}
            >
              ♔ 백
            </button>
            <button
              className={`color-btn black ${playerColor === 'black' ? 'active' : ''}`}
              onClick={() => handleColorChange('black')}
            >
              ♚ 흑
            </button>
          </div>
        </div>

        <div className="control-section">
          <label>오프닝 선택:</label>
          <select value={selectedOpening.id} onChange={handleOpeningChange}>
            {availableOpenings.map((opening) => (
              <option key={opening.id} value={opening.id}>
                {opening.name}
              </option>
            ))}
          </select>
        </div>

        <div className="opening-info">
          <h3>{selectedOpening.name}</h3>
          <p>{selectedOpening.description}</p>
          <span className={`color-badge ${selectedOpening.color}`}>
            {selectedOpening.color === 'white' ? '백 오프닝' : '흑 오프닝'}
          </span>
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
              } ${index % 2 === (playerColor === 'white' ? 1 : 0) ? 'opponent-move' : 'your-move'}`}
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
          orientation={playerColor}
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
            {getTurnText()}의 차례입니다.
            {currentMove && ` 다음 수: ${currentMove.notation}`}
            {!isUserTurn && ' (상대방 수)'}
          </div>
        )}

        {!isComplete && mode === 'practice' && isUserTurn && (
          <div className="instruction">
            당신({playerColor === 'white' ? '백' : '흑'})의 차례입니다. 올바른 수를 두세요!
          </div>
        )}
      </div>
    </div>
  );
}
