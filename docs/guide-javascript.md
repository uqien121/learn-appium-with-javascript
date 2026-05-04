# Hướng dẫn Appium với JavaScript (WebdriverIO)

## Tổng quan stack

| Thành phần | Package | Vai trò |
|---|---|---|
| Test runner | `@wdio/cli` | Điều phối chạy test |
| WebDriver client | `webdriverio` | Giao tiếp với Appium server |
| Test framework | `@wdio/mocha-framework` | Cú pháp `describe/it` |
| Appium server | `appium` | Nhận lệnh, điều khiển device |
| Android driver | `appium-uiautomator2-driver` | Tự động hóa Android |
| iOS driver | `appium-xcuitest-driver` | Tự động hóa iOS |

---

## Cài đặt

```bash
# 1. Cài Appium toàn cục
npm install -g appium

# 2. Cài driver
appium driver install uiautomator2
appium driver install xcuitest   # macOS only

# 3. Cài dependencies dự án
npm install
```

---

## Cấu trúc test cơ bản

```javascript
// tests/exercises/01-find-element.js
describe('Bài 01 - Tìm element', () => {
  before(async () => {
    // Chạy trước tất cả test trong suite này
  });

  it('nên tìm thấy nút đăng nhập', async () => {
    const loginBtn = await $('~login-btn');
    await expect(loginBtn).toBeDisplayed();
  });

  it('nên tìm thấy trường username', async () => {
    const usernameField = await $('~username-input');
    await expect(usernameField).toBeDisplayed();
  });
});
```

---

## Các thao tác cơ bản

### Tìm và tương tác với element

```javascript
// Tìm một element
const el = await $('~accessibility-id');
const el2 = await $('id=com.example.app:id/button');

// Tìm nhiều elements
const items = await $$('.android.widget.TextView');

// Click
await el.click();

// Nhập text
await el.setValue('hello world');
await el.clearValue();

// Lấy text
const text = await el.getText();

// Kiểm tra hiển thị
const isDisplayed = await el.isDisplayed();
const isEnabled = await el.isEnabled();
```

### Wait

```javascript
// Chờ element xuất hiện
await $('~btn').waitForDisplayed({ timeout: 10000 });

// Chờ element biến mất
await $('~loading').waitForDisplayed({ timeout: 15000, reverse: true });

// Chờ element có thể tương tác
await $('~btn').waitForEnabled({ timeout: 10000 });

// Chờ có text cụ thể
await $('~label').waitUntil(async () => {
  return (await $('~label').getText()) === 'Thành công';
}, { timeout: 10000 });
```

### Swipe và Scroll

```javascript
// Scroll xuống màn hình
await driver.action('pointer')
  .move({ duration: 0, x: 540, y: 800 })
  .down({ button: 0 })
  .move({ duration: 1000, x: 540, y: 200 })
  .up({ button: 0 })
  .perform();

// Scroll đến element
await $('~target-element').scrollIntoView();
```

### Alert

```javascript
// Xử lý alert native
await driver.acceptAlert();
await driver.dismissAlert();
const alertText = await driver.getAlertText();
```

---

## Matchers của WebdriverIO (Expect API)

```javascript
await expect($('~element')).toBeDisplayed();
await expect($('~element')).toBeEnabled();
await expect($('~element')).toHaveText('Hello');
await expect($('~element')).toHaveTextContaining('Hell');
await expect($('~element')).toHaveAttribute('content-desc', 'value');
await expect(driver).toHaveTitle('App Name');
```

---

## Ví dụ hoàn chỉnh: Test Login

```javascript
// tests/exercises/login.test.js
import LoginPage from '../../src/pages/LoginPage.js';
import HomePage from '../../src/pages/HomePage.js';

describe('Login Flow', () => {
  it('đăng nhập thành công với thông tin hợp lệ', async () => {
    await LoginPage.login('user@example.com', 'password123');
    await expect(HomePage.welcomeText).toBeDisplayed();
  });

  it('hiện lỗi khi mật khẩu sai', async () => {
    await LoginPage.login('user@example.com', 'wrongpassword');
    await expect(LoginPage.errorMessage).toBeDisplayed();
    await expect(LoginPage.errorMessage).toHaveTextContaining('Sai mật khẩu');
  });
});
```

---

## Chạy test

```bash
# Chạy tất cả test (Android)
npm run test:android

# Chạy tất cả test (iOS)
npm run test:ios

# Chạy một file test cụ thể
npx wdio run config/wdio.android.conf.js --spec tests/exercises/01-find-element.js
```

---

## Debugging

```bash
# Xem log Appium chi tiết
appium --log-level debug

# Dùng Appium Inspector để tìm locators
# Download: https://github.com/appium/appium-inspector/releases

# Thêm screenshot khi test fail
# wdio.conf.js
afterTest: async (test, ctx, { error }) => {
  if (error) {
    await driver.saveScreenshot(`./screenshots/${test.title}.png`);
  }
}
```

---

## Tài liệu thêm

- [WebdriverIO Docs](https://webdriver.io/docs/gettingstarted)
- [Appium Docs](https://appium.io/docs/en/3.2/)
- [WebdriverIO + Appium Setup](https://webdriver.io/docs/appium/)
