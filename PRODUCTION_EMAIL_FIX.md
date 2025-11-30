# Email Service - Quick Setup for Production

## Problem
Gmail SMTP is blocked by Render and other cloud hosting providers, causing email sending to fail in production.

## Solution
Use **Resend** - the easiest, most developer-friendly free email service.

---

## 🚀 Quick Setup (2 Minutes) ⚡

### 1. Create Resend Account
- Visit: https://resend.com
- Click **"Start Building"** or **"Sign Up"**
- Sign up with GitHub or email (free, no credit card)

### 2. Get API Key (Instant)
- After signup, you'll see the dashboard
- Click **"API Keys"** in the left sidebar
- Click **"Create API Key"**
- Give it a name (e.g., "SkillOrbit Production")
- Copy the key (starts with `re_`)

### 3. Update Render Environment Variables

Go to your Render dashboard → **skillorbit-backend** → **Environment**

**Add these variables:**

```
EMAIL_SERVICE = resend
RESEND_API_KEY = re_xxxxx (paste your key from step 2)
EMAIL_FROM = SkillOrbit <onboarding@resend.dev>
```

**That's it!** No sender verification needed to start.

### 4. Save & Deploy
- Click "Save Changes" in Render
- Wait for automatic redeployment (~2-3 minutes)
- Test user registration on your live site!

---

## ✅ Testing

1. **Production Test**: Register a new user at https://skill-orbit-mini-project.vercel.app
2. **Check Email**: Look for OTP in inbox (check spam folder)
3. **Verify in Resend**: Dashboard → Emails → View sent emails

---

## 💡 Local Development

Your local setup (Gmail) still works! The `.env` file is configured to use Gmail on your machine:

```bash
EMAIL_SERVICE=smtp  # Uses Gmail locally
```

Only Render uses Resend because `EMAIL_SERVICE=resend` in production.

---

## 📊 Resend Free Tier

- **3,000 emails/month** (100 emails/day)
- **No credit card required**
- **Email tracking & analytics**
- **Best deliverability**
- **No sender verification needed initially**
- **Modern JSON API (not SMTP)**

---

## 🆘 Troubleshooting

**Email not received?**
1. Check Resend dashboard → Emails
2. Check spam folder
3. Verify API key is correct
4. Check Render logs for errors

**"Invalid API key" error?**
- Make sure you copied the full API key (starts with `re_`)
- Check RESEND_API_KEY is correct in Render environment variables
- Try creating a new API key

**Need custom domain?**
- Resend lets you use `onboarding@resend.dev` by default
- For custom domain (e.g., `noreply@skillorbit.com`), verify domain in Resend dashboard

---

## 🎯 Why Resend is Better

| Feature | Resend | Brevo | Gmail |
|---------|--------|-------|-------|
| Free emails/month | **3,000** | 300 | Unlimited* |
| Works on cloud | ✅ Yes | ✅ Yes | ❌ Blocked |
| Setup time | **2 min** | 5 min | N/A |
| Credit card needed | ❌ No | ❌ No | ❌ No |
| Sender verification | ❌ Not initially | ✅ Required | ✅ Required |
| Developer-friendly | ✅ Best | Medium | N/A |
| API type | Modern JSON | SMTP | SMTP |

**Gmail blocked on Render/Heroku/Railway*

---

**That's it!** Your email service will now work perfectly in production. 🎉
