// import { client } from 'e2e-jest.setup';
import { tapOnSkipText } from './helpers';

describe('Basic E2E Tests', () => {
  it('Tap an element', async () => {
    await tapOnSkipText();
    expect('Appium').toEqual('Appium');
  });
});
