# Packaging and Installer Guide for Kashmir Carpentry LLC Windows Desktop App

## Prerequisites

- Windows machine with Node.js (v18 or higher) and npm installed
- Git (optional, for cloning repository)
- PowerShell or Command Prompt access

## Packaging the Application

### Step 1: Clone or Download the Project

```bash
git clone <repository-url>
cd kashmir-carpentry-llc
```

### Step 2: Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Step 3: Build the Next.js Application

```bash
npm run build
```

### Step 4: Build the Electron Desktop App

```bash
npm install electron electron-builder electron-store --save-dev
npx electron-builder --win --config electron-package.json
```

This will create a Windows installer executable in the `dist` folder.

## Installer Location

- The installer will be located in the `dist` folder, named something like:

```
Kashmir Carpentry LLC Setup.exe
```

## Installing the Application

1. Double-click the installer executable.
2. Follow the on-screen instructions to install the application.
3. After installation, launch the app from the Start Menu or Desktop shortcut.

## Default Login Credentials

| Role    | Username | Password     |
|---------|----------|--------------|
| Admin   | admin    | kashmir2025  |
| Manager | manager  | manager123   |
| User    | user     | user123      |

## Updating the Application

- To update, download the latest installer and run it.
- Your data will be preserved if stored locally.

## Troubleshooting

- If the installer fails, ensure you have the latest Node.js and npm versions.
- Check for any antivirus or firewall blocking the installer.
- Run the installer as Administrator if you encounter permission issues.

## Additional Notes

- The app supports multi-user authentication and role-based access.
- Data backup and restore features are available in the app.
- For networked multi-PC setups, use shared drives or backup/restore.

## Support

For further assistance, please contact the development team or system administrator.

---

This guide helps you package, install, and manage the Kashmir Carpentry LLC Windows desktop application.
