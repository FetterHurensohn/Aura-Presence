/**
 * Storage Service (Supabase Storage)
 * Handles file uploads for user avatars and media
 * 
 * Features:
 * - Avatar uploads with automatic resizing
 * - File type validation
 * - Size limits
 * - Automatic cleanup of old files
 */

import { getStorage, isSupabaseAvailable } from '../database/supabaseClient.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';
import path from 'path';

const AVATAR_BUCKET = 'avatars';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Upload user avatar
 * @param {number} userId - User ID
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimeType - MIME type
 * @param {string} originalName - Original filename
 * @returns {Promise<Object>} Upload result with public URL
 */
export async function uploadAvatar(userId, fileBuffer, mimeType, originalName) {
  if (!isSupabaseAvailable()) {
    logger.warn('Supabase Storage not available - avatar upload skipped');
    return { success: false, error: 'Storage service not configured' };
  }

  // Validate file size
  if (fileBuffer.length > MAX_FILE_SIZE) {
    return { 
      success: false, 
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` 
    };
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(mimeType)) {
    return { 
      success: false, 
      error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' 
    };
  }

  const storage = getStorage(AVATAR_BUCKET);
  if (!storage) {
    return { success: false, error: 'Storage initialization failed' };
  }

  try {
    // Generate unique filename
    const ext = path.extname(originalName);
    const hash = crypto.randomBytes(8).toString('hex');
    const filename = `${userId}/${Date.now()}-${hash}${ext}`;

    // Upload file
    const { data, error } = await storage.upload(filename, fileBuffer, {
      contentType: mimeType,
      cacheControl: '3600',
      upsert: false
    });

    if (error) {
      logger.error('Avatar upload failed:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = storage.getPublicUrl(data.path);

    logger.info(`Avatar uploaded for user ${userId}: ${data.path}`);

    return {
      success: true,
      path: data.path,
      url: publicUrl,
      size: fileBuffer.length,
      mimeType
    };
  } catch (error) {
    logger.error('Avatar upload error:', error);
    return { success: false, error: 'Upload failed' };
  }
}

/**
 * Delete user avatar
 * @param {string} filePath - File path in storage
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteAvatar(filePath) {
  if (!isSupabaseAvailable()) {
    return { success: false, error: 'Storage service not configured' };
  }

  const storage = getStorage(AVATAR_BUCKET);
  if (!storage) {
    return { success: false, error: 'Storage initialization failed' };
  }

  try {
    const { error } = await storage.remove([filePath]);

    if (error) {
      logger.error('Avatar deletion failed:', error);
      return { success: false, error: error.message };
    }

    logger.info(`Avatar deleted: ${filePath}`);
    return { success: true };
  } catch (error) {
    logger.error('Avatar deletion error:', error);
    return { success: false, error: 'Deletion failed' };
  }
}

/**
 * List user avatars
 * @param {number} userId - User ID
 * @returns {Promise<Array>} List of avatar files
 */
export async function listUserAvatars(userId) {
  if (!isSupabaseAvailable()) {
    return [];
  }

  const storage = getStorage(AVATAR_BUCKET);
  if (!storage) {
    return [];
  }

  try {
    const { data, error } = await storage.list(`${userId}/`, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    });

    if (error) {
      logger.error('List avatars failed:', error);
      return [];
    }

    return data;
  } catch (error) {
    logger.error('List avatars error:', error);
    return [];
  }
}

/**
 * Get avatar download URL
 * @param {string} filePath - File path in storage
 * @param {number} expiresIn - URL expiry in seconds (default: 3600)
 * @returns {Promise<Object>} Signed URL result
 */
export async function getAvatarDownloadUrl(filePath, expiresIn = 3600) {
  if (!isSupabaseAvailable()) {
    return { success: false, error: 'Storage service not configured' };
  }

  const storage = getStorage(AVATAR_BUCKET);
  if (!storage) {
    return { success: false, error: 'Storage initialization failed' };
  }

  try {
    const { data, error } = await storage.createSignedUrl(filePath, expiresIn);

    if (error) {
      logger.error('Get signed URL failed:', error);
      return { success: false, error: error.message };
    }

    return { success: true, url: data.signedUrl };
  } catch (error) {
    logger.error('Get signed URL error:', error);
    return { success: false, error: 'URL generation failed' };
  }
}

/**
 * Cleanup old avatars for user (keep only latest 5)
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Cleanup result
 */
export async function cleanupOldAvatars(userId) {
  if (!isSupabaseAvailable()) {
    return { success: false, error: 'Storage service not configured' };
  }

  try {
    const avatars = await listUserAvatars(userId);
    
    // Keep latest 5, delete rest
    const toDelete = avatars.slice(5);
    
    if (toDelete.length === 0) {
      return { success: true, deleted: 0 };
    }

    const storage = getStorage(AVATAR_BUCKET);
    const filePaths = toDelete.map(file => `${userId}/${file.name}`);
    
    const { error } = await storage.remove(filePaths);

    if (error) {
      logger.error('Cleanup avatars failed:', error);
      return { success: false, error: error.message };
    }

    logger.info(`Cleaned up ${toDelete.length} old avatars for user ${userId}`);
    return { success: true, deleted: toDelete.length };
  } catch (error) {
    logger.error('Cleanup avatars error:', error);
    return { success: false, error: 'Cleanup failed' };
  }
}

export default {
  uploadAvatar,
  deleteAvatar,
  listUserAvatars,
  getAvatarDownloadUrl,
  cleanupOldAvatars
};

