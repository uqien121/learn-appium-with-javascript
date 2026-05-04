// Bài 19: Chụp màn hình
import { join } from 'path';

describe('Bài 19 - Chụp màn hình', () => {
  it('chụp toàn bộ màn hình', async () => {
    const screenshotPath = join(process.cwd(), 'screenshots', 'ex19-full.png');
    await driver.saveScreenshot(screenshotPath);
    console.log('Screenshot đã lưu:', screenshotPath);
  });

  it('chụp một element cụ thể', async () => {
    const el = await $('~product-card');
    await el.saveScreenshot('./screenshots/ex19-element.png');
  });

  it('lấy screenshot dưới dạng base64', async () => {
    const base64 = await driver.takeScreenshot();
    expect(base64).toBeDefined();
    expect(base64.length).toBeGreaterThan(0);
    console.log('Base64 length:', base64.length);
  });
});
