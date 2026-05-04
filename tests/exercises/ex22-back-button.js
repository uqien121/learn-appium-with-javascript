// Bài 22: Nhấn nút Back (Android hardware back button)
describe('Bài 22 - Back button', () => {
  before(async () => {
    // Điều hướng vào một màn hình con trước
    await $('~settings-btn').click();
    await expect($('~settings-screen')).toBeDisplayed();
  });

  it('quay lại màn hình trước bằng back button', async () => {
    await driver.back();
    await expect($('~home-screen')).toBeDisplayed();
  });

  it('quay lại nhiều lần', async () => {
    await $('~settings-btn').click();
    await $('~profile-btn').click();

    await driver.back();  // profile -> settings
    await expect($('~settings-screen')).toBeDisplayed();

    await driver.back();  // settings -> home
    await expect($('~home-screen')).toBeDisplayed();
  });
});
