/**
 * Supabase Client Tests
 * Tests for the Supabase wrapper client
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        download: jest.fn(),
        list: jest.fn()
      }))
    },
    channel: jest.fn(() => ({
      on: jest.fn(),
      subscribe: jest.fn()
    }))
  }))
}));

describe('Supabase Client', () => {
  let supabaseModule;

  beforeEach(async () => {
    // Reset environment variables
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-key';
    
    // Clear module cache
    jest.resetModules();
    
    // Import fresh module
    supabaseModule = await import('../../src/database/supabaseClient.js');
  });

  describe('getSupabaseClient', () => {
    it('should return null when credentials are missing', async () => {
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_KEY;
      
      jest.resetModules();
      const module = await import('../../src/database/supabaseClient.js');
      
      const client = module.getSupabaseClient();
      expect(client).toBeNull();
    });

    it('should initialize client with valid credentials', () => {
      const client = supabaseModule.getSupabaseClient();
      expect(client).toBeDefined();
      expect(client).not.toBeNull();
    });

    it('should return same instance on subsequent calls (singleton)', () => {
      const client1 = supabaseModule.getSupabaseClient();
      const client2 = supabaseModule.getSupabaseClient();
      expect(client1).toBe(client2);
    });
  });

  describe('getStorage', () => {
    it('should return null when client is not available', async () => {
      delete process.env.SUPABASE_URL;
      jest.resetModules();
      const module = await import('../../src/database/supabaseClient.js');
      
      const storage = module.getStorage('avatars');
      expect(storage).toBeNull();
    });

    it('should return storage interface for valid bucket', () => {
      const storage = supabaseModule.getStorage('avatars');
      expect(storage).toBeDefined();
    });
  });

  describe('createRealtimeChannel', () => {
    it('should return null when client is not available', async () => {
      delete process.env.SUPABASE_URL;
      jest.resetModules();
      const module = await import('../../src/database/supabaseClient.js');
      
      const channel = module.createRealtimeChannel('test-channel');
      expect(channel).toBeNull();
    });

    it('should create channel with valid name', () => {
      const channel = supabaseModule.createRealtimeChannel('test-channel');
      expect(channel).toBeDefined();
    });
  });

  describe('isSupabaseAvailable', () => {
    it('should return false when credentials are missing', async () => {
      delete process.env.SUPABASE_URL;
      jest.resetModules();
      const module = await import('../../src/database/supabaseClient.js');
      
      const available = module.isSupabaseAvailable();
      expect(available).toBe(false);
    });

    it('should return true when credentials are present', () => {
      const available = supabaseModule.isSupabaseAvailable();
      expect(available).toBe(true);
    });
  });
});

