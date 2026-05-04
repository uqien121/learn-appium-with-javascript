// Bài 14: Swipe phải (quay lại slide trước, mở drawer menu)
describe('Bài 14 - Swipe phải', () => {
  it('swipe phải để mở drawer menu', async () => {
    await driver.action('pointer')
      .move({ duration: 0, x: 10, y: 400 })
      .down({ button: 0 })
      .move({ duration: 800, x: 300, y: 400 })
      .up({ button: 0 })
      .perform();

    await expect($('~drawer-menu')).toBeDisplayed();
  });

  it('swipe phải trong onboarding để quay lại slide trước', async () => {
    await driver.action('pointer')
      .move({ duration: 0, x: 200, y: 400 })
      .down({ button: 0 })
      .move({ duration: 800, x: 800, y: 400 })
      .up({ button: 0 })
      .perform();
  });
});
