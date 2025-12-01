# Complete Render Environment Variables Setup

## 📋 All Required Environment Variables for Render

Copy these EXACT variable names and values to your Render dashboard:

---

### 1. Server Configuration

| Variable Name | Value | Description |
|--------------|--------|-------------|
| `NODE_ENV` | `production` | Tells Node.js this is production |
| `PORT` | `10000` | Render uses port 10000 |

---

### 2. Database Configuration

| Variable Name | Value | Description |
|--------------|--------|-------------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/...` | Your MongoDB Atlas connection string (use your existing value) |

---

### 3. JWT Authentication

| Variable Name | Value | Description |
|--------------|--------|-------------|
| `JWT_SECRET` | `your_jwt_secret_here` | Secret key for JWT tokens (use your existing value) |
| `JWT_EXPIRES` | `24h` | Token expiration time |

---

### 4. AI Service (Groq)

| Variable Name | Value | Description |
|--------------|--------|-------------|
| `GROQ_API_KEY` | `gsk_your_groq_key_here` | Your Groq API key for AI features |

---

### 5. Frontend URL

| Variable Name | Value | Description |
|--------------|--------|-------------|
| `FRONTEND_URL` | `https://skill-orbit-mini-project.vercel.app` | Your Vercel frontend URL (for CORS) |

---

### 6. Email Service (Resend) - **CRITICAL FOR EMAILS** ⚠️

| Variable Name | Value | Description |
|--------------|--------|-------------|
| `EMAIL_SERVICE` | `resend` | Which email service to use |
| `RESEND_API_KEY` | `re_YOUR_KEY_HERE` | **Get from https://resend.com/api-keys** |
| `EMAIL_FROM` | `SkillOrbit <onboarding@resend.dev>` | Sender email address |

---

### 7. Optional/Fallback Email Settings (Keep These)

| Variable Name | Value | Description |
|--------------|--------|-------------|
| `EMAIL_HOST` | `smtp.gmail.com` | Fallback SMTP host |
| `EMAIL_PORT` | `587` | Fallback SMTP port |
| `EMAIL_SECURE` | `false` | Fallback SMTP secure setting |
| `EMAIL_USER` | `skillorbit.web.2025@gmail.com` | Fallback email user |
| `EMAIL_PASS` | `pudesigiugrrmgbj` | Fallback Gmail app password |

---

## 🎯 Step-by-Step: Add to Render Dashboard

### 1. Go to Render Dashboard
- Visit: https://dashboard.render.com
- Login to your account
- Select: **skillorbit-backend** service

### 2. Navigate to Environment Tab
- Click **"Environment"** in the left sidebar
- You'll see existing environment variables

### 3. Add Missing Variables

For each variable above, click **"+ Add Environment Variable"** and enter:

**Example for RESEND_API_KEY**:
```
Key: RESEND_API_KEY
Value: re_xxxxxxxxxxxxxxxxxxxxx
```

### 4. Critical Variables to Add NOW

If you don't have these, add them immediately:

```
EMAIL_SERVICE = resend
RESEND_API_KEY = re_YOUR_KEY_FROM_RESEND
EMAIL_FROM = SkillOrbit <onboarding@resend.dev>
```

### 5. Save Changes
- Click **"Save Changes"** button at the bottom
- Render will automatically redeploy (takes 2-3 minutes)
- Watch the **"Logs"** tab for deployment status

---

## ✅ Complete Environment Variables List (Copy-Paste Format)

```bash
# Server
NODE_ENV=production
PORT=10000

# Database
MONGODB_URI=your_mongodb_connection_string_here

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES=24h

# AI Service
GROQ_API_KEY=your_groq_api_key_here

# Frontend
FRONTEND_URL=https://skill-orbit-mini-project.vercel.app

# Email Service - RESEND (CRITICAL!)
EMAIL_SERVICE=resend
RESEND_API_KEY=re_YOUR_KEY_HERE  # ← GET THIS FROM RESEND.COM
EMAIL_FROM=SkillOrbit <onboarding@resend.dev>

# Fallback Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=skillorbit.web.2025@gmail.com
EMAIL_PASS=pudesigiugrrmgbj
```

---

## 🔑 How to Get RESEND_API_KEY

**If you don't have it yet**:

1. **Sign up**: https://resend.com
   - Click "Start Building"
   - Sign up with GitHub or email (free)

2. **Create API Key**:
   - After login → Dashboard
   - Click "API Keys" in left sidebar
   - Click "+ Create API Key"
   - Name: `SkillOrbit Production`
   - Permission: "Sending access"
   - Click "Add"

3. **Copy the Key**:
   - Key will start with `re_`
   - Example: `re_123abc456def789ghi`
   - **SAVE IT** - you won't see it again!

4. **Add to Render**:
   - Go back to Render → Environment
   - Add: `RESEND_API_KEY = re_your_copied_key`
   - Save changes

---

## 🔍 Verify Environment Variables

After saving, check the Environment tab shows:

✅ **Must have (14 variables)**:
1. NODE_ENV
2. PORT
3. MONGODB_URI
4. JWT_SECRET
5. JWT_EXPIRES
6. GROQ_API_KEY
7. FRONTEND_URL
8. EMAIL_SERVICE ← **CRITICAL**
9. RESEND_API_KEY ← **CRITICAL**
10. EMAIL_FROM ← **CRITICAL**
11. EMAIL_HOST
12. EMAIL_PORT
13. EMAIL_SECURE
14. EMAIL_USER
15. EMAIL_PASS

---

## 📊 After Adding Variables

### Check Logs

1. Go to Render → **Logs** tab
2. Look for these success messages:

```
📧 Email Service Configuration:
   EMAIL_SERVICE: resend
   RESEND_API_KEY: ✅ Found
   Status: ✅ Resend Email Service ACTIVE (3,000/month free)
```

```
✅ Resend client initialized
```

```
✅ MongoDB Connected Successfully!
🚀 Server running on http://0.0.0.0:10000
```

### Test Email

1. Go to your live site: https://skill-orbit-mini-project.vercel.app
2. Click "Sign Up"
3. Register with your real email
4. Check inbox (and spam folder) for OTP
5. Check Resend dashboard: https://resend.com/emails

---

## ❌ Common Issues

**"RESEND_API_KEY: ❌ Not Found"**
- You didn't add RESEND_API_KEY to Render
- Solution: Add it in Environment tab

**"EMAIL_SERVICE: smtp"**
- EMAIL_SERVICE is not set to "resend"
- Solution: Add/update EMAIL_SERVICE=resend

**"Invalid API key"**
- API key is wrong or has extra spaces
- Solution: Create new key from Resend dashboard

---

## 📝 Quick Checklist

Before testing, ensure:

- [ ] All 15 environment variables added in Render
- [ ] RESEND_API_KEY starts with `re_`
- [ ] EMAIL_SERVICE = `resend` (not "smtp")
- [ ] Clicked "Save Changes" in Render
- [ ] Deployment completed (green "Live" status)
- [ ] Logs show "Resend Email Service ACTIVE"
- [ ] No error messages in logs

---

**Need help?** Share:
1. Screenshot of your Render Environment variables (hide RESEND_API_KEY value)
2. Last 20 lines from Render Logs tab
3. Any error messages you see

The most important variables for email are:
- `EMAIL_SERVICE=resend`
- `RESEND_API_KEY=re_xxx`
- `EMAIL_FROM=SkillOrbit <onboarding@resend.dev>`

Add these three and emails should work! 🚀
