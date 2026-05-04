// Bài 12: Scroll lên đầu trang
describe('Bài 12 - Scroll lên', () => {
  before(async () => {
    // Scroll xuống trước để có thể test scroll lên
    await driver.action('pointer')
      .move({ duration: 0, x: 540, y: 800 })
      .down({ button: 0 })
      .move({ duration: 1000, x: 540, y: 200 })
      .up({ button: 0 })
      .perform();
  });

  it('scroll lên một lần', async () => {
    await driver.action('pointer')
      .move({ duration: 0, x: 540, y: 200 })
      .down({ button: 0 })
      .move({ duration: 1000, x: 540, y: 800 })
      .up({ button: 0 })
      .perform();
  });

  it('scroll lên đầu trang', async () => {
    await $('~page-header').scrollIntoView();
    await expect($('~page-header')).toBeDisplayed();
  });
});
