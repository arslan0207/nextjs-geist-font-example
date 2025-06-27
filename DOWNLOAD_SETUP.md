# Kashmir Carpentry LLC - Download & Setup Guide

## 📥 **Quick Download & Setup**

### Option 1: Download All Files (Recommended)

1. **Download the complete project** by clicking the "Download ZIP" button or using git:
   ```bash
   git clone [repository-url]
   cd kashmir-carpentry-llc
   ```

2. **Install Node.js** (if not already installed):
   - Visit: https://nodejs.org/
   - Download and install the LTS version (18.x or higher)

3. **Run the setup script**:
   
   **For Windows:**
   - Double-click `build-desktop.bat`
   - Or open Command Prompt and run: `build-desktop.bat`
   
   **For Mac/Linux:**
   - Open Terminal and run: `./build-desktop.sh`

4. **Find your executable** in the `dist` folder after build completes

### Option 2: Manual Setup

1. **Download and extract** all project files
2. **Open terminal/command prompt** in the project folder
3. **Run these commands**:
   ```bash
   # Install dependencies
   npm install --legacy-peer-deps
   
   # Build the web application
   npm run build
   
   # Install Electron for desktop app
   npm install electron electron-builder electron-store --save-dev
   
   # Build desktop executable
   npx electron-builder --win --config electron-package.json
   ```

## 🎯 **What You'll Get**

After building, you'll find these files in the `dist` folder:

- **Windows**: `Kashmir Carpentry LLC Setup.exe` (Installer)
- **Mac**: `Kashmir Carpentry LLC.dmg` (Disk Image)
- **Linux**: `Kashmir Carpentry LLC.AppImage` (Portable App)

## 🚀 **Installation**

1. **Run the installer** from the `dist` folder
2. **Follow installation prompts**
3. **Launch the application**
4. **Login with default credentials**:
   - Admin: `admin` / `kashmir2025`
   - Manager: `manager` / `manager123`
   - User: `user` / `user123`

## 🌐 **For Web Version (No Download Required)**

If you just want to use the web version:

1. **Install Node.js** (https://nodejs.org/)
2. **Download project files**
3. **Open terminal in project folder**
4. **Run**:
   ```bash
   npm install --legacy-peer-deps
   npm run dev
   ```
5. **Open browser** to `http://localhost:3000`

## 📁 **File Structure You Need**

Make sure you have these essential files:
```
kashmir-carpentry-llc/
├── src/                    # Application source code
├── electron/               # Desktop app files
│   ├── main.js
│   └── preload.js
├── electron-package.json   # Desktop build config
├── build-desktop.bat      # Windows build script
├── build-desktop.sh       # Mac/Linux build script
├── package.json           # Dependencies
└── BUILD_INSTRUCTIONS.md  # Detailed instructions
```

## ⚡ **Quick Start Commands**

```bash
# For web development
npm install --legacy-peer-deps
npm run dev

# For desktop build (Windows)
build-desktop.bat

# For desktop build (Mac/Linux)
./build-desktop.sh
```

## 🔧 **Troubleshooting**

### Common Issues:

1. **"npm not found"**: Install Node.js first
2. **"Permission denied"**: Run as administrator (Windows) or use `sudo` (Mac/Linux)
3. **Build fails**: Check internet connection and try again
4. **App won't start**: Ensure all files are extracted properly

### Need Help?

1. Check `BUILD_INSTRUCTIONS.md` for detailed steps
2. Ensure Node.js version 18+ is installed
3. Make sure all project files are downloaded
4. Try running commands as administrator

## 📱 **Network Setup for Multiple PCs**

### Option A: Install on Each PC
1. Build the executable once
2. Copy the installer to each PC
3. Install on each computer
4. Use backup/restore to sync data

### Option B: Shared Network Installation
1. Install on main computer
2. Share the installation folder on network
3. Other PCs access via network path
4. Set proper network permissions

## 🔐 **Default Login Accounts**

- **admin** / **kashmir2025** - Full system access
- **manager** / **manager123** - Management features
- **user** / **user123** - Basic operations

## 💾 **Data Backup**

- Automatic local backup in application
- Manual backup via "Reports" → "Backup Manager"
- Export data as CSV files
- Restore from backup files

---

**Need the executable immediately?** 
Run the build script and check the `dist` folder for your platform-specific installer!
