# Best Practices: Setup Appium với JavaScript

## 1. Cấu trúc thư mục chuẩn

```
learn-appium-with-javascript/
├── apps/                         # File .apk / .app để test
├── config/
│   ├── wdio.conf.js              # Config chung
│   ├── wdio.android.conf.js      # Config riêng Android
│   └── wdio.ios.conf.js          # Config riêng iOS
├── docs/                         # Tài liệu
├── src/
│   ├── pages/                    # Page Object Model
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   └── HomePage.js
│   └── utils/
│       ├── gestures.js           # Swipe, scroll helpers
│       └── wait.js               # Custom wait helpers
├── tests/
│   └── exercises/
│       ├── 01-find-element.js
│       └── ...
├── package.json
└── README.md
```

---

## 2. Cài đặt môi trường

### Bước 1: Prerequisites

```bash
# Kiểm tra Node.js (cần >= 20.19.0)
node -v

# Kiểm tra npm (cần >= 10)
npm -v

# Kiểm tra Java (cần cho Android)
java -version

# Android Studio + SDK (cho Android)
# Xcode (cho iOS, chỉ macOS)
```

### Bước 2: Cài Appium server và drivers

```bash
# Cài Appium toàn cục
npm install -g appium

# Cài driver Android
appium driver install uiautomator2

# Cài driver iOS (macOS only)
appium driver install xcuitest

# Kiểm tra sức khỏe môi trường
npm install -g appium-doctor
appium-doctor --android
appium-doctor --ios
```

### Bước 3: Cài dependencies dự án

```bash
npm install
```

---

## 3. Pattern: Page Object Model (POM)

Không viết test trực tiếp với selector. Tách selector vào Page Object.

**src/pages/BasePage.js**
```javascript
export default class BasePage {
  async waitForDisplayed(selector, timeout = 10000) {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout });
    return el;
  }

  async tap(selector) {
    const el = await this.waitForDisplayed(selector);
    await el.click();
  }

  async typeText(selector, text) {
    const el = await this.waitForDisplayed(selector);
    await el.setValue(text);
  }
}
```

**src/pages/LoginPage.js**
```javascript
import BasePage from './BasePage.js';

class LoginPage extends BasePage {
  get usernameField() { return $('~username'); }
  get passwordField() { return $('~password'); }
  get loginButton()   { return $('~login-btn'); }

  async login(username, password) {
    await this.typeText('~username', username);
    await this.typeText('~password', password);
    await this.tap('~login-btn');
  }
}

export default new LoginPage();
```

---

## 4. Locator Strategy ưu tiên

Ưu tiên theo thứ tự (từ tốt nhất đến kém nhất):

| Ưu tiên | Locator | Android | iOS | Ví dụ |
|---|---|---|---|---|
| 1 | Accessibility ID | `content-desc` | `accessibilityIdentifier` | `$('~login-btn')` |
| 2 | ID | `resource-id` | `name` | `$('com.app:id/btn')` |
| 3 | XPath | Có | Có | Hạn chế dùng |
| 4 | Class Name | Có | Có | Chỉ khi không còn lựa chọn |

**Tránh dùng XPath** trừ khi bắt buộc — chậm và dễ vỡ khi UI thay đổi.

---

## 5. Capabilities quan trọng

```javascript
// Android
{
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'emulator-5554',   // tên device hoặc serial
  'appium:platformVersion': '14.0',
  'appium:app': '/path/to/app.apk',
  'appium:noReset': false,                // true = giữ state giữa các session
  'appium:fullReset': false,              // true = xóa hoàn toàn app data
  'appium:newCommandTimeout': 240,        // timeout khi không có command
  'appium:autoGrantPermissions': true,    // tự cấp permissions
}

// iOS
{
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': 'iPhone 15',
  'appium:platformVersion': '17.0',
  'appium:app': '/path/to/app.app',
  'appium:noReset': false,
  'appium:wdaLaunchTimeout': 120000,      // thời gian WDA khởi động
}
```

---

## 6. Xử lý wait đúng cách

**Không dùng** `driver.pause()` (sleep cứng). Dùng explicit wait thay thế.

```javascript
// Tệ - dừng cứng 3 giây dù element đã sẵn sàng
await driver.pause(3000);

// Tốt - chờ đến khi element xuất hiện (tối đa 10 giây)
await $('~submit-btn').waitForDisplayed({ timeout: 10000 });

// Tốt - chờ element có thể click
await $('~submit-btn').waitForEnabled({ timeout: 10000 });

// Tốt - chờ element biến mất (loading spinner)
await $('~loading').waitForDisplayed({ timeout: 15000, reverse: true });
```

---

## 7. Gestures (swipe, scroll)

```javascript
// Scroll xuống
await driver.action('pointer')
  .move({ x: 500, y: 800 })
  .down()
  .move({ x: 500, y: 200 })
  .up()
  .perform();

// Hoặc dùng WebdriverIO built-in (v9+)
await driver.scroll(0, -300);   // scroll lên
await driver.scroll(0, 300);    // scroll xuống
```

---

## 8. Chạy Appium server độc lập vs tích hợp WebdriverIO

### Cách 1: Tích hợp qua `@wdio/appium-service` (khuyến nghị khi dev)
WebdriverIO tự khởi/dừng Appium server — không cần mở terminal riêng.

```javascript
// wdio.conf.js
services: [['appium', { command: 'appium' }]]
```

### Cách 2: Chạy Appium server thủ công (khuyến nghị cho CI/CD)
```bash
# Terminal 1: chạy server
appium --port 4723 --relaxed-security

# Terminal 2: chạy test
npm test
```

---

## 9. Biến môi trường

Không hard-code path app hay device name vào config. Dùng biến môi trường:

```javascript
// config/wdio.android.conf.js
capabilities: [{
  'appium:app': process.env.ANDROID_APP_PATH,
  'appium:deviceName': process.env.ANDROID_DEVICE || 'emulator-5554',
}]
```

```bash
# .env (thêm .env vào .gitignore)
ANDROID_APP_PATH=./apps/myapp-debug.apk
ANDROID_DEVICE=emulator-5554
```

---

## 10. .gitignore

```
node_modules/
apps/*.apk
apps/*.ipa
apps/*.app
.env
*.log
allure-results/
allure-report/
```
