// Bài 25: Ẩn bàn phím ảo
describe('Bài 25 - Ẩn bàn phím', () => {
  it('ẩn bàn phím sau khi nhập text', async () => {
    const field = await $('~search-input');
    await field.click();
    await field.setValue('search term');

    // Kiểm tra bàn phím đang hiển thị
    const isKeyboardShown = await driver.isKeyboardShown();
    expect(isKeyboardShown).toBe(true);

    // Ẩn bàn phím
    await driver.hideKeyboard();

    const isHidden = await driver.isKeyboardShown();
    expect(isHidden).toBe(false);
  });

  it('ẩn bàn phím bằng cách tap ra ngoài', async () => {
    await $('~search-input').click();

    // Tap vào vùng không phải input
    const { width, height } = await driver.getWindowSize();
    await driver.action('pointer')
      .move({ duration: 0, x: width / 2, y: 100 })
      .down({ button: 0 })
      .up({ button: 0 })
      .perform();
  });

  it('ẩn bàn phím trên Android bằng back button', async () => {
    await $('~text-input').click();
    await driver.pressKeyCode(4);  // KeyCode 4 = BACK
  });
});
