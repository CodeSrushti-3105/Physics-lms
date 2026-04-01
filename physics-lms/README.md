# PhysicsLab LMS

A full-stack MERN Learning Management System for Physics classes.

## Setup

### Backend
```bash
cd backend
npm install
# Make sure MongoDB is running locally
npm run dev
```
Server starts on http://localhost:5000  
Default admin: `admin@physics.com` / `admin123`

### Frontend
```bash
cd frontend
npm install
npm start
```
App starts on http://localhost:3000

## Features
- Role-based: Admin (Teacher) + Student
- Student approval system (pending → approved/rejected)
- Batch-wise content (11th / 12th)
- Study materials, MCQ tests with timer, results tracking
- Physics formula library
- Premium animated UI
