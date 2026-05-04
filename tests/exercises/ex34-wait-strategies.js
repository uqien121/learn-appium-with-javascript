// Bài 34: So sánh các chiến lược wait - implicit vs explicit
// Kết luận: LUÔN dùng explicit wait, không dùng driver.pause()
describe('Bài 34 - Wait Strategies', () => {
  it('BAD: driver.pause() - chờ cứng (không nên dùng)', async () => {
    await $('~load-btn').click();
    await driver.pause(3000);  // Chờ 3 giây dù kết quả đã về sau 0.5 giây - lãng phí
    await expect($('~result')).toBeDisplayed();
  });

  it('GOOD: waitForDisplayed - chờ element xuất hiện', async () => {
    await $('~load-btn').click();
    await $('~result').waitForDisplayed({ timeout: 10000 });  // chỉ chờ đúng lúc cần
    await expect($('~result')).toBeDisplayed();
  });

  it('GOOD: waitUntil - điều kiện tùy chỉnh', async () => {
    await $('~load-btn').click();
    await driver.waitUntil(
      async () => {
        const text = await $('~counter').getText().catch(() => '0');
        return parseInt(text) >= 5;
      },
      { timeout: 15000, timeoutMsg: 'Counter chưa đạt 5 sau 15 giây', interval: 500 }
    );
  });

  it('GOOD: waitForExist - element tồn tại trong DOM (kể cả ẩn)', async () => {
    await $('~load-btn').click();
    await $('~hidden-data').waitForExist({ timeout: 10000 });
  });

  it('GOOD: xử lý element có thể không tồn tại', async () => {
    const el = await $('~optional-banner');
    const exists = await el.isExisting();
    if (exists) {
      await el.click();
    }
  });
});
