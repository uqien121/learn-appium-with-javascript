// Bài 07: Lấy text từ element
describe('Bài 07 - Lấy text', () => {
  it('lấy text của label', async () => {
    const label = await $('~welcome-message');
    const text = await label.getText();
    console.log('Text hiển thị:', text);
    expect(typeof text).toBe('string');
  });

  it('kiểm tra text bằng matcher', async () => {
    const el = await $('~page-title');
    await expect(el).toHaveText('Trang chủ');
  });

  it('kiểm tra text chứa chuỗi con', async () => {
    const el = await $('~greeting');
    await expect(el).toHaveTextContaining('Xin chào');
  });

  it('lấy text của nhiều items', async () => {
    const items = await $$('~product-name');
    const texts = await Promise.all(items.map(item => item.getText()));
    console.log('Danh sách sản phẩm:', texts);
    expect(texts.length).toBeGreaterThan(0);
  });
});
