// Bài 20: Lấy thông tin màn hình và device
describe('Bài 20 - Thông tin màn hình', () => {
  it('lấy kích thước màn hình', async () => {
    const { width, height } = await driver.getWindowSize();
    console.log(`Màn hình: ${width}x${height}`);
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });

  it('lấy thông tin device', async () => {
    const capabilities = driver.capabilities;
    console.log('Platform:', capabilities.platformName);
    console.log('Device:', capabilities['appium:deviceName']);
    console.log('OS Version:', capabilities['appium:platformVersion']);
  });

  it('tính toán tọa độ swipe dựa vào kích thước màn hình', async () => {
    const { width, height } = await driver.getWindowSize();
    const centerX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.8);
    const endY = Math.floor(height * 0.2);

    await driver.action('pointer')
      .move({ duration: 0, x: centerX, y: startY })
      .down({ button: 0 })
      .move({ duration: 1000, x: centerX, y: endY })
      .up({ button: 0 })
      .perform();
  });
});
