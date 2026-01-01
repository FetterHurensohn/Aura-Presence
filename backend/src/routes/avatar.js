/**
 * Avatar Upload Routes
 * Handles user avatar uploads via Supabase Storage
 */

import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.js';
import { 
  uploadAvatar, 
  deleteAvatar, 
  listUserAvatars,
  cleanupOldAvatars 
} from '../services/storageService.js';
import { sendSuccess, sendError, asyncHandler } from '../utils/responseHelpers.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF allowed.'));
    }
  }
});

/**
 * POST /api/avatar/upload
 * Upload user avatar
 */
router.post('/upload', authenticateToken, upload.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendError(res, 'No file uploaded', 400);
  }

  const userId = req.user.userId;
  const { buffer, mimetype, originalname } = req.file;

  const result = await uploadAvatar(userId, buffer, mimetype, originalname);

  if (!result.success) {
    return sendError(res, result.error, 400);
  }

  // Cleanup old avatars (keep only latest 5)
  await cleanupOldAvatars(userId);

  logger.info(`User ${userId} uploaded avatar: ${result.path}`);

  return sendSuccess(res, {
    message: 'Avatar uploaded successfully',
    avatar: {
      url: result.url,
      path: result.path,
      size: result.size,
      mimeType: result.mimeType
    }
  });
}));

/**
 * DELETE /api/avatar/:path
 * Delete user avatar
 */
router.delete('/:path(*)', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const filePath = req.params.path;

  // Verify the file belongs to the user
  if (!filePath.startsWith(`${userId}/`)) {
    return sendError(res, 'Unauthorized to delete this file', 403);
  }

  const result = await deleteAvatar(filePath);

  if (!result.success) {
    return sendError(res, result.error, 400);
  }

  logger.info(`User ${userId} deleted avatar: ${filePath}`);

  return sendSuccess(res, {
    message: 'Avatar deleted successfully'
  });
}));

/**
 * GET /api/avatar/list
 * List user avatars
 */
router.get('/list', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const avatars = await listUserAvatars(userId);

  return sendSuccess(res, {
    avatars: avatars.map(file => ({
      name: file.name,
      size: file.metadata?.size,
      createdAt: file.created_at,
      updatedAt: file.updated_at
    }))
  });
}));

/**
 * POST /api/avatar/cleanup
 * Cleanup old avatars (keep only latest 5)
 */
router.post('/cleanup', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const result = await cleanupOldAvatars(userId);

  if (!result.success) {
    return sendError(res, result.error, 400);
  }

  logger.info(`User ${userId} cleaned up avatars: ${result.deleted} deleted`);

  return sendSuccess(res, {
    message: 'Old avatars cleaned up',
    deleted: result.deleted
  });
}));

export default router;

