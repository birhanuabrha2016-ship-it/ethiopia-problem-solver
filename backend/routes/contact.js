const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');

// Contact form endpoint
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email to you (admin)
    const adminMailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // This sends to YOUR email
      subject: `📬 New Contact Form Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2 style="color: #667eea;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message}
          </div>
          <p style="color: #888; font-size: 12px; margin-top: 20px;">
            Sent from Ethiopia Problem Solver Contact Form
          </p>
        </div>
      `
    };

    // Auto-reply to user
    const userMailOptions = {
      from: `"Birhanu Abrha" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting Ethiopia Problem Solver",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2 style="color: #667eea;">Thank You for Reaching Out!</h2>
          <p>Dear ${name},</p>
          <p>Thank you for contacting Ethiopia Problem Solver. I have received your message and will get back to you as soon as possible.</p>
          <p><strong>Your message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message}
          </div>
          <p style="margin-top: 20px;">Best regards,<br><strong>Birhanu Abrha</strong><br>Founder, Ethiopia Problem Solver</p>
          <p style="color: #888; font-size: 12px; margin-top: 20px;">
            📧 birhanuabrha2016@gmail.com | 📱 +251 942 780 234
          </p>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).json({ 
      message: "Message sent successfully! Check your email for confirmation." 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      message: "Failed to send message. Please try again." 
    });
  }
});

module.exports = router;