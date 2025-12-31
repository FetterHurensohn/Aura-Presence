#!/bin/bash
###############################################################################
# Log Rotation Script
# Rotiert und komprimiert alte Log-Files
# 
# Empfohlene Cron-Schedule: Täglich um 3 Uhr morgens
# 0 3 * * * /path/to/backend/scripts/rotate-logs.sh
###############################################################################

set -e

# Konfiguration
LOGS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../logs" && pwd)"
RETENTION_DAYS=${LOG_RETENTION_DAYS:-30}
ARCHIVE_DIR="$LOGS_DIR/archive"

echo "=== Log Rotation Started ==="
echo "Logs Directory: $LOGS_DIR"
echo "Retention Days: $RETENTION_DAYS"

# Erstelle Archive-Verzeichnis falls nicht vorhanden
mkdir -p "$ARCHIVE_DIR"

# Finde und komprimiere Log-Files älter als 1 Tag
find "$LOGS_DIR" -name "*.log" -type f -mtime +1 -not -path "*/archive/*" | while read -r logfile; do
  filename=$(basename "$logfile")
  timestamp=$(date -r "$logfile" +%Y%m%d_%H%M%S 2>/dev/null || stat -f %Sm -t %Y%m%d_%H%M%S "$logfile")
  
  echo "Archiving: $filename"
  
  # Komprimiere und verschiebe
  gzip -c "$logfile" > "$ARCHIVE_DIR/${filename%.log}_${timestamp}.log.gz"
  
  # Leere Original-File (nicht löschen, da Winston möglicherweise noch schreibt)
  > "$logfile"
done

# Lösche Archive älter als Retention-Period
echo "Cleaning up archives older than $RETENTION_DAYS days..."
find "$ARCHIVE_DIR" -name "*.log.gz" -type f -mtime +$RETENTION_DAYS -delete

# Statistiken
ARCHIVE_COUNT=$(find "$ARCHIVE_DIR" -name "*.log.gz" -type f | wc -l)
ARCHIVE_SIZE=$(du -sh "$ARCHIVE_DIR" 2>/dev/null | cut -f1)

echo "=== Log Rotation Completed ==="
echo "Archived Logs: $ARCHIVE_COUNT"
echo "Archive Size: $ARCHIVE_SIZE"

exit 0

