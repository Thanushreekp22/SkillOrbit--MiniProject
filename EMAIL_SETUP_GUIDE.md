# 📧 Email Service Setup Guide for Cloud Deployment

## Problem
Gmail blocks SMTP access from cloud platforms like Render, Heroku, and Vercel for security reasons. This causes email verification (OTP) to fail in production.

## ✅ Solution: Use SendGrid (Recommended)

SendGrid is a cloud-friendly email service that offers:
- ✅ **100 free emails per day** (more than enough for most apps)
- ✅ Works perfectly on all cloud platforms
- ✅ High deliverability rates
- ✅ Easy setup (5 minutes)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create SendGrid Account
1. Go to [https://sendgrid.com/](https://sendgrid.com/)
2. Click **"Start for Free"**
3. Sign up with your email
4. Verify your email address

### Step 2: Create API Key
1. After login, go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name it: `SkillOrbit-Production`
4. Select **"Full Access"** (or at minimum: Mail Send)
5. Click **"Create & View"**
6. **COPY THE API KEY** (you'll only see it once!)
   - Format: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 3: Verify Sender Identity
1. Go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in the form:
   - From Name: `SkillOrbit`
   - From Email: `skillorbit.web.2025@gmail.com` (or any email you own)
   - Reply To: Same as From Email
   - Company Address: Your address
4. Check your email and click the verification link
5. ✅ Sender verified!

### Step 4: Add to Render
1. Go to your Render dashboard
2. Select your **skillorbit-backend** service
3. Click **Environment** tab
4. Click **"Add Environment Variable"**
5. Add:
   - Key: `SENDGRID_API_KEY`
   - Value: `SG.your_api_key_here` (paste your API key)
6. Click **"Save Changes"**
7. Service will automatically redeploy ✅

### Step 5: Update EMAIL_FROM
1. In Render Environment variables
2. Update `EMAIL_FROM` to match your verified sender:
   - Value: `SkillOrbit <skillorbit.web.2025@gmail.com>`

---

## 🧪 Testing

### Test Locally
```bash
# Add to backend/.env
SENDGRID_API_KEY=SG.your_api_key_here
EMAIL_FROM=SkillOrbit <your-verified-email@gmail.com>

# Start backend
cd backend
npm start

# Register a new user - check your email for OTP
```

### Test in Production
1. Go to your deployed app: https://skill-orbit-mini-project.vercel.app
2. Click **Register**
3. Fill in the form with your email
4. Check your inbox for the OTP email
5. ✅ If you receive it, email service is working!

---

## 📊 SendGrid Dashboard

After sending emails, check:
- **Activity** → See all sent emails
- **Statistics** → Track delivery rates
- **Suppressions** → Check for bounced/blocked emails

---

## 🔄 Alternative Options

### Option 1: Resend (Modern alternative)
- Free: 100 emails/day
- Setup: https://resend.com/
- Add to .env: `RESEND_API_KEY`

### Option 2: Mailgun
- Free: 100 emails/day (first month)
- Setup: https://www.mailgun.com/
- Add to .env: `MAILGUN_API_KEY` and `MAILGUN_DOMAIN`

### Option 3: Brevo (formerly Sendinblue)
- Free: 300 emails/day
- Setup: https://www.brevo.com/
- Add to .env: `BREVO_API_KEY`

---

## 🐛 Troubleshooting

### "401 Unauthorized" Error
- ❌ API key is incorrect
- ✅ Copy the key again from SendGrid
- ✅ Make sure there are no extra spaces

### "403 Forbidden" Error
- ❌ Sender email not verified
- ✅ Go to SendGrid → Sender Authentication → Verify

### Emails go to Spam
- ✅ Complete Domain Authentication (advanced)
- ✅ Add SPF and DKIM records to your domain

### Still not working?
1. Check Render logs: `Dashboard → Service → Logs`
2. Look for "Email transporter created successfully"
3. If you see errors, check the API key format

---

## 💡 Pro Tips

1. **Monitor Usage**: SendGrid dashboard shows your daily email count
2. **Template Emails**: Use SendGrid's dynamic templates for better design
3. **Domain Authentication**: For higher limits, authenticate your domain
4. **Webhooks**: Track email opens, clicks, and bounces
5. **Multiple Keys**: Create separate keys for dev/staging/production

---

## 📝 Current Configuration

Your app is already configured to support SendGrid! Just add the API key and it will work automatically.

**Priority order:**
1. ✅ SendGrid (if `SENDGRID_API_KEY` is set) - **RECOMMENDED**
2. ⚠️ Gmail/SMTP (if `EMAIL_USER` + `EMAIL_PASS` is set) - May not work on cloud
3. 📝 Console logging (development mode)

---

## 🎉 Success Checklist

- [ ] Created SendGrid account
- [ ] Created API key
- [ ] Verified sender email
- [ ] Added `SENDGRID_API_KEY` to Render
- [ ] Updated `EMAIL_FROM` to match verified sender
- [ ] Tested registration with real email
- [ ] Received OTP email successfully

---

## Need Help?

- SendGrid Docs: https://docs.sendgrid.com/
- SendGrid Support: https://support.sendgrid.com/
- GitHub Issues: https://github.com/Thanushreekp22/SkillOrbit--MiniProject/issues

---

**Note**: The code automatically detects SendGrid and uses it if available. No code changes needed! 🎉
