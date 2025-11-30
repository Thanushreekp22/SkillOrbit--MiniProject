# Resend Email Service - Setup Guide for Render

## ✅ Implementation Complete

The backend is now configured to use **Resend** for email sending in production. Resend offers:

- ✨ **3,000 free emails per month** (10x more than Brevo)
- ⚡ **No sender verification needed** to start
- 🎯 **Modern JSON API** (easier than SMTP)
- 🚀 **Works perfectly on cloud** (Render, Heroku, Vercel, etc.)
- 📊 **Email analytics dashboard**

---

## 🚀 Production Setup (3 Minutes)

### Step 1: Create Resend Account (1 minute)

1. Go to **https://resend.com**
2. Click **"Start Building"**
3. Sign up with:
   - GitHub (recommended - instant)
   - Email address

### Step 2: Get API Key (30 seconds)

1. After login, you'll see the dashboard
2. Click **"API Keys"** in the left sidebar
3. Click **"+ Create API Key"**
4. Enter name: `SkillOrbit Production`
5. Select permission: **"Sending access"**
6. Click **"Add"**
7. **Copy the API key** (starts with `re_`)

   ⚠️ **Important**: Save this key securely - you won't see it again!

### Step 3: Configure Render (1 minute)

1. Go to **https://dashboard.render.com**
2. Select your **skillorbit-backend** service
3. Click **"Environment"** tab in the left sidebar
4. Add/Update these variables:

   | Variable Name | Value | Notes |
   |--------------|--------|-------|
   | `EMAIL_SERVICE` | `resend` | Switch to Resend |
   | `RESEND_API_KEY` | `re_xxxxx` | Your API key from Step 2 |
   | `EMAIL_FROM` | `SkillOrbit <skillorbit.web.2025@gmail.com>` | Your sender email |

5. Click **"Save Changes"**

### Step 4: Deploy & Test (1 minute)

1. Render will automatically redeploy (takes ~2-3 minutes)
2. Watch the **"Logs"** tab for deployment progress
3. Wait for **"Live"** status (green indicator)
4. Test registration on: **https://skill-orbit-mini-project.vercel.app**

---

## 📧 Email Configuration Details

### Sender Email

Your emails will be sent from: `skillorbit.web.2025@gmail.com`

**Important**: You need to verify this email address in Resend dashboard:
1. Go to Resend Dashboard → **Domains**
2. Click **"Verify single email address"**
3. Enter: `skillorbit.web.2025@gmail.com`
4. Check Gmail inbox for verification link
5. Click to verify

Your emails will show:
```
From: SkillOrbit <skillorbit.web.2025@gmail.com>
```

### Custom Domain (Optional)

To use your own domain (e.g., `noreply@skillorbit.com`):

1. Go to Resend Dashboard → **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `skillorbit.com`
4. Add DNS records (provided by Resend)
5. Wait for verification (5-10 minutes)
6. Update `EMAIL_FROM` in Render:
   ```
   EMAIL_FROM = SkillOrbit <noreply@skillorbit.com>
   ```

---

## 🧪 Testing

### Test User Registration

1. Visit: **https://skill-orbit-mini-project.vercel.app**
2. Click **"Sign Up"** or **"Register"**
3. Enter your real email address
4. Check your inbox for OTP email
5. **Check spam folder** if not in inbox (first emails may land there)

### Verify in Resend Dashboard

1. Go to **https://resend.com/emails**
2. You should see your sent emails
3. Click on an email to see:
   - Delivery status
   - Open rate (if enabled)
   - Bounce information (if any)

### Check Render Logs

1. Go to Render → **skillorbit-backend** → **Logs**
2. Look for these messages:
   ```
   📧 Email Service Configuration:
      EMAIL_SERVICE: resend
      RESEND_API_KEY: ✅ Found
      Status: ✅ Resend Email Service ACTIVE (3,000/month free)
   ```
3. When email is sent:
   ```
   📤 Sending OTP via Resend to: user@example.com
   ✅ Email sent via Resend: <message-id>
   ```

---

## 🔍 Troubleshooting

### Email Not Received

**1. Check Resend Dashboard**
- Go to **Emails** tab
- Find your email in the list
- Check status:
  - ✅ **Delivered**: Email sent successfully
  - ⏳ **Queued**: Still processing
  - ❌ **Failed**: See error message

**2. Check Spam Folder**
- First emails from new senders often go to spam
- Mark as "Not Spam" to improve future delivery
- Consider adding SPF/DKIM records (custom domain only)

**3. Verify Environment Variables**
- Go to Render → Environment
- Confirm `EMAIL_SERVICE` = `resend`
- Confirm `RESEND_API_KEY` starts with `re_`
- Confirm `EMAIL_FROM` is set

**4. Check Render Logs**
- Look for errors like:
  - `❌ Not Found` - API key missing
  - `Invalid API key` - Wrong key
  - `Rate limit exceeded` - Too many emails

### Common Errors

**Error: "Invalid API key"**
```
Solution:
1. Verify API key in Render starts with "re_"
2. Ensure no extra spaces in the key
3. Create a new API key if needed
```

**Error: "Rate limit exceeded"**
```
Solution:
- Free tier limit: 100 emails/day, 3,000/month
- Wait 24 hours for reset
- Upgrade to paid plan if needed
```

**Error: "RESEND_API_KEY: ❌ Not Found"**
```
Solution:
1. Go to Render → Environment
2. Add RESEND_API_KEY variable
3. Paste your API key
4. Save changes and redeploy
```

**Emails going to spam**
```
Solution:
1. Ask users to add skillorbit.web.2025@gmail.com to contacts
2. For production, use custom domain with SPF/DKIM
3. Avoid spam trigger words in email content
4. Keep email volume consistent
```

---

## 📊 Resend Free Tier Limits

| Feature | Free Tier | Notes |
|---------|-----------|-------|
| **Emails per month** | 3,000 | More than enough for OTPs |
| **Emails per day** | 100 | Automatic reset daily |
| **API Keys** | Unlimited | Create multiple for different envs |
| **Email tracking** | ✅ Included | Opens, clicks, bounces |
| **Custom domains** | ✅ 1 domain | Verify your own domain |
| **Support** | Community | Upgrade for priority support |
| **Email analytics** | ✅ Included | View in dashboard |

---

## 🔐 Security Best Practices

### Protect Your API Key

- ✅ Store in environment variables (never in code)
- ✅ Use different keys for dev/staging/production
- ✅ Rotate keys periodically
- ❌ Never commit API keys to Git
- ❌ Don't share keys in screenshots/logs

### Regenerate API Key

If your key is compromised:

1. Go to Resend → **API Keys**
2. Click **"⋮"** next to the compromised key
3. Click **"Delete"**
4. Create a new API key
5. Update Render environment variable
6. Save and redeploy

---

## 💡 Development vs Production

### Local Development (Your Machine)

Uses **Gmail SMTP** (already configured in `.env`):

```bash
EMAIL_SERVICE=smtp
EMAIL_USER=skillorbit.web.2025@gmail.com
EMAIL_PASS=pudesigiugrrmgbj
```

This works fine locally because Gmail allows localhost connections.

### Production (Render Cloud)

Uses **Resend API** (configured in Render environment):

```bash
EMAIL_SERVICE=resend
RESEND_API_KEY=re_xxxxx
```

This is required because Gmail blocks cloud providers.

---

## 📈 Monitoring Email Usage

### View Email Statistics

1. Go to **https://resend.com/emails**
2. See:
   - Total sent today/this month
   - Delivery rate
   - Bounce rate
   - Open rate (if tracking enabled)

### Set Up Alerts

1. Go to Resend → **Settings** → **Notifications**
2. Enable alerts for:
   - Daily usage approaching limit
   - Monthly quota approaching limit
   - Failed deliveries

### Email Logs

Every email is logged with:
- Timestamp
- Recipient
- Subject
- Status (delivered/failed)
- Error message (if failed)

---

## 🚀 Next Steps After Setup

### 1. Test Thoroughly ✅
- [ ] Register a new user
- [ ] Verify OTP email received
- [ ] Check Resend dashboard shows email
- [ ] Test from different email providers (Gmail, Outlook, Yahoo)

### 2. Monitor Performance 📊
- [ ] Check delivery rate in Resend dashboard
- [ ] Monitor spam rate
- [ ] Review failed emails and fix issues

### 3. Optional: Custom Domain 🌐
- [ ] Purchase domain (e.g., skillorbit.com)
- [ ] Add domain to Resend
- [ ] Configure DNS records
- [ ] Update EMAIL_FROM in Render

### 4. Scale as Needed 📈
- [ ] Monitor monthly usage
- [ ] Upgrade to paid plan if needed ($20/month for 50,000 emails)
- [ ] Implement email templates for branding

---

## 📞 Support Resources

- **Resend Documentation**: https://resend.com/docs
- **API Reference**: https://resend.com/docs/api-reference
- **Status Page**: https://status.resend.com
- **Community Discord**: https://resend.com/discord
- **Email Us**: support@resend.com

---

## ✅ Checklist

Before marking this as complete:

- [ ] Resend account created
- [ ] API key generated and saved securely
- [ ] `EMAIL_SERVICE=resend` added to Render
- [ ] `RESEND_API_KEY=re_xxxxx` added to Render
- [ ] `EMAIL_FROM` configured in Render
- [ ] Changes saved in Render
- [ ] Deployment completed successfully
- [ ] Test email sent and received
- [ ] Email visible in Resend dashboard
- [ ] No errors in Render logs

---

**Status**: ✅ Ready for Production

**Implementation Date**: November 30, 2024

**Last Updated**: After switching from Brevo to Resend

**Git Commit**: `c1257c0` - "Switch from Brevo to Resend for email service"
