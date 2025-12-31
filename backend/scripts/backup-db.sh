#!/bin/bash
#
# PostgreSQL Database Backup Script
# Erstellt tägliche Backups der PostgreSQL-Datenbank
#
# Usage:
#   ./backup-db.sh
#
# Cron Example (täglich um 2 Uhr nachts):
#   0 2 * * * /app/backend/scripts/backup-db.sh
#

# Exit on error
set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"
RETENTION_DAYS="${RETENTION_DAYS:-7}"

# Farben für Output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== PostgreSQL Backup Script ===${NC}"
echo "Started at: $(date)"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}ERROR: DATABASE_URL environment variable is not set${NC}"
  exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Perform backup
echo -e "${YELLOW}Creating backup...${NC}"
if pg_dump "$DATABASE_URL" > "$BACKUP_FILE"; then
  echo -e "${GREEN}✓ Backup created successfully: $BACKUP_FILE${NC}"
  
  # Get file size
  SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "Backup size: $SIZE"
else
  echo -e "${RED}✗ Backup failed!${NC}"
  exit 1
fi

# Compress backup
echo -e "${YELLOW}Compressing backup...${NC}"
if gzip "$BACKUP_FILE"; then
  echo -e "${GREEN}✓ Backup compressed: ${BACKUP_FILE}.gz${NC}"
  BACKUP_FILE="${BACKUP_FILE}.gz"
else
  echo -e "${YELLOW}⚠ Compression failed, keeping uncompressed backup${NC}"
fi

# Optional: Upload to S3/Backblaze/etc.
if [ -n "$BACKUP_UPLOAD_COMMAND" ]; then
  echo -e "${YELLOW}Uploading backup to remote storage...${NC}"
  if eval "$BACKUP_UPLOAD_COMMAND $BACKUP_FILE"; then
    echo -e "${GREEN}✓ Backup uploaded successfully${NC}"
  else
    echo -e "${RED}✗ Upload failed!${NC}"
  fi
fi

# Clean up old backups (older than RETENTION_DAYS)
echo -e "${YELLOW}Cleaning up old backups...${NC}"
find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "backup_*.sql" -type f -mtime +$RETENTION_DAYS -delete

REMAINING=$(find "$BACKUP_DIR" -name "backup_*" -type f | wc -l)
echo -e "${GREEN}✓ Cleanup complete. $REMAINING backup(s) remaining${NC}"

echo ""
echo -e "${GREEN}=== Backup completed successfully ===${NC}"
echo "Finished at: $(date)"

# Optional: Send notification (e.g., via webhook, email, etc.)
if [ -n "$BACKUP_NOTIFICATION_WEBHOOK" ]; then
  curl -X POST "$BACKUP_NOTIFICATION_WEBHOOK" \
    -H "Content-Type: application/json" \
    -d "{\"text\":\"✓ PostgreSQL backup completed: $BACKUP_FILE\",\"timestamp\":\"$(date -Iseconds)\"}" \
    || echo "Notification failed (non-critical)"
fi

exit 0





