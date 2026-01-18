// 체스 오프닝 데이터
// 각 오프닝은 이름, 설명, 그리고 수순(moves)을 포함합니다.

export const openings = [
  {
    id: 'italian-game',
    name: 'Italian Game (이탈리안 게임)',
    description: '가장 오래된 오프닝 중 하나로, 빠른 전개와 중앙 통제를 목표로 합니다.',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: '킹스 폰 오프닝 - 중앙 통제' },
      { from: 'e7', to: 'e5', notation: 'e5', comment: '흑의 대칭적 응수' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: '나이트 전개, e5 폰 공격' },
      { from: 'b8', to: 'c6', notation: 'Nc6', comment: '나이트로 e5 폰 방어' },
      { from: 'f1', to: 'c4', notation: 'Bc4', comment: '비숍이 f7을 노림 - 이탈리안 게임!' },
    ],
  },
  {
    id: 'sicilian-defense',
    name: 'Sicilian Defense (시칠리안 디펜스)',
    description: '흑의 가장 인기 있는 응수. 비대칭적인 포지션을 만들어 승리 기회를 높입니다.',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: '킹스 폰 오프닝' },
      { from: 'c7', to: 'c5', notation: 'c5', comment: '시칠리안 디펜스! d4를 견제' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: '나이트 전개' },
      { from: 'd7', to: 'd6', notation: 'd6', comment: '폰 구조 강화' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: '중앙 확장' },
    ],
  },
  {
    id: 'french-defense',
    name: 'French Defense (프렌치 디펜스)',
    description: '견고한 폰 구조를 형성하는 방어적 오프닝입니다.',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: '킹스 폰 오프닝' },
      { from: 'e7', to: 'e6', notation: 'e6', comment: '프렌치 디펜스! d5 준비' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: '중앙 폰 전진' },
      { from: 'd7', to: 'd5', notation: 'd5', comment: '중앙 도전' },
      { from: 'b1', to: 'c3', notation: 'Nc3', comment: '나이트로 d5 폰 압박' },
    ],
  },
  {
    id: 'queens-gambit',
    name: "Queen's Gambit (퀸스 갬빗)",
    description: 'd4 오프닝의 대표작. 폰을 희생하여 중앙 통제권을 얻습니다.',
    moves: [
      { from: 'd2', to: 'd4', notation: 'd4', comment: '퀸스 폰 오프닝' },
      { from: 'd7', to: 'd5', notation: 'd5', comment: '대칭적 응수' },
      { from: 'c2', to: 'c4', notation: 'c4', comment: '퀸스 갬빗! d5 폰에 압력' },
      { from: 'e7', to: 'e6', notation: 'e6', comment: '퀸스 갬빗 디클라인드' },
      { from: 'b1', to: 'c3', notation: 'Nc3', comment: '나이트 전개' },
    ],
  },
  {
    id: 'london-system',
    name: 'London System (런던 시스템)',
    description: '안정적이고 배우기 쉬운 시스템 오프닝. 모든 레벨에서 사용됩니다.',
    moves: [
      { from: 'd2', to: 'd4', notation: 'd4', comment: '퀸스 폰 오프닝' },
      { from: 'd7', to: 'd5', notation: 'd5', comment: '대칭적 응수' },
      { from: 'c1', to: 'f4', notation: 'Bf4', comment: '런던 시스템의 핵심 수!' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: '나이트 전개' },
      { from: 'e2', to: 'e3', notation: 'e3', comment: '폰 구조 안정화' },
    ],
  },
  {
    id: 'ruy-lopez',
    name: 'Ruy Lopez (루이 로페즈)',
    description: '스페인 오프닝이라고도 불리는 클래식 오프닝. 나이트를 압박합니다.',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: '킹스 폰 오프닝' },
      { from: 'e7', to: 'e5', notation: 'e5', comment: '대칭적 응수' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: '나이트 전개' },
      { from: 'b8', to: 'c6', notation: 'Nc6', comment: '나이트로 방어' },
      { from: 'f1', to: 'b5', notation: 'Bb5', comment: '루이 로페즈! 나이트 압박' },
    ],
  },
  {
    id: 'caro-kann',
    name: 'Caro-Kann Defense (카로칸 디펜스)',
    description: '프렌치 디펜스와 비슷하지만 c폰으로 지원하는 견고한 오프닝입니다.',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: '킹스 폰 오프닝' },
      { from: 'c7', to: 'c6', notation: 'c6', comment: '카로칸 디펜스! d5 준비' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: '중앙 확장' },
      { from: 'd7', to: 'd5', notation: 'd5', comment: '중앙 도전' },
      { from: 'b1', to: 'c3', notation: 'Nc3', comment: '나이트 전개' },
    ],
  },
  {
    id: 'kings-indian',
    name: "King's Indian Defense (킹스 인디언 디펜스)",
    description: '하이퍼모던 오프닝. 중앙을 양보하고 나중에 반격합니다.',
    moves: [
      { from: 'd2', to: 'd4', notation: 'd4', comment: '퀸스 폰 오프닝' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: '나이트 전개' },
      { from: 'c2', to: 'c4', notation: 'c4', comment: '중앙 확장' },
      { from: 'g7', to: 'g6', notation: 'g6', comment: '킹사이드 피앙케토 준비' },
      { from: 'b1', to: 'c3', notation: 'Nc3', comment: '나이트 전개' },
    ],
  },
];

export default openings;
