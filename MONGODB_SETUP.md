# MongoDB Setup Guide

## Error: ECONNREFUSED

This error means MongoDB is not running on your system. Here's how to fix it:

## Quick Solutions

### Option 1: MongoDB Atlas (Cloud - Recommended for Quick Start)

**Easiest option - No local installation needed!**

1. **Create Free Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free (no credit card required)

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a region close to you
   - Click "Create"

3. **Setup Database Access**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `admin`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Create .env File**
   ```bash
   # In your project root
   cp .env.example .env
   ```

7. **Update .env**
   ```env
   MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/erp-system?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```
   
   Replace:
   - `YOUR_PASSWORD` with your database user password
   - `cluster0.xxxxx` with your actual cluster URL

8. **Test Connection**
   ```bash
   npm run seed
   ```

---

### Option 2: Local MongoDB Installation

#### Windows

**Method A: MongoDB Installer**

1. **Download MongoDB**
   - Go to https://www.mongodb.com/try/download/community
   - Select:
     - Version: Latest
     - Platform: Windows
     - Package: MSI
   - Click "Download"

2. **Install MongoDB**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - Install as a Service: ✅ Yes
   - Service Name: `MongoDB`
   - Data Directory: `C:\Program Files\MongoDB\Server\7.0\data`
   - Log Directory: `C:\Program Files\MongoDB\Server\7.0\log`

3. **Verify Installation**
   ```powershell
   # Check if MongoDB service is running
   Get-Service MongoDB
   
   # Should show: Status = Running
   ```

4. **If Service Not Running**
   ```powershell
   # Start MongoDB service
   net start MongoDB
   ```

5. **Create .env File**
   ```bash
   cp .env.example .env
   ```
   
   Content:
   ```env
   MONGODB_URI=mongodb://localhost:27017/erp-system
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```

6. **Test Connection**
   ```bash
   npm run seed
   ```

**Method B: MongoDB with Chocolatey**

```powershell
# Install Chocolatey (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install MongoDB
choco install mongodb

# Start MongoDB
net start MongoDB
```

**Method C: Docker (Recommended for Development)**

```powershell
# Install Docker Desktop from https://www.docker.com/products/docker-desktop

# Run MongoDB container
docker run -d `
  --name mongodb `
  -p 27017:27017 `
  -e MONGO_INITDB_DATABASE=erp-system `
  -v mongodb_data:/data/db `
  mongo:latest

# Verify it's running
docker ps
```

Create `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/erp-system
JWT_SECRET=your-super-secret-jwt-key-change-this
```

---

#### macOS

**Method A: Homebrew**

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
brew services list | grep mongodb
```

**Method B: Docker**

```bash
# Install Docker Desktop from https://www.docker.com/products/docker-desktop

# Run MongoDB
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=erp-system \
  -v mongodb_data:/data/db \
  mongo:latest
```

Create `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/erp-system
JWT_SECRET=your-super-secret-jwt-key-change-this
```

---

#### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
sudo systemctl status mongod
```

---

## Verify MongoDB is Running

### Check Service Status

**Windows:**
```powershell
Get-Service MongoDB
# or
net start | findstr MongoDB
```

**macOS:**
```bash
brew services list | grep mongodb
# or
ps aux | grep mongod
```

**Linux:**
```bash
sudo systemctl status mongod
```

**Docker:**
```bash
docker ps | grep mongo
```

### Test Connection

```bash
# Using mongosh (MongoDB Shell)
mongosh

# Should connect and show:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017/...
# test>
```

---

## Environment Setup

### 1. Create .env File

```bash
# Copy example
cp .env.example .env
```

### 2. Edit .env

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/erp-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/erp-system?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Generate Secure JWT Secret

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

---

## Seed Demo Data

Once MongoDB is running and `.env` is configured:

```bash
# Seed the database
npm run seed

# Expected output:
# 🌱 Starting demo data seeding...
# ✅ Connected to MongoDB
# 👤 Creating demo user...
# ✅ Created demo user
# ...
```

---

## Start the Application

```bash
# Development mode
npm run dev

# Open browser
http://localhost:3000

# Login
Email: demo@example.com
Password: demo123
```

---

## Troubleshooting

### Still Getting ECONNREFUSED?

1. **Check if MongoDB is actually running**
   ```bash
   # Windows
   Get-Service MongoDB
   
   # macOS/Linux
   ps aux | grep mongod
   
   # Docker
   docker ps
   ```

2. **Check the port**
   ```bash
   # Windows
   netstat -ano | findstr :27017
   
   # macOS/Linux
   lsof -i :27017
   ```

3. **Try connecting manually**
   ```bash
   mongosh mongodb://localhost:27017
   ```

4. **Check MongoDB logs**
   - Windows: `C:\Program Files\MongoDB\Server\7.0\log\mongod.log`
   - macOS: `/usr/local/var/log/mongodb/mongo.log`
   - Linux: `/var/log/mongodb/mongod.log`
   - Docker: `docker logs mongodb`

### Connection String Issues

**Wrong:**
```
mongodb://localhost:27017erp-system  ❌ (missing /)
mongodb://localhost/erp-system       ❌ (missing port)
mongodb://localhost:27017/           ❌ (missing database)
```

**Correct:**
```
mongodb://localhost:27017/erp-system ✅
```

### Permission Issues (Linux/macOS)

```bash
# Fix data directory permissions
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown mongodb:mongodb /tmp/mongodb-27017.sock

# Restart
sudo systemctl restart mongod
```

### Port Already in Use

```bash
# Find what's using port 27017
# Windows
netstat -ano | findstr :27017

# macOS/Linux
lsof -i :27017

# Kill the process or change MongoDB port in .env
MONGODB_URI=mongodb://localhost:27018/erp-system
```

---

## Recommended: Docker Setup (Cross-Platform)

**Best for development - works on all platforms!**

### 1. Install Docker Desktop
- Windows/Mac: https://www.docker.com/products/docker-desktop
- Linux: https://docs.docker.com/engine/install/

### 2. Create docker-compose.yml

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: erp-mongodb
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=erp-system
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

### 3. Start MongoDB

```bash
docker-compose up -d
```

### 4. Verify

```bash
docker ps
# Should show erp-mongodb running
```

### 5. Stop MongoDB

```bash
docker-compose down
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start MongoDB (Windows) | `net start MongoDB` |
| Start MongoDB (macOS) | `brew services start mongodb-community` |
| Start MongoDB (Linux) | `sudo systemctl start mongod` |
| Start MongoDB (Docker) | `docker start mongodb` |
| Check Status | `mongosh` |
| Seed Database | `npm run seed` |
| Start App | `npm run dev` |

---

## Summary

1. ✅ Install MongoDB (Atlas, Local, or Docker)
2. ✅ Create `.env` file with connection string
3. ✅ Start MongoDB service
4. ✅ Run `npm run seed`
5. ✅ Run `npm run dev`
6. ✅ Login at http://localhost:3000

**Recommended for beginners: MongoDB Atlas (cloud) - no installation needed!**
