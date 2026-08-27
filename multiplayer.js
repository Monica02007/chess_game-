// Real-time Online Multiplayer Client Controller (WebSocket)

class MultiplayerClient {
  constructor() {
    this.ws = null;
    this.roomId = null;
    this.myRole = 'spectator'; // 'white' | 'black' | 'spectator'
    this.roomData = null;
    this.connected = false;
    this.timerInterval = null;
    this.whiteTime = 300;
    this.blackTime = 300;
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.connected = true;
      console.log("WebSocket connected to:", wsUrl);
      this.updateConnectionStatus(true);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = json_safe_parse(event.data);
        if (data) this.handleMessage(data);
      } catch (e) {
        console.error("Failed to parse WS msg:", e);
      }
    };

    this.ws.onclose = () => {
      this.connected = false;
      this.updateConnectionStatus(false);
      // Auto-reconnect after 3s
      setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = (err) => {
      console.warn("WebSocket error:", err);
    };

    this.startClockTicking();
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  createRoom(name, minutes, increment, color) {
    this.send({
      type: 'create_room',
      name: name,
      time_minutes: minutes,
      increment: increment,
      color: color
    });
  }

  joinRoom(roomId, name) {
    this.send({
      type: 'join_room',
      room_id: roomId,
      name: name
    });
  }

  makeMove(moveObj, san, fen, isCheck, isCheckmate, isDraw) {
    this.send({
      type: 'make_move',
      move: moveObj,
      san: san,
      fen: fen,
      is_check: isCheck,
      is_checkmate: isCheckmate,
      is_draw: isDraw
    });
  }

  resign() {
    this.send({ type: 'resign' });
  }

  offerDraw() {
    this.send({ type: 'offer_draw' });
  }

  respondDraw(accept) {
    this.send({ type: 'respond_draw', accept: accept });
  }

  requestRematch() {
    this.send({ type: 'rematch_request' });
  }

  sendChat(text, isCoach = false) {
    this.send({
      type: 'chat_message',
      text: text,
      is_coach: isCoach
    });
  }

  handleMessage(msg) {
    console.log("WS Event Received:", msg.type, msg);

    if (msg.type === 'room_created' || msg.type === 'room_joined') {
      this.roomId = msg.room_id;
      this.myRole = msg.role;
      this.roomData = msg.room;

      // Flip board if player is black
      if (this.myRole === 'black') {
        window.chessboardView.flipped = true;
        window.chessboardView.renderSquares();
      } else {
        window.chessboardView.flipped = false;
        window.chessboardView.renderSquares();
      }

      window.app.onRoomJoined(this.roomData, this.myRole);
      window.soundFX.playGameStart();
    }

    else if (msg.type === 'room_updated') {
      this.roomData = msg.room;
      window.app.updateRoomUI(this.roomData);
    }

    else if (msg.type === 'move_made') {
      this.roomData = msg.room;
      window.app.onRemoteMove(msg);
    }

    else if (msg.type === 'game_over') {
      this.roomData = msg.room;
      window.app.onGameOver(msg);
    }

    else if (msg.type === 'draw_offered') {
      window.app.showDrawOfferModal(msg.offered_by);
    }

    else if (msg.type === 'draw_declined') {
      alert("Opponent declined the draw offer.");
    }

    else if (msg.type === 'rematch_started') {
      this.myRole = msg.role;
      this.roomData = msg.room;
      window.app.onRematchStarted(this.roomData, this.myRole);
    }

    else if (msg.type === 'chat_broadcast') {
      window.app.appendChatMessage(msg);
    }

    else if (msg.type === 'player_disconnected') {
      this.roomData = msg.room;
      window.app.updateRoomUI(this.roomData);
    }

    else if (msg.type === 'error') {
      alert(msg.message);
    }
  }

  startClockTicking() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.roomData && this.roomData.status === 'active' && this.roomData.mode !== 'casual') {
        const turn = this.roomData.turn;
        if (turn === 'w' && this.roomData.white_player) {
          this.whiteTime = Math.max(0, this.whiteTime - 1);
        } else if (turn === 'b' && this.roomData.black_player) {
          this.blackTime = Math.max(0, this.blackTime - 1);
        }
        window.app.updateClockDisplay(this.whiteTime, this.blackTime);
      }
    }, 1000);
  }

  updateConnectionStatus(isConnected) {
    const dot = document.getElementById('ws-status-dot');
    const text = document.getElementById('ws-status-text');
    if (dot && text) {
      if (isConnected) {
        dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500';
        text.innerText = 'Connected';
      } else {
        dot.className = 'w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse';
        text.innerText = 'Connecting...';
      }
    }
  }
}

function json_safe_parse(str) {
  try { return JSON.parse(str); } catch { return null; }
}

window.multiplayerClient = new MultiplayerClient();
