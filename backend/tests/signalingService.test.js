/**
 * Tests für WebRTC Signaling Service
 */

import signalingService from '../src/services/signalingService.js';

describe('Signaling Service', () => {
  
  let mockSocket1, mockSocket2;
  let mockIo;
  
  beforeEach(() => {
    // Mock Socket.IO
    mockSocket1 = {
      id: 'socket1',
      userId: 'user1',
      userName: 'User 1',
      join: jest.fn(),
      leave: jest.fn(),
      to: jest.fn(() => mockSocket1),
      emit: jest.fn(),
      on: jest.fn()
    };
    
    mockSocket2 = {
      id: 'socket2',
      userId: 'user2',
      userName: 'User 2',
      join: jest.fn(),
      leave: jest.fn(),
      to: jest.fn(() => mockSocket2),
      emit: jest.fn(),
      on: jest.fn()
    };
    
    mockIo = {
      on: jest.fn()
    };
    
    // Reset SignalingService state
    signalingService.rooms.clear();
    signalingService.connections.clear();
  });
  
  test('sollte Room erstellen und User joinen lassen', () => {
    signalingService.handleJoinRoom(mockSocket1, 'room1');
    
    expect(mockSocket1.join).toHaveBeenCalledWith('room1');
    expect(signalingService.rooms.has('room1')).toBe(true);
    expect(signalingService.rooms.get('room1').has('socket1')).toBe(true);
    expect(mockSocket1.emit).toHaveBeenCalledWith(
      'room-joined',
      expect.objectContaining({ roomId: 'room1' })
    );
  });
  
  test('sollte zweiten User zum Room hinzufügen', () => {
    signalingService.handleJoinRoom(mockSocket1, 'room1');
    signalingService.handleJoinRoom(mockSocket2, 'room1');
    
    const room = signalingService.rooms.get('room1');
    expect(room.size).toBe(2);
    expect(room.has('socket1')).toBe(true);
    expect(room.has('socket2')).toBe(true);
  });
  
  test('sollte Room voll ablehnen (max 2 User)', () => {
    const mockSocket3 = { ...mockSocket1, id: 'socket3', userId: 'user3' };
    
    signalingService.handleJoinRoom(mockSocket1, 'room1');
    signalingService.handleJoinRoom(mockSocket2, 'room1');
    signalingService.handleJoinRoom(mockSocket3, 'room1');
    
    const room = signalingService.rooms.get('room1');
    expect(room.size).toBe(2); // Nur 2 User
    expect(mockSocket3.emit).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({ message: 'Room is full' })
    );
  });
  
  test('sollte User aus Room entfernen', () => {
    signalingService.handleJoinRoom(mockSocket1, 'room1');
    signalingService.handleLeaveRoom(mockSocket1);
    
    expect(mockSocket1.leave).toHaveBeenCalledWith('room1');
    expect(signalingService.connections.has('socket1')).toBe(false);
  });
  
  test('sollte leeren Room löschen', () => {
    signalingService.handleJoinRoom(mockSocket1, 'room1');
    signalingService.handleLeaveRoom(mockSocket1);
    
    expect(signalingService.rooms.has('room1')).toBe(false);
  });
  
  test('sollte Offer routen', () => {
    const offerData = {
      to: 'socket2',
      offer: { type: 'offer', sdp: 'mock-sdp' }
    };
    
    signalingService.handleOffer(mockSocket1, offerData);
    
    expect(mockSocket1.to).toHaveBeenCalledWith('socket2');
    expect(mockSocket1.emit).toHaveBeenCalledWith(
      'offer',
      expect.objectContaining({
        from: 'socket1',
        offer: offerData.offer
      })
    );
  });
  
  test('sollte Answer routen', () => {
    const answerData = {
      to: 'socket1',
      answer: { type: 'answer', sdp: 'mock-sdp' }
    };
    
    signalingService.handleAnswer(mockSocket2, answerData);
    
    expect(mockSocket2.to).toHaveBeenCalledWith('socket1');
    expect(mockSocket2.emit).toHaveBeenCalledWith(
      'answer',
      expect.objectContaining({
        from: 'socket2',
        answer: answerData.answer
      })
    );
  });
  
  test('sollte ICE Candidate routen', () => {
    const candidateData = {
      to: 'socket2',
      candidate: { candidate: 'mock-candidate' }
    };
    
    signalingService.handleIceCandidate(mockSocket1, candidateData);
    
    expect(mockSocket1.to).toHaveBeenCalledWith('socket2');
    expect(mockSocket1.emit).toHaveBeenCalledWith(
      'ice-candidate',
      expect.objectContaining({
        from: 'socket1',
        candidate: candidateData.candidate
      })
    );
  });
  
  test('sollte disconnect behandeln', () => {
    signalingService.handleJoinRoom(mockSocket1, 'room1');
    signalingService.handleDisconnect(mockSocket1);
    
    expect(signalingService.connections.has('socket1')).toBe(false);
    expect(signalingService.rooms.has('room1')).toBe(false);
  });
  
  test('sollte Room-Info liefern', () => {
    signalingService.handleJoinRoom(mockSocket1, 'room1');
    signalingService.handleJoinRoom(mockSocket2, 'room1');
    
    const roomInfo = signalingService.getRoomInfo('room1');
    
    expect(roomInfo).toBeDefined();
    expect(roomInfo.roomId).toBe('room1');
    expect(roomInfo.userCount).toBe(2);
    expect(roomInfo.users).toHaveLength(2);
  });
  
  test('sollte Stats liefern', () => {
    signalingService.handleJoinRoom(mockSocket1, 'room1');
    signalingService.handleJoinRoom(mockSocket2, 'room2');
    
    const stats = signalingService.getStats();
    
    expect(stats.totalRooms).toBe(2);
    expect(stats.totalConnections).toBe(2);
    expect(stats.rooms).toHaveLength(2);
  });
  
  test('sollte ungültige Room-ID ablehnen', () => {
    signalingService.handleJoinRoom(mockSocket1, null);
    
    expect(mockSocket1.emit).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({ message: 'Invalid room ID' })
    );
  });
  
  test('sollte ungültige Offer-Daten ablehnen', () => {
    signalingService.handleOffer(mockSocket1, { to: 'socket2' }); // Kein offer
    
    expect(mockSocket1.emit).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({ message: 'Invalid offer data' })
    );
  });
});

