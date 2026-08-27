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
    this.activeAnimations = [];

    this.initDOM();
  }

  initDOM() {
    this.container.innerHTML = `
      <div id="board-frame" style="position:relative; width:100%; max-width:520px; aspect-ratio:1/1; border-radius:16px; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5); border:4px solid #334155; background:#0f172a; user-select:none;">
        <div id="board-grid" style="display:grid; grid-template-columns:repeat(8, 12.5%); grid-template-rows:repeat(8, 12.5%); width:100%; height:100%;"></div>
        <div id="animation-layer" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:25; overflow:hidden;"></div>
        <svg id="board-arrows" viewBox="0 0 100 100" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:20;">
          <defs>
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g id="arrows-layer"></g>
        </svg>
      </div>
    `;

    this.grid = document.getElementById('board-grid');
    this.animationLayer = document.getElementById('animation-layer');
    this.arrowsLayer = document.getElementById('arrows-layer');

    this.renderSquares();
  }

  getSquareCoords(square) {
    const fileIdx = square.charCodeAt(0) - 97;
    const rankIdx = 8 - parseInt(square[1]);

    const col = this.flipped ? 7 - fileIdx : fileIdx;
    const row = this.flipped ? 7 - rankIdx : rankIdx;

    return {
      col,
      row,
      leftPct: col * 12.5,
      topPct: row * 12.5
    };
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
          transition: background-color 150ms ease, box-shadow 150ms ease;
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

  updateBoard(game, options = {}) {
    if (!game) return;
    const hideSquares = options.hideSquares || [];
    const hideAll = options.hideAll || false;
    const board = game.board();
    const squares = this.grid.querySelectorAll('[data-square]');

    squares.forEach(sqDiv => {
      const square = sqDiv.dataset.square;
      const fileIdx = square.charCodeAt(0) - 97;
      const rankIdx = 8 - parseInt(square[1]);
      const piece = board[rankIdx][fileIdx];

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
      // King in check highlight
      else if (game.in_check() && piece && piece.type === 'k' && piece.color === game.turn()) {
        sqDiv.style.backgroundColor = '#ef4444';
        sqDiv.style.boxShadow = 'inset 0 0 0 4px #b91c1c';
      }
      // Predicted Best Move highlight (Origin & Destination)
      else if (this.bestMoveArrow && (this.bestMoveArrow.from === square || this.bestMoveArrow.to === square)) {
        if (this.bestMoveArrow.from === square) {
          sqDiv.style.backgroundColor = baseLight ? 'rgba(52, 211, 153, 0.45)' : 'rgba(5, 150, 105, 0.45)';
          sqDiv.style.boxShadow = 'inset 0 0 0 3px rgba(16, 185, 129, 0.9)';
        } else {
          sqDiv.style.backgroundColor = baseLight ? 'rgba(52, 211, 153, 0.6)' : 'rgba(16, 185, 129, 0.6)';
          sqDiv.style.boxShadow = 'inset 0 0 0 3px rgba(52, 211, 153, 0.95)';
        }
      }
      // Opponent Threat highlight
      else if (this.threatArrow && (this.threatArrow.from === square || this.threatArrow.to === square)) {
        sqDiv.style.backgroundColor = baseLight ? 'rgba(252, 165, 165, 0.45)' : 'rgba(185, 28, 28, 0.45)';
        sqDiv.style.boxShadow = 'inset 0 0 0 2.5px rgba(239, 68, 68, 0.85)';
      }
      // Last move highlight
      else if (this.lastMove && (this.lastMove.from === square || this.lastMove.to === square)) {
        sqDiv.style.backgroundColor = baseLight ? '#a7f3d0' : '#065f46';
      }

      // Add Piece
      if (piece && !hideAll && !hideSquares.includes(square)) {
        const pieceKey = `${piece.color}${piece.type.toUpperCase()}`;
        const pWrapper = document.createElement('div');
        pWrapper.className = 'piece-wrapper';
        pWrapper.style.cssText = 'width:84%; height:84%; display:flex; align-items:center; justify-content:center; pointer-events:none; user-select:none; transition:transform 120ms ease;';
        pWrapper.innerHTML = PIECE_SVGS[pieceKey] || '';
        sqDiv.appendChild(pWrapper);
      }

      // Add Legal Move Target Dots
      if (!hideAll && this.legalMoves.includes(square)) {
        const isCapture = !!piece;
        const targetDiv = document.createElement('div');
        targetDiv.className = 'move-target-dot';
        if (isCapture) {
          targetDiv.style.cssText = 'position:absolute; inset:4px; border-radius:9999px; border:4px solid #10b981; background:rgba(16,185,129,0.25); pointer-events:none; animation: dotPulse 1.5s infinite;';
        } else {
          targetDiv.style.cssText = 'position:absolute; width:18px; height:18px; border-radius:9999px; background:#10b981; border:2px solid #ffffff; box-shadow:0 0 10px #10b981; pointer-events:none;';
        }
        sqDiv.appendChild(targetDiv);
      }
    });

    this.renderArrows();
  }

  showMatchStartBanner(whiteName = "You", blackName = "AI Opponent", subtitle = "Ready... Play!") {
    const frame = this.container.querySelector('#board-frame');
    if (!frame) return;

    let banner = frame.querySelector('#board-match-banner');
    if (banner) banner.remove();

    banner = document.createElement('div');
    banner.id = 'board-match-banner';
    banner.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 40;
      pointer-events: none;
      background: radial-gradient(circle at center, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.6) 70%, rgba(15, 23, 42, 0.2) 100%);
      backdrop-filter: blur(4px);
      animation: bannerFadeInOut 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    `;

    banner.innerHTML = `
      <div style="transform: scale(0.9); animation: bannerPopIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 18px 26px; border-radius: 20px; background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(244, 63, 94, 0.4); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(244,63,94,0.3);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span style="font-size: 16px;">⚔️</span>
          <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #f43f5e;">Grandmaster Match</span>
          <span style="font-size: 16px;">⚔️</span>
        </div>
        <div style="font-size: 18px; font-weight: 900; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 6px;">
          <span style="color:#ffffff;">${whiteName}</span>
          <span style="color: #64748b; font-size: 13px; font-weight: 700;">VS</span>
          <span style="color: #38bdf8;">${blackName}</span>
        </div>
        <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 14px; border-radius: 9999px; background: rgba(16, 185, 129, 0.18); border: 1px solid rgba(16, 185, 129, 0.4); font-size: 11px; font-weight: 700; color: #34d399;">
          <span style="display: inline-block; width: 7px; height: 7px; border-radius: 9999px; background: #10b981; box-shadow: 0 0 10px #10b981;"></span>
          ${subtitle}
        </div>
      </div>
    `;

    frame.appendChild(banner);

    setTimeout(() => {
      if (banner && banner.parentNode) banner.remove();
    }, 1850);
  }

  playOpeningSequence(game, onFinish) {
    if (!this.animationLayer) {
      this.updateBoard(game);
      if (onFinish) onFinish();
      return;
    }

    // Cancel any running animations
    this.activeAnimations.forEach(anim => {
      try { anim.cancel(); } catch { }
    });
    this.activeAnimations = [];
    this.animationLayer.innerHTML = '';

    // Render empty grid squares
    this.updateBoard(game, { hideAll: true });

    // Collect initial pieces
    const board = game.board();
    const piecesToAnimate = [];

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece) {
          const square = `${String.fromCharCode(97 + f)}${8 - r}`;
          const coords = this.getSquareCoords(square);
          const pieceKey = `${piece.color}${piece.type.toUpperCase()}`;
          const isPawn = piece.type === 'p';
          const isWhite = piece.color === 'w';

          piecesToAnimate.push({
            square,
            coords,
            pieceKey,
            isPawn,
            isWhite,
            fileIdx: f,
            rankIdx: r
          });
        }
      }
    }

    // Play fanfare & sound
    window.soundFX.playGameStart();

    // Show Match Opening Banner
    const isAi = window.app && window.app.mode === 'ai';
    const playerSide = window.app ? window.app.playerColor : 'w';
    const whiteTitle = playerSide === 'w' ? 'You (White)' : (isAi ? 'Grandmaster AI' : 'Player 1');
    const blackTitle = playerSide === 'b' ? 'You (Black)' : (isAi ? 'AI Opponent' : 'Player 2');
    this.showMatchStartBanner(whiteTitle, blackTitle, "Game Opened • White to Move");

    const animPromises = [];

    piecesToAnimate.forEach((p) => {
      const animEl = document.createElement('div');
      animEl.className = 'animating-piece';
      animEl.style.cssText = `
        position: absolute;
        width: 12.5%;
        height: 12.5%;
        left: ${p.coords.leftPct}%;
        top: ${p.coords.topPct}%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        user-select: none;
        will-change: transform, opacity;
      `;

      const inner = document.createElement('div');
      inner.style.cssText = 'width:84%; height:84%; display:flex; align-items:center; justify-content:center;';
      inner.innerHTML = PIECE_SVGS[p.pieceKey] || '';
      animEl.appendChild(inner);

      this.animationLayer.appendChild(animEl);

      // Stagger timings:
      // Black back-rank -> Black pawns -> White back-rank -> White pawns
      let rankBaseDelay = 0;
      if (!p.isWhite) {
        rankBaseDelay = p.isPawn ? 120 : 30;
      } else {
        rankBaseDelay = p.isPawn ? 240 : 160;
      }
      const fileDelay = p.fileIdx * 30;
      const totalDelay = rankBaseDelay + fileDelay;

      // Drop from top or bottom
      const startYOffset = p.isWhite ? 80 : -80;

      const animation = animEl.animate([
        {
          transform: `translate3d(0, ${startYOffset}px, 0) scale(0.6) rotate(${p.fileIdx % 2 === 0 ? -8 : 8}deg)`,
          opacity: 0
        },
        {
          transform: `translate3d(0, -10px, 0) scale(1.12) rotate(0deg)`,
          opacity: 0.95,
          offset: 0.72
        },
        {
          transform: `translate3d(0, 0, 0) scale(1) rotate(0deg)`,
          opacity: 1
        }
      ], {
        duration: 360,
        delay: totalDelay,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fill: 'both'
      });

      this.activeAnimations.push(animation);

      setTimeout(() => {
        if (p.isPawn && (p.fileIdx === 3 || p.fileIdx === 4)) {
          window.soundFX.playPieceDrop(p.fileIdx);
        } else if (!p.isPawn && (p.fileIdx === 3 || p.fileIdx === 4)) {
          window.soundFX.playPieceDrop(5);
        }
      }, totalDelay + 220);

      const promise = new Promise((resolve) => {
        animation.onfinish = () => resolve();
        animation.oncancel = () => resolve();
      });
      animPromises.push(promise);
    });

    Promise.all(animPromises).then(() => {
      this.animationLayer.innerHTML = '';
      this.activeAnimations = [];
      this.updateBoard(game);
      if (onFinish) onFinish();
    });
  }

  animateMove(game, move, onFinish) {
    if (!move || !move.from || !move.to || !this.animationLayer) {
      this.updateBoard(game);
      if (onFinish) onFinish();
      return;
    }

    // Cancel any currently running animations cleanly
    this.activeAnimations.forEach(anim => {
      try { anim.cancel(); } catch { }
    });
    this.activeAnimations = [];
    this.animationLayer.innerHTML = '';

    const movesToAnimate = [];

    // Main moving piece
    const movedPieceType = move.promotion ? move.promotion : move.piece;
    const pieceKey = `${move.color}${movedPieceType.toUpperCase()}`;
    movesToAnimate.push({
      pieceKey: pieceKey,
      from: move.from,
      to: move.to
    });

    // Castling companion rook animation
    const isCastling = (move.san === 'O-O' || move.san === 'O-O-O' || (move.piece === 'k' && Math.abs(move.from.charCodeAt(0) - move.to.charCodeAt(0)) > 1));
    const hideSquares = [move.from, move.to];

    if (isCastling) {
      if (move.color === 'w') {
        if (move.to === 'g1') { // Kingside White
          movesToAnimate.push({ pieceKey: 'wR', from: 'h1', to: 'f1' });
          hideSquares.push('h1', 'f1');
        } else if (move.to === 'c1') { // Queenside White
          movesToAnimate.push({ pieceKey: 'wR', from: 'a1', to: 'd1' });
          hideSquares.push('a1', 'd1');
        }
      } else {
        if (move.to === 'g8') { // Kingside Black
          movesToAnimate.push({ pieceKey: 'bR', from: 'h8', to: 'f8' });
          hideSquares.push('h8', 'f8');
        } else if (move.to === 'c8') { // Queenside Black
          movesToAnimate.push({ pieceKey: 'bR', from: 'a8', to: 'd8' });
          hideSquares.push('a8', 'd8');
        }
      }
    }

    // Render board with moving pieces hidden on static grid
    this.updateBoard(game, { hideSquares });

    const animPromises = [];

    movesToAnimate.forEach(m => {
      const fromCoords = this.getSquareCoords(m.from);
      const toCoords = this.getSquareCoords(m.to);

      const animEl = document.createElement('div');
      animEl.className = 'animating-piece';
      animEl.style.cssText = `
        position: absolute;
        width: 12.5%;
        height: 12.5%;
        left: ${fromCoords.leftPct}%;
        top: ${fromCoords.topPct}%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        user-select: none;
        will-change: transform, filter;
      `;

      const innerWrapper = document.createElement('div');
      innerWrapper.style.cssText = 'width:84%; height:84%; display:flex; align-items:center; justify-content:center;';
      innerWrapper.innerHTML = PIECE_SVGS[m.pieceKey] || '';
      animEl.appendChild(innerWrapper);

      this.animationLayer.appendChild(animEl);

      const deltaXPercent = (toCoords.col - fromCoords.col) * 100;
      const deltaYPercent = (toCoords.row - fromCoords.row) * 100;

      const animation = animEl.animate([
        {
          transform: 'translate3d(0, 0, 0) scale(1)',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        },
        {
          transform: `translate3d(${deltaXPercent * 0.7}%, ${deltaYPercent * 0.7}%, 0) scale(1.08)`,
          filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.6))',
          offset: 0.7
        },
        {
          transform: `translate3d(${deltaXPercent}%, ${deltaYPercent}%, 0) scale(1)`,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }
      ], {
        duration: 220,
        easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
        fill: 'forwards'
      });

      this.activeAnimations.push(animation);

      const promise = new Promise((resolve) => {
        animation.onfinish = () => resolve();
        animation.oncancel = () => resolve();
      });
      animPromises.push(promise);
    });

    Promise.all(animPromises).then(() => {
      this.animationLayer.innerHTML = '';
      this.activeAnimations = [];
      this.updateBoard(game);
      if (onFinish) onFinish();
    });
  }

  handleSquareClick(square) {
    console.log("👉 User tapped square:", square);

    if (!window.app) return;
    if (window.app.isSpectator && window.app.isSpectator()) return;
    if (!window.app.isMyTurn || !window.app.isMyTurn()) {
      console.log("⚠️ Not your turn or AI is calculating!");
      return;
    }

    const game = window.app.game;
    if (!game) return;

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
    if (window.app && window.app.game) {
      this.updateBoard(window.app.game);
    }
  }

  setThreatArrow(from, to) {
    this.threatArrow = from && to ? { from, to } : null;
    this.renderArrows();
    if (window.app && window.app.game) {
      this.updateBoard(window.app.game);
    }
  }

  clearArrows() {
    this.bestMoveArrow = null;
    this.threatArrow = null;
    this.renderArrows();
    if (window.app && window.app.game) {
      this.updateBoard(window.app.game);
    }
  }

  getSquareCenter(square) {
    if (!square || square.length < 2) return { x: 50, y: 50 };
    const fileIdx = square.charCodeAt(0) - 97;
    const rankIdx = 8 - parseInt(square[1]);

    const col = this.flipped ? 7 - fileIdx : fileIdx;
    const row = this.flipped ? 7 - rankIdx : rankIdx;

    const step = 100 / 8; // 12.5
    return {
      x: (col + 0.5) * step,
      y: (row + 0.5) * step
    };
  }

  createArrowSVG(fromSquare, toSquare, color = '#10b981', isDashed = false) {
    if (!fromSquare || !toSquare) return null;
    const p1 = this.getSquareCenter(fromSquare);
    const p2 = this.getSquareCenter(toSquare);
    if (!p1 || !p2) return null;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return null;

    const angle = Math.atan2(dy, dx);

    // Arrowhead geometry configuration in viewBox units (0..100)
    const headLen = 4.2;
    const headWidth = 3.6;

    // Start slightly offset from center of from square so piece center is visible
    const startOffset = 2.0;
    const sx = p1.x + startOffset * Math.cos(angle);
    const sy = p1.y + startOffset * Math.sin(angle);

    // Line end stops where arrowhead base meets
    const ex = p2.x - (headLen * 0.7) * Math.cos(angle);
    const ey = p2.y - (headLen * 0.7) * Math.sin(angle);

    // Triangle base center and perpendicular vectors
    const baseX = p2.x - headLen * Math.cos(angle);
    const baseY = p2.y - headLen * Math.sin(angle);
    const perpX = (headWidth / 2) * Math.sin(angle);
    const perpY = (headWidth / 2) * -Math.cos(angle);

    const tipX = p2.x;
    const tipY = p2.y;
    const c1X = baseX + perpX;
    const c1Y = baseY + perpY;
    const c2X = baseX - perpX;
    const c2Y = baseY - perpY;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'chess-arrow-group');

    // Origin base dot
    const baseDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    baseDot.setAttribute('cx', `${p1.x}`);
    baseDot.setAttribute('cy', `${p1.y}`);
    baseDot.setAttribute('r', '1.8');
    baseDot.setAttribute('fill', color);
    baseDot.setAttribute('opacity', '0.9');
    g.appendChild(baseDot);

    // Main shaft line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', `${sx}`);
    line.setAttribute('y1', `${sy}`);
    line.setAttribute('x2', `${ex}`);
    line.setAttribute('y2', `${ey}`);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '2.5');
    line.setAttribute('stroke-linecap', 'round');
    if (isDashed) {
      line.setAttribute('stroke-dasharray', '2.5, 1.5');
    }
    g.appendChild(line);

    // Arrowhead polygon
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', `${tipX},${tipY} ${c1X},${c1Y} ${c2X},${c2Y}`);
    poly.setAttribute('fill', color);
    g.appendChild(poly);

    if (color === '#10b981') {
      g.setAttribute('filter', 'url(#glow-green)');
    } else {
      g.setAttribute('filter', 'url(#glow-red)');
    }
    g.style.opacity = '0.95';

    return g;
  }

  renderArrows() {
    if (!this.arrowsLayer) return;
    this.arrowsLayer.innerHTML = '';

    if (this.threatArrow) {
      const g = this.createArrowSVG(this.threatArrow.from, this.threatArrow.to, '#ef4444', true);
      if (g) this.arrowsLayer.appendChild(g);
    }

    if (this.bestMoveArrow) {
      const g = this.createArrowSVG(this.bestMoveArrow.from, this.bestMoveArrow.to, '#10b981', false);
      if (g) this.arrowsLayer.appendChild(g);
    }
  }

  flip() {
    this.flipped = !this.flipped;
    this.renderSquares();
    if (window.app && window.app.game) {
      this.updateBoard(window.app.game);
    }
  }
}
