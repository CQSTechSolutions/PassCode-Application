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
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/your-project-id"
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

## Testing OTA Updates

1. Install the app using a preview or production build
2. Make changes to your app code
3. Push an update using the commands above
4. Open the app to see the update being applied

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