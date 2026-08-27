// Universal Bulletproof Select-and-Tap Chessboard with Guaranteed Explicit Layout

const PIECE_SVGS = {
  wP: `<svg viewBox="0 0 45 45" style="width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));"><path d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 l 23,0 c 0,-7.92 -4.41,-12.41 -7.41,-13.47 1.47,-1.19 2.41,-3 2.41,-5.03 0,-2.41 -1.33,-4.5 -3.28,-5.62 0.49,-0.67 0.78,-1.49 0.78,-2.38 0,-2.21 -1.79,-4 -4,-4 z" fill="#ffffff" stroke="#0f172a" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  wN: `<svg viewBox="0 0 45 45" style="width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));"><path d="m 22,10 c 10.5,1 16.5,8 16,29 L 15,39 C 15,30 25,27.5 23,13" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/><path d="m 24,18 c 0.38,2.91 -5.55,7.37 -8,9 -3,2 -2.82,4.34 -5,4 -1.042,-0.94 1.41,-3.04 0,-3 -1,0 0.19,1.23 -1,2 -1,0 -4.003,1 -4,-4 0,-2 6,-12 6,-12 0,0 1.89,-1.9 2,-3.5 -0.73,-0.994 -0.5,-2 -0.5,-3 1,-1 3,2.5 3,2.5 l 2,0 c 0,0 0.78,-1.992 2.5,-3 1,0 1,3 1,3" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/></svg>`,
  wB: `<svg viewBox="0 0 45 45" style="width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));"><g fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m 9,36 c 3.39,-0.97 10.11,0.43 13.5,-2 3.39,2.43 10.11,1.03 13.5,2 0,0 1.65,0.54 3,2 -0.68,0.97 -1.65,0.99 -3,0.5 -3.39,-0.97 -10.11,0.46 -13.5,-1 -3.39,1.46 -10.11,0.03 -13.5,1 -1.354,0.49 -2.323,0.47 -3,-0.5 1.354,-1.94 3,-2 3,-2 z" fill="#ffffff"/><path d="m 15,32 c 2.5,2.5 12.5,2.5 15,0 0.5,-1.5 0,-2 0,-2 0,-2.5 -2.5,-4 -2.5,-4 5.5,-1.5 6,-11.5 -5,-15.5 -11,4 -10.5,14 -5,15.5 0,0 -2.5,1.5 -2.5,4 0,0 -0.5,0.5 0,2 z" fill="#ffffff"/><path d="m 25,8 a 2.5,2.5 0 1 1 -5,0 2.5,2.5 0 1 1 5,0 z" fill="#ffffff"/><path d="m 17.5,26 10,0 M 22.5,21 l 0,10"/></g></svg>`,
  wR: `<svg viewBox="0 0 45 45" style="width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));"><g fill="#ffffff" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m 9,39 27,0 0,-3 -27,0 0,3 z m 3,-3 0,-4 21,0 0,4 -21,0 z m -1,-22 0,-5 4,0 0,2 5,0 0,-2 5,0 0,2 5,0 0,-2 4,0 0,5" stroke-linecap="butt"/><path d="m 12,32 1,-18 19,0 1,18 -21,0 z"/><path d="m 14,29.5 0,-13 17,0 0,13 -17,0 z" stroke-linecap="butt"/></g></svg>`,
  wQ: `<svg viewBox="0 0 45 45" style="width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));"><g fill="#ffffff" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m 8,12 a 2,2 0 1 1 -4,0 2,2 0 1 1 4,0 z m 16.5,-4.5 a 2,2 0 1 1 -4,0 2,2 0 1 1 4,0 z m 16.5,4.5 a 2,2 0 1 1 -4,0 2,2 0 1 1 4,0 z m -30,8 a 2,2 0 1 1 -4,0 2,2 0 1 1 4,0 z m 27,0 a 2,2 0 1 1 -4,0 2,2 0 1 1 4,0 z"/><path d="m 9,26 c 8.5,-1.5 21,-1.5 27,0 l 2,-12 -7,11 -5.5,-13.5 -3,15 -3,-15 -5.5,13.5 -7,-11 2,12 z"/><path d="m 9,26 c 0,2 1.5,2 2.5,4 2.5,5 1,5.5 11,5.5 10,0 8.5,-0.5 11,-5.5 1,-2 2.5,-2 2.5,-4 -8.5,-1.5 -18.5,-1.5 -27,0 z"/><path d="m 11,38.5 c 0,-1.5 1,-2.5 2.5,-2.5 l 18,0 c 1.5,0 2.5,1 2.5,2.5 l -23,0 z"/></g></svg>`,
  wK: `<svg viewBox="0 0 45 45" style="width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));"><g fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m 22.5,11.63 0,-5.63 m -2.5,2 5,0" stroke-linejoin="miter"/><path d="m 22.5,25 c 0,0 4.5,-7.5 3,-10.5 0,0 -1,-2.5 -3,-2.5 -2,0 -3,2.5 -3,2.5 -1.5,3 3,10.5 3,10.5" fill="#ffffff"/><path d="m 11.5,37 c 5.5,3.5 15.5,3.5 21,0 l 0,-7 c 0,0 9,-4.5 6,-10.5 -4,-1 -6,2.5 -6,2.5 0,0 -3,-4 -8.5,-4 -5.5,0 -8.5,4 -8.5,4 0,0 -2,-3.5 -6,-2.5 -3,6 6,10.5 6,10.5 l 0,7 z" fill="#ffffff"/><path d="m 11.5,30 c 5.5,-3 15.5,-3 21,0 m -21,3.5 c 5.5,-3 15.5,-3 21,0 m -21,3.5 c 5.5,-3 15.5,-3 21,0"/></g></svg>`,

  bP: `<svg viewBox="0 0 45 45" style="width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));"><path d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 l 23,0 c 0,-7.92 -4.41,-12.41 -7.41,-13.47 1.47,-1.19 2.41,-3 2.41,-5.03 0,-2.41 -1.33,-4.5 -3.28,-5.62 0.49,-0.67 0.78,-1.49 0.78,-2.38 0,-2.21 -1.79,-4 -4,-4 z" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  bN: `<svg viewBox="0 0 45 45" style="width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));"><path d="m 22,10 c 10.5,1 16.5,8 16,29 L 15,39 C 15,30 25,27.5 23,13" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8"/><path d="m 24,18 c 0.38,2.91 -5.55,7.37 -8,9 -3,2 -2.82,4.34 -5,4 -1.042,-0.94 1.41,-3.04 0,-3 -1,0 0.19,1.23 -1,2 -1,0 -4.003,1 -4,-4 0,-2 6,-12 6,-12 0,0 1.89,-1.9 2,-3.5 -0.73,-0.994 -0.5,-2 -0.5,-3 1,-1 3,2.5 3,2.5 l 2,0 c 0,0 0.78,-1.992 2.5,-3 1,0 1,3 1,3" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8"/></svg>`,
  bB: `<svg viewBox="0 0 45 45" style="width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));"><g fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m 9,36 c 3.39,-0.97 10.11,0.43 13.5,-2 3.39,2.43 10.11,1.03 13.5,2 0,0 1.65,0.54 3,2 -0.68,0.97 -1.65,0.99 -3,0.5 -3.39,-0.97 -10.11,0.46 -13.5,-1 -3.39,1.46 -10.11,0.03 -13.5,1 -1.354,0.49 -2.323,0.47 -3,-0.5 1.354,-1.94 3,-2 3,-2 z" fill="#0f172a"/><path d="m 15,32 c 2.5,2.5 12.5,2.5 15,0 0.5,-1.5 0,-2 0,-2 0,-2.5 -2.5,-4 -2.5,-4 5.5,-1.5 6,-11.5 -5,-15.5 -11,4 -10.5,14 -5,15.5 0,0 -2.5,1.5 -2.5,4 0,0 -0.5,0.5 0,2 z" fill="#0f172a"/><path d="m 25,8 a 2.5,2.5 0 1 1 -5,0 2.5,2.5 0 1 1 5,0 z" fill="#0f172a"/><path d="m 17.5,26 10,0 M 22.5,21 l 0,10"/></g></svg>`,
  bR: `<svg viewBox="0 0 45 45" style="width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));"><g fill="#0f172a" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m 9,39 27,0 0,-3 -27,0 0,3 z m 3,-3 0,-4 21,0 0,4 -21,0 z m -1,-22 0,-5 4,0 0,2 5,0 0,-2 5,0 0,2 5,0 0,-2 4,0 0,5" stroke-linecap="butt"/><path d="m 12,32 1,-18 19,0 1,18 -21,0 z"/><path d="m 14,29.5 0,-13 17,0 0,13 -17,0 z" stroke-linecap="butt"/></g></svg>`,
  bQ: `<svg viewBox="0 0 45 45" style="width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));"><g fill="#0f172a" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m 8,12 a 2,2 0 1 1 -4,0 2,2 0 1 1 4,0 z m 16.5,-4.5 a 2,2 0 1 1 -4,0 2,2 0 1 1 4,0 z m 16.5,4.5 a 2,2 0 1 1 -4,0 2,2 0 1 1 4,0 z m -30,8 a 2,2 0 1 1 -4,0 2,2 0 1 1 4,0 z m 27,0 a 2,2 0 1 1 -4,0 2,2 0 1 1 4,0 z"/><path d="m 9,26 c 8.5,-1.5 21,-1.5 27,0 l 2,-12 -7,11 -5.5,-13.5 -3,15 -3,-15 -5.5,13.5 -7,-11 2,12 z"/><path d="m 9,26 c 0,2 1.5,2 2.5,4 2.5,5 1,5.5 11,5.5 10,0 8.5,-0.5 11,-5.5 1,-2 2.5,-2 2.5,-4 -8.5,-1.5 -18.5,-1.5 -27,0 z"/><path d="m 11,38.5 c 0,-1.5 1,-2.5 2.5,-2.5 l 18,0 c 1.5,0 2.5,1 2.5,2.5 l -23,0 z"/></g></svg>`,
  bK: `<svg viewBox="0 0 45 45" style="width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));"><g fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m 22.5,11.63 0,-5.63 m -2.5,2 5,0" stroke-linejoin="miter"/><path d="m 22.5,25 c 0,0 4.5,-7.5 3,-10.5 0,0 -1,-2.5 -3,-2.5 -2,0 -3,2.5 -3,2.5 -1.5,3 3,10.5 3,10.5" fill="#0f172a"/><path d="m 11.5,37 c 5.5,3.5 15.5,3.5 21,0 l 0,-7 c 0,0 9,-4.5 6,-10.5 -4,-1 -6,2.5 -6,2.5 0,0 -3,-4 -8.5,-4 -5.5,0 -8.5,4 -8.5,4 0,0 -2,-3.5 -6,-2.5 -3,6 6,10.5 6,10.5 l 0,7 z" fill="#0f172a"/><path d="m 11.5,30 c 5.5,-3 15.5,-3 21,0 m -21,3.5 c 5.5,-3 15.5,-3 21,0 m -21,3.5 c 5.5,-3 15.5,-3 21,0"/></g></svg>`
};

class ChessboardView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.flipped = false;
    this.selectedSquare = null;
    this.legalMoves = [];
    this.lastMove = null;
    this.bestMoveArrow = null;
    this.threatArrow = null;
    this.lastClickTimestamp = 0;

    this.initDOM();
  }

  initDOM() {
    this.container.innerHTML = `
      <div style="position:relative; width:100%; max-width:520px; aspect-ratio:1/1; border-radius:16px; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5); border:4px solid #334155; background:#0f172a; user-select:none;">
        <div id="board-grid" style="display:grid; grid-template-columns:repeat(8, 12.5%); grid-template-rows:repeat(8, 12.5%); width:100%; height:100%;"></div>
        <svg id="board-arrows" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:20;">
          <defs>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
            </marker>
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g id="arrows-layer"></g>
        </svg>
      </div>
    `;

    this.grid = document.getElementById('board-grid');
    this.arrowsLayer = document.getElementById('arrows-layer');

    this.renderSquares();
  }

  renderSquares() {
    this.grid.innerHTML = '';
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    const displayRanks = this.flipped ? [...ranks].reverse() : ranks;
    const displayFiles = this.flipped ? [...files].reverse() : files;

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const square = `${displayFiles[f]}${displayRanks[r]}`;
        const isLight = (f + r) % 2 === 0;

        const sqDiv = document.createElement('div');
        sqDiv.dataset.square = square;
        sqDiv.setAttribute('role', 'button');
        sqDiv.setAttribute('tabindex', '0');
        
        sqDiv.style.cssText = `
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
          touch-action: manipulation;
          background-color: ${isLight ? '#cbd5e1' : '#334155'};
          transition: background-color 100ms;
        `;

        if (f === 0) {
          const rankLbl = document.createElement('span');
          rankLbl.style.cssText = `position:absolute; top:2px; left:4px; font-size:10px; font-weight:700; pointer-events:none; color:${isLight ? '#475569' : '#94a3b8'};`;
          rankLbl.innerText = displayRanks[r];
          sqDiv.appendChild(rankLbl);
        }
        if (r === 7) {
          const fileLbl = document.createElement('span');
          fileLbl.style.cssText = `position:absolute; bottom:2px; right:4px; font-size:10px; font-weight:700; pointer-events:none; color:${isLight ? '#475569' : '#94a3b8'};`;
          fileLbl.innerText = displayFiles[f];
          sqDiv.appendChild(fileLbl);
        }

        // Tap & Click Trigger with 50ms throttle
        const handleTap = (e) => {
          e.preventDefault();
          const now = Date.now();
          if (now - this.lastClickTimestamp < 50) return;
          this.lastClickTimestamp = now;
          this.handleSquareClick(square);
        };

        sqDiv.addEventListener('pointerup', handleTap);
        sqDiv.addEventListener('click', handleTap);

        this.grid.appendChild(sqDiv);
      }
    }
  }

  updateBoard(game) {
    if (!game) return;
    const board = game.board();
    const squares = this.grid.querySelectorAll('[data-square]');

    squares.forEach(sqDiv => {
      const square = sqDiv.dataset.square;
      const fileIdx = square.charCodeAt(0) - 97;
      const rankIdx = 8 - parseInt(square[1]);
      const piece = board[rankIdx][fileIdx];

      const isLight = (sqDiv.style.order || 0) % 2 === 0;
      const f = square.charCodeAt(0) - 97;
      const r = 8 - parseInt(square[1]);
      const baseLight = (f + r) % 2 === 0;

      // Remove existing pieces & dots
      const oldPiece = sqDiv.querySelector('.piece-wrapper');
      if (oldPiece) oldPiece.remove();
      const oldDot = sqDiv.querySelector('.move-target-dot');
      if (oldDot) oldDot.remove();

      // Base square color
      sqDiv.style.backgroundColor = baseLight ? '#cbd5e1' : '#334155';
      sqDiv.style.boxShadow = 'none';
      sqDiv.style.outline = 'none';

      // Selected piece highlight
      if (this.selectedSquare === square) {
        sqDiv.style.backgroundColor = '#fbbf24'; // Amber Yellow
        sqDiv.style.boxShadow = 'inset 0 0 0 4px #d97706';
      }
      // Last move highlight
      else if (this.lastMove && (this.lastMove.from === square || this.lastMove.to === square)) {
        sqDiv.style.backgroundColor = baseLight ? '#a7f3d0' : '#065f46';
      }
      // King in check highlight
      else if (game.in_check() && piece && piece.type === 'k' && piece.color === game.turn()) {
        sqDiv.style.backgroundColor = '#ef4444';
      }

      // Add Piece
      if (piece) {
        const pieceKey = `${piece.color}${piece.type.toUpperCase()}`;
        const pWrapper = document.createElement('div');
        pWrapper.className = 'piece-wrapper';
        pWrapper.style.cssText = 'width:84%; height:84%; display:flex; align-items:center; justify-content:center; pointer-events:none; user-select:none;';
        pWrapper.innerHTML = PIECE_SVGS[pieceKey] || '';
        sqDiv.appendChild(pWrapper);
      }

      // Add Legal Move Target Dots
      if (this.legalMoves.includes(square)) {
        const isCapture = !!piece;
        const targetDiv = document.createElement('div');
        targetDiv.className = 'move-target-dot';
        if (isCapture) {
          targetDiv.style.cssText = 'position:absolute; inset:4px; border-radius:9999px; border:4px solid #10b981; background:rgba(16,185,129,0.25); pointer-events:none;';
        } else {
          targetDiv.style.cssText = 'position:absolute; width:18px; height:18px; border-radius:9999px; background:#10b981; border:2px solid #ffffff; box-shadow:0 0 10px #10b981; pointer-events:none;';
        }
        sqDiv.appendChild(targetDiv);
      }
    });

    this.renderArrows();
  }

  handleSquareClick(square) {
    console.log("👉 User tapped square:", square);

    if (window.app.isSpectator()) return;
    if (!window.app.isMyTurn()) {
      console.log("⚠️ Not your turn or AI is calculating!");
      return;
    }

    const game = window.app.game;

    // 1. If a piece is ALREADY selected
    if (this.selectedSquare) {
      // Option A: Destination square is a valid move -> MAKE THE MOVE!
      if (this.legalMoves.includes(square)) {
        console.log(`🚀 Executing move: ${this.selectedSquare} -> ${square}`);
        const from = this.selectedSquare;
        this.selectedSquare = null;
        this.legalMoves = [];
        window.app.onUserMove(from, square);
        return;
      }

      // Option B: User tapped another piece of their own color -> Switch selection!
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        this.selectedSquare = square;
        this.legalMoves = game.moves({ square: square, verbose: true }).map(m => m.to);
        console.log(`Switched selection to ${square}, destinations:`, this.legalMoves);
        this.updateBoard(game);
        return;
      }

      // Option C: User tapped an empty invalid square -> Deselect
      this.selectedSquare = null;
      this.legalMoves = [];
      this.updateBoard(game);
      return;
    }

    // 2. If NO piece is selected -> Select piece
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      this.selectedSquare = square;
      this.legalMoves = game.moves({ square: square, verbose: true }).map(m => m.to);
      console.log(`Selected ${square} (${piece.color}${piece.type}), destinations:`, this.legalMoves);
      this.updateBoard(game);
    }
  }

  setBestMoveArrow(from, to) {
    this.bestMoveArrow = from && to ? { from, to } : null;
    this.renderArrows();
  }

  setThreatArrow(from, to) {
    this.threatArrow = from && to ? { from, to } : null;
    this.renderArrows();
  }

  clearArrows() {
    this.bestMoveArrow = null;
    this.threatArrow = null;
    this.renderArrows();
  }

  getSquareCenter(square) {
    const fileIdx = square.charCodeAt(0) - 97;
    const rankIdx = 8 - parseInt(square[1]);

    const col = this.flipped ? 7 - fileIdx : fileIdx;
    const row = this.flipped ? 7 - rankIdx : rankIdx;

    const step = 100 / 8;
    return {
      x: (col + 0.5) * step,
      y: (row + 0.5) * step
    };
  }

  renderArrows() {
    if (!this.arrowsLayer) return;
    this.arrowsLayer.innerHTML = '';

    if (this.bestMoveArrow) {
      const p1 = this.getSquareCenter(this.bestMoveArrow.from);
      const p2 = this.getSquareCenter(this.bestMoveArrow.to);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', `${p1.x}%`);
      line.setAttribute('y1', `${p1.y}%`);
      line.setAttribute('x2', `${p2.x}%`);
      line.setAttribute('y2', `${p2.y}%`);
      line.setAttribute('stroke', '#10b981');
      line.setAttribute('stroke-width', '6');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('marker-end', 'url(#arrow-green)');
      line.setAttribute('filter', 'url(#glow-green)');
      line.setAttribute('opacity', '0.9');

      this.arrowsLayer.appendChild(line);
    }

    if (this.threatArrow) {
      const p1 = this.getSquareCenter(this.threatArrow.from);
      const p2 = this.getSquareCenter(this.threatArrow.to);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', `${p1.x}%`);
      line.setAttribute('y1', `${p1.y}%`);
      line.setAttribute('x2', `${p2.x}%`);
      line.setAttribute('y2', `${p2.y}%`);
      line.setAttribute('stroke', '#ef4444');
      line.setAttribute('stroke-width', '5');
      line.setAttribute('stroke-dasharray', '6 3');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('marker-end', 'url(#arrow-red)');
      line.setAttribute('filter', 'url(#glow-red)');
      line.setAttribute('opacity', '0.85');

      this.arrowsLayer.appendChild(line);
    }
  }

  flip() {
    this.flipped = !this.flipped;
    this.renderSquares();
    this.updateBoard(window.app.game);
  }
}
