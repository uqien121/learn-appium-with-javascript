// Bài 37: Chạy test song song
// WebdriverIO hỗ trợ parallel qua maxInstances trong wdio.conf.js

// Thêm vào wdio.conf.js để chạy song song:
// maxInstances: 3,           // Chạy tối đa 3 test suite cùng lúc
// maxInstancesPerCapability: 2,

// Quan trọng khi viết test song song:
// 1. Mỗi test phải độc lập (không phụ thuộc vào state của test khác)
// 2. Không dùng shared state (global variables)
// 3. Mỗi test tự setup và teardown data của nó

describe('Bài 37 - Test độc lập (chuẩn cho parallel)', () => {
  let testUserId;

  before(async () => {
    // Tạo user riêng cho test này để tránh conflict với test khác
    const timestamp = Date.now();
    const email = `parallel-test-${timestamp}@example.com`;
    await $('~register-link').click();
    await $('~email-input').setValue(email);
    await $('~password-input').setValue('Pass123!');
    await $('~register-btn').click();
    testUserId = timestamp;
  });

  after(async () => {
    // Dọn dẹp data sau test
    console.log(`Cleanup user: ${testUserId}`);
  });

  it('test với user riêng - không conflict với test khác', async () => {
    await expect($('~home-screen')).toBeDisplayed();
  });

  it('thêm item vào cart của riêng user này', async () => {
    await $('~product-list-item-0').click();
    await $('~add-to-cart-btn').click();
    await expect($('~cart-badge')).toHaveText('1');
  });
});
