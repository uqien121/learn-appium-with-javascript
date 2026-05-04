// Bài 35: Tự động chụp ảnh khi test fail
// Cách setup: thêm vào wdio.conf.js
//
// afterTest: async (test, ctx, { error }) => {
//   if (error) {
//     const name = test.title.replace(/\s+/g, '-');
//     await driver.saveScreenshot(`./screenshots/FAIL-${name}-${Date.now()}.png`);
//   }
// }

describe('Bài 35 - Screenshot khi fail', () => {
  it('test này sẽ pass và không chụp ảnh', async () => {
    await expect($('~app-content')).toBeDisplayed();
  });

  it('chụp ảnh thủ công trước khi assert quan trọng', async () => {
    // Chụp ảnh để debug nếu cần
    await driver.saveScreenshot('./screenshots/before-critical-action.png');

    await $('~confirm-purchase-btn').click();
    await driver.saveScreenshot('./screenshots/after-critical-action.png');

    await expect($('~success-screen')).toBeDisplayed();
  });

  it('custom error message với context', async () => {
    const productName = await $('~product-title').getText().catch(() => 'unknown');
    const price = await $('~product-price').getText().catch(() => '0');

    // Assertion với custom error message
    const isInStock = await $('~in-stock-badge').isDisplayed();
    expect(isInStock, `Sản phẩm "${productName}" (${price}) phải còn hàng`).toBe(true);
  });
});
