const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send verification email
const sendVerificationEmail = async (email, token) => {
  // Use your IP address for the verification link
  const verificationLink = `http://192.168.137.128:3000/verify-email/${token}`;
  
  const mailOptions = {
    from: '"Birhanu Abrha - Ethiopia Problem Solver" <birhanuabrha2016@gmail.com>',
    to: email,
    subject: 'Verify Your Email - Ethiopia Problem Solver',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #667eea; text-align: center;">🇪🇹 Ethiopia Problem Solver</h2>
        <h3 style="color: #333;">Welcome! Please verify your email</h3>
        <p style="color: #666; line-height: 1.6;">
          Thank you for registering! Please click the button below to verify your email address:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Verify Email</a>
        </div>
        <p style="color: #666; line-height: 1.6;">
          Or copy and paste this link in your browser:<br>
          <span style="color: #667eea;">${verificationLink}</span>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 24 hours.
        </p>
        <p style="color: #999; font-size: 12px;">
          Created by Birhanu Abrha | 📧 birhanuabrha2016@gmail.com | 📱 +251 942 780 234
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  // Use your IP address for the reset link
  const resetLink = `http://192.168.137.128:3000/reset-password/${token}`;
  
  const mailOptions = {
    from: '"Birhanu Abrha - Ethiopia Problem Solver" <birhanuabrha2016@gmail.com>',
    to: email,
    subject: 'Reset Your Password - Ethiopia Problem Solver',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #667eea; text-align: center;">🇪🇹 Ethiopia Problem Solver</h2>
        <h3 style="color: #333;">Reset Your Password</h3>
        <p style="color: #666; line-height: 1.6;">
          You requested to reset your password. Click the button below to create a new password:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #666; line-height: 1.6;">
          Or copy and paste this link in your browser:<br>
          <span style="color: #667eea;">${resetLink}</span>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour.
        </p>
        <p style="color: #999; font-size: 12px;">
          If you didn't request this, please ignore this email.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          Created by Birhanu Abrha | 📧 birhanuabrha2016@gmail.com | 📱 +251 942 780 234
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};