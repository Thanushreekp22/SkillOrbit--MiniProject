# 🚀 SkillOrbit Deployment - START HERE

## 📁 Files Created for Deployment

I've created the following deployment configuration files:

1. **`QUICK_DEPLOY.md`** - Quick reference guide (5 min read)
2. **`DEPLOYMENT_GUIDE.md`** - Detailed step-by-step guide (15 min read)
3. **`DEPLOYMENT_CHECKLIST.md`** - Interactive checklist to track progress
4. **`backend/render.yaml`** - Render configuration file
5. **`frontend/vercel.json`** - Vercel configuration file

---

## ⚡ Quick Start (Follow These Steps)

### 1️⃣ Backend on Render (15 minutes)

**Go to:** https://render.com

1. Sign up with GitHub
2. New Web Service → Connect `SkillOrbit--MiniProject`
3. Settings:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. Add Environment Variables (see below)
5. Deploy!

**Environment Variables for Render:**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=<get from MongoDB Atlas>
JWT_SECRET=<any secure random string>
JWT_EXPIRES=24h
GROQ_API_KEY=<your Groq API key>
```

**Your backend will be at:** `https://skillorbit-backend.onrender.com`

---

### 2️⃣ Frontend on Vercel (10 minutes)

**Go to:** https://vercel.com

1. Sign up with GitHub
2. Import Project → Select `SkillOrbit--MiniProject`
3. Settings:
   - Root Directory: `frontend`
   - Framework: Vite (auto-detected)
4. Add Environment Variable:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```
5. Deploy!

**Your frontend will be at:** `https://skillorbit.vercel.app`

---

### 3️⃣ MongoDB Atlas (10 minutes)

**Go to:** https://cloud.mongodb.com

1. Create free cluster (M0)
2. Create database user (save password!)
3. Network Access → Add IP: `0.0.0.0/0`
4. Get connection string
5. Use as `MONGODB_URI` in Render

---

### 4️⃣ Final Step - Connect Everything

1. Go back to Render → Your service → Environment
2. Add: `FRONTEND_URL` = `https://your-project.vercel.app`
3. Save (auto-redeploys)
4. Test your app!

---

## 🎯 What You Need Before Starting

### Required Accounts (All Free)
- [ ] GitHub account (you already have this ✅)
- [ ] Render account (sign up at render.com)
- [ ] Vercel account (sign up at vercel.com)
- [ ] MongoDB Atlas account (sign up at mongodb.com/cloud/atlas)
- [ ] Groq API key (get from console.groq.com)

### Required Information
- [ ] MongoDB connection string
- [ ] Groq API key
- [ ] JWT secret (any random string, e.g., `mySecretKey12345!@#`)

---

## 📚 Which Guide Should I Read?

| If you want... | Read this file |
|----------------|----------------|
| **Quick overview** | `QUICK_DEPLOY.md` |
| **Detailed instructions** | `DEPLOYMENT_GUIDE.md` |
| **Step-by-step checklist** | `DEPLOYMENT_CHECKLIST.md` |
| **Just get started** | This file! |

---

## 🔑 Important URLs to Bookmark

| Service | URL | What for |
|---------|-----|----------|
| **Render** | https://dashboard.render.com | Backend hosting |
| **Vercel** | https://vercel.com/dashboard | Frontend hosting |
| **MongoDB** | https://cloud.mongodb.com | Database |
| **Groq** | https://console.groq.com | AI API keys |
| **GitHub** | https://github.com/Thanushreekp22/SkillOrbit--MiniProject | Your code |

---

## ⏱️ Time Estimate

- **Backend (Render):** 15 minutes
- **Frontend (Vercel):** 10 minutes
- **MongoDB Setup:** 10 minutes
- **Testing:** 5 minutes
- **Total:** ~40 minutes

---

## 🆘 Common Issues & Quick Fixes

### "Service Unavailable" on Backend
- **Cause:** Free tier services sleep after 15 min inactivity
- **Fix:** Wait 30-60 seconds, it's waking up!

### "API calls failing" on Frontend
- **Cause:** Wrong `VITE_API_BASE_URL`
- **Fix:** Check it matches your Render URL exactly + `/api`

### "CORS Error"
- **Cause:** `FRONTEND_URL` not set in Render
- **Fix:** Add your Vercel URL as `FRONTEND_URL` in Render

### "MongoDB connection failed"
- **Cause:** IP not whitelisted or wrong connection string
- **Fix:** Add `0.0.0.0/0` in MongoDB Network Access

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Backend URL opens and shows "Skill Matrix Backend running 🚀"
- [ ] Frontend URL opens and shows landing page
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Dashboard loads with data
- [ ] Can take an assessment
- [ ] Learning path generates

---

## 🎉 You're Ready!

**Next Step:** Open `DEPLOYMENT_CHECKLIST.md` and start checking off items!

**Need Help?** 
- Check `DEPLOYMENT_GUIDE.md` for detailed troubleshooting
- Review deployment logs in Render/Vercel dashboards
- Verify all environment variables are set correctly

---

## 📝 Deployment Order

```
1. Setup MongoDB Atlas (get connection string)
   ↓
2. Deploy Backend on Render (use MongoDB string)
   ↓
3. Deploy Frontend on Vercel (use Render URL)
   ↓
4. Update Backend with Frontend URL
   ↓
5. Test Everything
   ↓
6. 🎊 Celebrate!
```

---

**Good luck with your deployment! 🚀**

*All configuration files are ready. Your code is already pushed to GitHub. Just follow the steps above!*
