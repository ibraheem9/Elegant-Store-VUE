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
echo Starting development server on port 8081...
echo.
set EXPO_PORT=8081
call npm run dev

pause
