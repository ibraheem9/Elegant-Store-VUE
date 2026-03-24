# 🪟 Windows Setup Guide - Store Management App

Complete troubleshooting guide for running the Store Management App on Windows.

---

## 🔴 Issue: Port 8081 Already in Use

### Error Message
```
Port NaN is being used by another process
Input is required, but 'npx expo' is in non-interactive mode.
Required input:
> Use port 11000 instead?
Skipping dev server
```

### Solution 1: Kill Process Using Port 8081 (Recommended)

**Using PowerShell (Run as Administrator):**

```powershell
# Find process using port 8081
netstat -ano | findstr :8081

# Kill the process (replace PID with the actual process ID)
taskkill /PID <PID> /F

# Example:
taskkill /PID 12345 /F
```

**Using Command Prompt (Run as Administrator):**

```cmd
# Find process using port 8081
netstat -ano | findstr :8081

# Kill the process
taskkill /PID <PID> /F
```

### Solution 2: Use a Different Port

**Set environment variable before running:**

```powershell
# PowerShell
$env:EXPO_PORT=8082
npm run dev

# Or in one command:
$env:EXPO_PORT=8082; npm run dev
```

**Or in Command Prompt:**

```cmd
# Command Prompt
set EXPO_PORT=8082
npm run dev
```

**Or add to your system environment variables:**
1. Press `Win + X` and select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Click "New" under "User variables"
5. Variable name: `EXPO_PORT`
6. Variable value: `8082`
7. Click OK and restart your terminal

---

## 🔧 Solution 3: Fix package.json for Windows

The issue is that Windows doesn't handle `${EXPO_PORT:-8081}` syntax properly.

**Edit `package.json` and replace the `dev:metro` script:**

```json
{
  "scripts": {
    "dev:metro": "cross-env EXPO_USE_METRO_WORKSPACE_ROOT=1 cross-env EXPO_PORT=8081 npx expo start --web --port 8081"
  }
}
```

Or create a Windows-specific batch file:

**Create `dev-windows.bat` in project root:**

```batch
@echo off
setlocal enabledelayedexpansion

REM Kill any process using port 8081
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do (
    taskkill /PID %%a /F 2>nul
)

REM Wait a moment for port to be released
timeout /t 2 /nobreak

REM Start the development server
set EXPO_PORT=8081
npm run dev
```

**Then run:**
```cmd
dev-windows.bat
```

---

## 🚀 Complete Windows Setup Steps

### Step 1: Install Prerequisites

```powershell
# Check Node.js version (should be v18+)
node --version

# Check npm version
npm --version

# If not installed, download from https://nodejs.org/
```

### Step 2: Clone Repository

```powershell
git clone https://github.com/ibraheem9/Elegant-Store-VUE.git
cd Elegant-Store-VUE
```

### Step 3: Install Dependencies

```powershell
npm install
```

### Step 4: Fix npm Audit Issues (Optional but Recommended)

```powershell
# Run audit fix
npm audit fix --force

# This may take a few minutes
```

### Step 5: Kill Port 8081 (If Needed)

```powershell
# Find what's using port 8081
netstat -ano | findstr :8081

# Kill it (replace PID with actual ID)
taskkill /PID <PID> /F
```

### Step 6: Start Development Server

**Option A: Default Port (8081)**
```powershell
npm run dev
```

**Option B: Alternative Port (if 8081 is busy)**
```powershell
$env:EXPO_PORT=8082
npm run dev
```

### Step 7: Access the App

- **Web:** Open http://localhost:8081 (or 8082 if using alternative port)
- **Mobile:** Scan QR code with Expo Go app

---

## 📱 Common Ports to Try

If port 8081 is busy, try these alternatives:

```powershell
# Try port 8082
$env:EXPO_PORT=8082; npm run dev

# Try port 3000
$env:EXPO_PORT=3000; npm run dev

# Try port 5000
$env:EXPO_PORT=5000; npm run dev

# Try port 9000
$env:EXPO_PORT=9000; npm run dev
```

---

## 🐛 Other Common Windows Issues

### Issue: npm command not found

**Solution:**
1. Restart PowerShell or Command Prompt
2. Reinstall Node.js from https://nodejs.org/
3. Add Node.js to PATH manually:
   - Search "Environment Variables"
   - Add Node.js bin folder to PATH

### Issue: Permission Denied

**Solution:** Run PowerShell as Administrator
1. Right-click PowerShell
2. Select "Run as Administrator"
3. Try again

### Issue: Git command not found

**Solution:** Install Git from https://git-scm.com/

### Issue: ENOENT: no such file or directory

**Solution:**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue: Cannot find module errors

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install
```

---

## 🔍 Checking What's Using a Port

### PowerShell
```powershell
# List all connections on port 8081
netstat -ano | findstr :8081

# Get more details about a process
Get-Process -Id <PID>
```

### Command Prompt
```cmd
# List all connections on port 8081
netstat -ano | findstr :8081

# Get process info
tasklist | findstr <PID>
```

---

## 💾 Batch Script for Easy Setup

**Create `setup-windows.bat` in project root:**

```batch
@echo off
echo.
echo ===================================
echo Store Management App - Windows Setup
echo ===================================
echo.

REM Check Node.js
echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install from https://nodejs.org/
    pause
    exit /b 1
)

REM Check Git
echo Checking Git...
git --version
if errorlevel 1 (
    echo ERROR: Git not found. Please install from https://git-scm.com/
    pause
    exit /b 1
)

REM Install dependencies
echo.
echo Installing dependencies...
call npm install

REM Kill port 8081
echo.
echo Clearing port 8081...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do (
    echo Killing process %%a
    taskkill /PID %%a /F 2>nul
)

REM Start dev server
echo.
echo Starting development server...
echo.
set EXPO_PORT=8081
call npm run dev

pause
```

**Run it:**
```cmd
setup-windows.bat
```

---

## 🌐 Testing Checklist

- [ ] Dependencies installed successfully
- [ ] No port conflicts
- [ ] Dev server starts without errors
- [ ] Web app loads at http://localhost:8081
- [ ] Can login with demo credentials
- [ ] Can add sales transactions
- [ ] Can view statistics
- [ ] Dark mode works

---

## 📞 Still Having Issues?

1. **Check Node.js version:** `node --version` (should be v18+)
2. **Check npm version:** `npm --version` (should be v9+)
3. **Clear cache:** `npm cache clean --force`
4. **Reinstall:** `rm -r node_modules && npm install`
5. **Check firewall:** Windows Firewall might block port access
6. **Restart computer:** Sometimes helps with port conflicts

---

## ✅ Success Indicators

When everything is working:

```
[1] Starting project at D:\Work\2026\Hamoda\Elegant-Store-VUE
[1] Web node_modules/expo-router/entry.js ░░░░░░░░░░░░░░░░  0.0%
[1] Web Bundled 305ms node_modules/expo-router/entry.js
[1] ✓ Expo Go app is ready
[1] ✓ Web is ready at http://localhost:8081
```

Then open http://localhost:8081 in your browser and login!

---

**Last Updated:** March 24, 2026

**For more help:** See README.md and QUICKSTART.md
