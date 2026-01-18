import './CarlsenThinking.css';

export default function CarlsenThinking({ thoughts, isThinking, gameState }) {
  if (gameState === 'setup') {
    return (
      <div className="carlsen-thinking">
        <div className="thinking-header">
          <span className="thinking-icon">🧠</span>
          <h3>칼슨의 생각</h3>
        </div>
        <div className="thinking-content intro">
          <p>"안녕하세요. 저는 Magnus Carlsen입니다."</p>
          <p>"체스는 정확한 계산과 깊은 이해가 필요한 게임입니다. 당신의 실력을 보여주세요."</p>
          <div className="carlsen-tips">
            <h4>💡 플레이 팁</h4>
            <ul>
              <li>오프닝에서 중앙을 통제하세요</li>
              <li>기물을 빠르게 전개하세요</li>
              <li>킹을 안전하게 캐슬링하세요</li>
              <li>저는 엔드게임에서 강합니다. 조심하세요!</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="carlsen-thinking">
      <div className="thinking-header">
        <span className="thinking-icon">{isThinking ? '🤔' : '🧠'}</span>
        <h3>칼슨의 생각</h3>
        {isThinking && <div className="thinking-spinner"></div>}
      </div>

      <div className="thinking-content">
        {thoughts ? (
          <>
            {thoughts.move && (
              <div className="thought-move">
                <span className="label">선택한 수:</span>
                <span className="move-notation">{thoughts.move}</span>
              </div>
            )}

            {thoughts.thinking && (
              <div className="thought-analysis">
                <span className="label">분석:</span>
                <p>{thoughts.thinking}</p>
              </div>
            )}

            {thoughts.reaction && (
              <div className="thought-reaction">
                <span className="label">반응:</span>
                <p>"{thoughts.reaction}"</p>
              </div>
            )}

            {thoughts.evaluation && (
              <div className="thought-eval">
                <span className="label">평가:</span>
                <span className={`evaluation ${thoughts.evaluation.toLowerCase().replace(/\s/g, '-')}`}>
                  {thoughts.evaluation}
                </span>
              </div>
            )}

            {thoughts.confidence > 0 && (
              <div className="thought-confidence">
                <span className="label">확신도:</span>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{ width: `${thoughts.confidence}%` }}
                  ></div>
                </div>
                <span className="confidence-value">{thoughts.confidence}%</span>
              </div>
            )}
          </>
        ) : (
          <p className="waiting">게임을 시작하면 칼슨의 생각을 볼 수 있습니다.</p>
        )}
      </div>

      <div className="carlsen-quote">
        <p>"I'm not afraid of anyone, but I respect everyone."</p>
        <span>- Magnus Carlsen</span>
      </div>
    </div>
  );
}
