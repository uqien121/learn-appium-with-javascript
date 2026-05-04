import { config as baseConfig } from './wdio.conf.js';

export const config = {
  ...baseConfig,

  specs: ['./tests/exercises/**/*.js'],

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'emulator-5554',
      'appium:platformVersion': '14.0',
      'appium:app': process.env.ANDROID_APP_PATH || './apps/app.apk',
      'appium:noReset': false,
      'appium:newCommandTimeout': 240,
    },
  ],
};
