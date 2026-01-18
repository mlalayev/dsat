# 📊 Dashboard Integration Guide

## 🎉 What's Been Done

Your dashboards are now **fully connected to the backend** with real-time data from PostgreSQL!

### ✅ Completed Features

#### User Dashboard (`UserDashboard.tsx`)
- **Real-time Stats:**
  - Questions answered (from exam attempts)
  - Accuracy rate (calculated from correct/total)
  - Study time (hours from exam durations)
  - Best score (highest exam score)
  
- **Recent Sessions:**
  - Shows actual exam attempts
  - Displays score, questions, time, and date
  - Color-coded by performance (green 80+, yellow 60-79, red <60)
  
- **Topic Progress:**
  - Real data from `user_progress` table
  - Shows subject, topic, completion percentage
  - Tracks correct answers vs total questions
  
- **Available Exams:**
  - Fetches active exams from database
  - Groups by subject categories

#### Admin Dashboard (`AdminDashboard.tsx`)
- **Real-time Stats:**
  - Total users count
  - Total exams and questions
  - New users today
  - Active sessions (24h)
  - Total topics
  
- **Recent Users:**
  - Shows last 10 registered users
  - Displays best score and activity status
  - Join date and email
  
- **Recent Exams:**
  - Shows all exams with details
  - Question count per exam
  - Created date and status (Published/Draft)
  
- **Analytics Tab:**
  - User growth chart (last 7 days)
  - Question distribution by subject
  - Visual percentages and counts

## 🆕 New API Endpoints

### 1. User Statistics API
**Endpoint:** `GET /api/user/stats?user_id=X`

**Returns:**
```json
{
  "success": true,
  "stats": {
    "questionsAnswered": 30,
    "correctAnswers": 24,
    "accuracy": 80,
    "studyTime": 2,
    "currentStreak": 3,
    "bestScore": 90,
    "avgScore": 83,
    "totalAttempts": 3
  },
  "recentSessions": [
    {
      "id": 1,
      "topic": "Digital SAT Practice Test",
      "score": 90,
      "questions": 10,
      "time": "25 min",
      "date": "2026-01-18"
    }
  ],
  "topicProgress": [
    {
      "subject": "Mathematics",
      "topic": "Algebra",
      "questions": 30,
      "correct": 25,
      "progress": 83
    }
  ]
}
```

### 2. Admin Statistics API
**Endpoint:** `GET /api/admin/stats?user_id=X`

**Returns:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 5,
    "totalExams": 1,
    "totalQuestions": 10,
    "newUsersToday": 1,
    "totalTopics": 2,
    "activeSessions": 2
  },
  "recentUsers": [...],
  "recentExams": [...],
  "questionDistribution": [...],
  "userGrowth": [...]
}
```

## 🧪 Testing Your Dashboards

### Quick Test (Automated)

Run this script to add test data:

```bash
node test-dashboard-data.js
```

This will:
- Add sample exam attempts
- Add topic progress data
- Show you which user to login with

### Manual Test (Using pgAdmin)

1. **Find your user ID:**
```sql
SELECT id, email, role FROM users;
```

2. **Add exam attempts:**
```sql
INSERT INTO user_exam_attempts 
  (user_id, exam_id, score, total_questions, correct_answers, time_spent, passed, completed_at, answers)
VALUES 
  (YOUR_USER_ID, 1, 85, 10, 8, 1800, true, NOW(), '{}'),
  (YOUR_USER_ID, 1, 90, 10, 9, 1500, true, NOW() - INTERVAL '1 day', '{}'),
  (YOUR_USER_ID, 1, 75, 10, 7, 2100, true, NOW() - INTERVAL '2 days', '{}');
```

3. **Add topic progress:**
```sql
INSERT INTO user_progress 
  (user_id, subject, topic, questions_attempted, questions_correct, total_time_spent, last_practiced)
VALUES
  (YOUR_USER_ID, 'Mathematics', 'Algebra', 30, 25, 45, NOW()),
  (YOUR_USER_ID, 'Reading', 'Vocabulary', 25, 18, 35, NOW() - INTERVAL '1 day');
```

4. **Login and check dashboard:**
   - Visit http://localhost:3000/login
   - Login with your user account
   - Go to /dashboard
   - You should see all your data!

## 📊 Dashboard Features Explained

### User Dashboard

#### Stats Cards (Top Row)
1. **Questions Answered** - Total questions from all attempts
2. **Accuracy Rate** - (Correct / Total) × 100
3. **Study Time** - Total time spent in hours
4. **Best Score** - Highest exam score achieved

#### Recent Sessions Section
- Last 5 exam attempts
- Shows score with color coding
- Displays question count and time spent
- Includes date of attempt

#### Topic Progress Section
- Shows all subjects/topics practiced
- Progress bar based on accuracy
- Marks as "Mastered" if ≥80%
- Shows correct/total questions

### Admin Dashboard

#### Stats Cards (Top Row)
1. **Total Users** - All registered users
2. **Total Exams** - Active exams count
3. **Active Sessions** - Users active in 24h
4. **Topics** - Unique subjects

#### Overview Tab
- Recent exams with details
- Recent users with scores
- Quick actions for each

#### Questions Tab
- All exams listed
- Search and filter capabilities
- View/Edit/Delete buttons

#### Users Tab
- All users management
- Search functionality
- Activity status

#### Analytics Tab
- User growth chart (last 7 days)
- Question distribution pie chart
- Real-time statistics

## 🔄 Data Flow

```
User takes exam → Submit via API → Data stored in database
                                           ↓
Dashboard loads → Fetches from /api/user/stats → Displays real data
```

For admins:
```
Admin dashboard → Fetches from /api/admin/stats → Shows platform metrics
```

## 🎯 What Shows Up Where

### User Dashboard Shows:
- ✅ **Your** exam attempts
- ✅ **Your** scores and accuracy
- ✅ **Your** topic progress
- ✅ **Your** study time

### Admin Dashboard Shows:
- ✅ **All** users count and list
- ✅ **All** exams and questions
- ✅ **Platform-wide** analytics
- ✅ **Growth** metrics

## 🐛 Troubleshooting

### Dashboard Shows Zero Data
**Problem:** All stats show 0 or "No data"

**Solutions:**
1. Make sure you've taken at least one exam
2. Run `node test-dashboard-data.js` to add sample data
3. Check if user is logged in (localStorage has 'user')
4. Verify user_id is correct

### Admin Dashboard Empty
**Problem:** Admin sees no users/exams

**Solutions:**
1. Verify user has admin role:
   ```sql
   SELECT role FROM users WHERE id = YOUR_ID;
   ```
2. Make sure exams exist:
   ```sql
   SELECT COUNT(*) FROM exams WHERE is_active = true;
   ```
3. Run `node add-sample-exam.js` to add sample exam

### API Errors in Console
**Problem:** "Failed to fetch stats" error

**Solutions:**
1. Check database connection: `node test-connection.js`
2. Verify API endpoint exists: Visit `/api/user/stats?user_id=1`
3. Check terminal for backend errors
4. Ensure user_id exists in database

### Loading Forever
**Problem:** Dashboard stuck on "Loading..."

**Solutions:**
1. Check browser console for errors
2. Verify localStorage has user data
3. Test API directly in browser console:
   ```javascript
   fetch('/api/user/stats?user_id=YOUR_ID').then(r => r.json()).then(console.log)
   ```

## 📝 Verifying Data

### Check User Has Data
```sql
-- Check attempts
SELECT * FROM user_exam_attempts WHERE user_id = YOUR_ID;

-- Check progress
SELECT * FROM user_progress WHERE user_id = YOUR_ID;

-- Check stats
SELECT 
  COUNT(*) as attempts,
  SUM(correct_answers) as correct,
  SUM(total_questions) as total,
  MAX(score) as best_score
FROM user_exam_attempts 
WHERE user_id = YOUR_ID;
```

### Check Admin Can See Everything
```sql
-- Total users
SELECT COUNT(*) FROM users;

-- Total exams
SELECT COUNT(*) FROM exams WHERE is_active = true;

-- Recent users
SELECT name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5;
```

## 🚀 Next Steps

Now that dashboards show real data, you can:

1. **Build Exam Taking Interface**
   - Create exam page with questions
   - Add timer functionality
   - Submit answers to existing API

2. **Add More Analytics**
   - Performance charts
   - Progress over time
   - Subject-wise breakdown

3. **Enhance Admin Features**
   - Create exam UI
   - Add/edit questions interface
   - User management actions

4. **Add Notifications**
   - New score notifications
   - Achievement badges
   - Study reminders

## 🎓 Summary

✅ **User Dashboard** - Shows personal stats, sessions, and progress
✅ **Admin Dashboard** - Shows platform-wide metrics and management tools
✅ **Real-time Data** - All data fetched from PostgreSQL
✅ **API Endpoints** - `/api/user/stats` and `/api/admin/stats`
✅ **Test Scripts** - `test-dashboard-data.js` for easy testing

Your dashboards are now **production-ready** with real backend integration! 🎉

---

**Quick Start:**
```bash
# 1. Add test data
node test-dashboard-data.js

# 2. Start server
npm run dev

# 3. Login and view dashboard
# Visit: http://localhost:3000/dashboard
```

Enjoy your fully functional dashboards! 🚀


