// utility file to extract the config for E2E testing at runtime
// for appium

let capabilities;

const android = {
  platformName: 'Android',
  'appium:deviceName': 'R5CX419HV2R',
  'appium:appPackage': 'host.exp.exponent',
  'appium:appActivity': 'host.exp.exponent.MainActivity',
  'appium:automationName': 'UiAutomator2',
  'appium:newCommandTimeout': 360,
  'appium:autoGrantPermissions': true,
  'appium:enableBiometric': false,
  'appium:noReset': true,
  'appium:fullReset': false,
  'appium:bstack:options': {
    enableBiometric: false,
  },
};

const ios = {
  platformName: 'iOS',
  'appium:udid': 'E522E7D8-BB31-45EE-AED2-3071DDB8B945',
  'appium:bundleId': 'host.exp.Exponent',
  'appium:automationName': 'XCUITest',
  'appium:newCommandTimeout': 360,
  'appium:noReset': true,
  'appium:fullReset': false,
};

if (!process.env.E2E_DEVICE) {
  throw new Error('E2E_DEVICE environment variable is not defined');
}

if (
  !(
    process.env.E2E_DEVICE.includes('android') ||
    process.env.E2E_DEVICE.includes('ios')
  )
) {
  throw new Error('No e2e device configuration found');
}

if (process.env.E2E_DEVICE === 'android') {
  capabilities = android;
}

if (process.env.E2E_DEVICE === 'ios') {
  capabilities = ios;
}

export default capabilities;
