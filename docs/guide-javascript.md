# Hướng dẫn Appium với JavaScript — từ đầu đến thành thạo

## Mục lục
1. [Stack sử dụng là gì?](#1-stack-sử-dụng-là-gì)
2. [Cài đặt](#2-cài-đặt)
3. [Hiểu cấu trúc một file test](#3-hiểu-cấu-trúc-một-file-test)
4. [Tìm elements — trái tim của automation](#4-tìm-elements--trái-tim-của-automation)
5. [Các thao tác cơ bản](#5-các-thao-tác-cơ-bản)
6. [Chờ đợi đúng cách — lỗi phổ biến nhất](#6-chờ-đợi-đúng-cách--lỗi-phổ-biến-nhất)
7. [Assertions — kiểm tra kết quả](#7-assertions--kiểm-tra-kết-quả)
8. [Gestures — scroll, swipe](#8-gestures--scroll-swipe)
9. [Ví dụ hoàn chỉnh](#9-ví-dụ-hoàn-chỉnh)
10. [Chạy test](#10-chạy-test)
11. [Debug khi test fail](#11-debug-khi-test-fail)

---

## 1. Stack sử dụng là gì?

Bạn sẽ dùng những thứ sau. Đây là giải thích đơn giản về từng thứ:

**WebdriverIO** — thư viện JavaScript giúp bạn viết code điều khiển app. Nó lo việc giao tiếp với Appium server, bạn chỉ cần viết logic test.

**Appium** — server chạy nền, nhận lệnh từ WebdriverIO, điều khiển emulator/thiết bị thật.

**Mocha** — framework test. Cung cấp cú pháp `describe` / `it` để tổ chức test case.

**UiAutomator2** (driver) — phần mềm do Google tạo ra để điều khiển ứng dụng Android.

```
Bạn viết JavaScript  →  WebdriverIO  →  Appium Server  →  UiAutomator2  →  App Android
```

---

## 2. Cài đặt

### Cài Appium server (chỉ làm một lần)

```bash
# Cài Appium
npm install -g appium

# Cài driver cho Android
appium driver install uiautomator2

# Cài driver cho iOS (chỉ trên macOS)
appium driver install xcuitest
```

### Cài dependencies của dự án

```bash
npm install
```

---

## 3. Hiểu cấu trúc một file test

Đây là ví dụ đơn giản nhất:

```javascript
// Mỗi file test được tổ chức thành các "nhóm" bằng describe()
describe('Test màn hình đăng nhập', () => {

  // Mỗi test case riêng lẻ dùng it()
  it('nên hiển thị nút đăng nhập', async () => {

    // Tìm element bằng Accessibility ID (dấu ~ phía trước)
    const loginBtn = await $('~login-btn');

    // Kiểm tra xem nút có đang hiển thị không
    await expect(loginBtn).toBeDisplayed();

  });

});
```

**Giải thích từng phần:**

`describe('tên nhóm', () => { ... })` — Nhóm các test liên quan lại. Giống như đặt tiêu đề chương.

`it('mô tả test', async () => { ... })` — Một test case cụ thể. Tên nên mô tả hành vi: *"nên làm gì"*.

`await` — Vì tất cả thao tác với app đều tốn thời gian (gửi lệnh qua mạng đến Appium), bạn phải dùng `await` để chờ lệnh hoàn thành trước khi tiếp tục.

`$('~login-btn')` — Tìm element trên màn hình. Dấu `~` nghĩa là tìm bằng Accessibility ID.

`expect(...).toBeDisplayed()` — Kiểm tra kết quả. Nếu sai, test fail và WebdriverIO báo lỗi.

---

## 4. Tìm elements — trái tim của automation

Để tương tác với bất cứ thứ gì trên màn hình (nút, ô nhập, text...), bạn phải **tìm được nó** trước.

### Dùng Appium Inspector để tìm locator

Trước khi viết code, bạn cần biết locator của element. Dùng **Appium Inspector**:

1. Tải về: https://github.com/appium/appium-inspector/releases
2. Mở Appium Inspector, kết nối vào emulator
3. Click vào element muốn tìm → Inspector hiện thông tin của element đó
4. Lấy `content-desc` (Android) hoặc `accessibility id` để dùng làm Accessibility ID

### Các loại locator

**1. Accessibility ID** — Khuyến nghị nhất

```javascript
// Android: tìm bằng content-desc attribute
// iOS: tìm bằng accessibilityIdentifier
const btn = await $('~login-btn');   // dấu ~ = accessibility id
```

> **Tại sao đây là tốt nhất?** Accessibility ID không thay đổi khi UI redesign. Nếu button di chuyển sang vị trí khác, locator vẫn đúng vì nó tìm theo *tên* chứ không theo *vị trí*.

**2. Resource ID** — Tốt thứ hai (chỉ Android)

```javascript
// Format: tên.package:id/tên_element
const btn = await $('id=com.example.myapp:id/loginButton');

// Hoặc ngắn hơn nếu WebdriverIO tự thêm package name
const btn = await $('#loginButton');
```

**3. XPath** — Dùng khi không còn lựa chọn nào khác

```javascript
// Tìm bằng text hiển thị
const btn = await $('//android.widget.Button[@text="Đăng nhập"]');

// Tìm bằng text chứa chuỗi con
const el = await $('//android.widget.TextView[contains(@text, "Xin chào")]');
```

> **Tại sao không nên dùng XPath?** XPath dựa vào vị trí trong cây UI. Nếu dev thêm một View ở trên, XPath có thể bị sai ngay cả khi element vẫn còn đó. Chậm hơn khoảng 3-5 lần so với Accessibility ID.

### Bảng tóm tắt

| Locator | Cú pháp | Khi nào dùng |
|---|---|---|
| Accessibility ID | `$('~ten-element')` | Ưu tiên dùng đầu tiên |
| Resource ID | `$('id=com.pkg:id/name')` | Khi không có accessibility id |
| XPath by text | `$('//Widget[@text="..."]')` | Khi 2 cái trên không dùng được |
| Class Name | `$('.android.widget.Button')` | Rất hiếm khi dùng |

---

## 5. Các thao tác cơ bản

### Click / Tap

```javascript
const btn = await $('~submit-btn');

// Click thông thường
await btn.click();

// Double tap (chạm 2 lần)
await btn.doubleClick();
```

### Nhập text

```javascript
const inputField = await $('~username-input');

// setValue: tự xóa rồi nhập
await inputField.setValue('user@example.com');

// addValue: nhập thêm vào (không xóa trước)
await inputField.addValue(' thêm text này');

// Chỉ xóa, không nhập gì
await inputField.clearValue();
```

### Lấy thông tin từ element

```javascript
const el = await $('~product-title');

// Lấy text hiển thị
const text = await el.getText();
console.log(text);  // "Áo thun trắng"

// Lấy giá trị attribute
const isChecked = await el.getAttribute('checked');

// Kiểm tra trạng thái
const isShowing = await el.isDisplayed();  // có hiển thị không?
const isClickable = await el.isEnabled();  // có thể click không?
const isInDOM = await el.isExisting();     // có tồn tại trong DOM không?
```

---

## 6. Chờ đợi đúng cách — lỗi phổ biến nhất

Đây là nguồn gốc của 80% lỗi flaky test (test khi pass khi fail không rõ lý do).

**Vấn đề:** App cần thời gian để load. Nếu code chạy quá nhanh, bạn tìm element khi nó chưa xuất hiện → test fail.

**Giải pháp sai:** `driver.pause(3000)` — ngủ cứng 3 giây. Vừa chậm vừa không đáng tin.

```javascript
// ❌ SAI — đừng làm thế này
await $('~submit-btn').click();
await driver.pause(3000);        // ngủ 3 giây dù kết quả đã về sau 0.5 giây
const result = await $('~result-text').getText();
```

**Giải pháp đúng:** Explicit wait — chờ *đúng điều kiện* cần, không ngủ cố định.

```javascript
// ✅ ĐÚNG — chờ đến khi element xuất hiện (tối đa 10 giây)
await $('~submit-btn').click();
await $('~result-text').waitForDisplayed({ timeout: 10000 });
const result = await $('~result-text').getText();
```

### Các loại wait

```javascript
// Chờ element xuất hiện trên màn hình
await $('~btn').waitForDisplayed({ timeout: 10000 });

// Chờ element biến mất (loading spinner)
await $('~loading').waitForDisplayed({
  timeout: 15000,
  reverse: true,           // reverse: true = chờ đến khi KHÔNG hiển thị
  timeoutMsg: 'Loading vẫn còn sau 15 giây — có thể server bị lỗi',
});

// Chờ element có thể click được
await $('~submit-btn').waitForEnabled({ timeout: 10000 });

// Chờ điều kiện tùy chỉnh
await driver.waitUntil(
  async () => {
    const count = await $('~item-count').getText();
    return parseInt(count) > 0;   // chờ đến khi có ít nhất 1 item
  },
  {
    timeout: 15000,
    interval: 500,    // kiểm tra mỗi 0.5 giây
    timeoutMsg: 'Danh sách trống sau 15 giây',
  }
);
```

---

## 7. Assertions — kiểm tra kết quả

Assertion là câu hỏi bạn hỏi sau mỗi hành động: *"Kết quả có đúng như mong đợi không?"*

```javascript
const el = await $('~welcome-message');

// Kiểm tra hiển thị
await expect(el).toBeDisplayed();
await expect(el).not.toBeDisplayed();   // phủ định: KHÔNG được hiển thị

// Kiểm tra text
await expect(el).toHaveText('Xin chào!');
await expect(el).toHaveTextContaining('Xin chào');   // chứa chuỗi con

// Kiểm tra trạng thái
await expect(el).toBeEnabled();
await expect(el).not.toBeEnabled();    // disabled
await expect(el).toBeChecked();        // checkbox đã tick

// Kiểm tra giá trị input
await expect($('~username-input')).toHaveValue('user@example.com');

// Kiểm tra số lượng
const items = await $$('~list-item');
expect(items.length).toBe(5);                      // đúng 5 items
expect(items.length).toBeGreaterThan(0);           // ít nhất 1 item
expect(items.length).toBeLessThanOrEqual(10);      // không quá 10 items
```

---

## 8. Gestures — scroll, swipe

### Scroll

```javascript
// Scroll xuống (vuốt từ dưới lên)
await driver.action('pointer')
  .move({ duration: 0, x: 540, y: 800 })    // đặt ngón tay ở y=800 (gần dưới)
  .down({ button: 0 })                        // đặt xuống (bắt đầu chạm)
  .move({ duration: 1000, x: 540, y: 200 }) // di chuyển lên y=200 trong 1 giây
  .up({ button: 0 })                          // nhấc ngón tay
  .perform();                                 // thực hiện

// Scroll đến element cụ thể (đơn giản hơn)
await $('~footer-btn').scrollIntoView();
```

> **Tại sao phức tạp vậy?** Scroll trên mobile là gesture (cử chỉ), không phải API đơn giản như web. Bạn đang mô phỏng chính xác ngón tay người dùng.

### Swipe

```javascript
// Swipe trái (thường dùng cho carousel)
await driver.action('pointer')
  .move({ duration: 0, x: 800, y: 400 })    // bắt đầu từ bên phải
  .down({ button: 0 })
  .move({ duration: 800, x: 200, y: 400 }) // kéo sang trái
  .up({ button: 0 })
  .perform();
```

---

## 9. Ví dụ hoàn chỉnh

Dưới đây là test login đầy đủ với giải thích từng dòng:

```javascript
// Khai báo nhóm test
describe('Màn hình đăng nhập', () => {

  // afterEach chạy sau MỖI test case
  // Dùng để reset về trạng thái ban đầu
  afterEach(async () => {
    // Nếu đang ở home screen (đăng nhập thành công), logout để test tiếp
    const isLoggedIn = await $('~logout-btn').isDisplayed().catch(() => false);
    if (isLoggedIn) {
      await $('~logout-btn').click();
    }
  });

  it('đăng nhập thành công với thông tin hợp lệ', async () => {
    // Bước 1: Nhập email
    await $('~username-input').setValue('user@example.com');

    // Bước 2: Nhập password
    await $('~password-input').setValue('Password123!');

    // Bước 3: Click nút đăng nhập
    await $('~login-btn').click();

    // Bước 4: Chờ màn hình home xuất hiện (tối đa 10 giây)
    await $('~home-screen').waitForDisplayed({ timeout: 10000 });

    // Bước 5: Kiểm tra kết quả
    await expect($('~home-screen')).toBeDisplayed();
    await expect($('~user-avatar')).toBeDisplayed();
  });

  it('hiện lỗi khi để trống mật khẩu', async () => {
    await $('~username-input').setValue('user@example.com');
    // Bỏ qua password — để trống

    await $('~login-btn').click();

    // Khi sai, form vẫn ở đây và hiện error message
    await expect($('~password-error')).toBeDisplayed();
    await expect($('~password-error')).toHaveTextContaining('bắt buộc');
  });

  it('nút login bị disabled khi chưa nhập gì', async () => {
    // Không nhập gì cả
    await expect($('~login-btn')).not.toBeEnabled();
  });

});
```

---

## 10. Chạy test

```bash
# Chạy tất cả test cho Android
npm run test:android

# Chạy tất cả test cho iOS
npm run test:ios

# Chạy một file test cụ thể
npx wdio run config/wdio.android.conf.js --spec tests/exercises/ex01-find-by-accessibility-id.js

# Chạy test theo pattern tên file
npx wdio run config/wdio.android.conf.js --spec "**/ex0*.js"
```

---

## 11. Debug khi test fail

### Xem Appium log

```bash
# Chạy Appium server với log chi tiết
appium --log-level debug
```

Log sẽ hiện mọi lệnh được gửi đi và phản hồi. Khi test fail, đây là nơi đầu tiên cần xem.

### Chụp ảnh để xem app đang ở đâu

```javascript
// Thêm dòng này vào chỗ bị lỗi để xem app đang hiển thị gì
await driver.saveScreenshot('./screenshots/debug.png');
```

### Dùng Appium Inspector

Mở Appium Inspector trong khi emulator đang chạy → bạn thấy được toàn bộ UI tree và có thể thử locator trực tiếp mà không cần chạy test.

### Lỗi thường gặp

**`Element not found` (NoSuchElementError)**
- Locator sai → dùng Appium Inspector kiểm tra lại
- Element chưa xuất hiện → thêm `waitForDisplayed` trước khi tìm
- Đang ở sai màn hình → kiểm tra flow trước đó có đúng không

**`Stale element reference`**
- Element đã bị xóa khỏi DOM sau khi bạn tìm nó
- Giải pháp: tìm lại element thay vì dùng biến cũ

**`Session not created`**
- Appium server chưa chạy → chạy `appium` trong terminal khác
- Emulator chưa bật → mở Android Studio → khởi động emulator
- Capabilities sai (package name, app path...) → kiểm tra lại config

---

## Tiếp theo

Sau khi đọc xong guide này:
1. Thực hành bài 01-10 trong `tests/exercises/`
2. Đọc [docs/best-practices.md](best-practices.md) để hiểu cách tổ chức code tốt
3. Học Page Object Model ở bài 26-27
