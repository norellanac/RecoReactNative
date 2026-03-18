const isUnitTesting = true; //set this to false to run e2e tests

module.exports = {
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation)',
  ],
  testTimeout: 999000,
  bail: 0,
  preset: 'react-native',
  setupFilesAfterEnv: isUnitTesting
    ? ['./setupTests.js']
    : ['./e2e-jest.setup.js'],
  testMatch: isUnitTesting
    ? ['**/__tests__/**/*.test.js']
    : ['**/__e2e__/*.e2etest.js'],
  moduleNameMapper: {
    '^@navigation$': '<rootDir>/app/routes',
    '^@atoms$': '<rootDir>/app/components/atoms',
    '^@molecules$': '<rootDir>/app/components/molecules',
    '^@organisms$': '<rootDir>/app/components/organisms',
  }
};
