import { remote } from 'webdriverio';

import capabilities from './e2e-config.js';
import { beforeAll, afterAll } from '@jest/globals';
//jest.retryTimes(1);
//jest.setTimeout(120000);

let client;
const config = {
  host: '0.0.0.0',
  port: 4723,
  waitforTimeout: 999000,
  logLevel: 'error',
  capabilities: {
    ...capabilities,
  },
};

beforeAll(async () => {
  client = await remote(config);
});

afterAll(async () => {
  await client.deleteSession();
});

export { client };
