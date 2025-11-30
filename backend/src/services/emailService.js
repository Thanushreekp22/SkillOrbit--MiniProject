import pkg from 'nodemailer';
const { createTransport } = pkg;
import { Resend } from 'resend';
import dotenv from "dotenv";
dotenv.config();

// Initialize email configuration check
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'smtp'; // smtp, resend

console.log('\n📧 Email Service Configuration:');
console.log('   EMAIL_SERVICE:', EMAIL_SERVICE);
if (EMAIL_SERVICE === 'resend') {
  console.log('   RESEND_API_KEY:', RESEND_API_KEY ? '✅ Found' : '❌ Not Found');
  console.log('   Status:', RESEND_API_KEY ? '✅ Resend Email Service ACTIVE (3,000/month free)' : '⚠️ Resend API Key Missing');
} else {
  console.log('   EMAIL_USER:', EMAIL_USER ? '✅ Found' : '❌ Not Found');
  console.log('   EMAIL_PASS:', EMAIL_PASS ? '✅ Found' : '❌ Not Found');
  console.log('   EMAIL_HOST:', process.env.EMAIL_HOST || 'smtp.gmail.com');
  console.log('   EMAIL_PORT:', process.env.EMAIL_PORT || '587');
  console.log('   Status:', (EMAIL_USER && EMAIL_PASS) ? '✅ SMTP Email Service ACTIVE' : '⚠️ Email Disabled - Console Mode');
}
console.log('');

// Initialize Resend client
let resendClient = null;
if (EMAIL_SERVICE === 'resend' && RESEND_API_KEY) {
  resendClient = new Resend(RESEND_API_KEY);
  console.log('✅ Resend client initialized');
}

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to generate OTP email HTML
const generateOTPEmailHTML = (email, otp, name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .otp-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 20px;
          border-radius: 8px;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 10px 0;
        }
        .info-box {
          background: #f8f9fa;
          padding: 15px;
          border-left: 4px solid #667eea;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 SkillOrbit</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Verify Your Email Address</p>
        </div>
        <div class="content">
          <h2 style="color: #667eea;">Hello ${name}! 👋</h2>
          <p>Thank you for registering with SkillOrbit. To complete your registration and start your learning journey, please verify your email address.</p>
          
          <div class="otp-box">
            <p style="margin: 0; font-size: 14px;">Your verification code is:</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 0; font-size: 14px;">This code will expire in 10 minutes</p>
          </div>

          <div class="info-box">
            <p style="margin: 0;"><strong>⚠️ Security Notice:</strong></p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Never share this code with anyone</li>
              <li>SkillOrbit will never ask for your password via email</li>
              <li>If you didn't request this code, please ignore this email</li>
            </ul>
          </div>

          <p>Enter this code on the verification page to activate your account and gain access to:</p>
          <ul style="color: #666;">
            <li>📊 Personalized skill assessments</li>
            <li>🎓 AI-powered learning paths</li>
            <li>📈 Progress tracking and analytics</li>
            <li>🏆 Achievement system and badges</li>
          </ul>

          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If you didn't create an account with SkillOrbit, you can safely ignore this email.
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 10px 0;">© 2024 SkillOrbit. All rights reserved.</p>
          <p style="margin: 0; color: #999;">Building skills, Building futures 🚀</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Create email transporter based on configured service (for non-Resend providers)
const createTransporter = () => {
  const emailService = process.env.EMAIL_SERVICE || 'smtp';
  
  // Resend uses its own client, not nodemailer transporter
  if (emailService === 'resend') {
    return null; // Use resendClient instead
  }
  
  // Fall back to SMTP (works with Gmail and other providers)
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;
  const emailHost = process.env.EMAIL_HOST || 'smtp-relay.brevo.com';
  const emailPort = parseInt(process.env.EMAIL_PORT || '587');
  const emailSecure = process.env.EMAIL_SECURE === 'true';
  
  if (emailUser && emailPass) {
    console.log('🔧 Creating SMTP transporter for:', emailUser);
    console.log('   Host:', emailHost);
    console.log('   Port:', emailPort);
    
    try {
      const config = {
        host: emailHost,
        port: emailPort,
        secure: emailSecure,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 15000,
        tls: {
          rejectUnauthorized: false // For cloud deployments
        }
      };
      
      // Don't use 'service' option for non-Gmail providers
      if (emailHost.includes('gmail')) {
        config.service = 'gmail';
      }
      
      const transporter = createTransport(config);
      console.log('✅ SMTP transporter created successfully');
      return transporter;
    } catch (error) {
      console.error('❌ Error creating SMTP transporter:', error.message);
      return null;
    }
  } else {
    console.log('⚠️  Email service not configured. OTP will be logged to console.');
    console.log('   Missing:', !emailUser ? 'EMAIL_USER' : 'EMAIL_PASS');
    return null;
  }
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  try {
    // Use Resend if configured
    if (EMAIL_SERVICE === 'resend' && resendClient) {
      console.log('📤 Sending OTP via Resend to:', email);
      
      const htmlContent = generateOTPEmailHTML(email, otp, name);
      
      const data = await resendClient.emails.send({
        from: process.env.EMAIL_FROM || 'SkillOrbit <onboarding@resend.dev>',
        to: email,
        subject: 'Verify Your Email - SkillOrbit',
        html: htmlContent
      });
      
      console.log('✅ Email sent via Resend:', data.id);
      return { 
        success: true, 
        message: 'OTP sent successfully via Resend',
        messageId: data.id 
      };
    }
    
    // Use SMTP transporter (Gmail, etc.)
    const transporter = createTransporter();
    
    if (!transporter) {
      // For development - just log the OTP
      console.log('\n\n');
      console.log('🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔');
      console.log('═══════════════════════════════════════');
      console.log('📧 OTP EMAIL (Development Mode)');
      console.log('═══════════════════════════════════════');
      console.log(`📨 To: ${email}`);
      console.log(`👤 Name: ${name}`);
      console.log(`\n🔑 OTP CODE: ${otp}\n`);
      console.log('⏰ Valid for: 10 minutes');
      console.log('═══════════════════════════════════════');
      console.log('🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔');
      console.log('\n\n');
      return { success: true, message: 'OTP logged to console (dev mode)' };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"SkillOrbit" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - SkillOrbit',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 40px 30px;
            }
            .otp-box {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
              padding: 20px;
              border-radius: 8px;
              margin: 30px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 10px 0;
            }
            .info-box {
              background: #f8f9fa;
              padding: 15px;
              border-left: 4px solid #667eea;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 SkillOrbit</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Verify Your Email Address</p>
            </div>
            <div class="content">
              <h2 style="color: #667eea;">Hello ${name}! 👋</h2>
              <p>Thank you for registering with SkillOrbit. To complete your registration and start your learning journey, please verify your email address.</p>
              
              <div class="otp-box">
                <p style="margin: 0; font-size: 14px;">Your verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 0; font-size: 14px;">This code will expire in 10 minutes</p>
              </div>

              <div class="info-box">
                <p style="margin: 0;"><strong>⚠️ Security Notice:</strong></p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Never share this code with anyone</li>
                  <li>SkillOrbit will never ask for your password via email</li>
                  <li>If you didn't request this code, please ignore this email</li>
                </ul>
              </div>

              <p>Enter this code on the verification page to activate your account and gain access to:</p>
              <ul style="color: #666;">
                <li>📊 Personalized skill assessments</li>
                <li>🎓 AI-powered learning paths</li>
                <li>📈 Progress tracking and analytics</li>
                <li>🏆 Achievement system and badges</li>
              </ul>
            </div>
            <div class="footer">
              <p style="margin: 0 0 10px 0;"><strong>SkillOrbit</strong> - Your Personalized Learning Platform</p>
              <p style="margin: 0; font-size: 12px;">This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log('📤 Attempting to send email to:', email);
    console.log('📧 From:', mailOptions.from);
    console.log('📝 Subject:', mailOptions.subject);
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('\n✅✅✅ EMAIL SENT SUCCESSFULLY! ✅✅✅');
    console.log('� To:', email);
    console.log('� Message ID:', info.messageId);
    console.log('� Response:', info.response);
    console.log('✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅\n');
    
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('\n❌❌❌ EMAIL SENDING FAILED! ❌❌❌');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Command:', error.command);
    console.error('Full error:', error);
    console.error('❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌\n');
    
    // Fallback to console logging if email fails
    console.log('\n\n');
    console.log('⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️');
    console.log('═══════════════════════════════════════');
    console.log('📧 OTP EMAIL (Fallback - Email Failed)');
    console.log('═══════════════════════════════════════');
    console.log(`📨 To: ${email}`);
    console.log(`👤 Name: ${name}`);
    console.log(`\n🔑 OTP CODE: ${otp}\n`);
    console.log('⏰ Valid for: 10 minutes');
    console.log(`❌ Error: ${error.message}`);
    console.log('═══════════════════════════════════════');
    console.log('⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️');
    console.log('\n\n');
    
    return { success: true, message: 'OTP logged to console (email service unavailable)' };
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (email, name) => {
  try {
    // Use Resend if configured
    if (EMAIL_SERVICE === 'resend' && resendClient) {
      console.log('📤 Sending welcome email via Resend to:', email);
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
            .content { padding: 30px 0; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to SkillOrbit!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}! 👋</h2>
              <p>Your email has been verified successfully! You're now ready to start your learning journey with SkillOrbit.</p>
              <p><strong>What's next?</strong></p>
              <ul>
                <li>Complete your profile</li>
                <li>Take your first skill assessment</li>
                <li>Explore AI-powered learning paths</li>
                <li>Track your progress</li>
              </ul>
              <p style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">Login to Your Account</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      const data = await resendClient.emails.send({
        from: process.env.EMAIL_FROM || 'SkillOrbit <onboarding@resend.dev>',
        to: email,
        subject: 'Welcome to SkillOrbit! 🎉',
        html: htmlContent
      });
      
      console.log('✅ Welcome email sent via Resend:', data.id);
      return { success: true, messageId: data.id };
    }
    
    // Use SMTP transporter (Gmail, etc.)
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log(`✅ Welcome email would be sent to ${email} (dev mode)`);
      return { success: true };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"SkillOrbit" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to SkillOrbit! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
            .content { padding: 30px 0; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to SkillOrbit!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}! 👋</h2>
              <p>Your email has been verified successfully! You're now ready to start your learning journey with SkillOrbit.</p>
              <p><strong>What's next?</strong></p>
              <ul>
                <li>Complete your profile</li>
                <li>Take your first skill assessment</li>
                <li>Explore AI-powered learning paths</li>
                <li>Track your progress</li>
              </ul>
              <p style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">Login to Your Account</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};
