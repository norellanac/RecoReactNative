import { client } from '../e2e-jest.setup';

const getSelector = (id) => {
  if (client && client.isAndroid) {
    return `android=new UiSelector().resourceId("us.boomsolutions.app:id/${id}")`;
  } else if (client && client.isIOS) {
    return `~${id}`;
  }
  throw new Error(
    'Client is not properly initialized or platform is not supported',
  );
};
const timeout = 9000;
export const tapButton = async elementID => {
  const button = await client.$(getSelector(elementID));
  await button.waitForDisplayed({ timeout });
  await button.click();
  await button.click();
  expect(button.isDisplayed()).toBeTruthy();
};

export const enterValueOn = async (elementID, value) => {
  const input = await client.$(getSelector(elementID));
  await input.waitForDisplayed({ timeout });
  await client.hideKeyboard();
  await input.setValue(value);
  expect(input).toBeTruthy();
};

export const seconds = async (seconds) => {
  await client.pause(seconds * 1000);
  expect(seconds).toBeTruthy();
};

export const tapText = async (text, exact = false) => {
  let selector;

  if (client && client.isAndroid) {
    // For Android, use UiSelector with text matching
    if (exact) {
      selector = `android=new UiSelector().text("${text}")`;
    } else {
      selector = `android=new UiSelector().textContains("${text}")`;
    }
  } else if (client && client.isIOS) {
    // For iOS, use predicate string or xpath
    if (exact) {
      selector = `~${text}`;
    } else {
      selector = `xpath=//*[contains(@name, "${text}") or contains(@label, "${text}") or contains(@value, "${text}")]`;
    }
  } else {
    throw new Error(
      'Client is not properly initialized or platform is not supported',
    );
  }

  const element = await client.$(selector);
  await element.waitForDisplayed({ timeout });
  await element.click();
  expect(element.isDisplayed()).toBeTruthy();
};

export const waitForText = async (text, exact = false, timeoutMs = timeout) => {
  let selector;
  
  if (client && client.isAndroid) {
    if (exact) {
      selector = `android=new UiSelector().text("${text}")`;
    } else {
      selector = `android=new UiSelector().textContains("${text}")`;
    }
  } else if (client && client.isIOS) {
    if (exact) {
      selector = `~${text}`;
    } else {
      selector = `xpath=//*[contains(@name, "${text}") or contains(@label, "${text}") or contains(@value, "${text}")]`;
    }
  } else {
    throw new Error(
      'Client is not properly initialized or platform is not supported',
    );
  }

  const element = await client.$(selector);
  await element.waitForDisplayed({ timeout: timeoutMs });
  return element;
};

export const isTextDisplayed = async (text, exact = false) => {
  try {
    const element = await waitForText(text, exact, 3000);
    return await element.isDisplayed();
  } catch {
    return false;
  }
};

// export const loginUser = async (username = 'test', password = '123456') => {
//   await seconds(3);
//   await enterValueOn('tenant-screen-company-code-input', 'test-tenant-a');
//   await seconds(5);
//   await tapButton('tenant-screen-select-button');
//   await seconds(5);
//   expect(await client.$('~logout')).toBeTruthy();
// };

export const tapOnSkipText = async () => {
  await tapText('Saltar', true);
};
