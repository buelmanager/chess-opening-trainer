import CONFIG from '../config/api';
import { positionToText, movesToPGN, parseAlgebraicMove } from '../utils/chessUtils';

const CARLSEN_SYSTEM_PROMPT = `You are Magnus Carlsen, the greatest chess player in history. You are playing a chess game.

Your playing style characteristics:
- Universal player: comfortable in any type of position
- Exceptional endgame technique - among the best in history
- "Nettlesome" play: you choose moves that pressure opponents into making mistakes
- Patient and precise: you can squeeze wins from seemingly equal positions
- You never give up, even in drawn positions
- Positional mastery similar to Karpov and Capablanca

Your favorite openings as White:
- Ruy Lopez (Spanish Opening)
- Italian Game
- London System
- Scotch Game
- Rossolimo against Sicilian

Your favorite openings as Black:
- Sveshnikov Sicilian
- Berlin Defense
- Nimzo-Indian Defense
- Queen's Gambit Declined

When responding, you must:
1. Analyze the position briefly in your mind
2. Consider multiple candidate moves
3. Choose the best move that fits your style
4. Explain your thinking process as Magnus Carlsen would

IMPORTANT: Your response must be in this exact JSON format:
{
  "move": "e4",
  "thinking": "Your analysis and reasoning in Korean",
  "evaluation": "Equal/Slight advantage White/Slight advantage Black/etc",
  "confidence": 85
}

The "move" field must contain ONLY the algebraic notation of your move (e.g., "e4", "Nf3", "O-O", "Bxc6").
The "thinking" field should contain your analysis in Korean, written in first person as Magnus Carlsen.
`;

export async function getCarlsenMove(position, moveHistory, isWhiteTurn) {
  const boardText = positionToText(position);
  const pgnMoves = movesToPGN(moveHistory);
  const colorToMove = isWhiteTurn ? 'White' : 'Black';

  const userPrompt = `Current position:
${boardText}

Move history: ${pgnMoves || '(game start)'}

It's ${colorToMove}'s turn. You are playing as ${colorToMove}.
What is your move? Remember to respond in the exact JSON format.`;

  try {
    const response = await fetch(CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.getApiKey()}`,
      },
      body: JSON.stringify({
        model: CONFIG.MODEL,
        messages: [
          { role: 'system', content: CARLSEN_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    // JSON 파싱
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      // 이동 파싱
      const moveData = parseAlgebraicMove(parsed.move, position, isWhiteTurn);

      return {
        move: moveData,
        notation: parsed.move,
        thinking: parsed.thinking || '깊은 생각 중...',
        evaluation: parsed.evaluation || 'Unknown',
        confidence: parsed.confidence || 75,
        raw: content,
      };
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Carlsen AI error:', error);
    return {
      move: null,
      notation: null,
      thinking: `오류가 발생했습니다: ${error.message}`,
      evaluation: 'Error',
      confidence: 0,
      error: true,
    };
  }
}

export async function getCarlsenAnalysis(position, moveHistory, lastMove) {
  const boardText = positionToText(position);
  const pgnMoves = movesToPGN(moveHistory);

  const userPrompt = `Current position after ${lastMove}:
${boardText}

Move history: ${pgnMoves}

As Magnus Carlsen, briefly analyze this position and the last move. What do you think about your opponent's move? What are the key ideas in this position?

Respond in Korean, in first person as Magnus Carlsen. Keep it concise (2-3 sentences).`;

  try {
    const response = await fetch(CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.getApiKey()}`,
      },
      body: JSON.stringify({
        model: CONFIG.MODEL,
        messages: [
          { role: 'system', content: 'You are Magnus Carlsen commenting on a chess game. Respond only in Korean.' },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '흥미로운 수네요.';
  } catch (error) {
    console.error('Analysis error:', error);
    return '포지션을 분석 중입니다...';
  }
}

export default { getCarlsenMove, getCarlsenAnalysis };
