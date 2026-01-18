# Quick Start - PostgreSQL Setup

## What You Need to Do:

### 1. **Create a Database in PostgreSQL**

**Using pgAdmin 4:**
- Open pgAdmin 4
- Right-click "Databases" → Create → Database
- Name it: `preppulse_db` (or any name you prefer)
- Click Save

**OR using psql command prompt:**
```sql
CREATE DATABASE preppulse_db;
```

### 2. **Configure Your Connection**

Edit the `.env.local` file in your project root and replace with your actual PostgreSQL credentials:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/preppulse_db
```

Replace:
- `YOUR_PASSWORD` with your PostgreSQL password
- `preppulse_db` with your database name (if different)

### 3. **Test the Connection**

Run your dev server:
```bash
npm run dev
```

Then visit: **http://localhost:3000/test-db**

OR test via API: **http://localhost:3000/api/test-db**

---

## 📚 Full Documentation

See `DATABASE_SETUP.md` for:
- Detailed setup instructions
- Example database schemas
- Troubleshooting guide
- Usage examples
- Security best practices

---

## 🗂️ What Was Created:

- ✅ `lib/db.ts` - Database connection utility
- ✅ `app/api/test-db/route.ts` - Test connection endpoint
- ✅ `app/api/example/route.ts` - Example CRUD operations
- ✅ `app/test-db/page.tsx` - Visual test page
- ✅ `components/DatabaseTest.tsx` - Test component
- ✅ `.env.local` - Your configuration file (UPDATE THIS!)
- ✅ `.env.example` - Template reference
- ✅ Installed `pg` and `@types/pg` packages

