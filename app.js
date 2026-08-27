// Grandmaster AI Chess: Complete Controller with Guaranteed AI Moves & On-Demand Prediction

class App {
  constructor() {
    window.app = this;
    this.game = new Chess();
    this.mode = 'ai';
    this.playerColor = 'w';
    this.aiColor = 'b';
    this.aiDifficulty = 'medium';
    this.searchDepth = 3;
    this.aiDepth = 2;
    this.currentAnalysis = null;
    this.moveHistory = [];
    this.capturedPieces = { w: [], b: [] };
    this.isAiThinking = false;

    this.timeLimitSecs = 300;
    this.playerTime = 300;
    this.aiTime = 300;
    this.clockInterval = null;
    this.gameActive = true;

    this.init();
  }

  init() {
    window.chessboardView = new ChessboardView('board-container');
    window.decisionTree = new DecisionTreeVisualizer('decision-tree-container');

    this.bindEvents();
    this.updateBoardView();
    this.startSoloClock();
    this.runAnalysis(false); // quiet initial analysis

    // Cinematic Match Opening Animation on Initial Launch
    setTimeout(() => {
      if (window.chessboardView && typeof window.chessboardView.playOpeningSequence === 'function') {
        window.chessboardView.playOpeningSequence(this.game);
      }
    }, 150);

    const canvas = document.getElementById('voice-waveform');
    if (canvas && window.voiceAgent) window.voiceAgent.setVisualizerCanvas(canvas);

    if (window.multiplayerClient) window.multiplayerClient.connect();
  }

  bindEvents() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Voice Mic button
    const micBtn = document.getElementById('btn-voice-mic');
    if (micBtn && window.voiceAgent) {
      micBtn.addEventListener('click', () => window.voiceAgent.toggleListening());
    }

    // Explicit Predict / Ask Aria Best Move buttons (both quick and standard)
    const askAriaBtn = document.getElementById('btn-ask-aria');
    if (askAriaBtn) {
      askAriaBtn.addEventListener('click', () => {
        this.predictBestMove();
      });
    }

    const askAriaQuickBtn = document.getElementById('btn-ask-aria-quick');
    if (askAriaQuickBtn) {
      askAriaQuickBtn.addEventListener('click', () => {
        this.predictBestMove();
      });
    }

    // Auto Play Recommended Move Buttons
    const playRecBtn = document.getElementById('btn-play-recommended');
    if (playRecBtn) {
      playRecBtn.addEventListener('click', () => {
        if (this.currentAnalysis && this.currentAnalysis.bestMove && this.isMyTurn()) {
          const m = this.currentAnalysis.bestMove;
          this.onUserMove(m.from, m.to);
        }
      });
    }

    const playRecQuickBtn = document.getElementById('btn-play-recommended-quick');
    if (playRecQuickBtn) {
      playRecQuickBtn.addEventListener('click', () => {
        if (this.currentAnalysis && this.currentAnalysis.bestMove && this.isMyTurn()) {
          const m = this.currentAnalysis.bestMove;
          this.onUserMove(m.from, m.to);
        }
      });
    }

    // AI Difficulty Selector
    const aiDiffSelect = document.getElementById('ai-difficulty-select');
    if (aiDiffSelect) {
      aiDiffSelect.addEventListener('change', (e) => {
        this.setAIDifficulty(e.target.value);
      });
    }

    // Search Depth Selector
    const depthSelect = document.getElementById('depth-select');
    if (depthSelect) {
      depthSelect.addEventListener('change', (e) => {
        this.searchDepth = parseInt(e.target.value);
        this.runAnalysis(false);
      });
    }

    // Play Side Toggles
    const playWhiteBtn = document.getElementById('btn-play-white');
    const playBlackBtn = document.getElementById('btn-play-black');

    if (playWhiteBtn && playBlackBtn) {
      playWhiteBtn.addEventListener('click', () => this.setPlayerSide('w'));
      playBlackBtn.addEventListener('click', () => this.setPlayerSide('b'));
    }

    // Flip Board Button
    const flipBtn = document.getElementById('btn-flip-board');
    if (flipBtn) {
      flipBtn.addEventListener('click', () => window.chessboardView.flip());
    }

    // Reset / New Game
    const resetBtn = document.getElementById('btn-reset-board');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetGame());
    }

    // Replay Game Opening Animation Button
    const replayOpeningBtn = document.getElementById('btn-replay-opening');
    if (replayOpeningBtn) {
      replayOpeningBtn.addEventListener('click', () => {
        if (window.chessboardView && typeof window.chessboardView.playOpeningSequence === 'function') {
          window.chessboardView.playOpeningSequence(this.game);
        }
      });
    }

    // Predict Best Move Buttons (Quick & Sidebar)
    const quickPredictBtn = document.getElementById('btn-ask-aria-quick');
    if (quickPredictBtn) {
      quickPredictBtn.addEventListener('click', () => this.predictBestMove());
    }

    const hintBtn = document.getElementById('btn-hint-move');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => this.predictBestMove());
    }

    // Play Recommended Move Button
    const quickPlayBtn = document.getElementById('btn-play-recommended-quick');
    if (quickPlayBtn) {
      quickPlayBtn.addEventListener('click', () => this.playRecommendedMove());
    }

    // Multiplayer Create Room
    const createRoomBtn = document.getElementById('btn-create-room');
    if (createRoomBtn) {
      createRoomBtn.addEventListener('click', () => {
        const name = document.getElementById('player-name-input')?.value || 'Player 1';
        const mins = parseInt(document.getElementById('time-control-select')?.value || 5);
        const color = document.getElementById('color-choice-select')?.value || 'random';
        window.multiplayerClient.createRoom(name, mins, 0, color);
      });
    }

    // Multiplayer Join Room
    const joinRoomBtn = document.getElementById('btn-join-room');
    if (joinRoomBtn) {
      joinRoomBtn.addEventListener('click', () => {
        const code = document.getElementById('join-code-input')?.value.trim().toUpperCase();
        const name = document.getElementById('player-name-input')?.value || 'Player 2';
        if (!code) {
          alert("Please enter a valid 6-character room code.");
          return;
        }
        window.multiplayerClient.joinRoom(code, name);
      });
    }

    // Resign Button
    const resignBtn = document.getElementById('btn-resign');
    if (resignBtn) {
      resignBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to resign?")) {
          if (this.isMultiplayer()) {
            window.multiplayerClient.resign();
          } else {
            this.gameActive = false;
            window.voiceAgent.speak("You have resigned. AI wins the match.");
            alert("You resigned. AI wins!");
          }
        }
      });
    }

    // Offer Draw Button
    const drawBtn = document.getElementById('btn-offer-draw');
    if (drawBtn) {
      drawBtn.addEventListener('click', () => {
        if (this.isMultiplayer()) {
          window.multiplayerClient.offerDraw();
          alert("Draw offer sent to opponent.");
        } else {
          const score = this.currentAnalysis ? this.currentAnalysis.bestScore : 0;
          if (Math.abs(score) < 80) {
            this.gameActive = false;
            window.voiceAgent.speak("AI accepts your draw offer. Game drawn.");
            alert("AI accepted your draw offer! Game drawn.");
          } else {
            window.voiceAgent.speak("AI declines the draw offer and continues to fight.");
            alert("AI declined your draw offer.");
          }
        }
      });
    }

    // Chat Form
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        if (input && input.value.trim()) {
          const text = input.value.trim();
          if (this.isMultiplayer()) {
            window.multiplayerClient.sendChat(text);
          } else {
            this.appendChatMessage({ sender: 'You', text: text });
            setTimeout(() => {
              const answer = window.coachAgent.answerVoiceQuery(text, this.game, this.currentAnalysis);
              this.appendChatMessage({ sender: 'Aria (Lady Coach)', text: answer.speech, is_coach: true });
            }, 500);
          }
          input.value = '';
        }
      });
    }
  }

  predictBestMove() {
    if (!this.game || this.game.game_over()) return;
    const depth = Math.max(this.searchDepth || 2, 2);
    const analysis = window.chessEngine.findBestMove(this.game, depth);
    this.currentAnalysis = analysis;

    if (analysis && analysis.bestMove) {
      window.chessboardView.setBestMoveArrow(analysis.bestMove.from, analysis.bestMove.to);
      const explanation = window.coachAgent.generateMoveExplanation(this.game, analysis);
      this.updateCoachUI(explanation);
      window.voiceAgent.speak(explanation.spoken);

      const threat = window.chessEngine.findOpponentThreat(this.game);
      if (threat && threat.threatMove) {
        window.chessboardView.setThreatArrow(threat.threatMove.from, threat.threatMove.to);
      } else {
        window.chessboardView.threatArrow = null;
        window.chessboardView.renderArrows();
      }

      if (window.decisionTree) {
        window.decisionTree.render(analysis.searchTree);
      }
    }
  }

  playRecommendedMove() {
    if (!this.game || this.game.game_over()) return;
    if (!this.isMyTurn()) {
      window.voiceAgent.speak("Please wait for your opponent's turn to complete.");
      return;
    }

    if (!this.currentAnalysis || !this.currentAnalysis.bestMove) {
      this.predictBestMove();
    }

    if (this.currentAnalysis && this.currentAnalysis.bestMove) {
      const { from, to, promotion } = this.currentAnalysis.bestMove;
      this.onUserMove(from, to, promotion || 'q');
    }
  }

  setAIDifficulty(level) {
    this.aiDifficulty = level;
    if (level === 'easy') {
      this.aiDepth = 1;
      this.searchDepth = 1;
    } else if (level === 'medium') {
      this.aiDepth = 2;
      this.searchDepth = 2;
    } else if (level === 'hard') {
      this.aiDepth = 3;
      this.searchDepth = 3;
    } else if (level === 'master') {
      this.aiDepth = 4;
      this.searchDepth = 4;
    }

    const depthSelect = document.getElementById('depth-select');
    if (depthSelect) depthSelect.value = String(this.searchDepth);

    const diffBadge = document.getElementById('ai-diff-badge');
    if (diffBadge) diffBadge.innerText = `Level: ${level.toUpperCase()}`;

    this.runAnalysis(false);
  }

  setPlayerSide(color) {
    this.playerColor = color;
    this.aiColor = color === 'w' ? 'b' : 'w';

    const playWhiteBtn = document.getElementById('btn-play-white');
    const playBlackBtn = document.getElementById('btn-play-black');

    if (color === 'w') {
      playWhiteBtn?.classList.add('bg-white', 'text-slate-900');
      playWhiteBtn?.classList.remove('bg-slate-800', 'text-slate-300');
      playBlackBtn?.classList.remove('bg-white', 'text-slate-900');
      playBlackBtn?.classList.add('bg-slate-800', 'text-slate-300');
      window.chessboardView.flipped = false;
    } else {
      playBlackBtn?.classList.add('bg-white', 'text-slate-900');
      playBlackBtn?.classList.remove('bg-slate-800', 'text-slate-300');
      playWhiteBtn?.classList.remove('bg-white', 'text-slate-900');
      playWhiteBtn?.classList.add('bg-slate-800', 'text-slate-300');
      window.chessboardView.flipped = true;
    }

    window.chessboardView.renderSquares();
    this.resetGame();
  }

  resetGame() {
    this.game.reset();
    this.moveHistory = [];
    this.capturedPieces = { w: [], b: [] };
    this.playerTime = this.timeLimitSecs;
    this.aiTime = this.timeLimitSecs;
    this.gameActive = true;
    this.isAiThinking = false;
    window.chessboardView.lastMove = null;
    window.chessboardView.clearArrows();

    // Play Grandmaster Opening Piece Assembly Animation
    if (window.chessboardView && typeof window.chessboardView.playOpeningSequence === 'function') {
      window.chessboardView.playOpeningSequence(this.game);
    } else {
      this.updateBoardView();
    }

    this.updateOpeningBookUI();
    this.runAnalysis(false);

    if (this.mode === 'ai' && this.playerColor === 'b') {
      setTimeout(() => this.triggerAIMove(), 700);
    }
  }

  startSoloClock() {
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.clockInterval = setInterval(() => {
      if (this.mode === 'ai' && this.gameActive && !this.game.game_over()) {
        const turn = this.game.turn();
        if (turn === this.playerColor) {
          this.playerTime = Math.max(0, this.playerTime - 1);
          if (this.playerTime <= 0) {
            this.gameActive = false;
            alert("Time out! AI wins on time.");
            window.voiceAgent.speak("Time out! You ran out of time.");
          }
        } else {
          this.aiTime = Math.max(0, this.aiTime - 1);
          if (this.aiTime <= 0) {
            this.gameActive = false;
            alert("AI timed out! You win!");
            window.voiceAgent.speak("AI ran out of time. You win the match!");
          }
        }

        const wTime = this.playerColor === 'w' ? this.playerTime : this.aiTime;
        const bTime = this.playerColor === 'b' ? this.playerTime : this.aiTime;
        this.updateClockDisplay(wTime, bTime);
      }
    }, 1000);
  }

  switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('bg-sky-600', 'text-white');
        btn.classList.remove('bg-slate-800', 'text-slate-400');
      } else {
        btn.classList.remove('bg-sky-600', 'text-white');
        btn.classList.add('bg-slate-800', 'text-slate-400');
      }
    });

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('hidden', content.id !== `tab-${tabName}`);
    });
  }

  isMultiplayer() {
    return this.mode === 'multiplayer';
  }

  isSpectator() {
    return this.isMultiplayer() && window.multiplayerClient.myRole === 'spectator';
  }

  isMyTurn() {
    if (this.isMultiplayer()) {
      const role = window.multiplayerClient.myRole;
      return (this.game.turn() === 'w' && role === 'white') || (this.game.turn() === 'b' && role === 'black');
    }
    // In Solo vs AI: User can move whenever it's user's turn and AI is not calculating!
    return this.game.turn() === this.playerColor && !this.isAiThinking && this.gameActive;
  }

  onUserMove(from, to) {
    if (!this.gameActive || this.isAiThinking) return;

    // Execute Move on Chess.js
    const move = this.game.move({ from: from, to: to, promotion: 'q' });
    if (!move) {
      console.warn("Illegal user move:", from, to);
      return;
    }

    // Clear prediction arrow so user can play naturally
    window.chessboardView.clearArrows();

    if (move.captured) {
      const captColor = move.color === 'w' ? 'b' : 'w';
      this.capturedPieces[captColor].push(move.captured);
      window.soundFX.playCapture();
    } else if (move.san === 'O-O' || move.san === 'O-O-O') {
      window.soundFX.playCastle();
    } else {
      window.soundFX.playMove();
    }

    if (this.game.in_check()) {
      window.soundFX.playCheck();
    }

    window.chessboardView.lastMove = { from, to };
    this.moveHistory.push(move);

    this.updateBoardView(move);
    this.runAnalysis(false); // quiet update

    if (this.isMultiplayer()) {
      window.multiplayerClient.makeMove(
        move,
        move.san,
        this.game.fen(),
        this.game.in_check(),
        this.game.in_checkmate(),
        this.game.in_draw()
      );
    } else {
      // Trigger AI opponent reply immediately!
      if (!this.game.game_over() && this.game.turn() === this.aiColor) {
        this.triggerAIMove();
      }
    }
  }

  triggerAIMove() {
    if (this.game.game_over()) return;
    this.isAiThinking = true;
    this.setAiStatus("🤖 AI is thinking...");

    setTimeout(() => {
      try {
        const analysis = window.chessEngine.findBestMove(this.game, this.aiDepth);
        this.isAiThinking = false;
        this.setAiStatus("Your turn to move");

        if (analysis && analysis.bestMove) {
          const movePayload = {
            from: analysis.bestMove.from,
            to: analysis.bestMove.to,
            promotion: analysis.bestMove.promotion || 'q'
          };
          const aiMove = this.game.move(movePayload);
          if (aiMove) {
            console.log("🤖 AI successfully executed move:", aiMove.san);

            if (aiMove.captured) {
              const captColor = aiMove.color === 'w' ? 'b' : 'w';
              this.capturedPieces[captColor].push(aiMove.captured);
              window.soundFX.playCapture();
            } else if (aiMove.san === 'O-O' || aiMove.san === 'O-O-O') {
              window.soundFX.playCastle();
            } else {
              window.soundFX.playMove();
            }

            if (this.game.in_check()) window.soundFX.playCheck();

            window.chessboardView.lastMove = { from: aiMove.from, to: aiMove.to };
            this.moveHistory.push(aiMove);

            this.updateBoardView(aiMove);
            this.runAnalysis(false); // quiet update

            // Brief voice announcement of AI move
            const pieceName = aiMove.piece === 'p' ? 'Pawn' : aiMove.piece === 'n' ? 'Knight' : aiMove.piece === 'b' ? 'Bishop' : aiMove.piece === 'r' ? 'Rook' : aiMove.piece === 'q' ? 'Queen' : 'King';
            window.voiceAgent.speak(`AI played ${pieceName} to ${aiMove.to}. Your turn.`);
          } else {
            console.error("AI move failed to apply:", movePayload);
          }
        }
      } catch (err) {
        console.error("AI error:", err);
        this.isAiThinking = false;
        this.setAiStatus("Your turn to move");
      }
    }, 400);
  }

  setAiStatus(text) {
    const aiStatusEl = document.getElementById('ai-status-indicator');
    if (aiStatusEl) aiStatusEl.innerText = text;
  }

  onRemoteMove(msg) {
    this.game.load(msg.fen);
    if (msg.move) {
      window.chessboardView.lastMove = { from: msg.move.from, to: msg.move.to };
      this.moveHistory.push(msg.move);
      if (msg.move.captured) {
        const captColor = msg.move.color === 'w' ? 'b' : 'w';
        this.capturedPieces[captColor].push(msg.move.captured);
        window.soundFX.playCapture();
      } else {
        window.soundFX.playMove();
      }
    }

    if (msg.is_check) window.soundFX.playCheck();

    this.updateBoardView(msg.move || null);
    this.runAnalysis(false);
  }

  runAnalysis(shouldSpeak = false) {
    if (this.game.game_over()) {
      this.handleGameEnd();
      return;
    }

    const analysis = window.chessEngine.findBestMove(this.game, this.searchDepth);
    this.currentAnalysis = analysis;

    if (analysis && analysis.bestMove) {
      const explanation = window.coachAgent.generateMoveExplanation(this.game, analysis);
      this.updateCoachUI(explanation);
      window.decisionTree.render(analysis.searchTree, analysis.bestMove.san);
      this.updateEvalBar(analysis.bestScore);

      if (shouldSpeak) {
        window.voiceAgent.speak(explanation.spoken);
      }
    }
  }

  updateCoachUI(exp) {
    const badge = document.getElementById('coach-tactical-badge');
    const speechText = document.getElementById('coach-speech-text');
    const stepsList = document.getElementById('coach-steps-list');
    const playRecBtn = document.getElementById('btn-play-recommended');

    if (badge) badge.innerText = exp.tacticalBadge;
    if (speechText) speechText.innerHTML = `<strong>Aria (Lady Coach):</strong> ${exp.spoken}`;

    if (playRecBtn) {
      playRecBtn.innerHTML = `▶️ Play Best Move: <strong>${exp.san}</strong>`;
    }

    if (stepsList) {
      stepsList.innerHTML = exp.steps.map(step => `
        <div class="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
          <span class="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
          <span>${step}</span>
        </div>
      `).join('');
    }
  }

  updateEvalBar(score) {
    const evalBar = document.getElementById('eval-bar-fill');
    const evalText = document.getElementById('eval-score-text');

    if (evalBar && evalText) {
      const pawns = (score / 100).toFixed(1);
      evalText.innerText = pawns > 0 ? `+${pawns}` : pawns;

      const clamped = Math.max(-1000, Math.min(1000, score));
      const pct = 50 + (clamped / 20);
      evalBar.style.height = `${pct}%`;
    }
  }

  updateBoardView(animatedMove = null) {
    if (animatedMove && window.chessboardView && typeof window.chessboardView.animateMove === 'function') {
      window.chessboardView.animateMove(this.game, animatedMove);
    } else if (window.chessboardView) {
      window.chessboardView.updateBoard(this.game);
    }
    this.updateMoveHistoryUI();
    this.updateCapturedUI();
    this.updateOpeningBookUI();

    const turnText = document.getElementById('turn-indicator');
    if (turnText) {
      const isWhite = this.game.turn() === 'w';
      turnText.innerHTML = `
        <span class="w-3 h-3 rounded-full ${isWhite ? 'bg-white' : 'bg-slate-900 ring-1 ring-slate-600'}"></span>
        <span>${isWhite ? 'White' : 'Black'} to Move</span>
      `;
    }
  }

  updateOpeningBookUI() {
    if (!window.OpeningExplorer) return;
    const openingInfo = window.OpeningExplorer.identifyOpening(this.moveHistory);

    const nameEl = document.getElementById('opening-name-text');
    const ecoEl = document.getElementById('opening-eco-badge');
    const tipEl = document.getElementById('opening-tip-text');

    if (nameEl) nameEl.innerText = openingInfo.name;
    if (ecoEl) ecoEl.innerText = openingInfo.eco;
    if (tipEl) tipEl.innerText = openingInfo.tip;
  }

  updateMoveHistoryUI() {
    const list = document.getElementById('move-history-list');
    if (!list) return;

    let html = '';
    for (let i = 0; i < this.moveHistory.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      const wMove = this.moveHistory[i]?.san || '';
      const bMove = this.moveHistory[i + 1]?.san || '';

      html += `
        <div class="flex items-center text-xs py-1 px-2 hover:bg-slate-800/60 rounded">
          <span class="w-8 text-slate-400 font-mono">${moveNum}.</span>
          <span class="w-16 font-semibold text-slate-200 font-mono">${wMove}</span>
          <span class="w-16 font-semibold text-slate-300 font-mono">${bMove}</span>
        </div>
      `;
    }
    list.innerHTML = html || '<div class="text-xs text-slate-400 py-2 text-center">No moves played yet.</div>';
    list.scrollTop = list.scrollHeight;
  }

  updateCapturedUI() {
    const wCap = document.getElementById('captured-white');
    const bCap = document.getElementById('captured-black');

    if (wCap) {
      wCap.innerHTML = this.capturedPieces.w.map(p => `<span class="text-sm">♟</span>`).join('');
    }
    if (bCap) {
      bCap.innerHTML = this.capturedPieces.b.map(p => `<span class="text-sm text-slate-400">♟</span>`).join('');
    }
  }

  updateClockDisplay(whiteSecs, blackSecs) {
    const fmt = (s) => {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const wClock = document.getElementById('clock-white');
    const bClock = document.getElementById('clock-black');

    if (wClock) wClock.innerText = fmt(whiteSecs);
    if (bClock) bClock.innerText = fmt(blackSecs);
  }

  onRoomJoined(room, role) {
    this.mode = 'multiplayer';
    this.game.load(room.fen);
    this.moveHistory = room.history || [];

    this.switchTab('game');

    const codeBadge = document.getElementById('current-room-badge');
    if (codeBadge) codeBadge.innerText = room.id;

    const shareUrl = `${window.location.origin}/?room=${room.id}`;
    const shareInput = document.getElementById('room-share-url');
    if (shareInput) shareInput.value = shareUrl;

    const copyBtn = document.getElementById('btn-copy-link');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(shareUrl);
        alert("Invite link copied to clipboard!");
      };
    }

    this.updateRoomUI(room);
    this.updateBoardView();
    this.runAnalysis(false);
  }

  updateRoomUI(room) {
    const pWhite = document.getElementById('player-card-white');
    const pBlack = document.getElementById('player-card-black');

    if (pWhite && room.white_player) {
      pWhite.querySelector('.player-name').innerText = room.white_player.name;
    }
    if (pBlack && room.black_player) {
      pBlack.querySelector('.player-name').innerText = room.black_player.name;
    }
  }

  showDrawOfferModal(offeredBy) {
    if (confirm(`${offeredBy.toUpperCase()} has offered a draw. Do you accept?`)) {
      window.multiplayerClient.respondDraw(true);
    } else {
      window.multiplayerClient.respondDraw(false);
    }
  }

  onGameOver(msg) {
    this.gameActive = false;
    window.chessboardView.clearArrows();
    let text = "";
    if (msg.reason === 'checkmate') {
      text = `Checkmate! ${msg.winner === 'w' ? 'White' : 'Black'} wins!`;
      window.soundFX.playGameWin();
    } else if (msg.reason === 'timeout') {
      text = `Time out! ${msg.winner === 'w' ? 'White' : 'Black'} wins on time!`;
      window.soundFX.playGameWin();
    } else if (msg.reason === 'resignation') {
      text = `${msg.resigned_by.toUpperCase()} resigned. ${msg.winner === 'w' ? 'White' : 'Black'} wins!`;
      window.soundFX.playGameWin();
    } else {
      text = `Game drawn (${msg.reason}).`;
    }

    alert(text);
    window.voiceAgent.speak(text);
  }

  onRematchStarted(room, role) {
    this.game.reset();
    this.moveHistory = [];
    this.capturedPieces = { w: [], b: [] };
    this.gameActive = true;
    window.chessboardView.lastMove = null;
    window.chessboardView.flipped = (role === 'black');
    window.chessboardView.renderSquares();

    this.updateBoardView();
    this.runAnalysis(false);
    window.soundFX.playGameStart();
  }

  appendChatMessage(msg) {
    const chatBox = document.getElementById('chat-messages');
    if (!chatBox) return;

    const div = document.createElement('div');
    div.className = `text-xs py-1 px-2 rounded ${
      msg.is_coach 
        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
        : 'bg-slate-800/70 text-slate-200'
    }`;
    div.innerHTML = `<span class="font-bold text-sky-400">${msg.sender}:</span> ${msg.text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  handleGameEnd() {
    this.gameActive = false;
    if (this.game.in_checkmate()) {
      const winner = this.game.turn() === 'w' ? 'Black' : 'White';
      window.voiceAgent.speak(`Checkmate. ${winner} wins the game!`);
      if ((winner === 'White' && this.playerColor === 'w') || (winner === 'Black' && this.playerColor === 'b')) {
        window.soundFX.playGameWin();
      }
    } else if (this.game.in_draw()) {
      window.voiceAgent.speak("Game is a draw.");
    }
  }
}

function initApp() {
  if (!window.app) {
    window.app = new App();

    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('room');
    if (roomId && window.multiplayerClient) {
      setTimeout(() => {
        window.multiplayerClient.joinRoom(roomId, 'Online Challenger');
      }, 500);
    }
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
