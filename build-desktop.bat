@echo off
echo 🏗️  Building Kashmir Carpentry LLC Desktop Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install --legacy-peer-deps
)

REM Build Next.js application
echo 🔨 Building Next.js application...
npm run build

REM Check if build was successful
if %errorlevel% neq 0 (
    echo ❌ Next.js build failed
    pause
    exit /b 1
)

REM Export static files
echo 📤 Exporting static files...
npm run export 2>nul || echo ⚠️  Export command not available, using build output

REM Create electron directory if it doesn't exist
if not exist "electron" mkdir electron

REM Install Electron dependencies
echo ⚡ Installing Electron dependencies...
npm install electron@^28.0.0 electron-builder@^24.9.1 electron-store@^8.1.0 --save-dev

REM Copy package.json for electron
copy electron-package.json package-electron.json

REM Create assets directory and placeholder icon
if not exist "assets" mkdir assets
if not exist "assets\icon.png" (
    echo 🎨 Creating placeholder icon...
    echo Add your application icon (512x512 PNG) to assets/icon.png > assets\icon-readme.txt
)

REM Build the desktop application
echo 🖥️  Building desktop application...
echo 🎯 Building for Windows platform...

REM Run electron-builder for Windows
npx electron-builder --win --config electron-package.json

if %errorlevel% equ 0 (
    echo ✅ Desktop application built successfully!
    echo 📁 Check the 'dist' folder for the executable files
    
    REM List the contents of dist folder
    if exist "dist" (
        echo 📋 Built files:
        dir dist
    )
    
    echo.
    echo 🚀 Installation Instructions:
    echo 1. Navigate to the 'dist' folder
    echo 2. Run the installer or executable file
    echo 3. Default login credentials:
    echo    - Admin: admin / kashmir2025
    echo    - Manager: manager / manager123
    echo    - User: user / user123
    echo.
    echo 📖 For detailed instructions, see BUILD_INSTRUCTIONS.md
    echo.
    echo Press any key to continue...
    pause >nul
) else (
    echo ❌ Build failed. Check the error messages above.
    pause
    exit /b 1
)
