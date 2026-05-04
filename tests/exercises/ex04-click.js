// Bài 04: Click / tap vào element
describe('Bài 04 - Click element', () => {
  it('click vào nút', async () => {
    const btn = await $('~submit-btn');
    await btn.click();
  });

  it('click vào item trong list', async () => {
    const items = await $$('~list-item');
    await items[0].click();
  });

  it('double tap', async () => {
    const el = await $('~double-tap-zone');
    await el.doubleClick();
  });
});
