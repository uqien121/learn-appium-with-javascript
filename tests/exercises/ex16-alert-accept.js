// Bài 16: Xử lý Alert - chấp nhận (OK)
describe('Bài 16 - Xử lý Alert (Accept)', () => {
  it('click nút gây ra alert rồi accept', async () => {
    await $('~delete-btn').click();

    // Chờ alert xuất hiện
    await driver.waitUntil(async () => {
      try {
        await driver.getAlertText();
        return true;
      } catch {
        return false;
      }
    }, { timeout: 5000, timeoutMsg: 'Alert không xuất hiện' });

    const alertText = await driver.getAlertText();
    expect(alertText).toContain('Xác nhận xóa');

    await driver.acceptAlert();
  });

  it('xử lý permission dialog trên Android', async () => {
    await $('~camera-btn').click();

    // Android permission dialog dùng UiAutomator2
    const allowBtn = await $('id=com.android.packageinstaller:id/permission_allow_button');
    if (await allowBtn.isDisplayed()) {
      await allowBtn.click();
    }
  });
});
