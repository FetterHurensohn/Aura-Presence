# Database Backups

This directory contains PostgreSQL database backups.

## Automatic Backups

Backups are created automatically using the `backup-db.sh` script.

### Setup (Linux/macOS)

1. Make the script executable:
   ```bash
   chmod +x backend/scripts/backup-db.sh
   ```

2. Set up cron job for daily backups (2 AM):
   ```bash
   crontab -e
   ```
   
   Add line:
   ```
   0 2 * * * cd /path/to/aura-presence && DATABASE_URL=$DATABASE_URL ./backend/scripts/backup-db.sh
   ```

### Manual Backup

```bash
cd backend
DATABASE_URL=your_postgres_url ./scripts/backup-db.sh
```

### Restore from Backup

```bash
# Unzip if compressed
gunzip backups/backup_YYYYMMDD_HHMMSS.sql.gz

# Restore
psql $DATABASE_URL < backups/backup_YYYYMMDD_HHMMSS.sql
```

## Configuration

Environment variables:
- `DATABASE_URL` - PostgreSQL connection string (required)
- `BACKUP_DIR` - Backup directory (default: `./backups`)
- `RETENTION_DAYS` - Days to keep backups (default: 7)
- `BACKUP_UPLOAD_COMMAND` - Optional command to upload backups
- `BACKUP_NOTIFICATION_WEBHOOK` - Optional webhook for notifications

## Notes

- Backups are automatically compressed with gzip
- Old backups are cleaned up automatically based on `RETENTION_DAYS`
- For production, consider uploading backups to S3/Backblaze/etc.
- Test restore procedure regularly!

## .gitignore

Backup files are gitignored to prevent committing database data.





