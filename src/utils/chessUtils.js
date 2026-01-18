// 체스 유틸리티 함수들

const INITIAL_POSITION = {
  a8: 'r', b8: 'n', c8: 'b', d8: 'q', e8: 'k', f8: 'b', g8: 'n', h8: 'r',
  a7: 'p', b7: 'p', c7: 'p', d7: 'p', e7: 'p', f7: 'p', g7: 'p', h7: 'p',
  a2: 'P', b2: 'P', c2: 'P', d2: 'P', e2: 'P', f2: 'P', g2: 'P', h2: 'P',
  a1: 'R', b1: 'N', c1: 'B', d1: 'Q', e1: 'K', f1: 'B', g1: 'N', h1: 'R',
};

// 포지션을 FEN 문자열로 변환
export function positionToFEN(position, activeColor = 'w', moveNumber = 1) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  let fen = '';

  for (const rank of ranks) {
    let emptyCount = 0;
    for (const file of files) {
      const square = file + rank;
      const piece = position[square];

      if (piece) {
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        fen += piece;
      } else {
        emptyCount++;
      }
    }
    if (emptyCount > 0) {
      fen += emptyCount;
    }
    if (rank !== '1') {
      fen += '/';
    }
  }

  // 캐슬링 권한 (단순화)
  fen += ` ${activeColor} KQkq - 0 ${moveNumber}`;

  return fen;
}

// 이동 기록을 PGN 형식으로 변환
export function movesToPGN(moves) {
  let pgn = '';
  moves.forEach((move, index) => {
    if (index % 2 === 0) {
      pgn += `${Math.floor(index / 2) + 1}. `;
    }
    pgn += `${move.notation} `;
  });
  return pgn.trim();
}

// 보드를 텍스트로 표현 (AI에게 전달용)
export function positionToText(position) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  const pieceNames = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
  };

  let board = '  a b c d e f g h\n';
  for (const rank of ranks) {
    board += rank + ' ';
    for (const file of files) {
      const square = file + rank;
      const piece = position[square];
      board += (piece ? pieceNames[piece] : '.') + ' ';
    }
    board += rank + '\n';
  }
  board += '  a b c d e f g h';

  return board;
}

// 대수 기호를 좌표로 변환 (e.g., "e4" -> {from: "e2", to: "e4"})
export function parseAlgebraicMove(notation, position, isWhiteTurn) {
  // 캐슬링
  if (notation === 'O-O' || notation === '0-0') {
    return isWhiteTurn
      ? { from: 'e1', to: 'g1' }
      : { from: 'e8', to: 'g8' };
  }
  if (notation === 'O-O-O' || notation === '0-0-0') {
    return isWhiteTurn
      ? { from: 'e1', to: 'c1' }
      : { from: 'e8', to: 'c8' };
  }

  // 기호 정리
  let move = notation.replace(/[+#x=]/g, '').replace(/[QRBN]$/, '');

  const files = 'abcdefgh';
  const ranks = '12345678';

  // 타겟 스퀘어 추출 (마지막 2글자)
  const targetSquare = move.slice(-2);
  if (!files.includes(targetSquare[0]) || !ranks.includes(targetSquare[1])) {
    return null;
  }

  // 폰 이동
  if (move.length === 2) {
    const file = move[0];
    const targetRank = parseInt(move[1]);
    const direction = isWhiteTurn ? -1 : 1;

    // 한 칸 이동
    const fromSquare = file + (targetRank + direction);
    if (position[fromSquare] === (isWhiteTurn ? 'P' : 'p')) {
      return { from: fromSquare, to: targetSquare };
    }

    // 두 칸 이동
    const fromSquare2 = file + (targetRank + direction * 2);
    if (position[fromSquare2] === (isWhiteTurn ? 'P' : 'p')) {
      return { from: fromSquare2, to: targetSquare };
    }
  }

  // 폰 캡처 (예: exd5)
  if (move.length === 3 && files.includes(move[0])) {
    const fromFile = move[0];
    const targetRank = parseInt(targetSquare[1]);
    const direction = isWhiteTurn ? -1 : 1;
    const fromSquare = fromFile + (targetRank + direction);

    if (position[fromSquare] === (isWhiteTurn ? 'P' : 'p')) {
      return { from: fromSquare, to: targetSquare };
    }
  }

  // 기물 이동
  const pieceMap = { 'N': 'N', 'B': 'B', 'R': 'R', 'Q': 'Q', 'K': 'K' };
  const pieceChar = pieceMap[move[0]];

  if (pieceChar) {
    const searchPiece = isWhiteTurn ? pieceChar : pieceChar.toLowerCase();

    // 힌트 파싱 (예: Nbd2, R1e1)
    let fileHint = null;
    let rankHint = null;
    if (move.length === 4) {
      const hint = move[1];
      if (files.includes(hint)) fileHint = hint;
      if (ranks.includes(hint)) rankHint = hint;
    }

    // 해당 기물 찾기
    for (const [square, piece] of Object.entries(position)) {
      if (piece === searchPiece) {
        if (fileHint && square[0] !== fileHint) continue;
        if (rankHint && square[1] !== rankHint) continue;

        // 간단한 유효성 검사 (실제로는 더 복잡함)
        if (canMove(square, targetSquare, piece, position)) {
          return { from: square, to: targetSquare };
        }
      }
    }
  }

  return null;
}

// 기물이 이동 가능한지 간단히 체크
function canMove(from, to, piece, position) {
  const pieceType = piece.toUpperCase();
  const fromFile = from.charCodeAt(0) - 97;
  const fromRank = parseInt(from[1]) - 1;
  const toFile = to.charCodeAt(0) - 97;
  const toRank = parseInt(to[1]) - 1;

  const fileDiff = Math.abs(toFile - fromFile);
  const rankDiff = Math.abs(toRank - fromRank);

  switch (pieceType) {
    case 'N':
      return (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2);
    case 'B':
      return fileDiff === rankDiff;
    case 'R':
      return fileDiff === 0 || rankDiff === 0;
    case 'Q':
      return fileDiff === rankDiff || fileDiff === 0 || rankDiff === 0;
    case 'K':
      return fileDiff <= 1 && rankDiff <= 1;
    default:
      return true;
  }
}

// 좌표 이동을 대수 기호로 변환
export function moveToNotation(from, to, position, isCapture = false) {
  const piece = position[from];
  if (!piece) return '';

  const pieceType = piece.toUpperCase();
  const pieceSymbol = pieceType === 'P' ? '' : pieceType;
  const captureSymbol = isCapture ? 'x' : '';

  if (pieceType === 'P' && isCapture) {
    return `${from[0]}x${to}`;
  }

  return `${pieceSymbol}${captureSymbol}${to}`;
}

export { INITIAL_POSITION };
