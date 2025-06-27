@echo off
title Kashmir Carpentry LLC - One-Click Setup
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                Kashmir Carpentry LLC                         ║
echo ║              One-Click Setup & Download                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo 📥 Please download and install Node.js first:
    echo    👉 https://nodejs.org/
    echo    👉 Download the LTS version (18.x or higher)
    echo.
    echo After installing Node.js, run this script again.
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

REM Check if npm is installed
echo [2/6] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed!
    pause
    exit /b 1
) else (
    echo ✅ npm is installed
)

REM Install project dependencies
echo [3/6] Installing project dependencies...
echo    This may take a few minutes...
npm install --legacy-peer-deps --silent
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
) else (
    echo ✅ Dependencies installed successfully
)

REM Build the Next.js application
echo [4/6] Building the web application...
npm run build --silent
if %errorlevel% neq 0 (
    echo ❌ Failed to build web application
    pause
    exit /b 1
) else (
    echo ✅ Web application built successfully
)

REM Install Electron dependencies
echo [5/6] Installing desktop application components...
npm install electron@^28.0.0 electron-builder@^24.9.1 electron-store@^8.1.0 --save-dev --silent
if %errorlevel% neq 0 (
    echo ❌ Failed to install Electron components
    pause
    exit /b 1
) else (
    echo ✅ Desktop components installed successfully
)

REM Build the desktop application
echo [6/6] Building desktop executable...
echo    Creating Windows installer...
npx electron-builder --win --config electron-package.json
if %errorlevel% neq 0 (
    echo ❌ Failed to build desktop application
    pause
    exit /b 1
) else (
    echo ✅ Desktop application built successfully!
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🎉 SUCCESS! 🎉                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📁 Your executable is ready in the 'dist' folder!
echo.
echo 🚀 What's next:
echo    1. Go to the 'dist' folder
echo    2. Run 'Kashmir Carpentry LLC Setup.exe'
echo    3. Install the application
echo    4. Launch and login with:
echo       👤 admin / kashmir2025 (Full access)
echo       👤 manager / manager123 (Manager access)
echo       👤 user / user123 (Basic access)
echo.
echo 💾 Features included:
echo    ✅ Customer & Project Management
echo    ✅ Invoice & Quotation Generation
echo    ✅ UAE Tax Compliance (9%% Corporate + 5%% VAT)
echo    ✅ Material & Labor Tracking
echo    ✅ Financial Reports
echo    ✅ Data Backup & Export
echo    ✅ Multi-user Authentication
echo.

REM Open the dist folder
if exist "dist" (
    echo 📂 Opening dist folder...
    start explorer dist
)

echo Press any key to exit...
pause >nul
