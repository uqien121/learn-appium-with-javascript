// Bài 21: Mở màn hình bằng Deep Link
describe('Bài 21 - Deep Link', () => {
  it('mở màn hình product detail qua deep link', async () => {
    // Android deep link
    await driver.execute('mobile: deepLink', {
      url: 'myapp://product/123',
      package: 'com.example.myapp',
    });

    await expect($('~product-detail-screen')).toBeDisplayed();
  });

  it('mở màn hình login qua deep link', async () => {
    await driver.execute('mobile: deepLink', {
      url: 'myapp://login',
      package: 'com.example.myapp',
    });

    await expect($('~login-form')).toBeDisplayed();
  });

  it('mở URL trong browser (iOS)', async () => {
    // iOS - mở Safari với URL
    await driver.execute('mobile: launchApp', {
      bundleId: 'com.apple.mobilesafari',
    });
  });
});
