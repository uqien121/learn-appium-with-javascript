/**
 * BasePage — Lớp cha cho tất cả Page Object
 *
 * Thay vì lặp lại code waitForDisplayed, click, setValue ở mọi page,
 * ta viết một lần ở đây rồi các page khác extends BasePage và dùng lại.
 *
 * Ví dụ:
 *   class LoginPage extends BasePage { ... }
 *   await LoginPage.tap('~login-btn');   // dùng method từ BasePage
 */
export default class BasePage {

  /**
   * Chờ element xuất hiện trên màn hình rồi trả về nó.
   *
   * Tại sao cần hàm này? Vì nếu tìm element ngay mà nó chưa load xong,
   * Appium sẽ báo "Element not found". Hàm này chờ đến khi element sẵn sàng.
   *
   * @param {string} selector - Locator của element, ví dụ: '~login-btn'
   * @param {number} timeout  - Chờ tối đa bao nhiêu ms (mặc định 10 giây)
   * @returns Element đã sẵn sàng để tương tác
   */
  async waitForDisplayed(selector, timeout = 10000) {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout });
    return el;
  }

  /**
   * Chờ rồi click element.
   * @param {string} selector - Locator của element
   */
  async tap(selector) {
    const el = await this.waitForDisplayed(selector);
    await el.click();
  }

  /**
   * Chờ rồi nhập text vào field.
   * setValue tự xóa text cũ trước khi nhập — không cần gọi clearValue riêng.
   * @param {string} selector - Locator của input field
   * @param {string} text     - Text cần nhập
   */
  async typeText(selector, text) {
    const el = await this.waitForDisplayed(selector);
    await el.setValue(text);
  }

  /**
   * Lấy text hiển thị của element.
   * @param {string} selector - Locator của element
   * @returns {Promise<string>} Text của element
   */
  async getText(selector) {
    const el = await this.waitForDisplayed(selector);
    return el.getText();
  }

  /**
   * Kiểm tra xem element có đang hiển thị không.
   * Không ném lỗi nếu element không tồn tại — trả về false thay vì crash.
   *
   * @param {string} selector - Locator của element
   * @param {number} timeout  - Chờ tối đa bao nhiêu ms
   * @returns {Promise<boolean>} true nếu đang hiển thị, false nếu không
   */
  async isDisplayed(selector, timeout = 5000) {
    try {
      const el = await $(selector);
      await el.waitForDisplayed({ timeout });
      return true;
    } catch {
      return false;
    }
  }
}
