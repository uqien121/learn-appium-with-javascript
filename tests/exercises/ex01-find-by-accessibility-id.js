// Bài 01: Tìm element bằng Accessibility ID
// Accessibility ID là locator tốt nhất: content-desc (Android) / accessibilityIdentifier (iOS)
describe('Bài 01 - Tìm element bằng Accessibility ID', () => {
  it('tìm một element', async () => {
    const el = await $('~login-btn');
    await expect(el).toBeDisplayed();
  });

  it('tìm nhiều elements cùng loại', async () => {
    const items = await $$('~list-item');
    expect(items.length).toBeGreaterThan(0);
  });
});
