# Kashmir Carpentry LLC - Desktop Application Build Instructions

## Prerequisites

1. **Node.js** (version 18 or higher)
2. **npm** or **yarn**
3. **Git** (optional, for version control)

## Building the Desktop Application

### Step 1: Prepare the Next.js Application

```bash
# Install dependencies
npm install

# Build the Next.js application for production
npm run build

# Export static files
npm run export
```

### Step 2: Setup Electron

```bash
# Copy the Electron package.json
cp electron-package.json package-electron.json

# Install Electron dependencies
npm install --prefix . electron@^28.0.0 electron-builder@^24.9.1 electron-store@^8.1.0
```

### Step 3: Build the Executable

#### For Windows (.exe):
```bash
# Build for Windows
npm run build-electron -- --win
```

#### For macOS (.dmg):
```bash
# Build for macOS
npm run build-electron -- --mac
```

#### For Linux (.AppImage):
```bash
# Build for Linux
npm run build-electron -- --linux
```

#### For All Platforms:
```bash
# Build for all platforms
npm run build-electron
```

## Alternative: Using Electron Builder Directly

### Step 1: Install Electron Builder Globally
```bash
npm install -g electron-builder
```

### Step 2: Prepare Files
```bash
# Create output directory
mkdir -p out

# Copy Next.js build to out directory
cp -r .next/static out/
cp -r public/* out/
```

### Step 3: Build
```bash
# Build executable
electron-builder --config electron-package.json
```

## Configuration Files

### Required Files:
- `electron/main.js` - Main Electron process
- `electron/preload.js` - Preload script for security
- `electron-package.json` - Electron build configuration

### Optional Assets:
- `assets/icon.png` - Application icon (512x512 recommended)
- `assets/icon.ico` - Windows icon
- `assets/icon.icns` - macOS icon

## Network Setup for Multiple PCs

### Option 1: Standalone Installation
1. Install the executable on each PC
2. Each PC maintains its own local database
3. Use backup/restore feature to sync data

### Option 2: Shared Network Drive
1. Install on one main PC
2. Share the application folder on network
3. Other PCs can access via network path
4. Configure Windows/network permissions

### Option 3: Database Server (Advanced)
1. Set up a central database server (MySQL/PostgreSQL)
2. Modify the application to connect to central database
3. All PCs connect to the same database

## User Accounts

The application includes three default user levels:

- **Admin**: `admin` / `kashmir2025` (Full access)
- **Manager**: `manager` / `manager123` (Limited access)
- **User**: `user` / `user123` (Basic access)

### To Add More Users:
1. Edit `src/app/login/page.tsx`
2. Add new credentials to the `validCredentials` array
3. Rebuild the application

## Data Backup

### Automatic Backup:
- Data is automatically backed up locally
- Backup files are stored in the application data folder

### Manual Backup:
- Use the "Backup Data" feature in the application
- Export data as JSON files
- Can be restored on any PC with the application

### Network Backup:
- Set up scheduled backup to network drive
- Use Windows Task Scheduler or similar

## Troubleshooting

### Common Issues:

1. **Build Fails**: Ensure all dependencies are installed
2. **App Won't Start**: Check Node.js version compatibility
3. **Data Not Syncing**: Verify network permissions
4. **Login Issues**: Check user credentials in code

### Support:
- Check the application logs in the data folder
- Use Developer Tools (Ctrl+Shift+I) for debugging
- Contact system administrator for network issues

## File Structure After Build:

```
dist/
├── win-unpacked/          # Windows executable files
├── mac/                   # macOS application bundle
├── linux-unpacked/        # Linux application files
└── Kashmir Carpentry LLC Setup.exe  # Windows installer
```

## Security Notes:

- User credentials are stored in the application code
- For production use, implement proper authentication
- Consider encrypting sensitive data
- Regular backup of data is recommended
- Keep the application updated for security patches
