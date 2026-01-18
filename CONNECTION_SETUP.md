# PrepPulse Server Connection Setup

Since you've created the "PrepPulse" server in pgAdmin 4, follow these steps to get it connected and create your database.

## Step 1: Get Your Server Connection Details

1. **Right-click on "PrepPulse" server** in pgAdmin 4
2. **Select "Properties"**
3. **Go to the "Connection" tab**
4. **Note down these details:**
   - **Host name/address**: Usually `localhost` or `127.0.0.1`
   - **Port**: Usually `5432` (default PostgreSQL port)
   - **Maintenance database**: Usually `postgres`
   - **Username**: Usually `postgres` (or the username you set)
   - **Password**: The password you set for this server

## Step 2: Connect to the Server

1. **Right-click on "PrepPulse" server**
2. **Select "Connect Server"**
3. **Enter your password** if prompted
4. The server should now show as connected (no red X)

## Step 3: Create a Database

1. **Expand the "PrepPulse" server** (click the arrow)
2. **Right-click on "Databases"**
3. **Select "Create" → "Database"**
4. **In the "Database" field, enter:** `preppulse_db`
5. **Click "Save"**

## Step 4: Update Your .env.local File

Open `.env.local` in your project root and update it with your PrepPulse server details:

```env
# PostgreSQL Database Connection for PrepPulse Server
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:PORT/preppulse_db

# Example (replace with your actual values):
# DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/preppulse_db

# Or use individual parameters:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=preppulse_db
```

**Replace:**
- `USERNAME` with your username (usually `postgres`)
- `PASSWORD` with your PrepPulse server password
- `HOST` with your host (usually `localhost`)
- `PORT` with your port (usually `5432`)

## Step 5: Test the Connection

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Visit:** http://localhost:3000/test-db

3. **Click "Test Database Connection"**

You should see a success message! ✅

## Troubleshooting

### If you can't see connection details:
- Make sure the PrepPulse server is connected (no red X)
- Try disconnecting and reconnecting to the server

### If connection fails:
- Double-check your password in `.env.local`
- Make sure the database `preppulse_db` exists
- Verify the host and port are correct
- Make sure PostgreSQL service is running

### If you forgot your password:
- You can reset it in pgAdmin 4 by right-clicking the server → Properties → Connection tab

