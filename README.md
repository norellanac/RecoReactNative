# ProjectX Mobile

Welcome to ProjectX Mobile, an advanced mobile application built with Expo, designed to deliver a seamless and efficient experience across both Android and iOS platforms. Leveraging the power of React Native and a suite of carefully selected libraries, this project aims to provide a robust foundation for developing high-quality mobile applications.

## Features

- **Cross-Platform Support**: Runs on Android, iOS, and web platforms.
- **Internationalization**: Integrated with `i18next` and `react-i18next` for easy localization.
- **Custom Icons**: Utilizes `@expo/vector-icons` for a wide range of icons.
- **Navigation**: Implemented with `@react-navigation/native` for smooth and intuitive navigation between screens.
- **Performance Optimized**: Includes `react-native-reanimated` and `react-native-gesture-handler` for fluid animations and gestures.
- **Testing Ready**: Setup with `jest` and `jest-expo` for unit testing.

## Getting Started

### Prerequisites

- Node.js
- Yarn package manager
- Expo CLI

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd ProjectX-Mobile
   ```

3. Install the dependencies:

   ```bash
    yarn install
   ```

4. Start the development server:

   ```bash
   yarn start
   ```

5. Open the Expo Go app on your mobile device and scan the QR code to run the application.

## Development

### Code Formatting & Linting

Format and lint your code to ensure consistency:

```bash
yarn format  # Format with Prettier
yarn lint    # Lint with ESLint
```

### Unit Testing

The project uses Jest and React Native Testing Library for unit testing. The Jest configuration automatically switches between unit and E2E test modes.

**Run unit tests:**

```bash
yarn test  # Run all unit tests with coverage
```

**Test Configuration:**
- **Framework**: Jest 30.2.0 + React Native Testing Library
- **Setup**: `setupTests.js` configures mocks and test environment
- **Coverage**: Automatic coverage reports in terminal and `coverage/` folder
- **Test Location**: `**/__tests__/**/*.test.js` files

**Writing Tests:**
- Place test files in `__tests__/` folders next to components
- Use `.test.js` extension
- Import from `@atoms`, `@molecules` aliases (configured in Jest)
- ThemeProvider and navigation mocks are pre-configured

**Example test structure:**
```javascript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@atoms';

describe('Button Component', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Button title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });
});
```

**Switch test modes** (in `jest.config.js`):
```javascript
const isUnitTesting = true;  // true = unit tests, false = E2E tests
```

## E2E testing (Appium + Expo Go)

This project includes end-to-end (E2E) test support using Appium and WebDriver-based tooling. Below are quick instructions to get E2E tests running on macOS (zsh) using Expo Go.

Important: tests expect `E2E_DEVICE` environment variable to be set to `android` or `ios`. Example test scripts use `yarn test:e2e:android`.

1) Verify devices / UDIDs

- Android (physical device):

```bash
# list connected Android devices (show device id)
adb devices
# Example output: R5CX419HV2R\tdevice
```

- iOS Simulator UDID:

```bash
# list available simulators and their UDIDs
xcrun simctl list devices
# copy the UDID of the simulator you want to use (e.g. iPhone 15 Pro)
```

- iOS physical device UDID (macOS):

```bash
# install libimobiledevice if you don't have it
brew install libimobiledevice
# list connected iOS devices (UDIDs)
idevice_id -l
# Alternative (if idevice_id not available):
system_profiler SPUSBDataType | grep -A20 -i "iphone"
```

2) Ensure Appium is running

You can run Appium with the project-local binary (recommended) or global install.

```bash
# using local install
yarn appium
# or using npx
npx appium
```

3) Fix common UiAutomator2 missing APK error (Android)

If Appium fails to create a session with an error mentioning a missing `settings_apk-debug.apk`, reinstall the UiAutomator2 driver used by Appium:

```bash
# uninstall then reinstall the UiAutomator2 driver
npx appium driver uninstall uiautomator2
npx appium driver install uiautomator2
# then restart Appium
npx appium
```

4) Verify connections

```bash
# Confirm Appium is listening on port 4723
nc -vz 127.0.0.1 4723
```

5) Run E2E tests

```bash
# Android E2E tests
yarn test:e2e:android
# iOS E2E tests  
yarn test:e2e:ios
```

### Troubleshooting

**Expo Go Configuration**: The project is pre-configured for Expo Go (`host.exp.exponent` / `host.exp.Exponent`).

**iOS Physical Devices**: Requires proper provisioning and developer signing.

**Node.js Compatibility**: Use Node.js 20.x for best WebDriverIO/Appium compatibility.

**ADB Issues**: Restart ADB if device connection fails:
```bash
adb kill-server && adb start-server
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
