# 🚀 URGENT: Fix Vercel Connection to Render Backend

## ❌ Current Problem
- ✅ Backend on Render is WORKING (shows "Skill Matrix Backend running 🚀")
- ❌ Frontend on Vercel is NOT CONNECTED to backend
- ❌ Login/Registration failing
- ❌ Shows default/demo user data

## 🎯 Root Cause
Your Vercel frontend is still trying to connect to `localhost` instead of your Render backend URL.

## ✅ SOLUTION - Follow These Exact Steps

### STEP 1: Get Your Render Backend URL

1. Go to: https://dashboard.render.com
2. Click on your **SkillOrbit backend** service
3. At the top, you'll see the URL (e.g., `skillorbit-backend.onrender.com`)
4. **COPY THIS URL** - you'll need it!

Example: If it shows `https://skillorbit-abc123.onrender.com`, your API URL will be:
```
https://skillorbit-abc123.onrender.com/api
```
⚠️ **IMPORTANT:** Make sure to add `/api` at the end!

---

### STEP 2: Add Environment Variable to Vercel (CRITICAL!)

1. Go to: https://vercel.com/dashboard
2. Click on your **SkillOrbit project**
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)
5. Click **Add New** button
6. Fill in:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://your-render-url.onrender.com/api` (use YOUR actual URL from Step 1)
   - **Environment:** Check ALL three boxes (Production, Preview, Development)
7. Click **Save**

---

### STEP 3: Add Frontend URL to Render Backend

1. Go back to: https://dashboard.render.com
2. Click on your backend service
3. Click **Environment** tab (left sidebar)
4. Find `FRONTEND_URL` variable (or click **Add Environment Variable**)
5. Set the value to your Vercel URL (e.g., `https://your-project.vercel.app`)
   - Get this from your Vercel dashboard
6. Click **Save Changes**
7. ⏳ Wait for Render to redeploy (takes ~2 minutes)

---

### STEP 4: Redeploy Vercel Frontend

1. Go to your Vercel dashboard
2. Click on your project
3. Click **Deployments** tab
4. Find the latest deployment
5. Click the **⋮** (three dots) button on the right
6. Click **Redeploy**
7. Click **Redeploy** again to confirm
8. ⏳ Wait for deployment to complete (~1-2 minutes)

---

### STEP 5: Clear Browser Cache & Test

1. Open your Vercel URL in browser
2. Press **Ctrl + Shift + R** (hard refresh) or **Ctrl + F5**
3. Open Developer Console (F12)
4. Go to **Console** tab
5. You should see the correct API URL being used
6. Try to register a new account
7. Try to login
8. ✅ Should work now!

### Step 3: Verify

1. Wait for both services to finish deploying (2-3 minutes)
2. Open your Vercel URL
3. Try to login
4. Should work! ✅

## 🔍 How to Find Your URLs

### Render Backend URL:
- Go to Render dashboard
- Your service URL is at the top (e.g., `skillorbit-backend.onrender.com`)
- Add `https://` before it
- Example: `https://skillorbit-backend.onrender.com`

### Vercel Frontend URL:
- Go to Vercel dashboard
- Your deployment URL is shown (e.g., `skillorbit.vercel.app`)
- Add `https://` before it
- Example: `https://skillorbit.vercel.app`

## 🔍 How to Verify It's Working

### Test 1: Check API URL in Browser Console
1. Open your Vercel site
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Type this and press Enter:
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_BASE_URL)
   ```
5. It should show your Render URL, NOT `localhost`

### Test 2: Check Network Requests
1. With Developer Tools open (F12)
2. Go to **Network** tab
3. Try to login or register
4. Look for API calls - they should go to your Render URL
5. Check the response - should NOT be CORS errors

### Test 3: Backend Health Check
Open this URL in a new tab (replace with YOUR Render URL):
```
https://your-backend.onrender.com/
```
You should see: "Skill Matrix Backend running 🚀"

---

## 🐛 Still Having Issues?

### Issue: "Login Failed" or "Registration Failed"

**Check Frontend Console:**
1. Open Vercel site
2. Press F12 → Console tab
3. Look for errors

**Common Problems:**
- ❌ `VITE_API_BASE_URL` not set in Vercel → Go back to Step 2
- ❌ Wrong URL format → Make sure it ends with `/api`
- ❌ Using `http://` instead of `https://` → Use `https://`
- ❌ Forgot to redeploy → Do Step 4 again

**Fix:**
1. Double-check the environment variable in Vercel Settings
2. Make sure it's: `https://your-render-url.onrender.com/api`
3. Redeploy from Vercel Deployments tab
4. Hard refresh browser (Ctrl + Shift + R)

---

### Issue: CORS Error

**Error Message:** "Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy"

**Fix:**
1. Go to Render dashboard → Your service → Environment
2. Check `FRONTEND_URL` = your exact Vercel URL (with `https://`)
3. No trailing slash at the end!
4. Wait for Render to redeploy
5. Test again

---

### Issue: Backend Not Responding (504 Gateway Timeout)

**Problem:** Render free tier services "sleep" after inactivity

**Fix:**
1. The first request after sleeping takes 30-60 seconds
2. Just wait and try again
3. Keep the backend URL open in a tab to keep it "awake"

---

### Issue: Shows Default User / Can't Register

**Problem:** Frontend not connected to backend at all

**Fix:**
1. Clear browser cache completely
2. Open Developer Tools (F12) → Application tab
3. Click "Clear site data"
4. Hard refresh (Ctrl + Shift + R)
5. Try again

## 📝 Complete Checklist

### Before You Start:
- [ ] I have my Render backend URL (from Render dashboard)
- [ ] I have my Vercel frontend URL (from Vercel dashboard)
- [ ] Backend shows "Skill Matrix Backend running 🚀" when I visit it

### Configuration:
- [ ] Added `VITE_API_BASE_URL` to Vercel Environment Variables
- [ ] Value is `https://[render-url].onrender.com/api` (with `/api` at end)
- [ ] Added to ALL environments (Production, Preview, Development)
- [ ] Added `FRONTEND_URL` to Render Environment Variables
- [ ] Value is `https://[vercel-url].vercel.app` (NO slash at end)

### Deployment:
- [ ] Saved changes in Vercel (clicked Save button)
- [ ] Saved changes in Render (clicked Save Changes button)
- [ ] Waited for Render to redeploy (check Logs tab)
- [ ] Manually redeployed Vercel (from Deployments tab)
- [ ] Both services show "Running" status

### Testing:
- [ ] Hard refreshed browser (Ctrl + Shift + R)
- [ ] Opened Developer Console (F12)
- [ ] Checked API URL is correct (not localhost)
- [ ] Tried to register a new user
- [ ] Registration successful ✅
- [ ] Tried to login with new user
- [ ] Login successful ✅
- [ ] Dashboard loads with real data ✅

---

## 🎯 Example Configuration

Let's say your URLs are:
- **Render Backend:** `https://skillorbit-backend-xyz.onrender.com`
- **Vercel Frontend:** `https://skillorbit-frontend.vercel.app`

### In Vercel Environment Variables:
```
VITE_API_BASE_URL = https://skillorbit-backend-xyz.onrender.com/api
```
✅ Note the `/api` at the end!

### In Render Environment Variables:
```
FRONTEND_URL = https://skillorbit-frontend.vercel.app
```
✅ No trailing slash!

---

## 🚨 Critical Points

1. **MUST add `/api` to Render URL** in Vercel
   - ❌ Wrong: `https://your-backend.onrender.com`
   - ✅ Correct: `https://your-backend.onrender.com/api`

2. **NO trailing slash in Vercel URL** in Render
   - ❌ Wrong: `https://your-frontend.vercel.app/`
   - ✅ Correct: `https://your-frontend.vercel.app`

3. **MUST use `https://`** not `http://`

4. **MUST redeploy Vercel** after adding environment variable
   - Environment variables only take effect after redeployment

5. **MUST wait for Render** to finish redeploying
   - Check Logs tab to see when it's done

---

## 💡 Pro Tips

- Keep both dashboards open in separate tabs
- Check "Running" status before testing
- First request to sleeping backend takes 30-60 seconds
- Use hard refresh (Ctrl + Shift + R) not regular refresh
- Check browser console for actual errors

---

## ✅ Success Indicators

You'll know it's working when:
1. No CORS errors in console
2. API calls go to Render URL (check Network tab)
3. Can register new users successfully
4. Can login and see dashboard
5. Real data loads (not demo data)

---

**Still stuck? Share your exact Render and Vercel URLs and I'll give you the exact values to use!**
