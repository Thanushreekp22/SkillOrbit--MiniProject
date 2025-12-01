import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log('\n🔍 Testing Resend Email Service...\n');
  
  // Check API key
  console.log('1. Checking API Key:');
  if (!process.env.RESEND_API_KEY) {
    console.log('   ❌ RESEND_API_KEY not found in .env file');
    console.log('   ⚠️  Add this to your .env:');
    console.log('   RESEND_API_KEY=re_your_api_key_here\n');
    return;
  }
  
  const keyPreview = process.env.RESEND_API_KEY.substring(0, 10);
  console.log(`   ✅ API Key found: ${keyPreview}...`);
  console.log(`   ✅ Key starts with: ${process.env.RESEND_API_KEY.substring(0, 3)}`);
  
  if (!process.env.RESEND_API_KEY.startsWith('re_')) {
    console.log('   ⚠️  WARNING: API key should start with "re_"\n');
  }
  
  // Test sending email
  console.log('\n2. Attempting to send test email...');
  console.log('   From: SkillOrbit <onboarding@resend.dev>');
  
  // CHANGE THIS TO YOUR EMAIL
  const testEmail = 'YOUR_EMAIL@gmail.com'; // ← Change this!
  console.log(`   To: ${testEmail}`);
  
  if (testEmail === 'YOUR_EMAIL@gmail.com') {
    console.log('\n   ⚠️  Please edit test-resend.js and change testEmail to your real email address!\n');
    return;
  }
  
  try {
    const data = await resend.emails.send({
      from: 'SkillOrbit <onboarding@resend.dev>',
      to: testEmail,
      subject: 'Test Email from SkillOrbit (Resend Test)',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #667eea;">✅ Test Successful!</h1>
          <p>Resend email service is working correctly.</p>
          <p><strong>Configuration:</strong></p>
          <ul>
            <li>API Key: ${keyPreview}...</li>
            <li>From: SkillOrbit &lt;onboarding@resend.dev&gt;</li>
            <li>To: ${testEmail}</li>
          </ul>
          <p>If you received this email, your Resend setup is correct! 🎉</p>
        </div>
      `
    });
    
    console.log('\n✅ SUCCESS! Email sent.');
    console.log('   Message ID:', data.id);
    console.log('   Full response:', JSON.stringify(data, null, 2));
    console.log('\n📧 Check your inbox (and spam folder) for the test email.');
    console.log('🌐 Also check Resend dashboard: https://resend.com/emails\n');
    
  } catch (error) {
    console.log('\n❌ ERROR sending email:');
    console.log('   Message:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n   💡 Solution: Check your API key is correct');
      console.log('      1. Go to https://resend.com/api-keys');
      console.log('      2. Create a new API key');
      console.log('      3. Update RESEND_API_KEY in .env file');
    } else if (error.message.includes('rate limit')) {
      console.log('\n   💡 Solution: You\'ve exceeded the free tier limit');
      console.log('      - Free tier: 100 emails/day, 3,000/month');
      console.log('      - Wait 24 hours or upgrade plan');
    } else {
      console.log('\n   Full error:', error);
    }
    console.log('');
  }
}

testResend();
