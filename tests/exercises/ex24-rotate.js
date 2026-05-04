// Bài 24: Xoay màn hình (landscape / portrait)
describe('Bài 24 - Xoay màn hình', () => {
  afterEach(async () => {
    // Reset về portrait sau mỗi test
    await driver.setOrientation('PORTRAIT');
  });

  it('xoay sang landscape', async () => {
    await driver.setOrientation('LANDSCAPE');
    const orientation = await driver.getOrientation();
    expect(orientation).toBe('LANDSCAPE');
  });

  it('kiểm tra layout thay đổi khi xoay', async () => {
    const portraitSize = await driver.getWindowSize();

    await driver.setOrientation('LANDSCAPE');
    const landscapeSize = await driver.getWindowSize();

    // Width và height phải đổi chỗ
    expect(landscapeSize.width).toBeGreaterThan(landscapeSize.height);
    expect(portraitSize.height).toBeGreaterThan(portraitSize.width);
  });

  it('content vẫn hiển thị sau khi xoay', async () => {
    await driver.setOrientation('LANDSCAPE');
    await expect($('~main-content')).toBeDisplayed();

    await driver.setOrientation('PORTRAIT');
    await expect($('~main-content')).toBeDisplayed();
  });
});
