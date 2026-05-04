import { config as baseConfig } from './wdio.conf.js';

export const config = {
  ...baseConfig,

  specs: ['./tests/exercises/**/*.js'],

  capabilities: [
    {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': 'iPhone 15',
      'appium:platformVersion': '17.0',
      'appium:app': process.env.IOS_APP_PATH || './apps/app.app',
      'appium:noReset': false,
      'appium:newCommandTimeout': 240,
    },
  ],
};
