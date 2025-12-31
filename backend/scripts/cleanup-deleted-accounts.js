#!/usr/bin/env node
/**
 * Cron-Job: Cleanup Deleted Accounts
 * Führt geplante Account-Löschungen aus (GDPR Art. 17)
 * 
 * Empfohlene Cron-Schedule: Täglich um 2 Uhr morgens
 * 0 2 * * * node backend/scripts/cleanup-deleted-accounts.js
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { executeScheduledDeletions } from '../src/services/gdprService.js';
import logger from '../src/utils/logger.js';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function main() {
  try {
    logger.info('=== GDPR Scheduled Deletions Cron Job Started ===');
    
    const result = await executeScheduledDeletions();
    
    logger.info(`=== GDPR Scheduled Deletions Cron Job Completed: ${result.deletedCount} accounts deleted ===`);
    
    process.exit(0);
    
  } catch (error) {
    logger.error('GDPR Scheduled Deletions Cron Job Failed:', error);
    process.exit(1);
  }
}

main();

