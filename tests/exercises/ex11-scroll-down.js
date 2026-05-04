// Bài 11: Scroll xuống để xem thêm nội dung
describe('Bài 11 - Scroll xuống', () => {
  it('scroll xuống một lần', async () => {
    await driver.action('pointer')
      .move({ duration: 0, x: 540, y: 800 })
      .down({ button: 0 })
      .move({ duration: 1000, x: 540, y: 200 })
      .up({ button: 0 })
      .perform();
  });

  it('scroll xuống cho đến khi tìm thấy element', async () => {
    let found = false;
    for (let i = 0; i < 5; i++) {
      const isVisible = await $('~load-more-btn').isDisplayed().catch(() => false);
      if (isVisible) {
        found = true;
        break;
      }
      await driver.action('pointer')
        .move({ duration: 0, x: 540, y: 800 })
        .down({ button: 0 })
        .move({ duration: 800, x: 540, y: 300 })
        .up({ button: 0 })
        .perform();
    }
    expect(found).toBe(true);
  });

  it('scroll đến cuối trang', async () => {
    await $('~footer-element').scrollIntoView();
    await expect($('~footer-element')).toBeDisplayed();
  });
});
