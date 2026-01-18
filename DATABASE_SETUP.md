# PostgreSQL Database Setup Guide

This guide will help you connect your Next.js application to PostgreSQL using pgAdmin 4 or psql command prompt.

## Prerequisites

- PostgreSQL installed (with pgAdmin 4 and psql)
- Node.js and npm installed
- This Next.js project

## Step 1: Create a Database

### Option A: Using pgAdmin 4 (GUI)

1. **Open pgAdmin 4**
2. **Connect to your PostgreSQL server**
   - Default password is usually set during PostgreSQL installation
3. **Create a new database:**
   - Right-click on "Databases" → "Create" → "Database"
   - Enter database name (e.g., `preppulse_db`)
   - Click "Save"

### Option B: Using psql (Command Line)

1. **Open psql Command Prompt**
2. **Log in as postgres user:**
   ```bash
   psql -U postgres
   ```
3. **Create a database:**
   ```sql
   CREATE DATABASE preppulse_db;
   ```
4. **Connect to the database:**
   ```sql
   \c preppulse_db
   ```

## Step 2: Create Example Tables (Optional)

Here's an example schema to get started:

```sql
-- Create a users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a sample table for your app
CREATE TABLE study_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  topic VARCHAR(255) NOT NULL,
  duration INTEGER, -- in minutes
  score INTEGER,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (email, name) VALUES 
  ('test@example.com', 'Test User'),
  ('demo@example.com', 'Demo User');

INSERT INTO study_sessions (user_id, topic, duration, score) VALUES
  (1, 'Mathematics', 45, 85),
  (1, 'Physics', 60, 92),
  (2, 'Chemistry', 30, 78);
```

## Step 3: Configure Environment Variables

1. **Create a `.env.local` file** in the root of your project:

```env
# PostgreSQL Database Connection
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/preppulse_db

# Or use individual parameters:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=preppulse_db
```

2. **Replace the values:**
   - `your_password`: Your PostgreSQL password (set during installation)
   - `preppulse_db`: Your database name (from Step 1)

### Finding Your PostgreSQL Connection Details:

- **Host**: Usually `localhost` or `127.0.0.1`
- **Port**: Default is `5432`
- **User**: Default is `postgres`
- **Password**: Set during PostgreSQL installation

## Step 4: Test the Connection

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test the database connection:**
   - Open your browser and navigate to: `http://localhost:3000/api/test-db`
   - You should see: `{"success": true, "message": "Database connection successful!"}`

## Step 5: Using the Database in Your App

### Example API Routes Created:

1. **Test Connection**: `/api/test-db` (GET)
   - Tests if database connection is working

2. **Example CRUD**: `/api/example` (GET, POST)
   - Example of fetching and creating records

### Using the Database Helper Functions:

```typescript
import { query, getClient } from '@/lib/db';

// Simple query
async function getUsers() {
  const result = await query('SELECT * FROM users');
  return result.rows;
}

// Query with parameters (prevents SQL injection)
async function getUserByEmail(email: string) {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

// Using transactions
async function createUserWithSession(userData, sessionData) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    
    const userResult = await client.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id',
      [userData.email, userData.name]
    );
    
    await client.query(
      'INSERT INTO study_sessions (user_id, topic) VALUES ($1, $2)',
      [userResult.rows[0].id, sessionData.topic]
    );
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

## Common Issues & Troubleshooting

### 1. Connection Refused Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: 
- Check if PostgreSQL service is running
- Windows: Open Services → Find "postgresql-x64-xx" → Start it
- Or restart via pgAdmin 4

### 2. Authentication Failed
```
Error: password authentication failed for user "postgres"
```
**Solution**:
- Verify your password in `.env.local`
- Reset password in pgAdmin 4 if needed

### 3. Database Does Not Exist
```
Error: database "your_db" does not exist
```
**Solution**:
- Create the database first (see Step 1)
- Verify database name in `.env.local` matches exactly

### 4. Port Already in Use
```
Error: port 5432 is already in use
```
**Solution**:
- Another PostgreSQL instance might be running
- Change the port in PostgreSQL config or `.env.local`

## Useful PostgreSQL Commands

### In psql:
```sql
\l                  -- List all databases
\c database_name    -- Connect to a database
\dt                 -- List all tables
\d table_name       -- Describe table structure
\du                 -- List all users
\q                  -- Quit psql
```

### Check PostgreSQL Status (Windows):
```powershell
# Check if PostgreSQL is running
Get-Service -Name postgresql*

# Start PostgreSQL
Start-Service postgresql-x64-xx

# Stop PostgreSQL
Stop-Service postgresql-x64-xx
```

## Next Steps

1. ✅ Database connection configured
2. ✅ Test API routes created
3. 📝 Design your database schema
4. 📝 Create your API routes
5. 📝 Connect frontend to your APIs

## Security Best Practices

1. **Never commit `.env.local`** to git (already in .gitignore)
2. **Always use parameterized queries** ($1, $2) to prevent SQL injection
3. **Use connection pooling** (already configured in `lib/db.ts`)
4. **Limit database permissions** in production
5. **Use environment-specific configurations**

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

For questions or issues, refer to the troubleshooting section above.

