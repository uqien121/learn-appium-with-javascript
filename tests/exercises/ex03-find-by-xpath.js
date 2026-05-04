// Bài 03: Tìm element bằng XPath (dùng khi không có accessibility id / id)
// Cảnh báo: XPath chậm và dễ vỡ khi UI thay đổi. Ưu tiên Accessibility ID.
describe('Bài 03 - Tìm element bằng XPath', () => {
  it('tìm bằng text chính xác', async () => {
    const el = await $('//android.widget.Button[@text="Đăng nhập"]');
    await expect(el).toBeDisplayed();
  });

  it('tìm bằng text chứa (contains)', async () => {
    const el = await $('//android.widget.TextView[contains(@text, "Xin chào")]');
    await expect(el).toBeDisplayed();
  });

  it('tìm phần tử con', async () => {
    // Tìm Button bên trong LinearLayout
    const el = await $('//android.widget.LinearLayout//android.widget.Button');
    await expect(el).toBeDisplayed();
  });
});
