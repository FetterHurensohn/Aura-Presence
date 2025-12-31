/**
 * Socket.IO Authentication Middleware
 * 
 * Validiert JWT-Token bei Socket-Connection
 */

import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET muss in .env gesetzt sein!');
}

/**
 * Socket.IO Auth Middleware
 */
export function socketAuthMiddleware(socket, next) {
  try {
    // Token aus Query-Parameters oder Auth-Header holen
    const token = socket.handshake.auth?.token || 
                  socket.handshake.query?.token ||
                  socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      logger.warn('Socket connection without token', { socketId: socket.id });
      
      // Optional: Erlaube Anonymous Connections für Public-Rooms
      // Für Production sollte das disabled werden
      if (process.env.ALLOW_ANONYMOUS_SOCKETS === 'true') {
        socket.userId = null;
        socket.userName = 'Anonymous';
        return next();
      }
      
      return next(new Error('Authentication required'));
    }

    // Token verifizieren
    const decoded = jwt.verify(token, JWT_SECRET);

    // User-Info an Socket anhängen
    socket.userId = decoded.userId;
    socket.userEmail = decoded.email;
    socket.userName = decoded.email?.split('@')[0] || 'User';

    logger.debug('Socket authenticated', {
      socketId: socket.id,
      userId: socket.userId,
      email: socket.userEmail
    });

    next();

  } catch (error) {
    logger.error('Socket authentication failed', {
      socketId: socket.id,
      error: error.message
    });

    return next(new Error('Invalid authentication token'));
  }
}

export default socketAuthMiddleware;

