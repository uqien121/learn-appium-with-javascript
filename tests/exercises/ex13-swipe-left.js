// Bài 13: Swipe trái (thường dùng cho carousel, tab, onboarding)
describe('Bài 13 - Swipe trái', () => {
  it('swipe trái trên carousel', async () => {
    await driver.action('pointer')
      .move({ duration: 0, x: 800, y: 400 })
      .down({ button: 0 })
      .move({ duration: 800, x: 200, y: 400 })
      .up({ button: 0 })
      .perform();
  });

  it('swipe trái để xóa item (swipe-to-delete)', async () => {
    const item = await $('~list-item-0');
    const { x, y, width, height } = await item.getLocation().then(async loc => {
      const size = await item.getSize();
      return { ...loc, ...size };
    });

    await driver.action('pointer')
      .move({ duration: 0, x: x + width - 10, y: y + height / 2 })
      .down({ button: 0 })
      .move({ duration: 500, x: x + 10, y: y + height / 2 })
      .up({ button: 0 })
      .perform();
  });
});
