# 🚀 Deployment Guide - Vercel + Render

## ⚠️ IMPORTANT: Local Storage Won't Work on Render

**Problem**: Render's free tier uses ephemeral storage - files uploaded will be deleted when the server restarts!

**Solution**: You have 2 options:

### Option 1: Use Cloudinary (Recommended for Production)
Keep using Cloudinary for production since it's reliable and persistent.

### Option 2: Use Render Disk Storage (Paid)
Upgrade to Render's paid plan with persistent disk storage.

---

## 🔄 Recommended Setup

### For Production (Vercel + Render):
- **Use Cloudinary** for file storage (reliable, persistent)
- Keep local storage for development only

### For Development (Local):
- **Use Local Storage** (free, simple)

---

## 📋 Safe Git Commit Steps

### Step 1: Verify .gitignore

Check that these files are ignored:

**Backend (.gitignore):**
```
node_modules/
.env
uploads/
```

**Frontend (.gitignore):**
```
.env.production
node_modules/
build/
.env.local
```

### Step 2: Check What Will Be Committed

```bash
cd physics-lms
git status
```

**Should NOT see:**
- ❌ `.env` files
- ❌ `node_modules/`
- ❌ `uploads/` folder
- ❌ Any sensitive data

**Should see:**
- ✅ `.js` files
- ✅ `.json` files
- ✅ `.md` files
- ✅ `.gitignore` files

### Step 3: Add Files

```bash
git add .
```

### Step 4: Commit

```bash
git commit -m "feat: implement local file storage for development"
```

### Step 5: Push

```bash
git push origin main
```

---

## 🌐 Deployment Configuration

### Vercel (Frontend)

**Environment Variables:**
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

### Render (Backend)

**Environment Variables:**
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

---

## 🔧 Switch to Cloudinary for Production

Since Render's free tier doesn't support persistent file storage, you should use Cloudinary for production:

### Step 1: Update server.js

Change this line:
```javascript
// For production (Cloudinary)
app.use('/api/materials', require('./routes/materials'));

// For development (Local Storage)
// app.use('/api/materials', require('./routes/materials-local'));
```

### Step 2: Update Frontend URLs

In `AdminMaterials.js` and `StudentMaterials.js`, the download function already works with both!

### Step 3: Set Environment Variables on Render

Make sure these are set:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## 📝 Environment Variables Checklist

### Backend (Render)
- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Secret for JWT tokens
- [ ] `PORT` - Port number (usually 5001)
- [ ] `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Your Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

### Frontend (Vercel)
- [ ] `REACT_APP_API_URL` - Backend URL (e.g., https://your-app.onrender.com/api)

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep `.env` files in `.gitignore`
- Use environment variables for secrets
- Use different credentials for dev/prod
- Rotate secrets regularly
- Use HTTPS in production

### ❌ DON'T:
- Commit `.env` files
- Hardcode secrets in code
- Share credentials publicly
- Use same credentials for dev/prod
- Commit `node_modules/`

---

## 🧪 Testing After Deployment

### Frontend (Vercel)
1. Visit your Vercel URL
2. Login as admin
3. Try uploading a file
4. Try downloading a file
5. Check if it works

### Backend (Render)
1. Check logs: `https://dashboard.render.com`
2. Test API: `https://your-backend.onrender.com/api/materials`
3. Verify MongoDB connection
4. Check Cloudinary uploads

---

## 🐛 Common Deployment Issues

### Issue: Files disappear after upload
**Cause**: Using local storage on Render (ephemeral)
**Solution**: Switch to Cloudinary for production

### Issue: CORS errors
**Cause**: Frontend can't access backend
**Solution**: Add CORS configuration in backend:
```javascript
app.use(cors({
  origin: 'https://your-frontend.vercel.app',
  credentials: true
}));
```

### Issue: Environment variables not working
**Cause**: Not set in Render/Vercel dashboard
**Solution**: Add them in the dashboard, then redeploy

### Issue: Build fails
**Cause**: Missing dependencies or wrong Node version
**Solution**: Check `package.json` and set Node version in Render

---

## 📊 Deployment Checklist

### Before Deploying:
- [ ] All `.env` files in `.gitignore`
- [ ] No sensitive data in code
- [ ] `uploads/` folder in `.gitignore`
- [ ] Tested locally
- [ ] Committed all changes

### After Deploying:
- [ ] Environment variables set on Render
- [ ] Environment variables set on Vercel
- [ ] Backend is running
- [ ] Frontend is accessible
- [ ] Can login
- [ ] Can upload files
- [ ] Can download files
- [ ] MongoDB connected
- [ ] Cloudinary working

---

## 🎯 Recommended Production Setup

```
Frontend (Vercel)
    ↓
Backend (Render)
    ↓
MongoDB Atlas (Database)
    ↓
Cloudinary (File Storage)
```

**Why this setup:**
- ✅ Vercel: Fast, free, auto-deploys
- ✅ Render: Free backend hosting
- ✅ MongoDB Atlas: Free database
- ✅ Cloudinary: Free file storage (persistent!)

---

## 🔄 Switching Between Local and Cloudinary

### For Development (Local):
```javascript
// server.js
app.use('/api/materials', require('./routes/materials-local'));
```

### For Production (Cloudinary):
```javascript
// server.js
app.use('/api/materials', require('./routes/materials'));
```

Or use environment variable:
```javascript
// server.js
const materialsRoute = process.env.NODE_ENV === 'production' 
  ? require('./routes/materials')
  : require('./routes/materials-local');

app.use('/api/materials', materialsRoute);
```

---

## ✅ Final Steps

1. **Commit your changes** (following steps above)
2. **Push to GitHub**
3. **Vercel will auto-deploy** frontend
4. **Render will auto-deploy** backend
5. **Test everything** works
6. **Monitor logs** for any errors

---

## 🆘 Need Help?

If deployment fails:
1. Check Render logs
2. Check Vercel logs
3. Verify environment variables
4. Test API endpoints manually
5. Check CORS configuration

---

## 🎉 Success!

Once deployed, your app will be live at:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.onrender.com`

Enjoy your deployed Physics LMS! 🚀
