# GitHub Secrets Configuration for Supabase CI/CD

## 📋 Values to Configure

Based on your current `.env` configuration, here are the values you need to add as GitHub Secrets:

### 1. SUPABASE_TEST_DATABASE_URL
```
postgresql://postgres.fefrkchgotntfdodouqg:5LrJLqO7FTpoHZ3M@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
```

### 2. SUPABASE_TEST_URL
```
https://fefrkchgotntfdodouqg.supabase.co
```

### 3. SUPABASE_TEST_SERVICE_KEY
**⚠️ You need to get this from Supabase Dashboard:**

1. Go to https://supabase.com/dashboard
2. Select your project `fefrkchgotntfdodouqg`
3. Go to **Settings** (⚙️) > **API**
4. Scroll to **Project API keys**
5. Copy the **`service_role`** key (NOT the anon key!)
   - It starts with: `eyJhbGc...`
   - Keep this secret - never expose in frontend!

---

## 🔧 How to Add Secrets to GitHub

### Step 1: Go to Repository Settings

1. Open your repository: https://github.com/YOUR_USERNAME/aura-presence
2. Click **Settings** (top right, needs repo admin access)
3. In left sidebar, click **Secrets and variables** > **Actions**

### Step 2: Add Each Secret

Click **"New repository secret"** and add these **3 secrets**:

#### Secret 1: `SUPABASE_TEST_DATABASE_URL`
- **Name:** `SUPABASE_TEST_DATABASE_URL`
- **Value:** 
  ```
  postgresql://postgres.fefrkchgotntfdodouqg:5LrJLqO7FTpoHZ3M@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
  ```
- Click **Add secret**

#### Secret 2: `SUPABASE_TEST_URL`
- **Name:** `SUPABASE_TEST_URL`
- **Value:** 
  ```
  https://fefrkchgotntfdodouqg.supabase.co
  ```
- Click **Add secret**

#### Secret 3: `SUPABASE_TEST_SERVICE_KEY`
- **Name:** `SUPABASE_TEST_SERVICE_KEY`
- **Value:** `[Get from Supabase Dashboard > Settings > API > service_role key]`
- Click **Add secret**

---

## ✅ Verification

After adding all secrets:

1. Go to **Actions** tab in your GitHub repo
2. Find the latest workflow run for `Test & Build (Supabase)`
3. It should now run **all tests** instead of just quick-check
4. Check if **backend-test** job passes with Supabase integration tests

---

## 🔒 Security Notes

- ✅ **DO:** Keep these secrets in GitHub Secrets only
- ❌ **DON'T:** Commit them to code or share publicly
- ⚠️ **WARNING:** Service key has admin access - never expose in frontend!
- 🔄 **ROTATE:** Change passwords regularly (especially after sharing)

---

## 📝 Quick Copy-Paste Checklist

```
[ ] Go to GitHub repo Settings
[ ] Navigate to Secrets and variables > Actions
[ ] Add SUPABASE_TEST_DATABASE_URL (value above)
[ ] Add SUPABASE_TEST_URL (value above)
[ ] Get service_role key from Supabase Dashboard
[ ] Add SUPABASE_TEST_SERVICE_KEY (service_role key)
[ ] Verify by triggering GitHub Actions workflow
[ ] Check if integration tests run successfully
```

---

## 🎯 What Happens After Configuration

Once secrets are configured, the CI/CD pipeline will:

1. ✅ Connect to your Supabase test database
2. ✅ Run database migrations
3. ✅ Execute all integration tests
4. ✅ Verify auth flow (register/login)
5. ✅ Test database constraints and queries
6. ✅ Upload test coverage to Codecov

---

## 🚨 Troubleshooting

### Error: "SUPABASE_TEST_DATABASE_URL not set"
- Secret name must be **exact** (case-sensitive)
- Wait a few seconds after adding - GitHub needs to sync

### Error: "password authentication failed"
- Double-check the password in DATABASE_URL
- Ensure no extra spaces when copying

### Error: "Tenant or user not found"
- Make sure you're using the **pooler** URL (port 6543)
- Check that project ref is correct: `fefrkchgotntfdodouqg`

---

## 📸 Screenshot Guide

### Where to Find Service Role Key:

1. Supabase Dashboard
2. Settings (⚙️) → API
3. Scroll to "Project API keys"
4. Look for **"service_role (secret)"**
5. Click 👁️ to reveal
6. Click 📋 to copy

**It should look like:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```

---

**Need help?** Open an issue or check the main README for contact info.

