# 🎯 STEP-BY-STEP: Create Database & Connect

## ✅ You've Done:
- ✅ Created PrepPulse server
- ✅ Created preppulse_db database (I can see it in pgAdmin!)

## 🔧 What You Need to Do NOW:

### Step 1: Make Sure PrepPulse Server is Connected

1. **In pgAdmin 4**, look at your "PrepPulse" server
2. **If it has a red X** → Right-click it → **"Connect Server"**
3. **Enter your password** when prompted
4. **The red X should disappear** when connected ✅

### Step 2: Verify Database Exists

1. **Click the arrow** next to "PrepPulse" server to expand it
2. **Click the arrow** next to "Databases" to expand it
3. **You should see "preppulse_db"** listed there
4. **If you DON'T see it**, follow Step 3 below

### Step 3: Create the Database (If It Doesn't Exist)

1. **Right-click on "Databases"** (under PrepPulse server)
2. **Click "Create" → "Database"**
3. **In the "Database" field**, type: `preppulse_db`
4. **Click "Save"** at the bottom
5. **Wait a few seconds** - you should see it appear in the list

### Step 4: Test the Connection

Once the database exists, run this command in your terminal:

```bash
node test-connection.js
```

**OR** start your Next.js app and visit:
- http://localhost:3000/test-db

---

## 🆘 Still Having Issues?

**Tell me:**
1. Can you see "preppulse_db" under Databases in pgAdmin?
2. Is the PrepPulse server connected (no red X)?
3. What error message do you see when testing?


