/**
 * Signaling Service - WebRTC Signaling mit Socket.IO
 * 
 * Verwaltet Rooms, User-Connections und routet WebRTC-Signaling-Messages
 */

import logger from '../utils/logger.js';

class SignalingService {
  constructor() {
    // Room-Management: roomId -> Set<socketId>
    this.rooms = new Map();
    
    // User-Tracking: socketId -> { userId, roomId, userName }
    this.connections = new Map();
  }

  /**
   * Initialisiere Socket.IO Server
   */
  initialize(io) {
    this.io = io;

    io.on('connection', (socket) => {
      logger.info('Socket connected', { socketId: socket.id, userId: socket.userId });

      // Join Room
      socket.on('join-room', (roomId) => {
        this.handleJoinRoom(socket, roomId);
      });

      // Leave Room
      socket.on('leave-room', () => {
        this.handleLeaveRoom(socket);
      });

      // WebRTC Signaling Events
      socket.on('offer', (data) => {
        this.handleOffer(socket, data);
      });

      socket.on('answer', (data) => {
        this.handleAnswer(socket, data);
      });

      socket.on('ice-candidate', (data) => {
        this.handleIceCandidate(socket, data);
      });

      // Disconnect
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });

    logger.info('✓ Signaling Service initialized');
  }

  /**
   * Handle Join Room
   */
  handleJoinRoom(socket, roomId) {
    // Validiere Room ID
    if (!roomId || typeof roomId !== 'string') {
      socket.emit('error', { message: 'Invalid room ID' });
      return;
    }

    // Prüfe ob User bereits in einem Room ist
    if (this.connections.has(socket.id)) {
      const existingConnection = this.connections.get(socket.id);
      if (existingConnection.roomId === roomId) {
        logger.warn('User already in room', { socketId: socket.id, roomId });
        return;
      }
      // Leave old room first
      this.handleLeaveRoom(socket);
    }

    // Room erstellen falls nicht vorhanden
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    const room = this.rooms.get(roomId);

    // Limitierung: Max 2 User pro Room (für 1-to-1 WebRTC)
    if (room.size >= 2) {
      socket.emit('error', { message: 'Room is full' });
      logger.warn('Room is full', { roomId, size: room.size });
      return;
    }

    // User zum Room hinzufügen
    room.add(socket.id);
    socket.join(roomId);

    // Connection-Info speichern
    this.connections.set(socket.id, {
      userId: socket.userId, // Aus Socket-Auth-Middleware
      roomId: roomId,
      userName: socket.userName || 'Anonymous'
    });

    logger.info('User joined room', {
      socketId: socket.id,
      userId: socket.userId,
      roomId,
      roomSize: room.size
    });

    // Benachrichtige andere User im Room
    socket.to(roomId).emit('user-joined', {
      userId: socket.userId,
      socketId: socket.id,
      userName: socket.userName || 'Anonymous'
    });

    // Sende aktuelle Room-Info an joiner
    const roomUsers = Array.from(room)
      .filter(id => id !== socket.id)
      .map(id => {
        const conn = this.connections.get(id);
        return {
          socketId: id,
          userId: conn?.userId,
          userName: conn?.userName
        };
      });

    socket.emit('room-joined', {
      roomId,
      users: roomUsers
    });
  }

  /**
   * Handle Leave Room
   */
  handleLeaveRoom(socket) {
    const connection = this.connections.get(socket.id);
    
    if (!connection) {
      return;
    }

    const { roomId } = connection;

    // Entferne User aus Room
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(socket.id);

      // Lösche leere Rooms
      if (room.size === 0) {
        this.rooms.delete(roomId);
        logger.info('Room deleted', { roomId });
      } else {
        // Benachrichtige verbleibende User
        socket.to(roomId).emit('user-left', {
          userId: socket.userId,
          socketId: socket.id
        });
      }
    }

    socket.leave(roomId);
    this.connections.delete(socket.id);

    logger.info('User left room', {
      socketId: socket.id,
      userId: socket.userId,
      roomId
    });

    socket.emit('room-left', { roomId });
  }

  /**
   * Handle WebRTC Offer
   */
  handleOffer(socket, data) {
    const { to, offer } = data;

    if (!to || !offer) {
      socket.emit('error', { message: 'Invalid offer data' });
      return;
    }

    logger.debug('Routing offer', {
      from: socket.id,
      to
    });

    // Route Offer zu Ziel-Socket
    socket.to(to).emit('offer', {
      from: socket.id,
      offer
    });
  }

  /**
   * Handle WebRTC Answer
   */
  handleAnswer(socket, data) {
    const { to, answer } = data;

    if (!to || !answer) {
      socket.emit('error', { message: 'Invalid answer data' });
      return;
    }

    logger.debug('Routing answer', {
      from: socket.id,
      to
    });

    // Route Answer zu Ziel-Socket
    socket.to(to).emit('answer', {
      from: socket.id,
      answer
    });
  }

  /**
   * Handle ICE Candidate
   */
  handleIceCandidate(socket, data) {
    const { to, candidate } = data;

    if (!to || !candidate) {
      socket.emit('error', { message: 'Invalid ICE candidate data' });
      return;
    }

    logger.debug('Routing ICE candidate', {
      from: socket.id,
      to
    });

    // Route ICE Candidate zu Ziel-Socket
    socket.to(to).emit('ice-candidate', {
      from: socket.id,
      candidate
    });
  }

  /**
   * Handle Disconnect
   */
  handleDisconnect(socket) {
    logger.info('Socket disconnected', {
      socketId: socket.id,
      userId: socket.userId
    });

    // Leave Room automatisch
    this.handleLeaveRoom(socket);
  }

  /**
   * Get Room Info
   */
  getRoomInfo(roomId) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return null;
    }

    const users = Array.from(room).map(socketId => {
      const conn = this.connections.get(socketId);
      return {
        socketId,
        userId: conn?.userId,
        userName: conn?.userName
      };
    });

    return {
      roomId,
      userCount: room.size,
      users
    };
  }

  /**
   * Get Stats
   */
  getStats() {
    return {
      totalRooms: this.rooms.size,
      totalConnections: this.connections.size,
      rooms: Array.from(this.rooms.entries()).map(([roomId, sockets]) => ({
        roomId,
        userCount: sockets.size
      }))
    };
  }
}

// Singleton Export
const signalingService = new SignalingService();

export default signalingService;

