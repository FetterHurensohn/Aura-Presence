# Supabase Database Migration Guide

## Environment Variables Setup

Copy this to your `backend/.env` file:

```bash
# ===========================================
# Aura Presence Backend - Environment Variables
# ===========================================

# Node Environment
NODE_ENV=development

# Server Configuration
PORT=3000

# Database Configuration (Supabase PostgreSQL)
# Get this from Supabase Project Settings > Database > Connection String (URI)
# Format: postgres://{user}:{password}@{host}:{port}/{database}
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# JWT Configuration
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Supabase Configuration (Optional - for Storage/Realtime features)
# Get these from Supabase Project Settings > API
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
# IMPORTANT: Service Key only for server-side operations - NEVER expose in frontend!
SUPABASE_SERVICE_KEY=[YOUR-SERVICE-KEY]

# OpenAI API (for AI evaluation features)
OPENAI_API_KEY=sk-...

# Stripe Configuration (for subscription features)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO_MONTHLY=price_...
STRIPE_PRICE_ID_PRO_YEARLY=price_...

# Sentry Error Tracking (optional)
SENTRY_DSN=https://...@sentry.io/...

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

## How to Get Supabase Credentials

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Choose your organization and region
   - Set a database password (save this!)

2. **Get DATABASE_URL**
   - In your Supabase project dashboard
   - Go to **Settings** > **Database**
   - Under **Connection String**, choose **URI**
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password

3. **Get SUPABASE_URL and Keys** (optional, for future features)
   - Go to **Settings** > **API**
   - Copy the **Project URL** → `SUPABASE_URL`
   - Copy the **anon public** key → `SUPABASE_ANON_KEY`
   - Copy the **service_role** key → `SUPABASE_SERVICE_KEY`

## Migration Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Environment Variables

Create `backend/.env` with the content above (replace placeholders).

### 3. Run Migrations

```bash
npm run db:migrate
```

Expected output:
```
Batch 1 run: X migrations
```

### 4. Verify Database Connection

```bash
node -e "import('./src/database/dbKnex.js').then(m => m.getDatabase().raw('SELECT 1+1 as result').then(r => console.log('✅ DB Connected:', r.rows)))"
```

Expected output:
```
✅ DB Connected: [ { result: 2 } ]
```

### 5. Start the Server

```bash
npm run dev
```

## Testing Auth Flow

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'
```

Expected: `200 OK` with `token`, `refreshToken`, and `user` object.

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'
```

Expected: `200 OK` with `token`, `refreshToken`, and `user` object.

### Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

Expected: `200 OK` with `user` object.

## Verify Data in Supabase

1. Go to your Supabase project
2. Click **Table Editor**
3. Select the `users` table
4. You should see your registered user

## Rollback Plan

If you need to rollback migrations:

```bash
npm run db:rollback
```

To rollback all migrations:

```bash
npm run db:rollback -- --all
```

## Security Notes

⚠️ **IMPORTANT**:
- Never commit your `.env` file to Git
- Never expose `SUPABASE_SERVICE_KEY` in frontend code
- Use Row Level Security (RLS) in Supabase for additional security
- Set up IP restrictions in Supabase if needed
- Rotate keys periodically

## Supabase Client Usage (Optional)

For future features like Storage or Realtime, you can use the Supabase client:

```javascript
import supabase from './database/supabaseClient.js';

// Upload file
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('public/avatar.png', file);

// Subscribe to realtime changes
supabase
  .channel('custom-channel')
  .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();
```

## Troubleshooting

### Error: "password authentication failed"
- Double-check your `DATABASE_URL` password
- Ensure you're using the password you set when creating the project

### Error: "ECONNREFUSED"
- Check your internet connection
- Verify the Supabase project is active

### Error: "relation does not exist"
- Run migrations: `npm run db:migrate`

### Migrations fail with "syntax error"
- Check that all migrations are PostgreSQL-compatible
- SQLite-specific syntax needs to be updated

## Support

For Supabase issues:
- Documentation: https://supabase.com/docs
- Discord: https://discord.supabase.com

For project issues:
- Check the main README.md
- Review migration files in `backend/src/database/migrations/`

