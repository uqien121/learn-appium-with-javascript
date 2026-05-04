// Bài 36: Test trên nhiều devices (cấu hình)
// Trong wdio.conf.js, thêm nhiều capabilities để chạy trên nhiều thiết bị

// config/wdio.multi-device.conf.js
// capabilities: [
//   {
//     platformName: 'Android',
//     'appium:deviceName': 'emulator-5554',
//     'appium:platformVersion': '13.0',
//     'appium:app': process.env.ANDROID_APP,
//   },
//   {
//     platformName: 'Android',
//     'appium:deviceName': 'emulator-5556',
//     'appium:platformVersion': '14.0',
//     'appium:app': process.env.ANDROID_APP,
//   }
// ]

describe('Bài 36 - Multi-device', () => {
  it('test hiển thị đúng trên device hiện tại', async () => {
    const { width, height } = await driver.getWindowSize();
    const caps = driver.capabilities;

    console.log(`Device: ${caps['appium:deviceName']}`);
    console.log(`OS: ${caps.platformName} ${caps['appium:platformVersion']}`);
    console.log(`Screen: ${width}x${height}`);

    await expect($('~main-content')).toBeDisplayed();
  });

  it('layout responsive theo kích thước màn hình', async () => {
    const { width } = await driver.getWindowSize();
    if (width >= 600) {
      // Tablet layout
      await expect($('~tablet-sidebar')).toBeDisplayed();
    } else {
      // Phone layout
      await expect($('~mobile-menu-btn')).toBeDisplayed();
    }
  });
});
