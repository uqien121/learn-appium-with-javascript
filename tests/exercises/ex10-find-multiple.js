// Bài 10: Tìm và làm việc với nhiều elements
describe('Bài 10 - Tìm nhiều elements', () => {
  it('đếm số lượng items trong list', async () => {
    const items = await $$('~list-item');
    console.log(`Số lượng items: ${items.length}`);
    expect(items.length).toBeGreaterThan(0);
  });

  it('lấy text của tất cả items', async () => {
    const items = await $$('~product-name');
    const names = await Promise.all(items.map(el => el.getText()));
    console.log('Tên sản phẩm:', names);
  });

  it('tìm element cụ thể trong list bằng filter', async () => {
    const items = await $$('~product-name');
    let targetItem;
    for (const item of items) {
      const text = await item.getText();
      if (text.includes('Áo')) {
        targetItem = item;
        break;
      }
    }
    expect(targetItem).toBeDefined();
  });

  it('click vào item thứ 3 trong list', async () => {
    const items = await $$('~list-item');
    await items[2].click();
  });
});
