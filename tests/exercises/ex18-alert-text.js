// Bài 18: Lấy text từ Alert
describe('Bài 18 - Lấy text Alert', () => {
  it('kiểm tra nội dung của alert', async () => {
    await $('~show-alert-btn').click();

    await driver.waitUntil(async () => {
      try { await driver.getAlertText(); return true; } catch { return false; }
    }, { timeout: 5000 });

    const text = await driver.getAlertText();
    console.log('Nội dung alert:', text);
    expect(text).toBeDefined();
    expect(text.length).toBeGreaterThan(0);

    await driver.acceptAlert();
  });

  it('nhập text vào prompt alert', async () => {
    await $('~show-prompt-btn').click();

    await driver.waitUntil(async () => {
      try { await driver.getAlertText(); return true; } catch { return false; }
    }, { timeout: 5000 });

    await driver.sendAlertText('Nội dung nhập vào');
    await driver.acceptAlert();
  });
});
