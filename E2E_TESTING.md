# E2E Testing with Appium & WebDriverIO

This project uses Appium with WebDriverIO for end-to-end testing of the React Native mobile application.

## Prerequisites

### System Requirements
- **Node.js** (v16 or higher)
- **Java Development Kit (JDK)** 8 or higher
- **Android SDK** (for Android testing)
- **Xcode** (for iOS testing on macOS)

### Android Setup
1. Install Android Studio
2. Set up Android SDK
3. Set `ANDROID_HOME` environment variable
4. Add Android SDK tools to PATH

### iOS Setup (macOS only)
1. Install Xcode
2. Install Xcode Command Line Tools: `xcode-select --install`
3. Install iOS Simulator

## Installation & Setup

### 1. Install Dependencies
```bash
yarn install
```

### 2. Install Appium Drivers
```bash
yarn appium:install-drivers
```

### 3. Verify Setup
```bash
yarn appium:doctor
```

## Running E2E Tests

### 1. Start Appium Server
```bash
# Start Appium server on default port 4723
yarn appium:server
```

### 2. Build Your App
Make sure your app is built and available:

**For Android:**
```bash
yarn android
# Or use development build
expo run:android
```

**For iOS:**
```bash
yarn ios
# Or use development build  
expo run:ios
```

### 3. Run E2E Tests

**Android Tests:**
```bash
yarn test:e2e:android
```

**iOS Tests:**
```bash
yarn test:e2e:ios
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `yarn appium:server` | Start Appium server |
| `yarn appium:install-drivers` | Install UiAutomator2 and XCUITest drivers |
| `yarn appium:list-drivers` | List installed Appium drivers |
| `yarn appium:doctor` | Check system setup for Android and iOS |
| `yarn test:e2e:setup` | Install drivers and check system setup |
| `yarn test:e2e:android` | Run E2E tests on Android |
| `yarn test:e2e:ios` | Run E2E tests on iOS |

## Configuration

### E2E Configuration (`e2e-config.js`)
- **Android**: Uses UiAutomator2 automation
- **iOS**: Uses XCUITest automation
- Configured with proper app package and activity names

### Jest Configuration (`jest.config.js`)
- E2E tests use different setup file (`e2e-jest.setup.js`)
- Test pattern: `**/__e2e__/*.e2etest.js`

## Writing E2E Tests

### Test Structure
```javascript
import { client } from 'e2e-jest.setup';
import { tapButton, enterValueOn, seconds } from './helpers';

describe('Feature Name', () => {
  it('should perform specific action', async () => {
    // Test implementation
    await tapButton('button-id');
    await enterValueOn('input-id', 'test value');
    await seconds(2);
    
    // Assertions
    expect(await client.$('~success-indicator')).toBeTruthy();
  });
});
```

### Helper Functions
- `tapButton(elementId)` - Tap a button element
- `enterValueOn(elementId, value)` - Enter text in input field
- `seconds(duration)` - Wait for specified seconds
- `loginUser(username, password)` - Login helper function

### Element Selectors
- **Android**: `android=new UiSelector().resourceId("package:id/elementId")`
- **iOS**: `~elementId` (accessibility identifier)

## Troubleshooting

### Common Issues

1. **Appium Server Not Starting**
   ```bash
   # Check if port 4723 is already in use
   lsof -ti:4723
   
   # Kill process if needed
   kill -9 $(lsof -ti:4723)
   ```

2. **Driver Installation Issues**
   ```bash
   # Reinstall drivers
   appium driver uninstall uiautomator2
   appium driver uninstall xcuitest
   yarn appium:install-drivers
   ```

3. **Android Device Not Found**
   ```bash
   # List connected devices
   adb devices
   
   # Start ADB server
   adb start-server
   ```

4. **iOS Simulator Issues**
   ```bash
   # Reset iOS Simulator
   xcrun simctl erase all
   
   # List available simulators
   xcrun simctl list devices
   ```

### Debug Mode
Add logging to see what Appium is doing:
```javascript
// In e2e-jest.setup.js, change logLevel
logLevel: 'debug',
```

## Best Practices

1. **Use Stable Selectors**: Prefer accessibility IDs over XPath
2. **Wait for Elements**: Always wait for elements before interacting
3. **Keep Tests Independent**: Each test should be able to run standalone
4. **Use Page Object Pattern**: Organize elements and actions into page objects
5. **Handle Timing**: Use appropriate waits instead of fixed delays
6. **Clean State**: Reset app state between tests when needed

## CI/CD Integration

For automated testing in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Setup E2E Testing
  run: |
    yarn appium:install-drivers
    yarn appium:doctor

- name: Start Appium Server
  run: yarn appium:server &

- name: Run E2E Tests
  run: yarn test:e2e:android
```

## Resources

- [Appium Documentation](https://appium.io/docs/en/2.0/)
- [WebDriverIO Documentation](https://webdriver.io/)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)