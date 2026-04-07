# Email Verification - Quick Setup Checklist

## ✅ What's Already Done

- [x] Backend email verification routes implemented
- [x] Frontend verification page created
- [x] Login/Register pages updated
- [x] Email templates configured
- [x] User model has verification fields
- [x] Nodemailer installed

## 🔧 What You Need to Do

### Step 1: Setup Gmail App Password (5 minutes)

1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left sidebar
3. Enable "2-Step Verification" if not already enabled
4. Search for "App passwords" or go to: https://myaccount.google.com/apppasswords
5. Select:
   - App: "Mail"
   - Device: "Other (Custom name)"
   - Name it: "Physics LMS"
6. Click "Generate"
7. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)

### Step 2: Update Backend .env File

Open `physics-lms/backend/.env` and replace:

```env
EMAIL_USER=your-email@gmail.com          # Replace with your actual Gmail
EMAIL_PASSWORD=your-app-password         # Replace with 16-char app password
```

Example:
```env
EMAIL_USER=sbclasses2024@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Step 3: Test Locally

```bash
# Terminal 1 - Start Backend
cd physics-lms/backend
npm start

# Terminal 2 - Start Frontend
cd physics-lms/frontend
npm start
```

Then:
1. Go to http://localhost:3000
2. Click "Register"
3. Fill in the form with a REAL email address
4. Submit
5. Check your email inbox
6. Click the verification link
7. Try to login

### Step 4: Update Production (Render)

1. Go to Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add these variables:
   - `EMAIL_SERVICE` = `gmail`
   - `EMAIL_USER` = `your-email@gmail.com`
   - `EMAIL_PASSWORD` = `your-16-char-app-password`
   - `APP_NAME` = `Physics LMS`
5. Click "Save Changes"
6. Service will auto-redeploy

### Step 5: Commit Changes

```bash
cd physics-lms
git add .
git commit -m "Add email verification for student registration"
git push
```

## 🧪 Testing Checklist

- [ ] Register with real email
- [ ] Receive verification email
- [ ] Click verification link
- [ ] See success message
- [ ] Try to login before verification (should fail)
- [ ] Try to login after verification (should work)
- [ ] Test "Resend verification email" button
- [ ] Check spam folder if email not received

## 📧 Email Configuration

Current setup uses Gmail. If you want to use a different service:

### SendGrid (Professional)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

### AWS SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
EMAIL_USER=your-aws-access-key
EMAIL_PASSWORD=your-aws-secret-key
```

## 🐛 Troubleshooting

### Email not sending?
- Check Gmail App Password is correct (no spaces)
- Verify 2FA is enabled on Google account
- Check backend console for errors
- Try sending a test email manually

### Token expired?
- Tokens expire after 24 hours
- Use "Resend verification email" button on login page

### Email goes to spam?
- Add sender to contacts
- Check email provider settings
- Consider using SendGrid for production

## 📚 Documentation

- `EMAIL_VERIFICATION_SETUP.md` - Complete setup guide
- `CHANGES_SUMMARY.md` - All changes made
- `SETUP_CHECKLIST.md` - This file

## 🎯 Expected User Flow

1. **Student registers** → System creates account + sends verification email
2. **Student checks email** → Clicks verification link
3. **Email verified** → Student can now login
4. **Student logs in** → Access granted (pending admin approval)
5. **Admin approves** → Student gets full access

## ⚠️ Important Notes

- Email verification is required BEFORE login
- Admin approval is still required AFTER email verification
- Verification links expire after 24 hours
- Students can request new verification emails
- Use a real email for testing

## 🚀 Ready to Go!

Once you complete Steps 1-5 above, your email verification system will be fully functional!
