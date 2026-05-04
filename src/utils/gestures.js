/**
 * gestures.js — Các hàm vuốt và cuộn màn hình
 *
 * Scroll và swipe trên mobile là "gesture" (cử chỉ tay).
 * Về mặt kỹ thuật, bạn đang mô phỏng: đặt ngón tay → giữ → di chuyển → nhấc lên.
 * Đó là lý do code trông phức tạp hơn web.
 */

/**
 * Scroll xuống một "trang".
 * Mô phỏng ngón tay đặt gần đáy màn hình, kéo lên trên.
 */
export async function scrollDown() {
  const { width, height } = await driver.getWindowSize();
  const centerX = Math.floor(width / 2);

  await driver.action('pointer')
    .move({ duration: 0, x: centerX, y: Math.floor(height * 0.75) })  // bắt đầu ở 75% chiều cao
    .down({ button: 0 })                                                 // đặt ngón tay xuống
    .move({ duration: 1000, x: centerX, y: Math.floor(height * 0.25) }) // kéo lên 25%
    .up({ button: 0 })                                                   // nhấc ngón tay
    .perform();
}

/**
 * Scroll lên một "trang".
 */
export async function scrollUp() {
  const { width, height } = await driver.getWindowSize();
  const centerX = Math.floor(width / 2);

  await driver.action('pointer')
    .move({ duration: 0, x: centerX, y: Math.floor(height * 0.25) })
    .down({ button: 0 })
    .move({ duration: 1000, x: centerX, y: Math.floor(height * 0.75) })
    .up({ button: 0 })
    .perform();
}

/**
 * Swipe trái (dùng cho: chuyển slide carousel, xóa item bằng swipe).
 */
export async function swipeLeft() {
  const { width, height } = await driver.getWindowSize();
  const centerY = Math.floor(height / 2);

  await driver.action('pointer')
    .move({ duration: 0, x: Math.floor(width * 0.8), y: centerY })
    .down({ button: 0 })
    .move({ duration: 800, x: Math.floor(width * 0.2), y: centerY })
    .up({ button: 0 })
    .perform();
}

/**
 * Swipe phải (dùng cho: mở drawer menu, quay lại slide trước).
 */
export async function swipeRight() {
  const { width, height } = await driver.getWindowSize();
  const centerY = Math.floor(height / 2);

  await driver.action('pointer')
    .move({ duration: 0, x: Math.floor(width * 0.2), y: centerY })
    .down({ button: 0 })
    .move({ duration: 800, x: Math.floor(width * 0.8), y: centerY })
    .up({ button: 0 })
    .perform();
}

/**
 * Scroll xuống cho đến khi tìm thấy element với selector cho trước.
 * Tối đa maxScrolls lần scroll.
 *
 * @param {string} selector   - Locator của element cần tìm
 * @param {number} maxScrolls - Số lần scroll tối đa (mặc định 5)
 * @returns {boolean} true nếu tìm thấy, false nếu không
 */
export async function scrollUntilVisible(selector, maxScrolls = 5) {
  for (let i = 0; i < maxScrolls; i++) {
    const isVisible = await $(selector).isDisplayed().catch(() => false);
    if (isVisible) {
      return true;
    }
    await scrollDown();
  }
  return false;
}
