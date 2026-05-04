// Bài 23: Nhấn Home button và chuyển đổi app
describe('Bài 23 - Home button & chuyển app', () => {
  it('nhấn Home button để ra màn hình chính', async () => {
    await driver.pressKeyCode(3);  // KeyCode 3 = HOME (Android)
  });

  it('mở lại app sau khi về Home', async () => {
    await driver.pressKeyCode(3);  // Home

    // Kích hoạt lại app
    await driver.activateApp('com.example.myapp');
    await expect($('~app-content')).toBeDisplayed();
  });

  it('chuyển sang app khác rồi quay lại', async () => {
    // Chuyển app sang background
    await driver.background(3);  // background 3 giây

    // App tự quay lại foreground sau 3 giây
    await expect($('~app-content')).toBeDisplayed();
  });

  it('kiểm tra trạng thái app', async () => {
    const state = await driver.queryAppState('com.example.myapp');
    // 4 = running in foreground
    expect(state).toBe(4);
  });
});
