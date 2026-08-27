import http from 'http';
import path from 'path';
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// API Health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static assets
const publicPath = process.cwd();
app.use(express.static(publicPath));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Create HTTP Server
const server = http.createServer(app);

// Create WebSocket server attached to HTTP server
const wss = new WebSocketServer({ server, path: '/ws' });

// In-Memory Multi-Room Store
const rooms = new Map();

function generateRoomId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CHESS-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function sanitizeRoom(room) {
  if (!room) return null;
  return {
    id: room.id,
    status: room.status,
    mode: room.mode,
    time_minutes: room.time_minutes,
    turn: room.turn,
    fen: room.fen,
    history: room.history,
    white_player: room.white_player ? { name: room.white_player.name } : null,
    black_player: room.black_player ? { name: room.black_player.name } : null,
    white_time: room.white_time,
    black_time: room.black_time
  };
}

function broadcastToRoom(room, message, excludeWs = null) {
  const payload = JSON.stringify(message);
  const clients = [];

  if (room.white_player && room.white_player.ws) clients.push(room.white_player.ws);
  if (room.black_player && room.black_player.ws) clients.push(room.black_player.ws);
  if (room.spectators && room.spectators.length > 0) {
    room.spectators.forEach(s => {
      if (s.ws) clients.push(s.ws);
    });
  }

  for (const client of clients) {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      try {
        client.send(payload);
      } catch (err) {
        console.warn('Failed to send to client:', err);
      }
    }
  }
}

wss.on('connection', (ws) => {
  let currentRoomId = null;
  let currentPlayerRole = null;
  let currentName = 'Anonymous';

  const send = (msg) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  };

  ws.on('message', (raw) => {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }

    const type = data.type;

    if (type === 'create_room') {
      const name = (data.name || 'Player 1').trim();
      const minutes = parseInt(data.time_minutes) || 5;
      const increment = parseInt(data.increment) || 0;
      const preferredColor = data.color || 'white';
      currentName = name;

      const roomId = generateRoomId();
      const role = preferredColor === 'black' ? 'black' : 'white';
      currentRoomId = roomId;
      currentPlayerRole = role;

      const newRoom = {
        id: roomId,
        status: 'waiting',
        mode: minutes === 0 ? 'casual' : 'timed',
        time_minutes: minutes,
        increment: increment,
        turn: 'w',
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        history: [],
        white_player: role === 'white' ? { name, ws } : null,
        black_player: role === 'black' ? { name, ws } : null,
        spectators: [],
        white_time: minutes * 60,
        black_time: minutes * 60,
        createdAt: Date.now()
      };

      rooms.set(roomId, newRoom);

      send({
        type: 'room_created',
        room_id: roomId,
        role: role,
        room: sanitizeRoom(newRoom)
      });
    }

    else if (type === 'join_room') {
      const roomId = (data.room_id || '').trim().toUpperCase();
      const name = (data.name || 'Player 2').trim();
      currentName = name;

      const room = rooms.get(roomId);
      if (!room) {
        send({ type: 'error', message: `Room "${roomId}" not found.` });
        return;
      }

      currentRoomId = roomId;

      if (!room.white_player) {
        room.white_player = { name, ws };
        currentPlayerRole = 'white';
        room.status = 'active';
      } else if (!room.black_player) {
        room.black_player = { name, ws };
        currentPlayerRole = 'black';
        room.status = 'active';
      } else {
        currentPlayerRole = 'spectator';
        room.spectators.push({ name, ws });
      }

      send({
        type: 'room_joined',
        room_id: roomId,
        role: currentPlayerRole,
        room: sanitizeRoom(room)
      });

      broadcastToRoom(room, {
        type: 'room_updated',
        room: sanitizeRoom(room)
      }, ws);
    }

    else if (type === 'make_move') {
      if (!currentRoomId) return;
      const room = rooms.get(currentRoomId);
      if (!room) return;

      if (data.fen) room.fen = data.fen;
      if (data.move) room.history.push(data.move);
      room.turn = room.turn === 'w' ? 'b' : 'w';

      broadcastToRoom(room, {
        type: 'move_made',
        room: sanitizeRoom(room),
        move: data.move,
        san: data.san,
        fen: data.fen,
        is_check: data.is_check,
        is_checkmate: data.is_checkmate,
        is_draw: data.is_draw
      });

      if (data.is_checkmate) {
        room.status = 'ended';
        const winner = currentPlayerRole === 'white' ? 'w' : 'b';
        broadcastToRoom(room, {
          type: 'game_over',
          room: sanitizeRoom(room),
          reason: 'checkmate',
          winner: winner
        });
      } else if (data.is_draw) {
        room.status = 'ended';
        broadcastToRoom(room, {
          type: 'game_over',
          room: sanitizeRoom(room),
          reason: 'draw'
        });
      }
    }

    else if (type === 'resign') {
      if (!currentRoomId) return;
      const room = rooms.get(currentRoomId);
      if (!room) return;

      room.status = 'ended';
      const winner = currentPlayerRole === 'white' ? 'b' : 'w';
      broadcastToRoom(room, {
        type: 'game_over',
        room: sanitizeRoom(room),
        reason: 'resignation',
        winner: winner,
        resigned_by: currentPlayerRole || 'opponent'
      });
    }

    else if (type === 'offer_draw') {
      if (!currentRoomId) return;
      const room = rooms.get(currentRoomId);
      if (!room) return;

      const opponentWs = currentPlayerRole === 'white' ? room.black_player?.ws : room.white_player?.ws;
      if (opponentWs && opponentWs.readyState === WebSocket.OPEN) {
        opponentWs.send(JSON.stringify({
          type: 'draw_offered',
          offered_by: currentPlayerRole || 'Opponent'
        }));
      }
    }

    else if (type === 'respond_draw') {
      if (!currentRoomId) return;
      const room = rooms.get(currentRoomId);
      if (!room) return;

      if (data.accept) {
        room.status = 'ended';
        broadcastToRoom(room, {
          type: 'game_over',
          room: sanitizeRoom(room),
          reason: 'agreement'
        });
      } else {
        const opponentWs = currentPlayerRole === 'white' ? room.black_player?.ws : room.white_player?.ws;
        if (opponentWs && opponentWs.readyState === WebSocket.OPEN) {
          opponentWs.send(JSON.stringify({ type: 'draw_declined' }));
        }
      }
    }

    else if (type === 'rematch_request') {
      if (!currentRoomId) return;
      const room = rooms.get(currentRoomId);
      if (!room) return;

      // Swap players
      const temp = room.white_player;
      room.white_player = room.black_player;
      room.black_player = temp;

      room.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      room.history = [];
      room.turn = 'w';
      room.status = 'active';
      room.white_time = room.time_minutes * 60;
      room.black_time = room.time_minutes * 60;

      if (room.white_player?.ws && room.white_player.ws.readyState === WebSocket.OPEN) {
        room.white_player.ws.send(JSON.stringify({
          type: 'rematch_started',
          role: 'white',
          room: sanitizeRoom(room)
        }));
      }

      if (room.black_player?.ws && room.black_player.ws.readyState === WebSocket.OPEN) {
        room.black_player.ws.send(JSON.stringify({
          type: 'rematch_started',
          role: 'black',
          room: sanitizeRoom(room)
        }));
      }
    }

    else if (type === 'chat_message') {
      if (!currentRoomId) return;
      const room = rooms.get(currentRoomId);
      if (!room) return;

      broadcastToRoom(room, {
        type: 'chat_broadcast',
        sender: currentName,
        text: data.text || '',
        is_coach: !!data.is_coach
      });
    }
  });

  ws.on('close', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    if (room.white_player?.ws === ws) {
      room.white_player = null;
    } else if (room.black_player?.ws === ws) {
      room.black_player = null;
    } else if (room.spectators) {
      room.spectators = room.spectators.filter(s => s.ws !== ws);
    }

    if (!room.white_player && !room.black_player && (!room.spectators || room.spectators.length === 0)) {
      rooms.delete(currentRoomId);
    } else {
      broadcastToRoom(room, {
        type: 'player_disconnected',
        room: sanitizeRoom(room)
      });
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Grandmaster AI Chess server listening on http://${HOST}:${PORT}`);
});
