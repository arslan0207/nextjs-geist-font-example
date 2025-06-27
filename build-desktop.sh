#!/bin/bash

# Kashmir Carpentry LLC - Desktop Build Script
echo "🏗️  Building Kashmir Carpentry LLC Desktop Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Build Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Next.js build failed"
    exit 1
fi

# Export static files
echo "📤 Exporting static files..."
npm run export 2>/dev/null || echo "⚠️  Export command not available, using build output"

# Create electron directory if it doesn't exist
mkdir -p electron

# Install Electron dependencies
echo "⚡ Installing Electron dependencies..."
npm install electron@^28.0.0 electron-builder@^24.9.1 electron-store@^8.1.0 --save-dev

# Copy package.json for electron
cp electron-package.json package-electron.json

# Create assets directory and placeholder icon
mkdir -p assets
if [ ! -f "assets/icon.png" ]; then
    echo "🎨 Creating placeholder icon..."
    # Create a simple text-based icon placeholder
    echo "Add your application icon (512x512 PNG) to assets/icon.png" > assets/icon-readme.txt
fi

# Build the desktop application
echo "🖥️  Building desktop application..."

# Determine the platform
case "$(uname -s)" in
    Darwin*)    PLATFORM="--mac";;
    Linux*)     PLATFORM="--linux";;
    CYGWIN*|MINGW32*|MSYS*|MINGW*) PLATFORM="--win";;
    *)          PLATFORM="--linux";;
esac

echo "🎯 Building for platform: $PLATFORM"

# Run electron-builder
npx electron-builder $PLATFORM --config electron-package.json

if [ $? -eq 0 ]; then
    echo "✅ Desktop application built successfully!"
    echo "📁 Check the 'dist' folder for the executable files"
    
    # List the contents of dist folder
    if [ -d "dist" ]; then
        echo "📋 Built files:"
        ls -la dist/
    fi
    
    echo ""
    echo "🚀 Installation Instructions:"
    echo "1. Navigate to the 'dist' folder"
    echo "2. Run the installer or executable file"
    echo "3. Default login credentials:"
    echo "   - Admin: admin / kashmir2025"
    echo "   - Manager: manager / manager123"
    echo "   - User: user / user123"
    echo ""
    echo "📖 For detailed instructions, see BUILD_INSTRUCTIONS.md"
else
    echo "❌ Build failed. Check the error messages above."
    exit 1
fi
