// Minimax Search Engine with Alpha-Beta Pruning, PST, and Search Tree Telemetry

const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Piece-Square Tables (PST) from White perspective (flipped for Black)
const PST = {
  p: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  r: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
  ],
  q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  k: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-20,-20],
    [-10,-20,-20,-20,-20,-20,-10,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
  ]
};

class ChessEngine {
  constructor() {
    this.nodesEvaluated = 0;
    this.nodesPruned = 0;
  }

  evaluateBoard(game) {
    if (game.in_checkmate()) {
      return game.turn() === 'w' ? -99999 : 99999;
    }
    if (game.in_draw() || game.in_threefold_repetition() || game.in_stalemate()) {
      return 0;
    }

    let score = 0;
    const board = game.board();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;

        const val = PIECE_VALUES[piece.type];
        const pstTable = PST[piece.type];
        const pstVal = piece.color === 'w' 
          ? pstTable[r][c] 
          : pstTable[7 - r][c];

        const pieceTotal = val + pstVal;
        if (piece.color === 'w') {
          score += pieceTotal;
        } else {
          score -= pieceTotal;
        }
      }
    }
    return score;
  }

  // Move ordering to prioritize captures and checks (boosts alpha-beta cutoffs)
  orderMoves(moves, game) {
    return moves.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      if (a.captured) {
        scoreA += PIECE_VALUES[a.captured] * 10 - PIECE_VALUES[a.piece];
      }
      if (b.captured) {
        scoreB += PIECE_VALUES[b.captured] * 10 - PIECE_VALUES[b.piece];
      }
      if (a.san.includes('+')) scoreA += 50;
      if (b.san.includes('+')) scoreB += 50;

      return scoreB - scoreA;
    });
  }

  // Recursive Minimax with Alpha-Beta Pruning and Tree Data Telemetry
  minimax(game, depth, alpha, beta, isMaximizing, treeNode = null) {
    this.nodesEvaluated++;

    if (depth === 0 || game.game_over()) {
      const evalScore = this.evaluateBoard(game);
      if (treeNode) {
        treeNode.eval = evalScore;
        treeNode.isLeaf = true;
      }
      return evalScore;
    }

    const rawMoves = game.moves({ verbose: true });
    const moves = this.orderMoves(rawMoves, game);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        game.move(move);

        const childNode = treeNode ? {
          move: move.san,
          uci: `${move.from}-${move.to}`,
          from: move.from,
          to: move.to,
          piece: move.piece,
          color: 'w',
          depth: depth,
          children: [],
          pruned: false,
          eval: null
        } : null;

        if (treeNode) treeNode.children.push(childNode);

        const evaluation = this.minimax(game, depth - 1, alpha, beta, false, childNode);
        game.undo();

        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);

        if (beta <= alpha) {
          this.nodesPruned += (moves.length - treeNode?.children.length || 0);
          if (childNode) childNode.pruned = true;
          break; // Beta cutoff
        }
      }
      if (treeNode) treeNode.eval = maxEval;
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        game.move(move);

        const childNode = treeNode ? {
          move: move.san,
          uci: `${move.from}-${move.to}`,
          from: move.from,
          to: move.to,
          piece: move.piece,
          color: 'b',
          depth: depth,
          children: [],
          pruned: false,
          eval: null
        } : null;

        if (treeNode) treeNode.children.push(childNode);

        const evaluation = this.minimax(game, depth - 1, alpha, beta, true, childNode);
        game.undo();

        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);

        if (beta <= alpha) {
          this.nodesPruned += (moves.length - treeNode?.children.length || 0);
          if (childNode) childNode.pruned = true;
          break; // Alpha cutoff
        }
      }
      if (treeNode) treeNode.eval = minEval;
      return minEval;
    }
  }

  // Analyzes current position and returns best move, candidate evaluations, and search tree
  findBestMove(game, depth = 3) {
    this.nodesEvaluated = 0;
    this.nodesPruned = 0;
    const startTime = performance.now();

    const isWhite = game.turn() === 'w';
    const rawMoves = game.moves({ verbose: true });
    const moves = this.orderMoves(rawMoves, game);

    if (moves.length === 0) return null;

    let bestMove = null;
    let bestScore = isWhite ? -Infinity : Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    const rootTree = {
      move: 'ROOT',
      fen: game.fen(),
      depth: depth,
      eval: null,
      children: []
    };

    const candidateMoves = [];

    for (const move of moves) {
      game.move(move);

      const branchTree = {
        move: move.san,
        uci: `${move.from}-${move.to}`,
        from: move.from,
        to: move.to,
        piece: move.piece,
        captured: move.captured,
        color: isWhite ? 'w' : 'b',
        depth: depth,
        children: [],
        pruned: false,
        eval: null
      };
      rootTree.children.push(branchTree);

      const score = this.minimax(game, depth - 1, alpha, beta, !isWhite, branchTree);
      game.undo();

      branchTree.eval = score;

      candidateMoves.push({
        move: move,
        san: move.san,
        from: move.from,
        to: move.to,
        piece: move.piece,
        captured: move.captured,
        score: score,
        scoreDisplay: (score / 100).toFixed(1)
      });

      if (isWhite) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
        alpha = Math.max(alpha, score);
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
        beta = Math.min(beta, score);
      }
    }

    rootTree.eval = bestScore;
    const duration = Math.round(performance.now() - startTime);

    // Sort candidate moves
    candidateMoves.sort((a, b) => isWhite ? b.score - a.score : a.score - b.score);

    return {
      bestMove: bestMove,
      bestScore: bestScore,
      evalInPawns: (bestScore / 100).toFixed(1),
      candidateMoves: candidateMoves,
      nodesEvaluated: this.nodesEvaluated,
      nodesPruned: this.nodesPruned,
      durationMs: duration,
      searchTree: rootTree,
      depth: depth
    };
  }

  // Detect immediate threat from opponent (for tactical alerts)
  findOpponentThreat(game) {
    const opponentGame = new Chess(game.fen());
    // Simulate what opponent would play if it were their turn right now
    const opponentColor = game.turn() === 'w' ? 'b' : 'w';
    
    // Check if opponent is already threatening any of our high-value pieces
    const moves = opponentGame.moves({ verbose: true });
    let highestThreat = null;
    let maxThreatValue = 0;

    for (const m of moves) {
      if (m.captured) {
        const val = PIECE_VALUES[m.captured] || 0;
        if (val > maxThreatValue) {
          maxThreatValue = val;
          highestThreat = m;
        }
      }
      if (m.san.includes('#')) {
        return {
          threatMove: m,
          threatType: 'checkmate',
          targetSquare: m.to,
          severity: 'critical',
          description: `Immediate Checkmate threat with ${m.san}!`
        };
      }
    }

    if (highestThreat && maxThreatValue >= 300) {
      return {
        threatMove: highestThreat,
        threatType: 'capture',
        targetSquare: highestThreat.to,
        severity: maxThreatValue >= 500 ? 'high' : 'medium',
        description: `Opponent can capture your ${highestThreat.captured.toUpperCase()} on ${highestThreat.to}.`
      };
    }

    return null;
  }
}

window.chessEngine = new ChessEngine();
