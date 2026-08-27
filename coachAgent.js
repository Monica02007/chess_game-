// Grandmaster AI Coach: Generates Step-by-Step Tactical Commentary and Predictions

const PIECE_NAMES = {
  p: 'Pawn',
  n: 'Knight',
  b: 'Bishop',
  r: 'Rook',
  q: 'Queen',
  k: 'King'
};

class CoachAgent {
  constructor() {
    this.agentName = "Grandmaster Aria";
    this.persona = "Strategic & Encouraging Grandmaster Coach";
  }

  generateMoveExplanation(game, analysisResult) {
    if (!analysisResult || !analysisResult.bestMove) {
      return {
        spoken: "No legal moves available in this position.",
        steps: ["The game is in an end state."],
        tacticalBadge: "Game Over",
        threat: null
      };
    }

    const { bestMove, bestScore, candidateMoves } = analysisResult;
    const turn = game.turn() === 'w' ? 'White' : 'Black';
    const piece = PIECE_NAMES[bestMove.piece] || 'Piece';
    const from = bestMove.from;
    const to = bestMove.to;
    const san = bestMove.san;
    const isCapture = !!bestMove.captured;
    const isCheck = san.includes('+');
    const isCastle = san === 'O-O' || san === 'O-O-O';

    let tacticalBadge = "Positional Improvement";
    let strategicGoal = "";
    let tacticalDetail = "";

    // 1. Check Castling
    if (isCastle) {
      tacticalBadge = "King Safety";
      strategicGoal = `Castling immediately tucks your King away into safety while activating your Rook towards the central files.`;
      tacticalDetail = `Secure the king perimeter and connect your rooks for the middlegame transition.`;
    }
    // 2. Check Captures
    else if (isCapture) {
      const capPiece = PIECE_NAMES[bestMove.captured] || 'piece';
      tacticalBadge = "Material Advantage";
      strategicGoal = `Strike with ${piece} taking ${capPiece} on ${to}.`;
      tacticalDetail = `Gains clear material while neutralizing the opponent's active piece.`;
    }
    // 3. Check Checks
    else if (isCheck) {
      tacticalBadge = "Direct Attack";
      strategicGoal = `Deliver check with ${piece} to ${to}, forcing the enemy King to respond.`;
      tacticalDetail = `Disrupts opponent coordination and seizes the initiative.`;
    }
    // 4. Center control / knight / bishop development
    else if (['d4', 'e4', 'd5', 'e5', 'c4', 'f4'].includes(to)) {
      tacticalBadge = "Center Control";
      strategicGoal = `Advance ${piece} to ${to} to establish a firm grip over key central squares.`;
      tacticalDetail = `Restricts opponent counterplay and opens up diagonal/file pathways.`;
    }
    // 5. Piece Development
    else if (['c3', 'f3', 'c6', 'f6', 'b3', 'g3'].includes(to) && (bestMove.piece === 'n' || bestMove.piece === 'b')) {
      tacticalBadge = "Rapid Development";
      strategicGoal = `Develop your ${piece} from ${from} to ${to} to prepare your army for battle.`;
      tacticalDetail = `Increases piece mobility and applies pressure across the board.`;
    }
    // 6. Default Positional
    else {
      tacticalBadge = "Strategic Maneuver";
      strategicGoal = `Reposition your ${piece} to ${to} to enhance square control.`;
      tacticalDetail = `Optimizes defensive harmony and creates future outpost options.`;
    }

    // Step-by-Step Tactical Steps
    const steps = [
      `Step 1: Move ${piece} from ${from.toUpperCase()} to ${to.toUpperCase()} (${san}).`,
      `Step 2: ${strategicGoal}`,
      `Step 3: ${tacticalDetail}`
    ];

    // Spoken Audio Script
    const spoken = `${turn} should play ${piece} to ${to}. ${strategicGoal} This move gives ${turn} an evaluated score of ${(bestScore/100).toFixed(1)} pawns.`;

    // Threat Check
    const threat = window.chessEngine.findOpponentThreat(game);

    return {
      san: san,
      from: from,
      to: to,
      piece: piece,
      color: turn,
      score: (bestScore / 100).toFixed(1),
      spoken: spoken,
      steps: steps,
      tacticalBadge: tacticalBadge,
      threat: threat,
      candidateMoves: candidateMoves
    };
  }

  // Generates conversational answers to player voice queries
  answerVoiceQuery(query, game, analysis) {
    const q = query.toLowerCase().trim();

    if (q.includes('best move') || q.includes('what should i play') || q.includes('next step') || q.includes('suggest')) {
      const exp = this.generateMoveExplanation(game, analysis);
      return {
        speech: exp.spoken,
        action: 'highlight_best_move',
        data: exp
      };
    }

    if (q.includes('threat') || q.includes('danger') || q.includes('opponent planning')) {
      const threat = window.chessEngine.findOpponentThreat(game);
      if (threat) {
        return {
          speech: `Attention! ${threat.description}`,
          action: 'highlight_threat',
          data: threat
        };
      } else {
        return {
          speech: "Your position looks secure. There are no immediate catastrophic threats from the opponent.",
          action: 'clear_threat',
          data: null
        };
      }
    }

    if (q.includes('who is winning') || q.includes('evaluation') || q.includes('score')) {
      const score = analysis ? parseFloat(analysis.evalInPawns) : 0;
      let text = "";
      if (Math.abs(score) < 0.5) {
        text = "The position is roughly balanced with equal chances for both sides.";
      } else if (score > 1.5) {
        text = `White has a strong advantage of plus ${score} pawns.`;
      } else if (score < -1.5) {
        text = `Black holds a substantial lead of minus ${Math.abs(score)} pawns.`;
      } else {
        text = score > 0 ? `White is slightly better by plus ${score}.` : `Black is slightly ahead by ${Math.abs(score)}.`;
      }
      return {
        speech: text,
        action: 'show_eval',
        data: { score }
      };
    }

    if (q.includes('explain') || q.includes('analyze') || q.includes('position')) {
      const exp = this.generateMoveExplanation(game, analysis);
      return {
        speech: `Analyzing position. ${exp.spoken} Key focus: ${exp.tacticalBadge}.`,
        action: 'highlight_best_move',
        data: exp
      };
    }

    // Default Fallback
    const exp = this.generateMoveExplanation(game, analysis);
    return {
      speech: `I recommend playing ${exp.san}. ${exp.steps[1]}`,
      action: 'highlight_best_move',
      data: exp
    };
  }
}

window.coachAgent = new CoachAgent();
