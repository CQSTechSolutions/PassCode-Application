# PassCode

A secure password manager that stores your credentials locally on your device. The application features a modern Edge browser-like UI with a search bar, sorting capabilities, and complete CRUD operations.

## Features

- Local password storage for enhanced security
- Edge browser-like modern UI
- Search functionality
- Complete CRUD operations (Create, Read, Update, Delete)
- Sorting by destination
- OTA (Over-The-Air) updates

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Run the development server:
```bash
npx expo start
```

## Deployment

### Initial Setup

1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```

2. Verify EAS installation:
   ```bash
   eas --version
   ```

3. Configure EAS build:
   ```bash
   eas build:configure
   ```

### Building

#### Preview Build (Development)

Create a preview build for testing:
```bash
eas build --profile preview --platform android
```

#### Production Build

Create a production build for store submission:
```bash
eas build --profile production --platform android
```

### OTA Updates

#### Configure Update Profile

Make sure your `app.json` has the correct update configuration:
```json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/your-project-id"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

#### Publishing OTA Updates

After making changes to your application, push an OTA update:

1. For preview builds:
   ```bash
   eas update --branch preview --message "Update message"
   ```

2. For production builds:
   ```bash
   eas update --branch production --message "Update message"
   ```

## Using OTA Updates in the App

### Automatic Updates

The app is configured to check for updates automatically when it starts. If an update is available:
1. A green banner will appear at the top of the screen
2. Tap the banner to install the update
3. The app will reload with the new version

### Manual Update Check

To manually check for updates:
1. Tap the refresh icon in the top-right corner of the header
2. If an update is available, you'll be prompted to install it
3. Tap "Update Now" to download and apply the update

### Update Troubleshooting

If updates aren't working properly:

1. **App not checking for updates:**
   - Make sure you're connected to the internet
   - Verify that the app was built with the correct EAS configuration

2. **Update not appearing after publishing:**
   - Ensure you're publishing to the correct branch (preview/production)
   - Confirm that the app's runtime version policy matches your configuration

3. **If updates still don't work:**
   - Uninstall the app and reinstall a new build from EAS
   - This creates a fresh installation that will properly connect to the update server

4. **For existing installs:**
   - Users with existing installs may need to reinstall the app if it was built with an incorrect OTA configuration
   - After reinstalling, future OTA updates should work as expected

## Testing OTA Updates

1. Install the app using a preview or production build
2. Make changes to your app code
3. Push an update using the commands above
4. Open the app and either:
   - Wait for the automatic update check, or
   - Tap the refresh icon in the header to check manually
5. Apply the update when prompted

## Best Practices

- Always test OTA updates with preview builds before pushing to production
- Include meaningful update messages to track changes
- Ensure your updates don't break existing functionality

# Builds

- npm install -g eas-cli
- eas --version
- eas build:configure
- eas build --profile preview --platform android
- eas build --profile production --platform android