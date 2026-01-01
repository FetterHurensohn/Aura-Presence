# 🚀 Quick Deployment Reference

## 📋 Deployment URLs

### Frontend (Vercel)
- **Dashboard:** https://vercel.com/dashboard
- **Deine URL:** `https://aura-presence-[hash].vercel.app`
- **Settings:** Project → Settings → Environment Variables

### Backend (Railway)
- **Dashboard:** https://railway.app/dashboard
- **Deine URL:** `https://aura-presence-backend-[hash].up.railway.app`
- **Settings:** Project → Variables

### Database (Supabase)
- **Dashboard:** https://supabase.com/dashboard
- **Project:** fefrkchgotntfdodouqg
- **Connection:** `postgresql://postgres.fefrkchgotntfdodouqg:***@aws-1-eu-central-1.pooler.supabase.com:6543/postgres`

---

## 🔑 Environment Variables Cheatsheet

### Railway Backend Variables

**Required (Minimum):**
```bash
DATABASE_URL=postgresql://postgres.fefrkchgotntfdodouqg:5LrJLqO7FTpoHZ3M@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
JWT_SECRET=dein-super-geheimes-jwt-secret-mindestens-32-zeichen-lang
JWT_REFRESH_SECRET=dein-super-geheimes-refresh-secret-mindestens-32-zeichen-lang
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://aura-presence-[hash].vercel.app
CORS_ORIGINS=https://aura-presence-[hash].vercel.app
```

**Optional (Features):**
```bash
# Supabase Storage & Realtime
SUPABASE_URL=https://fefrkchgotntfdodouqg.supabase.co
SUPABASE_ANON_KEY=[get from Supabase > Settings > API]
SUPABASE_SERVICE_KEY=[get from Supabase > Settings > API]

# OpenAI for AI Feedback
OPENAI_API_KEY=sk-...

# Stripe for Subscriptions
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO_MONTHLY=price_...
STRIPE_PRICE_ID_PRO_YEARLY=price_...

# Sentry Error Tracking
SENTRY_DSN=https://...@sentry.io/...
```

### Vercel Frontend Variables

```bash
VITE_API_URL=https://aura-presence-backend-[hash].up.railway.app
VITE_BACKEND_URL=https://aura-presence-backend-[hash].up.railway.app
NODE_ENV=production
```

---

## ⚡ Quick Commands

### Railway CLI
```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations
railway run npm run db:migrate

# View logs
railway logs

# Open dashboard
railway open
```

### Vercel CLI
```bash
# Install
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# View logs
vercel logs

# Open dashboard
vercel
```

---

## 🧪 Testing Endpoints

### Backend Health Check
```bash
curl https://your-backend.up.railway.app/health
```

### Register User
```powershell
$body = @{email="test@example.com"; password="Test1234!"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://your-backend.up.railway.app/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### Login User
```powershell
$body = @{email="test@example.com"; password="Test1234!"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://your-backend.up.railway.app/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

---

## 🔄 Deployment Workflow

### When you push to GitHub:

1. **Frontend (Vercel):**
   - Auto-deploys from `main` branch
   - Preview deployments for PRs
   - ~2 minutes

2. **Backend (Railway):**
   - Auto-deploys from `main` branch
   - ~3 minutes
   - Restarts automatically

3. **Database (Supabase):**
   - Always available
   - Manual migrations: `railway run npm run db:migrate`

---

## 🐛 Quick Troubleshooting

### Frontend shows blank page
→ Check browser console for errors
→ Verify VITE_API_URL is set in Vercel

### "Network Error" in frontend
→ Check CORS_ORIGINS in Railway includes Vercel URL
→ Verify backend is running: `/health` endpoint

### Backend crashes on startup
→ Check Railway logs
→ Verify all required ENV vars are set
→ Verify DATABASE_URL is correct

### "Migrations not run" error
→ Run: `railway run npm run db:migrate`
→ Or temporarily change start command to run migrations

### CORS errors
→ FRONTEND_URL must match Vercel deployment
→ Redeploy backend after changing

---

## 📊 Monitoring

### Vercel
- **Analytics:** Project → Analytics
- **Logs:** Deployments → Deployment → Runtime Logs

### Railway
- **Metrics:** Project → Metrics
- **Logs:** Project → View Logs (button)
- **Usage:** Project → Usage

### Supabase
- **Database:** Database → Table Editor
- **Logs:** Logs → PostgreSQL Logs
- **API:** Settings → API → API Logs

---

## 💰 Free Tier Limits

### Vercel
- ✅ 100 GB bandwidth/month
- ✅ Unlimited sites
- ✅ Automatic SSL

### Railway
- ⚠️ $5 credit/month
- ⚠️ Sleeps after 15min inactivity (Free)
- ✅ $5/month for Hobby (no sleep)

### Supabase
- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth
- ✅ 50k monthly active users

---

## 🎯 Post-Deployment Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Railway
- [ ] Database migrations run
- [ ] All ENV variables set (Railway & Vercel)
- [ ] `/health` endpoint works
- [ ] Register user works
- [ ] Login works
- [ ] Frontend can communicate with backend
- [ ] CORS configured correctly
- [ ] Custom domain added (optional)
- [ ] Monitoring/error tracking enabled (optional)

---

## 🔗 Important Links

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Supabase Docs:** https://supabase.com/docs
- **Project README:** [README.md](README.md)
- **Vercel Guide:** [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- **Railway Guide:** [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)
- **Supabase Guide:** [backend/SUPABASE_MIGRATION.md](backend/SUPABASE_MIGRATION.md)

---

**Keep this file handy for quick reference! 📌**

