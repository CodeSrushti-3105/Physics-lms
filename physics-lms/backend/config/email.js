const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send verification email
const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
    
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Physics LMS'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Welcome ${name}!</h2>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4f8ef7; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Verify Email
          </a>
          <p>Or copy this link: ${verificationUrl}</p>
          <p style="color: #999; font-size: 12px;">Link expires in 24 hours</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

module.exports = { sendVerificationEmail };
