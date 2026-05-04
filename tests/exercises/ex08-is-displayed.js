// Bài 08: Kiểm tra element có đang hiển thị không
describe('Bài 08 - Kiểm tra hiển thị', () => {
  it('element phải hiển thị', async () => {
    const el = await $('~main-content');
    await expect(el).toBeDisplayed();
  });

  it('element không được hiển thị (error message khi chưa có lỗi)', async () => {
    const errorMsg = await $('~error-message');
    await expect(errorMsg).not.toBeDisplayed();
  });

  it('kiểm tra bằng isDisplayed()', async () => {
    const el = await $('~header');
    const isVisible = await el.isDisplayed();
    expect(isVisible).toBe(true);
  });

  it('element tồn tại trong DOM nhưng không visible', async () => {
    const hiddenEl = await $('~hidden-panel');
    await expect(hiddenEl).not.toBeDisplayed();
  });
});
