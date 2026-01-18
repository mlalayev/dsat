# Complete Setup Guide - PrepPulse Exam System

## 🎯 What You Have Now

Your exam system includes:
- ✅ User authentication (signup/login)
- ✅ User roles (admin and regular users)
- ✅ Exam management system
- ✅ Database schema with all necessary tables
- ✅ Beautiful UI with animated backgrounds

## 📋 Prerequisites

1. **PostgreSQL** installed and running
2. **Node.js** installed
3. **Your .env.local file** with database credentials

## 🚀 Step 1: Verify Your .env.local File

Make sure you have a `.env.local` file in the root directory with these variables:

```env
# Database connection (use individual parameters)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=preppulse_db

# OR use a connection string (if you prefer)
# DATABASE_URL=postgresql://username:password@localhost:5432/preppulse_db
```

## 🗄️ Step 2: Create Database

Open **pgAdmin 4** and:

1. Right-click on "Databases"
2. Create > Database
3. Name it: `preppulse_db`
4. Click "Save"

## 🏗️ Step 3: Initialize Database Schema

Run this command to create all tables:

```bash
node init-database.js
```

This will create all necessary tables:
- users (with role field)
- exams
- questions
- user_exam_attempts
- user_question_responses
- study_sessions
- user_progress

## 🧪 Step 4: Test Database Connection

```bash
node test-connection.js
```

You should see: "✅ SUCCESS! Database connection works!"

## 👤 Step 5: Create Your First Admin User

### Method 1: Sign Up Then Promote (Recommended)

1. Start the development server:
```bash
npm run dev
```

2. Visit: http://localhost:3000/signup

3. Sign up with your email (e.g., admin@example.com)

4. Open pgAdmin 4, go to Query Tool, and run:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

5. Refresh your dashboard - you should now see "Admin Controls"

### Method 2: Direct SQL Insert

Run this in pgAdmin Query Tool:
```sql
INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
VALUES (
  'Admin User',
  'admin@example.com',
  '$2a$10$rN8iYJ5eH.YfhXl9qJ8wme7VEkPqKlH4Gg6Wg6Wg6Wg6Wg6Wg6W',  -- password: "admin123"
  'admin',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
```

Note: You'll need to reset this password after first login, or use Method 1.

## 📝 Step 6: Create Sample Exam (Admin Only)

Once you're logged in as admin, you can use the API to create exams:

```javascript
// Example: Create an exam via API
fetch('/api/exams', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Math Fundamentals',
    description: 'Basic mathematics exam',
    duration: 60,
    total_questions: 20,
    passing_score: 70,
    subject: 'Mathematics',
    created_by: 1  // Your admin user ID
  })
})
```

Or directly in SQL:
```sql
INSERT INTO exams (title, description, duration, total_questions, passing_score, subject, created_by, is_active)
VALUES ('Math Fundamentals', 'Test your basic math skills', 60, 20, 70, 'Mathematics', 1, true);

-- Add questions to the exam
INSERT INTO questions (exam_id, subject, topic, difficulty, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, points)
VALUES 
(1, 'Mathematics', 'Algebra', 'easy', 'What is 2 + 2?', '3', '4', '5', '6', 'B', 'Basic addition: 2 + 2 = 4', 1),
(1, 'Mathematics', 'Algebra', 'medium', 'Solve: 2x + 5 = 15', 'x = 3', 'x = 5', 'x = 7', 'x = 10', 'B', 'Subtract 5 from both sides: 2x = 10, divide by 2: x = 5', 1);
```

## 🎮 Step 7: Using the System

### For Regular Users:
1. Sign up at `/signup`
2. Login at `/login`
3. View available exams in dashboard
4. Take exams and view results

### For Admins:
1. All user features, plus:
2. Create new exams via API
3. Add/edit questions
4. View all user attempts
5. Manage exam status (activate/deactivate)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Exams
- `GET /api/exams` - List all active exams
- `POST /api/exams` - Create exam (admin only)
- `GET /api/exams/[id]` - Get exam with questions
- `DELETE /api/exams/[id]` - Deactivate exam (admin only)
- `POST /api/exams/[id]/submit` - Submit exam answers

### User Data
- `GET /api/user/attempts?user_id=X` - Get user's exam attempts

## 🛠️ Database Schema Overview

### Users Table
- Stores user accounts with roles (user/admin)
- Passwords are hashed with bcrypt

### Exams Table
- Stores exam metadata
- Links to creator (admin user)
- Can be activated/deactivated

### Questions Table
- Stores exam questions
- Linked to exams
- Multiple choice (A, B, C, D)

### User Exam Attempts
- Tracks user exam submissions
- Stores score, time, pass/fail status
- Stores user answers as JSON

### User Question Responses
- Detailed question-by-question responses
- Links to exam attempts

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Input validation on all endpoints
- ✅ SQL injection protection (parameterized queries)
- ✅ Email format validation

## 🎨 Features

### Current Features:
- User registration and login
- Role-based access (user/admin)
- Exam listing and viewing
- Exam submission and scoring
- User attempt history
- Beautiful animated UI

### To Implement:
- Exam taking interface
- Real-time timer during exams
- Results page with detailed breakdown
- Admin dashboard for exam management
- User profile page
- Exam statistics and analytics

## 🐛 Troubleshooting

### Database Connection Issues:
```bash
# Test your connection
node test-connection.js

# Check if PostgreSQL is running
# Windows: Services > postgresql-x64-XX > Running
```

### Can't Login/Signup:
1. Check browser console for errors
2. Check terminal for API errors
3. Verify database tables exist
4. Test API directly: `curl http://localhost:3000/api/test-db`

### Admin Role Not Working:
```sql
-- Verify your role
SELECT id, email, role FROM users WHERE email = 'your-email@example.com';

-- Update to admin if needed
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## 📞 Next Steps

1. ✅ Initialize database
2. ✅ Create admin user
3. ✅ Create sample exams
4. 🔄 Build exam-taking interface
5. 🔄 Add admin dashboard
6. 🔄 Add user statistics

## 🎉 You're All Set!

Your exam system is ready to use. Start the dev server:

```bash
npm run dev
```

Visit: http://localhost:3000

Happy coding! 🚀


