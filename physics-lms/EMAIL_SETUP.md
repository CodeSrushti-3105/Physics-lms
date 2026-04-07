# Email Verification Setup

## What It Does
- Student registers → Verification email sent
- Student clicks link → Email verified
- Student can now login

## Setup Steps

### 1. Configure Email in `.env`

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
APP_NAME=Physics LMS
FRONTEND_URL=http://localhost:3000
```

### 2. Get Gmail App Password
1. Enable 2-Factor Authentication on Gmail
2. Go to: Google Account → Security → App passwords
3. Generate password for "Mail"
4. Use that 16-digit password in `.env`

### 3. Test It
```bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm start
```

Register a new student and check your email!

## For Production (Render)
Add these environment variables:
- `EMAIL_SERVICE=gmail`
- `EMAIL_USER=your-email@gmail.com`
- `EMAIL_PASSWORD=your-app-password`
- `FRONTEND_URL=https://your-vercel-app.vercel.app`

That's it!
