// Bài 28: Test login flow hoàn chỉnh (E2E)
import LoginPage from '../../src/pages/LoginPage.js';

describe('Bài 28 - Login Flow E2E', () => {
  afterEach(async () => {
    // Logout sau mỗi test để reset state
    try {
      await $('~menu-btn').click();
      await $('~logout-btn').click();
    } catch {
      // Ignore nếu không ở trạng thái logged in
    }
  });

  it('đăng nhập thành công với thông tin hợp lệ', async () => {
    await LoginPage.login('user@example.com', 'Password123!');
    await expect($('~home-screen')).toBeDisplayed();
    await expect($('~user-avatar')).toBeDisplayed();
  });

  it('hiện lỗi khi để trống username', async () => {
    await LoginPage.login('', 'password123');
    await expect($('~username-error')).toBeDisplayed();
    await expect($('~username-error')).toHaveTextContaining('bắt buộc');
  });

  it('hiện lỗi khi để trống password', async () => {
    await LoginPage.login('user@example.com', '');
    await expect($('~password-error')).toBeDisplayed();
  });

  it('hiện lỗi khi sai mật khẩu', async () => {
    await LoginPage.login('user@example.com', 'wrongpassword');
    await expect($('~login-error-message')).toBeDisplayed();
    await expect($('~login-error-message')).toHaveTextContaining('Sai');
  });

  it('nút login bị disabled khi form trống', async () => {
    await expect(LoginPage.loginButton).not.toBeEnabled();
  });
});
