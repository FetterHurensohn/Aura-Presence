# Database Migration: SQLite → PostgreSQL

## Übersicht

Dieses Dokument beschreibt den Database-Layer-Refactoring von `better-sqlite3` zu `knex.js`, der sowohl SQLite (Development/Testing) als auch PostgreSQL (Production) unterstützt.

---

## Warum PostgreSQL?

**Probleme mit SQLite in Production:**
- ❌ Keine Concurrent Writes (nur 1 Writer zur Zeit)
- ❌ Keine Connection-Pooling
- ❌ Schlechte Performance bei vielen gleichzeitigen Requests
- ❌ Keine echte Replikation/Backups
- ❌ Keine Skalierung

**Vorteile von PostgreSQL:**
- ✅ Concurrent Reads & Writes
- ✅ Connection-Pooling
- ✅ Bessere Performance (Indexing, Query-Optimierung)
- ✅ Automatische Backups (bei Hosting-Providern)
- ✅ Horizontale Skalierung (Replicas)

---

## Architektur-Änderungen

### Vorher (better-sqlite3)

```
backend/src/
├── database/
│   └── db.js           # SQLite-spezifisch
├── models/
│   └── User.js         # Verwendet db.prepare()
```

### Nachher (Knex.js)

```
backend/src/
├── database/
│   ├── db.js           # Legacy (SQLite), bleibt für Tests
│   ├── dbKnex.js       # Neuer DB-Layer (Knex)
│   ├── knexfile.js     # Knex-Konfiguration
│   └── migrations/
│       └── 20250101000000_initial_schema.js
├── models/
│   ├── User.js         # Legacy (SQLite)
│   └── UserKnex.js     # Knex-Version (DB-agnostisch)
```

---

## Setup: Lokale Entwicklung (SQLite)

### 1. Dependencies installieren

```bash
cd backend
npm install
```

### 2. Environment-Variablen (optional)

```env
# SQLite (Default) - keine Konfiguration nötig
# Oder explizit:
DATABASE_URL=sqlite:./data/aura-presence.db

# Für In-Memory-DB (Tests):
DATABASE_URL=:memory:
```

### 3. Migrations ausführen

```bash
npm run migrate
```

### 4. Backend starten

```bash
npm run dev
```

**Erwartung:** Backend startet mit SQLite, Migrations werden automatisch ausgeführt.

---

## Setup: PostgreSQL (Production/Staging)

### 1. PostgreSQL-Instanz erstellen

#### Option A: Heroku Postgres (empfohlen)

```bash
heroku addons:create heroku-postgresql:essential-0 -a your-app-name
```

#### Option B: AWS RDS

1. Gehe zu [AWS RDS Console](https://console.aws.amazon.com/rds/)
2. Erstelle PostgreSQL-Instance (Freeor Tier verfügbar)
3. Notiere Connection-String

#### Option C: Supabase

1. Erstelle Projekt auf [supabase.com](https://supabase.com)
2. Kopiere PostgreSQL Connection-String

#### Option D: Lokal (für Testing)

**macOS:**

```bash
brew install postgresql@15
brew services start postgresql@15
createdb aura_presence_dev
```

**Windows (WSL oder native):**

```bash
# Download von postgresql.org
# Oder via Chocolatey:
choco install postgresql
```

**Linux:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb aura_presence_dev
```

### 2. Connection-String setzen

```env
DATABASE_URL=postgresql://username:password@host:port/dbname

# Beispiel (Heroku):
DATABASE_URL=postgres://user:pass@ec2-xxx.compute-1.amazonaws.com:5432/d123456

# Beispiel (lokal):
DATABASE_URL=postgresql://localhost/aura_presence_dev

# Optional: Connection-Pool-Größe
DB_POOL_MIN=2
DB_POOL_MAX=10
```

**Wichtig:** Connection-String niemals committen! Nur in `.env` (gitignored).

### 3. SSL-Modus (Production)

Für Production-DBs ist SSL Pflicht:

```env
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

### 4. Migrations ausführen

```bash
npm run migrate
```

**Erwartung:** Alle Tabellen werden in PostgreSQL erstellt.

### 5. Verify

```bash
# PostgreSQL CLI
psql $DATABASE_URL

# Tabellen anzeigen
\dt

# User-Tabelle prüfen
\d users

# Exit
\q
```

---

## Data-Migration: SQLite → PostgreSQL

Falls bereits User-Daten in SQLite existieren:

### 1. Backup erstellen

```bash
cp backend/data/aura-presence.db backend/data/aura-presence.db.backup
```

### 2. Daten exportieren

```bash
sqlite3 backend/data/aura-presence.db .dump > backend/data/sqlite_dump.sql
```

### 3. Daten in PostgreSQL importieren

**Option A: Manuell**

```bash
# User exportieren
sqlite3 backend/data/aura-presence.db "SELECT * FROM users;" > users.csv

# In PostgreSQL importieren
psql $DATABASE_URL -c "\COPY users(id, email, password_hash, ...) FROM 'users.csv' CSV HEADER;"
```

**Option B: Migration-Script (TODO)**

Erstelle Script: `backend/scripts/migrate-sqlite-to-postgres.js`

```javascript
// Liest SQLite-DB
// Schreibt in PostgreSQL
// Mit Progress-Feedback
```

### 4. Verify

```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

---

## Development-Workflow

### Code-Migration: User-Model

#### Vorher (better-sqlite3):

```javascript
// models/User.js
import getDatabase from '../database/db.js';

export function findUserByEmail(email) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
}
```

#### Nachher (Knex):

```javascript
// models/UserKnex.js
import getDatabase from '../database/dbKnex.js';

export function findUserByEmail(email) {
  const db = getDatabase();
  return db('users').where('email', email).first();
}
```

### Migration-Strategie

**Schritt 1:** Neue Knex-Models erstellen (z.B. `UserKnex.js`)

**Schritt 2:** Routes schrittweise umstellen:

```javascript
// routes/auth.js
// Vorher:
import { findUserByEmail } from '../models/User.js';

// Nachher:
import { findUserByEmail } from '../models/UserKnex.js';
```

**Schritt 3:** Alte Models löschen (wenn alle Routes migriert)

**Schritt 4:** Tests anpassen

---

## Tests anpassen

### Vorher (SQLite)

```javascript
// tests/auth.test.js
import { getDatabase, closeDatabase } from '../src/database/db.js';

beforeAll(() => {
  process.env.DB_PATH = ':memory:';
  getDatabase(); // Erstellt In-Memory-DB
});
```

### Nachher (Knex)

```javascript
// tests/auth.test.js
import { getDatabase, closeDatabase, initializeDatabase } from '../src/database/dbKnex.js';

beforeAll(async () => {
  process.env.DATABASE_URL = ':memory:';
  await initializeDatabase(); // Führt Migrations aus
});

afterAll(async () => {
  await closeDatabase();
});
```

---

## Migrations: Neue Tabellen hinzufügen

### 1. Migration erstellen

```bash
npm run migrate:make add_user_preferences
```

**Erstellt:** `backend/src/database/migrations/20250102123456_add_user_preferences.js`

### 2. Migration implementieren

```javascript
export async function up(knex) {
  await knex.schema.createTable('user_preferences', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('theme', 50).defaultTo('dark');
    table.boolean('email_notifications').defaultTo(true);
    table.bigInteger('created_at').notNullable();
    table.bigInteger('updated_at').notNullable();
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('user_preferences');
}
```

### 3. Migration ausführen

```bash
npm run migrate
```

### 4. Rollback (bei Fehler)

```bash
npm run migrate:rollback
```

---

## Production-Deployment

### Pre-Deployment-Checklist

- [ ] PostgreSQL-Instance erstellt
- [ ] `DATABASE_URL` als Secret/ENV-Variable gesetzt
- [ ] SSL-Modus aktiviert (`?sslmode=require`)
- [ ] Connection-Pool-Größe konfiguriert
- [ ] Backup-Strategie definiert
- [ ] Migration-Script getestet (in Staging)

### Deployment-Steps

1. **Backup (falls bereits Production-DB):**

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

2. **Deploy Code:**

```bash
git push heroku main
# Oder: Deploy via CI/CD
```

3. **Run Migrations:**

```bash
heroku run npm run migrate -a your-app-name
# Oder: In Deployment-Script einbauen
```

4. **Health-Check:**

```bash
curl https://your-app.com/health
```

5. **Verify Database:**

```bash
heroku psql -a your-app-name
\dt  # Tabellen anzeigen
SELECT COUNT(*) FROM users;
```

---

## Rollback-Plan

### Szenario: Migration schlägt fehl

**Schritt 1:** Stoppe Backend sofort

```bash
heroku ps:scale web=0 -a your-app-name
```

**Schritt 2:** Rollback Migrations

```bash
heroku run npm run migrate:rollback -a your-app-name
```

**Schritt 3:** Restore Backup (falls DB korrupt)

```bash
# Drop DB (VORSICHT!)
heroku pg:reset DATABASE -a your-app-name --confirm your-app-name

# Restore
heroku pg:backups:restore backup_url DATABASE_URL -a your-app-name
```

**Schritt 4:** Revert Code

```bash
git revert HEAD
git push heroku main
```

**Schritt 5:** Restart

```bash
heroku ps:scale web=1 -a your-app-name
```

---

## Performance-Optimierung

### Connection-Pooling

```env
DB_POOL_MIN=2
DB_POOL_MAX=10
```

### Indexing

```javascript
// Füge Indices in Migrations hinzu:
table.index('email', 'idx_users_email');
table.index(['user_id', 'started_at'], 'idx_sessions_user_started');
```

### Query-Optimierung

```javascript
// Schlecht: N+1 Queries
for (const user of users) {
  const sessions = await db('analysis_sessions').where('user_id', user.id);
}

// Gut: JOIN
const usersWithSessions = await db('users')
  .leftJoin('analysis_sessions', 'users.id', 'analysis_sessions.user_id')
  .select('users.*', db.raw('COUNT(analysis_sessions.id) as session_count'))
  .groupBy('users.id');
```

---

## Troubleshooting

### Error: "relation 'users' does not exist"

**Ursache:** Migrations nicht ausgeführt

**Lösung:**

```bash
npm run migrate
```

### Error: "password authentication failed"

**Ursache:** Falsche Credentials in `DATABASE_URL`

**Lösung:** Prüfe Connection-String

### Error: "too many connections"

**Ursache:** Connection-Pool zu groß oder Connections nicht geschlossen

**Lösung:**

```env
DB_POOL_MAX=5  # Reduziere Pool-Größe
```

### Error: "SSL required"

**Ursache:** Production-DB erfordert SSL

**Lösung:**

```env
DATABASE_URL=postgresql://...?sslmode=require
```

---

## Best Practices

### 1. Niemals raw SQL in Production

```javascript
// ❌ Schlecht (SQL-Injection-Risiko)
db.raw(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ Gut (Knex Query-Builder)
db('users').where('email', email);
```

### 2. Immer Transactions verwenden

```javascript
await db.transaction(async (trx) => {
  await trx('users').insert(userData);
  await trx('analysis_sessions').insert(sessionData);
});
```

### 3. Migrations sind einweg

- ❌ Niemals deployed Migrations ändern
- ✅ Neue Migration erstellen für Änderungen

### 4. Test-DB separieren

```javascript
// Test-DB: SQLite In-Memory
if (process.env.NODE_ENV === 'test') {
  process.env.DATABASE_URL = ':memory:';
}
```

---

## Weitere Ressourcen

- [Knex.js Dokumentation](https://knexjs.org/)
- [PostgreSQL Dokumentation](https://www.postgresql.org/docs/)
- [Heroku Postgres Docs](https://devcenter.heroku.com/categories/heroku-postgres)
- [AWS RDS Postgres](https://aws.amazon.com/rds/postgresql/)

---

**Bei Fragen:** Siehe `README.md` oder öffne ein Issue.





