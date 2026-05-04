// Bài 32: Upload file (ảnh, document)
describe('Bài 32 - Upload file', () => {
  it('upload ảnh từ device lên app', async () => {
    // Đẩy file lên device trước
    await driver.pushFile(
      '/sdcard/test-image.jpg',
      require('fs').readFileSync('./tests/data/test-image.jpg').toString('base64')
    );

    await $('~upload-btn').click();

    // Chọn từ gallery (Android)
    await $('~gallery-option').click();
    await $('~file-item-0').click();

    await expect($('~upload-preview')).toBeDisplayed();
  });

  it('upload ảnh bằng camera (giả lập)', async () => {
    // Inject ảnh giả vào camera stream (UiAutomator2)
    await driver.execute('mobile: injectImage', {
      payload: require('fs').readFileSync('./tests/data/test-image.jpg').toString('base64'),
    });

    await $('~camera-btn').click();
    await $('~capture-btn').click();
    await $('~confirm-btn').click();
  });
});
