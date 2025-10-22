# Demo Login Fix

## Issue
The demo user account wasn't being created, causing "Invalid credentials" error when trying to login.

## Solution
Updated the seed script to create the demo user account with properly hashed password.

## What Was Fixed

### Before
The seed script only created data (products, orders, etc.) but didn't create the actual user account in the `users` collection.

### After
The seed script now:
1. ✅ Creates the demo user account
2. ✅ Hashes the password with bcrypt
3. ✅ Stores user in the database
4. ✅ Sets proper role and department

## How to Fix

### Step 1: Run the Updated Seed Script
```bash
npm run seed
```

### Step 2: Verify Output
You should see:
```
👤 Creating demo user...
✅ Created demo user

📊 Demo Data Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Demo User:        1
Products:         50
Employees:        30
...
```

### Step 3: Login
Now you can login with:
```
Email:    demo@example.com
Password: demo123
```

## What the Script Does Now

### 1. Clears Old Data
```javascript
await db.collection('users').deleteMany({ email: 'demo@example.com' })
```
Removes any existing demo user to avoid duplicates.

### 2. Hashes Password
```javascript
const hashedPassword = await bcrypt.hash('demo123', 10)
```
Uses bcrypt with 10 salt rounds (same as signup).

### 3. Creates User
```javascript
const demoUser = {
  email: 'demo@example.com',
  password: hashedPassword,
  name: 'Demo User',
  role: 'admin',
  department: 'Management',
  createdAt: new Date(),
  updatedAt: new Date(),
}
await db.collection('users').insertOne(demoUser)
```

## User Details

| Field | Value |
|-------|-------|
| Email | demo@example.com |
| Password | demo123 (hashed in DB) |
| Name | Demo User |
| Role | admin |
| Department | Management |

## Verification

### Check if User Exists
Using MongoDB shell or Compass:
```javascript
db.users.findOne({ email: 'demo@example.com' })
```

Should return:
```javascript
{
  _id: ObjectId("..."),
  email: "demo@example.com",
  password: "$2a$10$...", // Hashed
  name: "Demo User",
  role: "admin",
  department: "Management",
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### Test Login
1. Go to http://localhost:3000
2. Enter:
   - Email: demo@example.com
   - Password: demo123
3. Click "Sign In"
4. Should redirect to /dashboard

## Troubleshooting

### Still Getting "Invalid credentials"?

**1. Check if seed ran successfully**
```bash
npm run seed
```
Look for: `✅ Created demo user`

**2. Verify MongoDB is running**
```bash
# Check if MongoDB is running
mongosh
# or
docker ps | grep mongo
```

**3. Check database connection**
Make sure `MONGODB_URI` in your `.env` file is correct:
```
MONGODB_URI=mongodb://localhost:27017/erp-system
```

**4. Check the users collection**
```bash
mongosh
use erp-system
db.users.find({ email: "demo@example.com" })
```

**5. Clear browser cache**
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Or clear cookies for localhost

**6. Check console for errors**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API responses

### Password Not Working?

**Make sure you're using:**
- Email: `demo@example.com` (not demo@example.com with extra spaces)
- Password: `demo123` (lowercase, no spaces)

**Case sensitive:**
- ✅ demo@example.com
- ❌ Demo@example.com
- ❌ DEMO@EXAMPLE.COM

### User Already Exists Error?

The seed script automatically removes the old demo user before creating a new one. If you still get this error:

```bash
# Manually remove the user
mongosh
use erp-system
db.users.deleteOne({ email: "demo@example.com" })

# Then run seed again
npm run seed
```

## Dependencies

The seed script now requires:
- ✅ `mongodb` - Already installed
- ✅ `bcryptjs` - Already installed (used by auth)

No additional installation needed!

## Security Note

⚠️ **Important:**
- This is for demo/development only
- Don't use `demo123` in production
- The password is intentionally simple for demos
- Change or remove demo user before going live

## Summary

The seed script now:
- ✅ Creates the demo user account
- ✅ Hashes the password properly
- ✅ Sets admin role and department
- ✅ Allows immediate login
- ✅ Works with existing auth system

**You can now login with demo@example.com / demo123!** 🎉

## Quick Commands

```bash
# Seed everything (including user)
npm run seed

# Start the app
npm run dev

# Login at
http://localhost:3000
```

---

**If you still have issues, check the MongoDB logs and ensure the database is accessible.**
