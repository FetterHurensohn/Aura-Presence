/**
 * Supabase Client Wrapper
 * 
 * This file provides a Supabase client instance for optional features:
 * - Storage (file uploads, avatars, media)
 * - Realtime (live data subscriptions)
 * - Edge Functions (serverless functions)
 * 
 * IMPORTANT: This is NOT used for primary database operations!
 * Primary DB operations use Knex with DATABASE_URL for better migration control.
 * 
 * Security Notes:
 * - SUPABASE_SERVICE_KEY should NEVER be exposed in frontend code
 * - Only use service key for server-side operations requiring elevated permissions
 * - Use anon key for client-side operations (if needed in future frontend features)
 */

import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

let supabaseClient = null;

/**
 * Initialize Supabase client (lazy initialization)
 * @returns {import('@supabase/supabase-js').SupabaseClient|null}
 */
export function getSupabaseClient() {
  // Return null if Supabase credentials not configured
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    if (!supabaseClient) {
      logger.warn('Supabase client not initialized: SUPABASE_URL or SUPABASE_SERVICE_KEY missing');
      logger.info('Supabase features (Storage, Realtime) will be disabled');
    }
    return null;
  }

  // Lazy initialization
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });
    
    const keyType = process.env.SUPABASE_SERVICE_KEY ? 'service_role' : 'anon';
    logger.info(`✅ Supabase client initialized (${keyType} key)`);
  }

  return supabaseClient;
}

/**
 * Storage helper for file uploads
 * @param {string} bucket - Storage bucket name
 * @returns {Object|null} Storage bucket interface
 */
export function getStorage(bucket = 'avatars') {
  const client = getSupabaseClient();
  if (!client) return null;
  
  return client.storage.from(bucket);
}

/**
 * Realtime helper for subscribing to database changes
 * @param {string} channelName - Unique channel name
 * @returns {Object|null} Realtime channel interface
 */
export function createRealtimeChannel(channelName) {
  const client = getSupabaseClient();
  if (!client) return null;
  
  return client.channel(channelName);
}

/**
 * Check if Supabase features are available
 * @returns {boolean}
 */
export function isSupabaseAvailable() {
  return !!(SUPABASE_URL && SUPABASE_SERVICE_KEY);
}

// Default export for convenience
export default {
  getClient: getSupabaseClient,
  getStorage,
  createRealtimeChannel,
  isAvailable: isSupabaseAvailable
};

