# Resend Troubleshooting - Not Sending Emails in Production

## Issue
Resend is not sending OTP emails to users in the deployed version on Render.

## Common Causes & Solutions

### 1. RESEND_API_KEY Not Set in Render ⚠️

**Check**: Go to Render Dashboard → skillorbit-backend → Environment

**Required Variables**:
```
EMAIL_SERVICE = resend
RESEND_API_KEY = re_xxxxxxxxxxxxx (must start with "re_")
EMAIL_FROM = SkillOrbit <onboarding@resend.dev>
```

**Fix**:
1. Get API key from https://resend.com/api-keys
2. Click "Create API Key"
3. Copy the key (starts with `re_`)
4. Add to Render environment variables
5. Save and wait for redeployment

---

### 2. Check Render Logs

**View Logs**:
1. Go to Render Dashboard
2. Click on **skillorbit-backend**
3. Click **"Logs"** tab
4. Look for email-related messages

**What to Look For**:

✅ **Good - Service Active**:
```
📧 Email Service Configuration:
   EMAIL_SERVICE: resend
   RESEND_API_KEY: ✅ Found
   Status: ✅ Resend Email Service ACTIVE
```

❌ **Problem - Key Missing**:
```
📧 Email Service Configuration:
   EMAIL_SERVICE: resend
   RESEND_API_KEY: ❌ Not Found
   Status: ⚠️ Email Disabled
```

❌ **Problem - Wrong Service**:
```
📧 Email Service Configuration:
   EMAIL_SERVICE: smtp
```

**When Email Sent**:
```
📤 Sending OTP via Resend to: user@gmail.com
✅ Email sent via Resend. Response: {...}
```

**Error Messages**:
```
❌ Invalid API key
❌ Rate limit exceeded
❌ Failed to send email
```

---

### 3. Verify Resend Dashboard

**Check Sent Emails**:
1. Login to https://resend.com
2. Go to **"Emails"** tab
3. Look for recent sent emails

**Possible Issues**:
- ❌ No emails showing = API key not configured or invalid
- ⏳ Emails in "Queued" = Still processing
- ❌ Emails "Failed" = Check error message
- ✅ Emails "Delivered" = Working but check user's spam folder

---

### 4. Test API Key Locally

**Quick Test**:
```bash
# In backend/.env, temporarily add:
EMAIL_SERVICE=resend
RESEND_API_KEY=re_your_api_key_here

# Run backend
npm start

# Try registering a user
# Check console for errors
```

---

### 5. Common Resend Errors

**Error: "Invalid API key"**
```
Solution:
- API key must start with "re_"
- No extra spaces in the key
- Create a new key if needed
```

**Error: "Rate limit exceeded"**
```
Solution:
- Free tier: 100 emails/day, 3,000/month
- Wait 24 hours or upgrade plan
```

**Error: "Email not sent" (no error message)**
```
Solution:
- RESEND_API_KEY environment variable not set
- Restart Render service after adding env vars
```

---

### 6. Step-by-Step Fix

**If emails aren't sending, follow these steps**:

#### Step 1: Verify Resend Account
- [ ] Login to https://resend.com
- [ ] Confirm account is active
- [ ] Check usage limits not exceeded

#### Step 2: Create/Verify API Key
- [ ] Go to https://resend.com/api-keys
- [ ] Click "Create API Key"
- [ ] Name it: "SkillOrbit Production"
- [ ] Copy the key (starts with `re_`)
- [ ] Save it somewhere secure

#### Step 3: Update Render Environment
- [ ] Go to https://dashboard.render.com
- [ ] Select **skillorbit-backend**
- [ ] Click **"Environment"** tab
- [ ] Find or add `RESEND_API_KEY`
- [ ] Paste your API key
- [ ] Ensure `EMAIL_SERVICE` = `resend`
- [ ] Click **"Save Changes"**

#### Step 4: Wait for Deployment
- [ ] Watch the **"Logs"** tab
- [ ] Wait for "Live" status (green)
- [ ] Look for "Resend Email Service ACTIVE" message

#### Step 5: Test
- [ ] Go to your live site
- [ ] Try to register a new user
- [ ] Check email inbox (and spam folder)
- [ ] Check Resend dashboard for sent emails

---

### 7. Manual Verification Script

Add this to test Resend directly:

**Create**: `backend/test-resend.js`
```javascript
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  try {
    console.log('Testing Resend with API key:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');
    
    const data = await resend.emails.send({
      from: 'SkillOrbit <onboarding@resend.dev>',
      to: 'YOUR_EMAIL@gmail.com', // Replace with your email
      subject: 'Test Email from SkillOrbit',
      html: '<h1>Test Successful!</h1><p>Resend is working correctly.</p>'
    });
    
    console.log('✅ Email sent successfully:', data);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testResend();
```

**Run locally**:
```bash
cd backend
node test-resend.js
```

---

### 8. Alternative: Check Backend Code

**Verify code is using Resend**:

File: `backend/src/services/emailService.js`

Should have:
```javascript
if (EMAIL_SERVICE === 'resend' && resendClient) {
  console.log('📤 Sending OTP via Resend to:', email);
  const data = await resendClient.emails.send({...});
}
```

---

### 9. Quick Checklist

- [ ] Resend account created at https://resend.com
- [ ] API key generated (starts with `re_`)
- [ ] `EMAIL_SERVICE=resend` in Render
- [ ] `RESEND_API_KEY=re_xxx` in Render
- [ ] Environment variables saved in Render
- [ ] Service redeployed (green "Live" status)
- [ ] Logs show "Resend Email Service ACTIVE"
- [ ] Test email sent
- [ ] Checked spam folder
- [ ] Checked Resend dashboard for sent emails

---

### 10. Still Not Working?

**Contact Support**:
- Resend Discord: https://resend.com/discord
- Check Resend status: https://status.resend.com
- Review Render logs for detailed error messages

**Share These Details**:
- Render logs (last 50 lines)
- Resend dashboard screenshot
- Environment variables (hide API key)
- Error messages from browser console

---

## Next Steps

1. Check Render logs RIGHT NOW - what does it say about email service?
2. Verify RESEND_API_KEY is set in Render environment
3. Check Resend dashboard - are emails being sent?
4. Test with a real email registration on your live site
5. Report back with any error messages you see

---

**Most Common Fix**: RESEND_API_KEY not set in Render environment variables! 🔑
