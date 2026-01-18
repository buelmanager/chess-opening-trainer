import { useState, useCallback, useEffect } from 'react';
import Chessboard from './Chessboard';
import CarlsenThinking from './CarlsenThinking';
import { useChessGame } from '../hooks/useChessGame';
import { getCarlsenMove, getCarlsenAnalysis } from '../services/carlsenAI';
import { moveToNotation } from '../utils/chessUtils';
import './CarlsenBattle.css';

export default function CarlsenBattle() {
  const [playerColor, setPlayerColor] = useState('white');
  const [gameState, setGameState] = useState('setup'); // setup, playing, ended
  const [isThinking, setIsThinking] = useState(false);
  const [carlsenThoughts, setCarlsenThoughts] = useState(null);
  const [moveList, setMoveList] = useState([]);
  const [gameResult, setGameResult] = useState(null);

  const {
    position,
    lastMove,
    makeMove,
    resetGame,
    moveHistory,
  } = useChessGame();

  const isPlayerTurn = useCallback(() => {
    const moveCount = moveHistory.length;
    if (playerColor === 'white') {
      return moveCount % 2 === 0;
    } else {
      return moveCount % 2 === 1;
    }
  }, [playerColor, moveHistory.length]);

  // 칼슨의 차례일 때 AI 호출
  const makeCarlsenMove = useCallback(async () => {
    if (gameState !== 'playing' || isPlayerTurn()) return;

    setIsThinking(true);
    setCarlsenThoughts({ thinking: '포지션을 분석하고 있습니다...', evaluation: '계산 중', confidence: 0 });

    const isWhiteTurn = moveHistory.length % 2 === 0;
    const result = await getCarlsenMove(position, moveList, isWhiteTurn);

    if (result.error || !result.move) {
      setCarlsenThoughts({
        thinking: result.thinking || '이동을 계산할 수 없습니다.',
        evaluation: 'Error',
        confidence: 0,
      });
      setIsThinking(false);
      return;
    }

    // 약간의 딜레이로 생각하는 느낌
    await new Promise(resolve => setTimeout(resolve, 1000));

    setCarlsenThoughts({
      thinking: result.thinking,
      evaluation: result.evaluation,
      confidence: result.confidence,
      move: result.notation,
    });

    // 이동 실행
    makeMove(result.move.from, result.move.to);
    setMoveList(prev => [...prev, { ...result.move, notation: result.notation }]);
    setIsThinking(false);
  }, [gameState, isPlayerTurn, position, moveList, moveHistory.length, makeMove]);

  // 칼슨 차례 감지
  useEffect(() => {
    if (gameState === 'playing' && !isPlayerTurn() && !isThinking) {
      makeCarlsenMove();
    }
  }, [gameState, isPlayerTurn, isThinking, makeCarlsenMove]);

  // 플레이어 이동 처리
  const handlePlayerMove = useCallback(async (from, to) => {
    if (gameState !== 'playing' || !isPlayerTurn() || isThinking) return;

    const isCapture = !!position[to];
    const notation = moveToNotation(from, to, position, isCapture);

    makeMove(from, to);
    setMoveList(prev => [...prev, { from, to, notation }]);

    // 칼슨의 반응 가져오기
    const analysis = await getCarlsenAnalysis(position, [...moveList, { from, to, notation }], notation);
    setCarlsenThoughts(prev => ({
      ...prev,
      reaction: analysis,
    }));
  }, [gameState, isPlayerTurn, isThinking, position, makeMove, moveList]);

  const startGame = () => {
    resetGame();
    setMoveList([]);
    setCarlsenThoughts(null);
    setGameResult(null);
    setGameState('playing');

    // 흑 선택 시 칼슨이 먼저 둠
    if (playerColor === 'black') {
      // useEffect에서 처리됨
    }
  };

  const resignGame = () => {
    setGameResult(playerColor === 'white' ? '흑 승리 (기권)' : '백 승리 (기권)');
    setGameState('ended');
  };

  const newGame = () => {
    setGameState('setup');
    resetGame();
    setMoveList([]);
    setCarlsenThoughts(null);
    setGameResult(null);
  };

  return (
    <div className="carlsen-battle">
      <div className="battle-sidebar">
        <div className="carlsen-profile">
          <div className="profile-image">👑</div>
          <div className="profile-info">
            <h2>Magnus Carlsen</h2>
            <span className="rating">Rating: 2830</span>
            <span className="title">World Chess Champion</span>
          </div>
        </div>

        {gameState === 'setup' && (
          <div className="setup-section">
            <h3>대결 설정</h3>
            <div className="color-selection">
              <label>당신의 색상:</label>
              <div className="color-options">
                <button
                  className={`color-option ${playerColor === 'white' ? 'selected' : ''}`}
                  onClick={() => setPlayerColor('white')}
                >
                  ♔ 백 (선공)
                </button>
                <button
                  className={`color-option ${playerColor === 'black' ? 'selected' : ''}`}
                  onClick={() => setPlayerColor('black')}
                >
                  ♚ 흑 (후공)
                </button>
              </div>
            </div>
            <button className="start-button" onClick={startGame}>
              🎮 대결 시작
            </button>
          </div>
        )}

        {gameState !== 'setup' && (
          <>
            <div className="game-info">
              <div className="turn-indicator">
                {isThinking ? (
                  <span className="thinking">🤔 칼슨이 생각 중...</span>
                ) : isPlayerTurn() ? (
                  <span className="your-turn">✨ 당신의 차례</span>
                ) : (
                  <span>칼슨의 차례</span>
                )}
              </div>
            </div>

            <div className="move-history">
              <h4>기보</h4>
              <div className="moves">
                {moveList.map((move, index) => (
                  <span key={index} className="move">
                    {index % 2 === 0 && `${Math.floor(index / 2) + 1}. `}
                    {move.notation}{' '}
                  </span>
                ))}
              </div>
            </div>

            <div className="game-controls">
              {gameState === 'playing' && (
                <button className="resign-button" onClick={resignGame}>
                  🏳️ 기권
                </button>
              )}
              <button className="new-game-button" onClick={newGame}>
                🔄 새 게임
              </button>
            </div>
          </>
        )}

        {gameResult && (
          <div className="game-result">
            <h3>게임 종료</h3>
            <p>{gameResult}</p>
          </div>
        )}
      </div>

      <div className="battle-main">
        <Chessboard
          position={position}
          onMove={handlePlayerMove}
          lastMove={lastMove}
          orientation={playerColor}
          disabled={!isPlayerTurn() || isThinking || gameState !== 'playing'}
        />

        {gameState === 'setup' && (
          <div className="setup-message">
            <p>세계 챔피언 Magnus Carlsen과 대결하세요!</p>
            <p>색상을 선택하고 게임을 시작하세요.</p>
          </div>
        )}
      </div>

      <div className="battle-thinking">
        <CarlsenThinking
          thoughts={carlsenThoughts}
          isThinking={isThinking}
          gameState={gameState}
        />
      </div>
    </div>
  );
}
