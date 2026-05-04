// Bài 15: Long press (nhấn giữ)
describe('Bài 15 - Long press', () => {
  it('long press để mở context menu', async () => {
    const el = await $('~list-item-0');
    const { x, y } = await el.getLocation();
    const { width, height } = await el.getSize();

    await driver.action('pointer')
      .move({ duration: 0, x: x + width / 2, y: y + height / 2 })
      .down({ button: 0 })
      .pause(2000)   // giữ 2 giây
      .up({ button: 0 })
      .perform();

    await expect($('~context-menu')).toBeDisplayed();
  });

  it('long press để chọn text', async () => {
    const textEl = await $('~selectable-text');
    const { x, y } = await textEl.getLocation();
    const { width, height } = await textEl.getSize();

    await driver.action('pointer')
      .move({ duration: 0, x: x + width / 2, y: y + height / 2 })
      .down({ button: 0 })
      .pause(1500)
      .up({ button: 0 })
      .perform();
  });
});
