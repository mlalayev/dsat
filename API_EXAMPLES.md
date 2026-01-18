# API Examples and Testing

## 🔌 Testing Your APIs

### Using Browser Console

Open your browser console (F12) and try these commands:

## Authentication APIs

### 1. Sign Up (Create User)
```javascript
fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(console.log);
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 3,
    "name": "Test User",
    "email": "test@example.com",
    "role": "user",
    "created_at": "2026-01-18T..."
  }
}
```

### 2. Login
```javascript
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(console.log);
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 2,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "created_at": "2026-01-18T..."
  }
}
```

## Exam APIs

### 3. Get All Exams
```javascript
fetch('http://localhost:3000/api/exams')
.then(r => r.json())
.then(console.log);
```

**Expected Response:**
```json
{
  "success": true,
  "exams": [
    {
      "id": 1,
      "title": "Digital SAT Practice Test",
      "description": "A comprehensive practice test...",
      "duration": 90,
      "total_questions": 10,
      "passing_score": 70,
      "subject": "SAT Prep",
      "creator_name": "Admin User",
      "is_active": true,
      "created_at": "2026-01-18T..."
    }
  ]
}
```

### 4. Get Specific Exam with Questions
```javascript
fetch('http://localhost:3000/api/exams/1')
.then(r => r.json())
.then(console.log);
```

**Expected Response:**
```json
{
  "success": true,
  "exam": {
    "id": 1,
    "title": "Digital SAT Practice Test",
    "duration": 90,
    ...
  },
  "questions": [
    {
      "id": 1,
      "subject": "Mathematics",
      "topic": "Algebra",
      "difficulty": "easy",
      "question_text": "If 2x + 5 = 15, what is the value of x?",
      "option_a": "x = 3",
      "option_b": "x = 5",
      "option_c": "x = 7",
      "option_d": "x = 10",
      "points": 1
    },
    ...
  ]
}
```

### 5. Create New Exam (Admin Only)
```javascript
fetch('http://localhost:3000/api/exams', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Physics Final Exam',
    description: 'Comprehensive physics test',
    duration: 120,
    total_questions: 30,
    passing_score: 75,
    subject: 'Physics',
    created_by: 2  // Your admin user ID
  })
})
.then(r => r.json())
.then(console.log);
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Exam created successfully",
  "exam": {
    "id": 2,
    "title": "Physics Final Exam",
    "duration": 120,
    ...
  }
}
```

### 6. Submit Exam Answers
```javascript
fetch('http://localhost:3000/api/exams/1/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 3,  // Your user ID
    answers: {
      1: 'B',  // question_id: answer
      2: 'A',
      3: 'B',
      4: 'B',
      5: 'C',
      6: 'C',
      7: 'B',
      8: 'B',
      9: 'C',
      10: 'C'
    },
    time_spent: 1800  // in seconds (30 minutes)
  })
})
.then(r => r.json())
.then(console.log);
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Exam submitted successfully",
  "result": {
    "attempt_id": 1,
    "score": 90,
    "correct_answers": 9,
    "total_questions": 10,
    "passed": true,
    "time_spent": 1800
  }
}
```

### 7. Get User's Exam Attempts
```javascript
fetch('http://localhost:3000/api/user/attempts?user_id=3')
.then(r => r.json())
.then(console.log);
```

**Expected Response:**
```json
{
  "success": true,
  "attempts": [
    {
      "id": 1,
      "user_id": 3,
      "exam_id": 1,
      "score": 90,
      "total_questions": 10,
      "correct_answers": 9,
      "time_spent": 1800,
      "passed": true,
      "completed_at": "2026-01-18T...",
      "exam_title": "Digital SAT Practice Test",
      "exam_description": "...",
      "passing_score": 70
    }
  ]
}
```

## Using Postman or cURL

### cURL Examples

#### Sign Up:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

#### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

#### Get Exams:
```bash
curl http://localhost:3000/api/exams
```

#### Submit Exam:
```bash
curl -X POST http://localhost:3000/api/exams/1/submit \
  -H "Content-Type: application/json" \
  -d '{"user_id":3,"answers":{"1":"B","2":"A","3":"B","4":"B","5":"C","6":"C","7":"B","8":"B","9":"C","10":"C"},"time_spent":1800}'
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "All fields are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Only admins can create exams"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Exam not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An error occurred during registration",
  "error": "Error details..."
}
```

## Testing Flow

### Complete User Journey:

1. **Sign up** a new user
2. **Login** with credentials
3. **Get exams list** to see available exams
4. **Get exam details** with questions
5. **Submit answers** for the exam
6. **Get user attempts** to see results

### Admin Journey:

1. **Login as admin** (admin@example.com / admin123)
2. **Create new exam** via POST /api/exams
3. **Add questions** via SQL or future admin UI
4. **View all exams** including inactive ones
5. **Manage exam status** (activate/deactivate)

## Database Queries for Testing

### Check User
```sql
SELECT id, name, email, role FROM users WHERE email = 'test@example.com';
```

### Check Exam Attempts
```sql
SELECT * FROM user_exam_attempts WHERE user_id = 3;
```

### Check Question Responses
```sql
SELECT uqr.*, q.question_text, q.correct_answer
FROM user_question_responses uqr
JOIN questions q ON uqr.question_id = q.id
WHERE uqr.attempt_id = 1;
```

### View All Exams
```sql
SELECT e.*, u.name as creator FROM exams e
LEFT JOIN users u ON e.created_by = u.id;
```

## Tips

1. **Check browser console** for errors
2. **Check terminal** for server-side errors
3. **Use pgAdmin** to verify database changes
4. **Test APIs** before building UI
5. **Keep user ID** handy when testing (get it from login response)

## Next Steps

Once APIs are working:
1. Build exam-taking UI
2. Add timer functionality
3. Create results page
4. Build admin dashboard
5. Add user profile page

Happy testing! 🚀


