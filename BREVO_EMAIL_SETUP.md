# Brevo Email Service Setup Guide

## Why Brevo Instead of Gmail?

Gmail SMTP is **blocked by most cloud hosting providers** including Render, Heroku, and Railway due to security restrictions. Brevo (formerly Sendinblue) provides:

- ✅ **300 free emails per day** (sufficient for most applications)
- ✅ **Cloud-friendly SMTP relay** (not blocked by hosting providers)
- ✅ **Professional email infrastructure** with deliverability tracking
- ✅ **No credit card required** for free tier
- ✅ **Simple API key authentication**

## Step 1: Create Brevo Account

1. Visit [https://www.brevo.com/](https://www.brevo.com/) (formerly sendinblue.com)
2. Click **"Sign Up Free"**
3. Fill in your details:
   - Email: Use your company/project email
   - Choose a password
   - Verify your email address

## Step 2: Get SMTP API Key

1. Log in to your Brevo dashboard
2. Navigate to **"SMTP & API"** in the top menu
3. Click on **"SMTP"** tab
4. Click **"Generate a new SMTP key"** or use existing one
5. **Copy the API key** - you'll need this for `BREVO_API_KEY`

**Important:** This is NOT the same as a REST API key. Make sure you're in the SMTP section.

## Step 3: Verify Your Sender Email

Brevo requires sender email verification for anti-spam compliance:

1. In Brevo dashboard, go to **"Senders"** section
2. Click **"Add a sender"**
3. Enter your email: `skillorbit.web.2025@gmail.com`
4. Check your email inbox for verification link
5. Click the verification link
6. Wait for approval (usually instant)

## Step 4: Configure Environment Variables

### For Local Development (.env file)

Add these lines to your `backend/.env` file:

```bash
# Email Service Configuration
EMAIL_SERVICE=brevo
BREVO_API_KEY=your_brevo_smtp_api_key_here
EMAIL_USER=skillorbit.web.2025@gmail.com
EMAIL_FROM=SkillOrbit <skillorbit.web.2025@gmail.com>

# Optional SMTP config (already set to Brevo defaults)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### For Render Deployment

1. Go to your Render dashboard: [https://dashboard.render.com/](https://dashboard.render.com/)
2. Select your **skillorbit-backend** service
3. Click **"Environment"** tab
4. Add/Update these environment variables:

| Variable Name | Value | Notes |
|--------------|--------|-------|
| `EMAIL_SERVICE` | `brevo` | Set this to use Brevo |
| `BREVO_API_KEY` | `xkeysib-xxxx...` | Your SMTP API key from Step 2 |
| `EMAIL_USER` | `skillorbit.web.2025@gmail.com` | Your verified sender email |
| `EMAIL_FROM` | `SkillOrbit <skillorbit.web.2025@gmail.com>` | Display name + email |
| `EMAIL_HOST` | `smtp-relay.brevo.com` | Already set in render.yaml |
| `EMAIL_PORT` | `587` | Already set in render.yaml |

5. Click **"Save Changes"**
6. Render will automatically redeploy with new environment variables

## Step 5: Test Email Sending

### Test Locally

1. Start your backend server:
```bash
cd backend
npm start
```

2. Test user registration or password reset:
   - Go to `http://localhost:5173` (frontend)
   - Try to register a new account
   - Check your email inbox for OTP

### Test on Production

1. After deploying to Render, test registration on your live site:
   - Visit `https://skill-orbit-mini-project.vercel.app`
   - Register with a real email address
   - Verify you receive the OTP email

2. Check Brevo dashboard for email statistics:
   - Go to **"Statistics"** → **"Email"**
   - You should see sent emails and delivery status

## Troubleshooting

### Email Not Received?

1. **Check Brevo Dashboard**:
   - Go to **"Logs"** → **"Email Logs"**
   - Look for your sent email
   - Check delivery status

2. **Check Spam Folder**:
   - Brevo emails may land in spam initially
   - Mark as "Not Spam" to improve future deliverability

3. **Verify Sender Email**:
   - Ensure `EMAIL_USER` is verified in Brevo dashboard
   - Unverified senders will be rejected

4. **Check Environment Variables**:
   - Verify `BREVO_API_KEY` is set correctly (starts with `xkeysib-`)
   - Ensure `EMAIL_SERVICE=brevo` is set

5. **Review Server Logs**:
   - Check Render logs for email sending errors
   - Look for "Email sent successfully" messages

### Common Errors

**Error: "Invalid credentials"**
- Double-check your BREVO_API_KEY
- Make sure you copied the SMTP key, not the REST API key

**Error: "Sender not authorized"**
- Verify your EMAIL_USER in Brevo dashboard
- Wait for approval if recently added

**Error: "Daily quota exceeded"**
- Free tier limit: 300 emails/day
- Upgrade to paid plan if needed

## Brevo Free Tier Limits

- **Emails per day**: 300
- **Contacts**: Unlimited
- **Email API**: Yes
- **SMS**: No (paid feature)
- **Marketing automation**: Limited
- **Email templates**: Yes

For SkillOrbit's OTP and welcome emails, 300/day is more than sufficient.

## Alternative: Keep Gmail for Development

If you want to use Gmail locally but Brevo in production:

### Local .env (Development)
```bash
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_app_password_here
```

### Render (Production)
```bash
EMAIL_SERVICE=brevo
BREVO_API_KEY=xkeysib-xxxx...
```

The code automatically handles both configurations.

## Support Resources

- **Brevo Documentation**: [https://developers.brevo.com/docs](https://developers.brevo.com/docs)
- **SMTP Configuration**: [https://help.brevo.com/hc/en-us/articles/209467485](https://help.brevo.com/hc/en-us/articles/209467485)
- **Email Best Practices**: [https://www.brevo.com/blog/email-deliverability/](https://www.brevo.com/blog/email-deliverability/)

## Next Steps

After successful email setup:

1. ✅ Test user registration flow
2. ✅ Test password reset functionality  
3. ✅ Monitor email delivery rates in Brevo dashboard
4. ✅ Consider custom email templates for better branding
5. ✅ Set up email tracking and analytics

---

**Need Help?** Check the Brevo support center or review the `backend/src/services/emailService.js` file for implementation details.
