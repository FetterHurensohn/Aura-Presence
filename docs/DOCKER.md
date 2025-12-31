# 🐳 Docker Deployment Guide

Vollständige Anleitung zur Containerisierung von Aura Presence mit Docker.

## 📦 Übersicht

- **Backend**: Node.js + Express + SQLite (dev) / PostgreSQL (prod)
- **Frontend**: React + Vite, served mit Nginx
- **Orchestrierung**: Docker Compose

## 🚀 Quick Start

### Development (mit Docker Compose)

```bash
# 1. Environment-Variablen setzen
cp backend/.env.example backend/.env
# Editiere backend/.env und setze JWT_SECRET

# 2. Container starten
docker-compose up -d

# 3. Logs anschauen
docker-compose logs -f

# 4. Öffnen
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

**Fertig!** 🎉

### Production (mit PostgreSQL)

```bash
# 1. Environment-Variablen für Production
export JWT_SECRET="your-production-secret-min-32-chars"
export POSTGRES_PASSWORD="your-secure-db-password"
export FRONTEND_URL="https://app.aurapresence.com"
export VITE_API_URL="https://api.aurapresence.com"
export OPENAI_API_KEY="sk-..."
export STRIPE_SECRET_KEY="sk_live_..."
export STRIPE_WEBHOOK_SECRET="whsec_..."
export STRIPE_PRICE_ID="price_..."

# 2. Production-Container starten
docker-compose -f docker-compose.prod.yml up -d

# 3. Verifizieren
curl http://localhost:3001/health
```

## 📋 Verfügbare Docker-Dateien

### Backend

- **`backend/Dockerfile`** - Multi-stage Build (Node.js Alpine)
- **`backend/.dockerignore`** - Ausschluss-Liste

**Features:**

- Multi-stage Build (Builder + Production)
- Non-root User (Security)
- Health Check eingebaut
- dumb-init für Signal-Handling
- Optimierte Layer-Caching

### Frontend

- **`frontend/Dockerfile`** - Build + Nginx Serving
- **`frontend/nginx.conf`** - Nginx-Konfiguration
- **`frontend/.dockerignore`** - Ausschluss-Liste

**Features:**

- Multi-stage Build (Vite Build + Nginx)
- SPA-Routing konfiguriert
- Gzip-Kompression aktiv
- Security-Headers
- Asset-Caching

### Docker Compose

- **`docker-compose.yml`** - Development (SQLite)
- **`docker-compose.prod.yml`** - Production (PostgreSQL)
- **`.dockerignore`** - Root-Level Ausschlüsse

## 🛠️ Einzelne Container bauen

### Backend

```bash
cd backend

# Build
docker build -t aura-backend:latest .

# Run
docker run -d \
  --name aura-backend \
  -p 3001:3001 \
  -e JWT_SECRET="your-secret" \
  -e DATABASE_URL="sqlite://./data/aura-presence.db" \
  -v $(pwd)/data:/app/data \
  aura-backend:latest
```

### Frontend

```bash
cd frontend

# Build mit Build-Args
docker build \
  --build-arg VITE_API_URL=http://localhost:3001 \
  -t aura-frontend:latest .

# Run
docker run -d \
  --name aura-frontend \
  -p 5173:80 \
  aura-frontend:latest
```

## 🔧 Docker Compose Commands

### Development

```bash
# Starten (detached)
docker-compose up -d

# Starten mit Rebuild
docker-compose up --build

# Logs anzeigen
docker-compose logs -f
docker-compose logs backend
docker-compose logs frontend

# Status prüfen
docker-compose ps

# Stoppen
docker-compose stop

# Stoppen & löschen
docker-compose down

# Stoppen & löschen inkl. Volumes
docker-compose down -v
```

### Production

```bash
# Production-Compose verwenden
docker-compose -f docker-compose.prod.yml up -d

# Mit Environment-File
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Health-Check
docker-compose -f docker-compose.prod.yml ps
```

## 📊 Health Checks

### Backend

```bash
# Direkter Check
curl http://localhost:3001/health

# Docker Health-Status
docker inspect --format='{{.State.Health.Status}}' aura-backend

# Erwartung: "healthy"
```

### Frontend

```bash
# Direkter Check
curl http://localhost:5173/health

# Docker Health-Status
docker inspect --format='{{.State.Health.Status}}' aura-frontend
```

## 🗄️ Volumes & Daten-Persistenz

### Development

```yaml
volumes:
  - ./backend/data:/app/data    # SQLite-Datenbank
  - ./backend/logs:/app/logs    # Log-Dateien
```

**Lokal gespeichert:** Daten bleiben auch nach `docker-compose down` erhalten.

### Production

```yaml
volumes:
  - postgres-data:/var/lib/postgresql/data  # PostgreSQL
  - backend-logs:/app/logs                  # Logs
```

**Docker Volumes:** Persistent, aber Docker-managed.

```bash
# Volumes auflisten
docker volume ls

# Volume löschen (VORSICHT!)
docker volume rm aura-presence_postgres-data
```

## 🌐 Netzwerk

### Development

- **Network**: `aura-network` (Bridge)
- Backend → Frontend: `http://backend:3001`
- Frontend → Backend: `http://localhost:3001` (external)

### Production

- **Network**: `aura-network` (Bridge)
- Backend → PostgreSQL: `postgres:5432`
- Frontend → Backend: via `VITE_API_URL` (build-time)

## 🔐 Environment-Variablen

### Backend (Required)

```bash
JWT_SECRET=your-secret-min-32-chars
DATABASE_URL=sqlite://./data/aura-presence.db  # oder PostgreSQL
```

### Backend (Optional)

```bash
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### Frontend (Build-Time)

```bash
VITE_API_URL=http://localhost:3001
VITE_TURN_USERNAME=your-turn-username
VITE_TURN_CREDENTIAL=your-turn-credential
```

**Wichtig:** Frontend-Variablen werden **beim Build** eingebunden, nicht zur Laufzeit!

## 🚨 Troubleshooting

### "Port already in use"

```bash
# Prüfe laufende Container
docker ps

# Stoppe konfliktierenden Container
docker stop <container-id>

# Oder ändere Port in docker-compose.yml
ports:
  - "3002:3001"  # Host:Container
```

### Backend startet nicht (Health Check fails)

```bash
# Logs prüfen
docker-compose logs backend

# Häufige Ursachen:
# - JWT_SECRET nicht gesetzt
# - DATABASE_URL ungültig
# - Port 3001 nicht erreichbar

# Interaktiv debuggen
docker-compose exec backend sh
node -e "console.log(process.env.JWT_SECRET)"
```

### Frontend zeigt "Network Error"

```bash
# Prüfe Backend-Erreichbarkeit
curl http://localhost:3001/health

# Prüfe VITE_API_URL im Build
docker-compose logs frontend | grep VITE_API_URL

# Rebuild mit korrekter URL
docker-compose up --build frontend
```

### PostgreSQL Connection Error

```bash
# Prüfe PostgreSQL-Status
docker-compose -f docker-compose.prod.yml ps postgres

# Prüfe Health
docker inspect --format='{{.State.Health.Status}}' aura-postgres

# Warte bis PostgreSQL bereit ist
docker-compose -f docker-compose.prod.yml up --wait postgres

# Prüfe Credentials
docker-compose -f docker-compose.prod.yml exec postgres \
  psql -U aura_admin -d aura_presence -c "\dt"
```

### Image zu groß

```bash
# Prüfe Image-Größe
docker images | grep aura

# Analyse
docker history aura-backend:latest

# Tipps:
# - .dockerignore korrekt konfiguriert?
# - Multi-stage Build verwendet?
# - --only=production für npm ci?
```

## 📈 Performance-Optimierung

### Layer-Caching

```dockerfile
# GUTE Reihenfolge (häufige Änderungen am Ende)
COPY package*.json ./
RUN npm ci
COPY . .

# SCHLECHTE Reihenfolge
COPY . .
RUN npm ci
```

### Build-Args cachen

```bash
# Mit BuildKit (schneller)
DOCKER_BUILDKIT=1 docker-compose build
```

### Ressourcen-Limits

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M
```

## 🔒 Sicherheit

### Non-Root User

✅ **Backend**: Läuft als User `nodejs` (UID 1001)  
✅ **Frontend**: Läuft als User `nginx`

### Secrets nicht in Images

❌ **FALSCH:**

```dockerfile
ENV JWT_SECRET=hardcoded-secret
```

✅ **RICHTIG:**

```yaml
environment:
  - JWT_SECRET=${JWT_SECRET}
```

### Production-Best-Practices

```yaml
# docker-compose.prod.yml
services:
  backend:
    restart: always              # Auto-Restart
    read_only: true              # Read-only Filesystem
    security_opt:
      - no-new-privileges:true   # Keine Privilege-Escalation
    cap_drop:
      - ALL                      # Alle Capabilities droppen
```

## 🚀 Deployment

### AWS ECS

```bash
# ECR Repository erstellen
aws ecr create-repository --repository-name aura-backend

# Login
aws ecr get-login-password --region eu-central-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.eu-central-1.amazonaws.com

# Build & Push
docker build -t aura-backend:latest ./backend
docker tag aura-backend:latest <account-id>.dkr.ecr.eu-central-1.amazonaws.com/aura-backend:latest
docker push <account-id>.dkr.ecr.eu-central-1.amazonaws.com/aura-backend:latest
```

### Docker Swarm

```bash
# Init Swarm
docker swarm init

# Deploy Stack
docker stack deploy -c docker-compose.prod.yml aura-presence

# Scale
docker service scale aura-presence_backend=3
```

### Kubernetes

```bash
# Convert Compose zu Kubernetes
kompose convert -f docker-compose.prod.yml

# Apply
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
```

## 📚 Weiterführende Ressourcen

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

**Happy Containerizing! 🐳**

