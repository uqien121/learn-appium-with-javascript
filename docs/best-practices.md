# Best Practices: Cách setup và viết Appium test đúng

*Tài liệu này giải thích TẠI SAO các quy tắc tồn tại, không chỉ liệt kê chúng.*

---

## 1. Cấu trúc thư mục — tại sao cần tổ chức?

Khi dự án nhỏ (5-10 test), để tất cả vào một file cũng được. Nhưng khi có 50-100 test, nếu không có cấu trúc rõ ràng, bạn sẽ không tìm được gì nữa.

**Cấu trúc khuyến nghị:**

```
project/
├── config/
│   ├── wdio.conf.js              ← Cài đặt chung: timeout, reporter, framework
│   ├── wdio.android.conf.js      ← Capabilities riêng cho Android
│   └── wdio.ios.conf.js          ← Capabilities riêng cho iOS
│
├── src/
│   ├── pages/                    ← Mỗi màn hình = 1 file (Page Object Model)
│   │   ├── BasePage.js           ← Các method dùng chung cho mọi màn hình
│   │   ├── LoginPage.js
│   │   └── HomePage.js
│   └── utils/
│       ├── gestures.js           ← scroll(), swipeLeft(), swipeRight()...
│       └── wait.js               ← Các helper chờ đợi tùy chỉnh
│
├── tests/
│   └── exercises/
│       ├── ex01-find-element.js
│       └── ...
│
└── apps/
    └── myapp-debug.apk           ← File app để test
```

---

## 2. Page Object Model (POM) — quan trọng nhất

### Vấn đề nếu không dùng POM

```javascript
// Không dùng POM — code bị lặp ở mọi nơi
describe('test A', () => {
  it('login', async () => {
    await $('~username').setValue('user@example.com');    // lặp
    await $('~password').setValue('pass123');              // lặp
    await $('~login-btn').click();                         // lặp
  });
});

describe('test B', () => {
  it('login trước khi mua hàng', async () => {
    await $('~username').setValue('user@example.com');    // lặp
    await $('~password').setValue('pass123');              // lặp
    await $('~login-btn').click();                         // lặp
  });
});
```

Nếu dev đổi accessibility id của ô username từ `~username` thành `~email-field`, bạn phải sửa ở tất cả các test. Với 50 test, đó là 50 chỗ phải sửa.

### Giải pháp: POM

```javascript
// src/pages/LoginPage.js
// Tất cả locator và logic login ở một chỗ
class LoginPage {
  // Getters: định nghĩa locator một lần ở đây
  get usernameField() { return $('~username'); }
  get passwordField() { return $('~password'); }
  get loginButton()   { return $('~login-btn'); }

  // Method: logic login ở một chỗ
  async login(email, password) {
    await this.usernameField.setValue(email);
    await this.passwordField.setValue(password);
    await this.loginButton.click();
  }
}

export default new LoginPage();
```

```javascript
// Bây giờ mọi test chỉ cần:
import LoginPage from '../../src/pages/LoginPage.js';

describe('test A', () => {
  it('login', async () => {
    await LoginPage.login('user@example.com', 'pass123');  // 1 dòng
  });
});

describe('test B', () => {
  it('login trước khi mua hàng', async () => {
    await LoginPage.login('user@example.com', 'pass123');  // 1 dòng
  });
});
```

Khi dev đổi locator → chỉ sửa 1 chỗ trong `LoginPage.js`.

---

## 3. Locator — chọn đúng loại

### Thứ tự ưu tiên

```
Accessibility ID  >  Resource ID  >  XPath
     (tốt nhất)       (tốt)          (cuối cùng)
```

**Accessibility ID là tốt nhất vì:**
- Dev đặt tên có nghĩa → dễ đọc: `~add-to-cart-btn` rõ hơn `//android.widget.Button[3]`
- Không phụ thuộc vào vị trí UI → ít bị vỡ khi redesign
- Tốc độ tìm nhanh nhất
- Hoạt động trên cả Android lẫn iOS nếu team đặt cùng tên

**Nếu app không có Accessibility ID?**

Nói với dev để thêm vào. Đó là yêu cầu hợp lý vì Accessibility ID còn giúp người khiếm thị dùng app tốt hơn. Đây là lý do kỹ thuật và xã hội để dev chịu làm.

**Ví dụ:**
```javascript
// ✅ Rõ ràng, ổn định
await $('~add-to-cart-btn').click();

// ❌ Không rõ đây là gì, vỡ khi có thêm button
await $('//android.widget.Button[3]').click();

// ❌ Vỡ khi text thay đổi (vd: dịch sang tiếng Anh)
await $('//android.widget.Button[@text="Thêm vào giỏ"]').click();
```

---

## 4. Wait — đừng dùng `pause()`

### Tại sao `pause()` là vấn đề

```javascript
// ❌ pause() là sleep cứng — không thông minh
await $('~buy-btn').click();
await driver.pause(5000);   // luôn ngủ 5 giây dù kết quả về sau 0.3 giây
                            // → test chậm không cần thiết
                            // Nếu server lag, 5 giây chưa đủ → test fail
```

Hãy tưởng tượng bạn đặt pizza, rồi ngồi chờ đúng 30 phút mới ra cửa lấy dù pizza đến sau 10 phút. Đó chính là `pause()`.

### Giải pháp: explicit wait

```javascript
// ✅ Chờ thông minh: kiểm tra liên tục đến khi điều kiện đúng
await $('~buy-btn').click();
await $('~order-success').waitForDisplayed({ timeout: 10000 });
// → Nếu success xuất hiện sau 0.3 giây: tiếp tục ngay
// → Nếu server chậm, chờ đến 10 giây: vẫn pass
// → Nếu sau 10 giây vẫn không có: fail với thông báo rõ ràng
```

### Timeout nên đặt bao nhiêu?

| Tình huống | Timeout khuyến nghị |
|---|---|
| Element xuất hiện ngay (button, input) | 5000ms (5 giây) |
| Sau khi click, chờ navigation | 10000ms (10 giây) |
| Load data từ API | 15000ms (15 giây) |
| Upload/download file | 30000ms (30 giây) |

---

## 5. Capabilities — tham số quan trọng

Capabilities là "thông số kỹ thuật" bạn gửi cho Appium để nó biết phải làm gì.

```javascript
// config/wdio.android.conf.js
capabilities: [{
  platformName: 'Android',           // Bắt buộc: Android hay iOS?
  'appium:automationName': 'UiAutomator2',  // Bắt buộc: driver nào?

  'appium:deviceName': 'emulator-5554',    // Tên device (xem bằng adb devices)
  'appium:platformVersion': '14.0',        // Phiên bản Android

  // Đường dẫn đến file app — PHẢI là absolute path hoặc relative từ cwd
  'appium:app': process.env.ANDROID_APP_PATH || './apps/myapp-debug.apk',

  // noReset: false = xóa data app trước mỗi session (mặc định)
  // noReset: true  = giữ nguyên data (đăng nhập rồi không cần đăng nhập lại)
  'appium:noReset': false,

  // fullReset: true = uninstall và reinstall app (mạnh hơn noReset)
  'appium:fullReset': false,

  // Sau bao lâu không có lệnh thì Appium đóng session (giây)
  'appium:newCommandTimeout': 240,

  // Tự động cấp permission khi app xin (Android)
  'appium:autoGrantPermissions': true,
}]
```

**Tìm deviceName bằng lệnh:**
```bash
# Xem tất cả device đang kết nối (kể cả emulator)
adb devices

# Output ví dụ:
# emulator-5554   device
# R3CN700WXYZ     device  ← thiết bị thật
```

---

## 6. Biến môi trường — không hard-code đường dẫn

**Sai:** Hard-code path vào config

```javascript
// ❌ Path chỉ đúng trên máy của bạn, người khác không dùng được
'appium:app': 'C:\\Users\\daing\\Desktop\\myapp.apk',
```

**Đúng:** Dùng biến môi trường

```javascript
// ✅ Mỗi người set biến môi trường theo máy của họ
'appium:app': process.env.ANDROID_APP_PATH,
```

```bash
# Chạy test và truyền path vào
ANDROID_APP_PATH=./apps/myapp.apk npm run test:android

# Hoặc tạo file .env (thêm vào .gitignore để không commit lên Git)
# ANDROID_APP_PATH=./apps/myapp.apk
# ANDROID_DEVICE=emulator-5554
```

---

## 7. Chạy Appium server — 2 cách

### Cách 1: Tự động qua WebdriverIO service (khuyến nghị khi dev)

```javascript
// wdio.conf.js
services: [
  ['appium', {
    command: 'appium',
    args: { relaxedSecurity: true },
  }]
]
```

WebdriverIO tự bật Appium khi bắt đầu test và tự tắt khi kết thúc. Bạn không cần mở terminal riêng.

### Cách 2: Tự mở Appium server (khuyến nghị cho CI/CD)

```bash
# Terminal 1: Chạy Appium server
appium --port 4723 --relaxed-security

# Terminal 2: Chạy test
npm run test:android
```

---

## 8. Tổ chức test case — quy tắc viết tên

Tên test case tốt phải mô tả được **hành vi** thay vì **code**:

```javascript
// ❌ Tên không rõ ràng
it('test login', async () => { ... });
it('test 1', async () => { ... });

// ✅ Tên mô tả hành vi rõ ràng
it('đăng nhập thành công với email và mật khẩu hợp lệ', async () => { ... });
it('hiển thị lỗi khi để trống ô mật khẩu', async () => { ... });
it('không cho đăng nhập khi tài khoản bị khóa', async () => { ... });
```

Khi test fail, bạn nhìn vào tên biết ngay cái gì bị vỡ mà không cần đọc code.

---

## 9. Chụp ảnh khi test fail — bắt buộc phải làm

Khi test fail trên CI/CD (máy chủ không có màn hình), bạn không nhìn thấy emulator đang hiển thị gì. Screenshot là bằng chứng duy nhất.

```javascript
// wdio.conf.js — thêm hook này
afterTest: async (test, ctx, { error }) => {
  if (error) {
    // Tạo tên file từ tên test, xóa ký tự đặc biệt
    const safeName = test.title.replace(/[^a-zA-Z0-9]/g, '-');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `./screenshots/FAIL-${safeName}-${timestamp}.png`;

    await driver.saveScreenshot(path);
    console.log(`Screenshot saved: ${path}`);
  }
},
```

---

## 10. .gitignore — những thứ KHÔNG nên commit

```gitignore
# Thư viện — quá nặng, ai clone về cũng chạy npm install để lấy
node_modules/

# File app — thường lớn (>50MB), commit lên Git rất chậm
apps/*.apk
apps/*.ipa
apps/*.app

# Config cá nhân — path trên máy bạn không giống máy người khác
.env

# Log và kết quả test — tự tạo lại mỗi lần chạy
*.log
screenshots/
allure-results/
allure-report/

# File hệ thống
.DS_Store      # macOS
Thumbs.db      # Windows
```
