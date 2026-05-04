/**
 * LoginPage — Page Object cho màn hình đăng nhập
 *
 * Tất cả locator và logic của màn hình login ở một chỗ này.
 * Khi dev đổi accessibility id, chỉ cần sửa ở đây — không phải sửa từng test.
 */
import BasePage from './BasePage.js';

class LoginPage extends BasePage {

  // === LOCATORS ===
  // Dùng getter để mỗi lần gọi tìm element mới — tránh stale element error
  // (stale = element đã bị xóa khỏi DOM sau khi bạn tìm nó lần trước)

  get usernameField() { return $('~username'); }
  get passwordField() { return $('~password'); }
  get loginButton()   { return $('~login-btn'); }
  get errorMessage()  { return $('~error-message'); }

  // === ACTIONS ===

  /**
   * Thực hiện đăng nhập.
   * @param {string} email    - Email người dùng
   * @param {string} password - Mật khẩu
   */
  async login(email, password) {
    await this.typeText('~username', email);
    await this.typeText('~password', password);
    await this.tap('~login-btn');
  }
}

// Export instance (singleton) thay vì class
// Nghĩa là tất cả test dùng chung 1 object LoginPage, không tạo mới mỗi lần
export default new LoginPage();
