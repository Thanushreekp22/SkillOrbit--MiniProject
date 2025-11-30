# Email Service - Quick Setup for Production

## Problem
Gmail SMTP is blocked by Render and other cloud hosting providers, causing email sending to fail in production.

## Solution
Use **Brevo (Sendinblue)** - a free, cloud-friendly email service.

---

## 🚀 Quick Setup (5 Minutes)

### 1. Create Brevo Account
- Visit: https://www.brevo.com
- Sign up (free, no credit card)
- Verify your email

### 2. Get SMTP Key
- Dashboard → **SMTP & API** → **SMTP** tab
- Click **"Generate new SMTP key"**
- Copy the key (starts with `xkeysib-`)

### 3. Verify Sender Email
- Dashboard → **Senders** → **Add a sender**
- Enter: `skillorbit.web.2025@gmail.com`
- Check inbox for verification link
- Click verify

### 4. Update Render Environment Variables

Go to your Render dashboard → **skillorbit-backend** → **Environment**

**Add these variables:**

```
EMAIL_SERVICE = brevo
BREVO_API_KEY = xkeysib-xxxxx (paste your key from step 2)
```

**Keep these existing:**
```
EMAIL_USER = skillorbit.web.2025@gmail.com
EMAIL_FROM = SkillOrbit <skillorbit.web.2025@gmail.com>
EMAIL_HOST = smtp-relay.brevo.com
EMAIL_PORT = 587
```

### 5. Save & Deploy
- Click "Save Changes" in Render
- Wait for automatic redeployment (~2-3 minutes)
- Test user registration on your live site!

---

## ✅ Testing

1. **Production Test**: Register a new user at https://skill-orbit-mini-project.vercel.app
2. **Check Email**: Look for OTP in inbox (check spam folder)
3. **Verify in Brevo**: Dashboard → Logs → Email Logs

---

## 💡 Local Development

Your local setup (Gmail) still works! The `.env` file is configured to use Gmail on your machine:

```bash
EMAIL_SERVICE=smtp  # Uses Gmail locally
```

Only Render uses Brevo because `EMAIL_SERVICE=brevo` in production.

---

## 📊 Brevo Free Tier

- **300 emails/day** (more than enough for OTPs and welcome emails)
- **Unlimited contacts**
- **Email tracking & analytics**
- **Professional deliverability**

---

## 🆘 Troubleshooting

**Email not received?**
1. Check Brevo dashboard → Logs
2. Check spam folder
3. Verify sender email is approved in Brevo
4. Check Render logs for errors

**"Invalid credentials" error?**
- Make sure you copied the **SMTP key**, not REST API key
- Check BREVO_API_KEY is correct in Render environment variables

**"Sender not authorized"?**
- Verify your email in Brevo dashboard → Senders

---

## 📚 Full Documentation

See `BREVO_EMAIL_SETUP.md` for detailed setup instructions and troubleshooting.

---

**That's it!** Your email service will now work perfectly in production. 🎉
