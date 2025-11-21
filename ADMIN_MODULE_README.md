# Admin Module - SkillOrbit

## Overview
Complete admin module for managing questions, viewing analytics, and monitoring platform activity.

## Features

### 1. Admin Authentication
- Secure login with JWT
- Role-based access control (Super Admin, Admin, Moderator)
- Permission-based features

### 2. Question Management
- ✅ Add new questions
- ✅ Edit existing questions
- ✅ Delete questions
- ✅ Bulk import questions
- ✅ Export questions (JSON)
- ✅ Search and filter questions
- ✅ Support for multiple question types (MCQ, True/False, Short Answer)

### 3. Analytics Dashboard
- Real-time platform statistics
- User growth tracking
- Assessment activity monitoring
- Top skills analysis
- Skills by category distribution
- User engagement metrics

### 4. User Management
- View all registered users
- User activity tracking
- Assessment history per user

## Setup Instructions

### 1. Create Super Admin

Run the script to create the initial super admin account:

```bash
cd backend
node src/scripts/createSuperAdmin.js
```

**Default Credentials:**
- Email: `admin@skillorbit.com`
- Password: `admin@123`
- Role: `super_admin`

⚠️ **Important:** Change the password after first login!

### 2. Backend Routes

The following routes are available:

#### Admin Authentication
```
POST   /api/admin/login                    # Admin login
GET    /api/admin/profile                  # Get admin profile
PUT    /api/admin/profile                  # Update profile
PUT    /api/admin/change-password          # Change password
POST   /api/admin/create                   # Create new admin (Super Admin only)
GET    /api/admin/all                      # Get all admins (Super Admin only)
PUT    /api/admin/toggle-status/:adminId   # Toggle admin status (Super Admin only)
```

#### Question Management
```
GET    /api/admin/dashboard/questions              # Get all questions (with pagination)
GET    /api/admin/dashboard/questions/statistics   # Question statistics
GET    /api/admin/dashboard/questions/export       # Export questions
GET    /api/admin/dashboard/questions/:id          # Get question by ID
POST   /api/admin/dashboard/questions              # Add new question
POST   /api/admin/dashboard/questions/bulk         # Bulk add questions
PUT    /api/admin/dashboard/questions/:id          # Update question
DELETE /api/admin/dashboard/questions/:id          # Delete question
```

#### Analytics
```
GET    /api/admin/dashboard/analytics     # Get platform analytics
```

#### User Management
```
GET    /api/admin/dashboard/users         # Get users with stats
```

### 3. Frontend Routes

```
/admin/login          # Admin login page
/admin/dashboard      # Admin dashboard with analytics
/admin/questions      # Question management interface
/admin/users          # User management (coming soon)
```

### 4. Access the Admin Panel

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

3. Navigate to: `http://localhost:3001/admin/login`

4. Login with super admin credentials

## API Examples

### Add Question
```javascript
POST /api/admin/dashboard/questions
Headers: {
  Authorization: Bearer <admin_token>
}
Body: {
  "skillName": "JavaScript",
  "questionText": "What is a closure in JavaScript?",
  "options": [
    "A function inside another function",
    "A loop structure",
    "A variable type",
    "An array method"
  ],
  "correctAnswer": "A function inside another function",
  "difficulty": "intermediate",
  "questionType": "mcq",
  "explanation": "A closure gives you access to an outer function's scope from an inner function.",
  "tags": ["javascript", "functions", "scope"]
}
```

### Bulk Add Questions
```javascript
POST /api/admin/dashboard/questions/bulk
Headers: {
  Authorization: Bearer <admin_token>
}
Body: {
  "questions": [
    {
      "skillName": "Python",
      "questionText": "What is Python?",
      "options": ["A programming language", "A snake", "A framework", "A database"],
      "correctAnswer": "A programming language",
      "difficulty": "basic",
      "questionType": "mcq"
    },
    // ... more questions
  ]
}
```

### Get Analytics
```javascript
GET /api/admin/dashboard/analytics
Headers: {
  Authorization: Bearer <admin_token>
}

Response: {
  "overview": {
    "totalUsers": 150,
    "totalAssessments": 450,
    "totalSkills": 120,
    "totalQuestions": 600
  },
  "userGrowth": [...],
  "assessmentActivity": [...],
  "topSkills": [...],
  "scoresByDifficulty": [...],
  "mostActiveUsers": [...],
  "skillsByCategory": [...]
}
```

## Admin Roles & Permissions

### Super Admin
- Full access to all features
- Can create/manage other admins
- Manage questions, users, analytics

### Admin
- Manage questions
- View analytics
- Cannot create other admins

### Moderator
- View analytics
- Limited question management

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Role-Based Access Control**: Different permissions for different roles
3. **Password Hashing**: bcrypt with salt rounds of 10
4. **Token Expiration**: 24-hour token validity
5. **Permission Checks**: Middleware validates permissions for each action

## Database Schema

### Admin Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['super_admin', 'admin', 'moderator'],
  permissions: {
    manageQuestions: Boolean,
    manageUsers: Boolean,
    viewAnalytics: Boolean,
    manageRoles: Boolean
  },
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date
}
```

### QuestionBank Model (Enhanced)
```javascript
{
  skillName: String,
  questionText: String,
  options: [String],
  correctAnswer: String,
  difficulty: Enum ['basic', 'intermediate', 'advanced'],
  questionType: Enum ['mcq', 'true-false', 'short-answer'],
  explanation: String,
  tags: [String],
  createdBy: ObjectId (ref: Admin),
  updatedBy: ObjectId (ref: Admin),
  createdAt: Date,
  updatedAt: Date
}
```

## Future Enhancements

- [ ] User management interface
- [ ] Role management
- [ ] Audit logs
- [ ] Question review/approval workflow
- [ ] Advanced analytics filters
- [ ] Email notifications
- [ ] CSV import/export for questions
- [ ] Question difficulty auto-detection
- [ ] Duplicate question detection

## Troubleshooting

### Admin can't login
- Check if admin exists in database
- Verify password is correct
- Check JWT_SECRET in .env file
- Ensure backend is running

### Questions not showing
- Verify admin token is valid
- Check permissions (manageQuestions: true)
- Check browser console for errors
- Verify API_URL in frontend .env

### Analytics not loading
- Check viewAnalytics permission
- Ensure MongoDB connection is active
- Verify aggregation queries are working

## Support

For issues or questions, contact the development team.

---

**Version:** 1.0  
**Last Updated:** November 21, 2025  
**Project:** SkillOrbit Mini-Project
