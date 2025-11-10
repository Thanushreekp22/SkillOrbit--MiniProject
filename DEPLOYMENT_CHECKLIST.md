# SkillOrbit Deployment Checklist ✅

## Prerequisites
- [ ] GitHub repository is ready and pushed
- [ ] MongoDB Atlas account created (or have MongoDB connection string)
- [ ] Groq API key obtained from https://console.groq.com

---

## Part 1: Backend Deployment (Render) 🔧

### Step 1: Create Render Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub account
- [ ] Verify email

### Step 2: Deploy Backend
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository: `SkillOrbit--MiniProject`
- [ ] Configure settings:
  - [ ] Name: `skillorbit-backend`
  - [ ] Root Directory: `backend`
  - [ ] Environment: `Node`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Plan: Free

### Step 3: Environment Variables
Add these in Render dashboard:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `MONGODB_URI` = `mongodb+srv://username:password@cluster.mongodb.net/skillorbit`
- [ ] `JWT_SECRET` = `your_secure_random_string_here`
- [ ] `JWT_EXPIRES` = `24h`
- [ ] `GROQ_API_KEY` = `gsk_your_actual_groq_api_key`

### Step 4: Deploy & Verify
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Copy backend URL: `https://skillorbit-backend.onrender.com`
- [ ] Test endpoint: `https://your-backend.onrender.com/api/test`

---

## Part 2: Frontend Deployment (Vercel) 🌐

### Step 1: Create Vercel Account
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub account

### Step 2: Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Select repository: `SkillOrbit--MiniProject`
- [ ] Click "Import"

### Step 3: Configure Project
- [ ] Root Directory: `frontend`
- [ ] Framework Preset: `Vite` (auto-detected)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### Step 4: Environment Variables
Add in Vercel project settings:

- [ ] `VITE_API_BASE_URL` = `https://your-backend.onrender.com/api`

### Step 5: Deploy & Verify
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-5 minutes)
- [ ] Copy frontend URL: `https://skillorbit.vercel.app`
- [ ] Open in browser and verify

---

## Part 3: Connect Frontend & Backend 🔗

### Update Backend CORS
- [ ] Go to Render dashboard → Your service → Environment
- [ ] Add new variable:
  - [ ] Key: `FRONTEND_URL`
  - [ ] Value: `https://your-project.vercel.app`
- [ ] Save and wait for auto-redeploy

---

## Part 4: MongoDB Atlas Setup 💾

### Create Database
- [ ] Go to https://cloud.mongodb.com
- [ ] Create new project: "SkillOrbit"
- [ ] Build a cluster (Free M0)
- [ ] Choose cloud provider and region

### Configure Access
- [ ] Database Access → Add Database User
  - [ ] Username: `skillorbit_user`
  - [ ] Password: (auto-generate and save)
- [ ] Network Access → Add IP Address
  - [ ] Add: `0.0.0.0/0` (allow from anywhere)

### Get Connection String
- [ ] Click "Connect" on your cluster
- [ ] Choose "Connect your application"
- [ ] Copy connection string
- [ ] Replace `<password>` with your database password
- [ ] Use this as `MONGODB_URI` in Render

---

## Part 5: Final Testing 🧪

### Test Backend
- [ ] Open: `https://your-backend.onrender.com`
- [ ] Should see: "Skill Matrix Backend running 🚀"
- [ ] Test API: `https://your-backend.onrender.com/api/test`

### Test Frontend
- [ ] Open: `https://your-project.vercel.app`
- [ ] Try to register a new user
- [ ] Login with credentials
- [ ] Navigate through pages
- [ ] Take an assessment
- [ ] Check learning path

### Verify Integration
- [ ] Check browser console for errors
- [ ] Verify API calls are successful
- [ ] Test all major features:
  - [ ] User registration
  - [ ] User login
  - [ ] Dashboard
  - [ ] Assessment
  - [ ] Learning path
  - [ ] Progress tracking
  - [ ] Reports

---

## Troubleshooting 🔍

### Backend Issues
- **Service sleeping?** Wait 30-60 seconds on first request
- **MongoDB connection error?** Check connection string and IP whitelist
- **Environment variables missing?** Verify all are set in Render

### Frontend Issues
- **API calls failing?** Check `VITE_API_BASE_URL` is correct
- **CORS errors?** Verify `FRONTEND_URL` is set in Render backend
- **Build errors?** Check build logs in Vercel

### Common Solutions
1. Clear cache and redeploy
2. Check environment variables spelling
3. Verify URLs don't have trailing slashes
4. Check browser console and network tab
5. Review deployment logs

---

## URLs to Save 📋

| Service | URL | Purpose |
|---------|-----|---------|
| GitHub Repo | https://github.com/Thanushreekp22/SkillOrbit--MiniProject | Source code |
| Render Dashboard | https://dashboard.render.com | Backend management |
| Vercel Dashboard | https://vercel.com/dashboard | Frontend management |
| MongoDB Atlas | https://cloud.mongodb.com | Database management |
| Backend API | https://your-backend.onrender.com | Live backend |
| Frontend App | https://your-project.vercel.app | Live application |
| Groq Console | https://console.groq.com | API key management |

---

## Next Steps 🎯

After successful deployment:

1. **Custom Domain** (Optional)
   - [ ] Add custom domain in Vercel
   - [ ] Update `FRONTEND_URL` in Render

2. **Monitoring**
   - [ ] Set up Render monitoring
   - [ ] Enable Vercel analytics
   - [ ] Monitor MongoDB usage

3. **Security**
   - [ ] Rotate API keys regularly
   - [ ] Review CORS settings
   - [ ] Enable 2FA on all platforms

4. **Optimization**
   - [ ] Consider upgrading to paid plans if needed
   - [ ] Optimize database queries
   - [ ] Add caching if necessary

---

## Support Resources 📚

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.atlas.mongodb.com
- **Vite Docs**: https://vitejs.dev
- **Express Docs**: https://expressjs.com

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Notes**: 
_____________________________________________
_____________________________________________
_____________________________________________

---

✨ **Congratulations on deploying SkillOrbit!** ✨
