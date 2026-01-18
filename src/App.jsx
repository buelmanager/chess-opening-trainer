import { useState } from 'react';
import OpeningTrainer from './components/OpeningTrainer';
import CarlsenBattle from './components/CarlsenBattle';
import './App.css';

function App() {
  const [currentMode, setCurrentMode] = useState('menu'); // menu, trainer, carlsen

  if (currentMode === 'trainer') {
    return (
      <div className="app-container">
        <button className="back-button" onClick={() => setCurrentMode('menu')}>
          ← 메뉴로 돌아가기
        </button>
        <OpeningTrainer />
      </div>
    );
  }

  if (currentMode === 'carlsen') {
    return (
      <div className="app-container">
        <button className="back-button" onClick={() => setCurrentMode('menu')}>
          ← 메뉴로 돌아가기
        </button>
        <CarlsenBattle />
      </div>
    );
  }

  return (
    <div className="main-menu">
      <div className="menu-content">
        <h1>♟ 체스 트레이너</h1>
        <p className="subtitle">오프닝을 배우고, 세계 챔피언과 대결하세요</p>

        <div className="menu-cards">
          <div className="menu-card" onClick={() => setCurrentMode('trainer')}>
            <div className="card-icon">📖</div>
            <h2>오프닝 트레이너</h2>
            <p>다양한 체스 오프닝을 학습하고 연습하세요</p>
            <ul>
              <li>13개의 유명 오프닝</li>
              <li>백/흑 양쪽 학습 가능</li>
              <li>학습 모드 & 연습 모드</li>
              <li>수순별 힌트 제공</li>
            </ul>
            <button className="card-button">시작하기 →</button>
          </div>

          <div className="menu-card carlsen" onClick={() => setCurrentMode('carlsen')}>
            <div className="card-icon">👑</div>
            <h2>vs Magnus Carlsen</h2>
            <p>AI가 구현한 세계 챔피언과 대결하세요</p>
            <ul>
              <li>칼슨 스타일의 AI</li>
              <li>실시간 분석 및 생각 공개</li>
              <li>백/흑 선택 가능</li>
              <li>프로의 관점 학습</li>
            </ul>
            <button className="card-button gold">도전하기 →</button>
          </div>
        </div>

        <div className="menu-footer">
          <p>Made with ♥ for chess lovers</p>
        </div>
      </div>
    </div>
  );
}

export default App;
