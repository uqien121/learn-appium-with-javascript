// Bài 33: Xử lý loading spinner / skeleton screen
describe('Bài 33 - Xử lý Loading Spinner', () => {
  it('chờ spinner biến mất trước khi tiếp tục', async () => {
    await $('~load-data-btn').click();

    // Spinner xuất hiện
    await expect($('~loading-spinner')).toBeDisplayed();

    // Chờ spinner biến mất (tối đa 15 giây)
    await $('~loading-spinner').waitForDisplayed({
      timeout: 15000,
      reverse: true,
      timeoutMsg: 'Loading spinner vẫn còn sau 15 giây',
    });

    // Sau khi load xong, content phải hiển thị
    await expect($('~content-list')).toBeDisplayed();
  });

  it('chờ skeleton screen biến mất', async () => {
    await $('~refresh-btn').click();

    await $('~skeleton-item').waitForDisplayed({
      timeout: 10000,
      reverse: true,
    });

    const items = await $$('~real-item');
    expect(items.length).toBeGreaterThan(0);
  });

  it('timeout nếu load quá lâu', async () => {
    await $('~slow-load-btn').click();

    await expect(async () => {
      await $('~loading-spinner').waitForDisplayed({
        timeout: 3000,
        reverse: true,
      });
    }).rejects.toThrow();
  });
});
