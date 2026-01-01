/**
 * Realtime Service (Supabase Realtime)
 * Handles real-time subscriptions for live updates
 * 
 * Features:
 * - User presence tracking
 * - Live session updates
 * - Analysis result notifications
 * - Real-time feedback updates
 */

import { createRealtimeChannel, isSupabaseAvailable } from '../database/supabaseClient.js';
import logger from '../utils/logger.js';

class RealtimeService {
  constructor() {
    this.channels = new Map();
    this.isAvailable = isSupabaseAvailable();
  }

  /**
   * Subscribe to user-specific updates
   * @param {number} userId - User ID
   * @param {Function} callback - Callback for updates
   * @returns {Object} Channel object or null
   */
  subscribeToUserUpdates(userId, callback) {
    if (!this.isAvailable) {
      logger.warn('Supabase Realtime not available');
      return null;
    }

    const channelName = `user-${userId}`;
    
    // Check if already subscribed
    if (this.channels.has(channelName)) {
      logger.info(`Already subscribed to ${channelName}`);
      return this.channels.get(channelName);
    }

    const channel = createRealtimeChannel(channelName);
    if (!channel) return null;

    // Subscribe to database changes for user's sessions
    channel
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'sessions',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          logger.info(`Session update for user ${userId}:`, payload.eventType);
          callback({
            type: 'session',
            event: payload.eventType,
            data: payload.new || payload.old
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info(`User ${userId} subscribed to realtime updates`);
        }
      });

    this.channels.set(channelName, channel);
    return channel;
  }

  /**
   * Subscribe to analysis feedback updates
   * @param {string} sessionId - Session ID
   * @param {Function} callback - Callback for feedback updates
   * @returns {Object} Channel object or null
   */
  subscribeToFeedback(sessionId, callback) {
    if (!this.isAvailable) {
      return null;
    }

    const channelName = `feedback-${sessionId}`;
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName);
    }

    const channel = createRealtimeChannel(channelName);
    if (!channel) return null;

    channel
      .on(
        'broadcast',
        { event: 'feedback' },
        (payload) => {
          logger.info(`Feedback update for session ${sessionId}`);
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  /**
   * Broadcast feedback to subscribers
   * @param {string} sessionId - Session ID
   * @param {Object} feedbackData - Feedback data
   */
  async broadcastFeedback(sessionId, feedbackData) {
    if (!this.isAvailable) {
      return;
    }

    const channelName = `feedback-${sessionId}`;
    const channel = this.channels.get(channelName);

    if (!channel) {
      logger.warn(`No channel found for session ${sessionId}`);
      return;
    }

    await channel.send({
      type: 'broadcast',
      event: 'feedback',
      payload: feedbackData
    });

    logger.info(`Broadcasted feedback for session ${sessionId}`);
  }

  /**
   * Subscribe to presence (who's online)
   * @param {string} roomId - Room ID
   * @param {Object} userState - User state (id, name, etc.)
   * @param {Function} callback - Callback for presence updates
   * @returns {Object} Channel object or null
   */
  subscribeToPresence(roomId, userState, callback) {
    if (!this.isAvailable) {
      return null;
    }

    const channelName = `presence-${roomId}`;
    
    const channel = createRealtimeChannel(channelName);
    if (!channel) return null;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat();
        callback({ type: 'sync', users });
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        callback({ type: 'join', users: newPresences });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        callback({ type: 'leave', users: leftPresences });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(userState);
          logger.info(`User ${userState.id} joined room ${roomId}`);
        }
      });

    this.channels.set(channelName, channel);
    return channel;
  }

  /**
   * Unsubscribe from a channel
   * @param {string} channelName - Channel name
   */
  async unsubscribe(channelName) {
    const channel = this.channels.get(channelName);
    if (channel) {
      await channel.unsubscribe();
      this.channels.delete(channelName);
      logger.info(`Unsubscribed from ${channelName}`);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  async unsubscribeAll() {
    for (const [name, channel] of this.channels.entries()) {
      await channel.unsubscribe();
      logger.info(`Unsubscribed from ${name}`);
    }
    this.channels.clear();
  }

  /**
   * Get active channels
   * @returns {Array} List of active channel names
   */
  getActiveChannels() {
    return Array.from(this.channels.keys());
  }
}

// Singleton instance
const realtimeService = new RealtimeService();

export default realtimeService;
export { RealtimeService };

