// Bài 39: Cross-platform test - cùng test chạy trên Android và iOS
const isAndroid = driver.capabilities.platformName === 'Android';
const isIOS = driver.capabilities.platformName === 'iOS';

// Helper: lấy locator đúng theo platform
function locator(androidSelector, iosSelector) {
  return isAndroid ? androidSelector : iosSelector;
}

describe('Bài 39 - Cross-platform Test', () => {
  it('tìm element với locator khác nhau theo platform', async () => {
    // Android dùng content-desc, iOS dùng accessibilityIdentifier
    // Nếu dev đặt cùng tên thì dùng ~selector cho cả hai
    const loginBtn = await $(locator('~login-btn', '~login-button'));
    await expect(loginBtn).toBeDisplayed();
  });

  it('scroll theo cách đúng với từng platform', async () => {
    if (isAndroid) {
      await driver.execute('mobile: scrollGesture', {
        left: 100, top: 100, width: 800, height: 800,
        direction: 'down',
        percent: 0.75,
      });
    } else {
      await driver.execute('mobile: scroll', {
        direction: 'down',
      });
    }
  });

  it('xử lý permission dialog khác nhau', async () => {
    await $('~request-permission-btn').click();

    if (isAndroid) {
      const allowBtn = await $('//android.widget.Button[contains(@text,"Allow")]');
      if (await allowBtn.isDisplayed().catch(() => false)) {
        await allowBtn.click();
      }
    } else {
      // iOS
      const allowBtn = await $('//XCUIElementTypeButton[@name="Allow"]');
      if (await allowBtn.isDisplayed().catch(() => false)) {
        await allowBtn.click();
      }
    }
  });

  it('kiểm tra platform name trong test', async () => {
    console.log('Đang chạy trên:', driver.capabilities.platformName);
    expect(['Android', 'iOS']).toContain(driver.capabilities.platformName);
  });
});
