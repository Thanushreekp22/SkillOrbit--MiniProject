# SkillOrbit Deployment Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                       │
│                  https://skillorbit.vercel.app               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS Requests
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React + Vite Application                             │  │
│  │  - Landing Page                                        │  │
│  │  - Dashboard                                           │  │
│  │  - Assessment System                                   │  │
│  │  - Learning Paths                                      │  │
│  │  - Progress Tracking                                   │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Calls
                         │ VITE_API_BASE_URL
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              RENDER (Backend API)                            │
│         https://skillorbit-backend.onrender.com              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Node.js + Express Server                             │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Routes & Controllers                            │  │  │
│  │  │  - User Management                               │  │  │
│  │  │  - Assessment Logic                              │  │  │
│  │  │  - Learning Path Generation                      │  │  │
│  │  │  - Progress Tracking                             │  │  │
│  │  │  - Report Generation                             │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────┬──────────────────────────────┬───────────────────┘
           │                              │
           │ Mongoose ODM                 │ HTTP Requests
           │                              │
           ▼                              ▼
┌─────────────────────────┐    ┌──────────────────────────┐
│   MONGODB ATLAS         │    │    GROQ AI API           │
│   (Database)            │    │    (AI Services)         │
│                         │    │                          │
│  Collections:           │    │  - Question Generation   │
│  - users                │    │  - Learning Path AI      │
│  - assessments          │    │  - Skill Analysis        │
│  - learningpaths        │    │                          │
│  - progress             │    │                          │
│  - roles                │    │                          │
│  - skills               │    │                          │
│  - questionbank         │    │                          │
└─────────────────────────┘    └──────────────────────────┘
```

---

## 🔄 Data Flow

### 1. User Registration/Login
```
Browser → Vercel Frontend → Render Backend → MongoDB
                                    ↓
                              JWT Token Generated
                                    ↓
                          Token stored in localStorage
```

### 2. Taking Assessment
```
Browser → Vercel Frontend → Render Backend → MongoDB (fetch questions)
                                    ↓
                          Questions sent to Frontend
                                    ↓
                          User answers questions
                                    ↓
Browser → Vercel Frontend → Render Backend → MongoDB (save results)
                                    ↓
                          Calculate scores & analysis
```

### 3. AI Learning Path Generation
```
Browser → Vercel Frontend → Render Backend → MongoDB (get user data)
                                    ↓
                          Analyze skill gaps
                                    ↓
                          Call Groq AI API
                                    ↓
                          Generate personalized path
                                    ↓
                          Save to MongoDB
                                    ↓
                          Return to Frontend
```

---

## 🌐 Environment Variables Flow

### Frontend (Vercel)
```javascript
// .env in Vercel
VITE_API_BASE_URL=https://skillorbit-backend.onrender.com/api

// Used in: frontend/src/api/axios.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});
```

### Backend (Render)
```javascript
// Environment Variables in Render
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skillorbit
JWT_SECRET=your_secret_key
JWT_EXPIRES=24h
GROQ_API_KEY=gsk_your_api_key
FRONTEND_URL=https://skillorbit.vercel.app

// Used throughout backend for:
// - Database connection
// - JWT token generation
// - CORS configuration
// - AI API calls
```

---

## 🔐 Security Flow

### Authentication
```
1. User logs in
   ↓
2. Backend validates credentials (bcrypt)
   ↓
3. Generate JWT token (jsonwebtoken)
   ↓
4. Send token to frontend
   ↓
5. Frontend stores in localStorage
   ↓
6. Include token in all API requests (Authorization header)
   ↓
7. Backend validates token on each request
```

### CORS Protection
```
Frontend (Vercel) → Makes request with Origin header
                           ↓
Backend (Render) → Checks if Origin is in allowedOrigins
                           ↓
                    If allowed → Process request
                    If not → Reject with CORS error
```

---

## 📊 Deployment Pipeline

### Backend (Render)
```
GitHub Push
    ↓
Render detects change
    ↓
Pull latest code
    ↓
Run: npm install
    ↓
Run: npm start
    ↓
Health check
    ↓
Deploy ✅
```

### Frontend (Vercel)
```
GitHub Push
    ↓
Vercel detects change
    ↓
Pull latest code
    ↓
Run: npm install
    ↓
Run: npm run build
    ↓
Optimize assets
    ↓
Deploy to CDN
    ↓
Deploy ✅
```

---

## 🔌 API Endpoints Structure

```
Base URL: https://skillorbit-backend.onrender.com/api

Authentication:
├── POST /users/register
├── POST /users/login
└── GET  /users/profile

Assessments:
├── GET  /assessment/questions/:roleId
├── POST /assessment/submit
└── GET  /assessment/results/:userId

Learning Paths:
├── GET  /learning-path/:userId
├── POST /learning-path/generate
└── PUT  /learning-path/update

Progress:
├── GET  /progress/:userId
├── POST /progress/update
└── GET  /progress/stats

Roles & Skills:
├── GET  /roles
├── GET  /roles/:roleId
├── GET  /skills
└── GET  /skills/:skillId

Reports:
├── GET  /reports/:userId
└── POST /reports/generate
```

---

## 💾 Database Schema Overview

```
MongoDB Database: skillorbit

Collections:
├── users
│   ├── _id
│   ├── name
│   ├── email
│   ├── password (hashed)
│   └── createdAt
│
├── assessments
│   ├── _id
│   ├── userId
│   ├── roleId
│   ├── answers[]
│   ├── score
│   └── completedAt
│
├── learningpaths
│   ├── _id
│   ├── userId
│   ├── roleId
│   ├── skills[]
│   ├── resources[]
│   └── generatedAt
│
├── progress
│   ├── _id
│   ├── userId
│   ├── learningPathId
│   ├── completedItems[]
│   └── updatedAt
│
└── roles
    ├── _id
    ├── name
    ├── description
    └── requiredSkills[]
```

---

## 🚀 Performance Considerations

### Frontend (Vercel)
- ✅ Automatic CDN distribution
- ✅ Edge caching
- ✅ Gzip compression
- ✅ Code splitting (Vite)
- ✅ Lazy loading routes

### Backend (Render)
- ⚠️ Free tier sleeps after 15 min inactivity
- ⚠️ First request takes 30-60 seconds to wake
- ✅ Auto-scaling on paid plans
- ✅ Health checks enabled

### Database (MongoDB Atlas)
- ✅ Automatic backups
- ✅ Indexed queries
- ✅ Connection pooling
- ⚠️ Free tier: 512MB storage limit

---

## 🔄 Auto-Deployment Workflow

```
Developer makes changes locally
         ↓
    git add .
    git commit -m "message"
    git push origin main
         ↓
GitHub receives push
         ↓
    ┌────┴────┐
    ↓         ↓
Render    Vercel
detects   detects
         ↓
Both auto-deploy
         ↓
    Services updated
         ↓
    Users see changes
```

---

## 📱 Request/Response Example

### Example: User Login

**1. Frontend Request:**
```javascript
// frontend/src/pages/Login.jsx
const response = await api.post('/users/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

**2. Network Request:**
```
POST https://skillorbit-backend.onrender.com/api/users/login
Headers:
  Content-Type: application/json
Body:
  {
    "email": "user@example.com",
    "password": "password123"
  }
```

**3. Backend Processing:**
```javascript
// backend/src/controllers/userController.js
1. Receive request
2. Find user in MongoDB
3. Compare password (bcrypt)
4. Generate JWT token
5. Send response
```

**4. Backend Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

**5. Frontend Handling:**
```javascript
// Store token and user data
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));

// Redirect to dashboard
navigate('/dashboard');
```

---

## 🎯 Monitoring & Logs

### Where to Check Logs

**Render (Backend):**
- Dashboard → Your Service → Logs
- Real-time log streaming
- Filter by severity

**Vercel (Frontend):**
- Dashboard → Your Project → Deployments → View Function Logs
- Build logs
- Runtime logs

**MongoDB Atlas:**
- Cluster → Metrics
- Performance metrics
- Query performance

---

## 🔧 Maintenance Tasks

### Regular Tasks
- [ ] Monitor Render service status
- [ ] Check MongoDB storage usage
- [ ] Review error logs weekly
- [ ] Update dependencies monthly
- [ ] Rotate API keys quarterly

### Scaling Considerations
- **Free tier limits:**
  - Render: 750 hours/month
  - Vercel: 100GB bandwidth
  - MongoDB: 512MB storage

- **When to upgrade:**
  - Backend sleeping affects UX
  - Storage approaching limit
  - Need faster response times

---

This architecture provides a scalable, modern full-stack application with clear separation of concerns and industry-standard deployment practices.
