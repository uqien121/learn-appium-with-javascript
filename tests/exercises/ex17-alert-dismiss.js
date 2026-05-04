// Bài 17: Xử lý Alert - hủy bỏ (Cancel/Dismiss)
describe('Bài 17 - Xử lý Alert (Dismiss)', () => {
  it('dismiss alert để hủy hành động', async () => {
    await $('~delete-btn').click();

    await driver.waitUntil(async () => {
      try {
        await driver.getAlertText();
        return true;
      } catch {
        return false;
      }
    }, { timeout: 5000 });

    await driver.dismissAlert();

    // Item vẫn còn sau khi cancel
    await expect($('~list-item-0')).toBeDisplayed();
  });

  it('từ chối permission trên Android', async () => {
    await $('~location-btn').click();

    const denyBtn = await $('id=com.android.packageinstaller:id/permission_deny_button');
    if (await denyBtn.isDisplayed()) {
      await denyBtn.click();
    }
  });
});
