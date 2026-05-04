# learn-appium-with-javascript

Dự án học Appium với JavaScript — từ con số 0 đến viết được test automation cho app mobile.

---

## Appium là gì? Tại sao cần học?

Hãy tưởng tượng bạn có một app mobile. Mỗi lần cập nhật, bạn phải mở điện thoại, tự tay bấm thử từng tính năng để chắc chắn không có gì bị vỡ. Mất hàng giờ. Dễ bỏ sót.

**Appium giúp bạn tự động hóa việc đó.** Bạn viết code một lần — code đó sẽ mở app, bấm nút, nhập text, kiểm tra kết quả — y hệt như người dùng thật, nhưng nhanh hơn hàng trăm lần và không bao giờ bỏ sót.

```
Bạn viết:  "Mở app → nhập email → nhập password → bấm Đăng nhập → kiểm tra có vào được home không"
Appium làm: tự thực hiện đúng như vậy trên emulator/điện thoại thật
```

---

## Dự án này gồm những gì?

| Thứ | Nội dung |
|---|---|
| [docs/bun-vs-npm.md](docs/bun-vs-npm.md) | Giải đáp: Bun có dùng được với Appium không? |
| [docs/best-practices.md](docs/best-practices.md) | Cách setup "chuẩn" — tránh những lỗi phổ biến |
| [docs/guide-javascript.md](docs/guide-javascript.md) | Học Appium với JavaScript từ đầu |
| [docs/guide-python.md](docs/guide-python.md) | Học Appium với Python |
| [docs/guide-golang.md](docs/guide-golang.md) | Học Appium với Golang |
| [tests/exercises/](tests/exercises/) | 40 bài tập thực hành, từ dễ đến khó |

---

## Bức tranh toàn cảnh: Các thành phần hoạt động như thế nào?

```
┌─────────────────────────────────────────────────────┐
│  Code test của bạn (JavaScript)                     │
│  "Bấm nút login"                                    │
└──────────────────────┬──────────────────────────────┘
                       │ gửi lệnh qua HTTP
                       ▼
┌─────────────────────────────────────────────────────┐
│  Appium Server (chạy trên máy tính của bạn)         │
│  Nhận lệnh, dịch sang lệnh native của Android/iOS  │
└──────────────────────┬──────────────────────────────┘
                       │ điều khiển
                       ▼
┌─────────────────────────────────────────────────────┐
│  Emulator hoặc điện thoại thật                      │
│  App thực sự được bấm, nhập, vuốt...               │
└─────────────────────────────────────────────────────┘
```

**Bạn chỉ cần viết phần đầu tiên.** Appium server và driver lo phần còn lại.

---

## Yêu cầu trước khi bắt đầu

Bạn cần cài sẵn những thứ sau trên máy:

### 1. Node.js (phiên bản >= 20)
Node.js là môi trường chạy JavaScript trên máy tính (không phải trình duyệt).
- Tải tại: https://nodejs.org — chọn bản **LTS**
- Kiểm tra sau khi cài: mở terminal, gõ `node -v` → phải thấy `v20.x.x` trở lên

### 2. Java (phiên bản >= 11) — chỉ cần cho Android
Android emulator cần Java để chạy.
- Tải tại: https://adoptium.net
- Kiểm tra: `java -version`

### 3. Android Studio — chỉ cần nếu test Android
Để có emulator Android trên máy tính.
- Tải tại: https://developer.android.com/studio
- Sau khi cài, mở **AVD Manager** và tạo một emulator (Virtual Device)

### 4. Xcode — chỉ cần nếu test iOS, và chỉ trên macOS
- Tải từ Mac App Store

---

## Cài đặt dự án (làm từng bước)

### Bước 1: Cài Appium server

Appium server là chương trình chạy ngầm trên máy, nhận lệnh từ code test của bạn.

```bash
npm install -g appium
```

> **`-g` nghĩa là gì?** Cài toàn cục (global) — dùng được từ bất kỳ thư mục nào, không chỉ trong dự án này.

Kiểm tra đã cài thành công:
```bash
appium --version
# Phải thấy: 3.x.x
```

### Bước 2: Cài driver cho Android

Driver là "phiên dịch viên" — nhận lệnh chung từ Appium, dịch thành lệnh mà Android hiểu.

```bash
appium driver install uiautomator2
```

> **Tại sao phải cài riêng?** Appium tách driver ra để nhẹ hơn. Bạn chỉ cài driver của platform mình dùng — không cần cài tất cả.

Kiểm tra driver đã cài:
```bash
appium driver list --installed
# Phải thấy: uiautomator2@...
```

### Bước 3: Kiểm tra môi trường với appium-doctor

Tool này kiểm tra tự động xem máy bạn thiếu gì.

```bash
npm install -g appium-doctor
appium-doctor --android
```

Nó sẽ in ra danh sách ✅ (OK) và ❌ (thiếu). Bạn cần sửa hết các ❌ trước khi test được.

**Lỗi phổ biến và cách sửa:**
| Lỗi | Nguyên nhân | Cách sửa |
|---|---|---|
| `ANDROID_HOME not set` | Chưa set biến môi trường | Xem hướng dẫn bên dưới |
| `adb not found` | Android SDK chưa cài | Cài Android Studio, mở SDK Manager |
| `Java not found` | Chưa cài Java | Cài từ adoptium.net |

**Set ANDROID_HOME trên Windows:**
```
1. Tìm kiếm "Environment Variables" trong Start Menu
2. Click "Edit the system environment variables"
3. Click "Environment Variables..."
4. Trong "System variables", click "New"
   - Variable name: ANDROID_HOME
   - Variable value: C:\Users\YourName\AppData\Local\Android\Sdk
5. Tìm "Path", click Edit, thêm: %ANDROID_HOME%\platform-tools
6. Restart terminal
```

### Bước 4: Cài dependencies của dự án

```bash
npm install
```

> Lệnh này đọc file `package.json` và tải về tất cả thư viện cần thiết (WebdriverIO, Appium client, ...) vào thư mục `node_modules/`.

### Bước 5: Đặt file app để test

Bạn cần có file `.apk` (Android) hoặc `.app`/`.ipa` (iOS) của app muốn test.

Đặt file đó vào thư mục `apps/` trong dự án này.

> **Chưa có app để test?** Dùng app mẫu của Appium: https://github.com/appium/android-apidemos/releases — tải file `ApiDemos-debug.apk`

---

## Chạy test đầu tiên

```bash
# Khởi động emulator Android trước (trong Android Studio → AVD Manager)

# Sau đó chạy test
ANDROID_APP_PATH=./apps/ApiDemos-debug.apk npm run test:android
```

---

## Cấu trúc thư mục

```
learn-appium-with-javascript/
│
├── apps/                    ← Đặt file .apk / .app vào đây
│
├── config/
│   ├── wdio.conf.js         ← Cài đặt chung cho WebdriverIO
│   ├── wdio.android.conf.js ← Cài đặt riêng cho Android
│   └── wdio.ios.conf.js     ← Cài đặt riêng cho iOS
│
├── docs/                    ← Tài liệu học
│
├── src/
│   ├── pages/               ← Page Object Model (xem bài 26-27)
│   └── utils/               ← Các hàm dùng chung (scroll, swipe...)
│
├── tests/
│   ├── exercises/           ← 40 bài tập thực hành
│   └── data/                ← Dữ liệu test (users.json, ...)
│
├── screenshots/             ← Tự động tạo khi có test fail
├── package.json             ← Khai báo thư viện và câu lệnh
└── .gitignore               ← Những file/thư mục không commit lên Git
```

---

## 40 Bài tập thực hành

Làm theo thứ tự — mỗi bài xây dựng trên kiến thức bài trước.

| # | Bài | Kỹ năng học | File |
|---|---|---|---|
| 01 | Tìm element bằng Accessibility ID | Locator cơ bản | [ex01](tests/exercises/ex01-find-by-accessibility-id.js) |
| 02 | Tìm element bằng ID | Locator | [ex02](tests/exercises/ex02-find-by-id.js) |
| 03 | Tìm element bằng XPath | Locator nâng cao | [ex03](tests/exercises/ex03-find-by-xpath.js) |
| 04 | Click / tap | Tương tác | [ex04](tests/exercises/ex04-click.js) |
| 05 | Nhập text | Tương tác | [ex05](tests/exercises/ex05-type-text.js) |
| 06 | Xóa text | Tương tác | [ex06](tests/exercises/ex06-clear-text.js) |
| 07 | Lấy text từ element | Đọc dữ liệu | [ex07](tests/exercises/ex07-get-text.js) |
| 08 | Kiểm tra element có hiển thị | Assertion | [ex08](tests/exercises/ex08-is-displayed.js) |
| 09 | Kiểm tra enabled/disabled | Assertion | [ex09](tests/exercises/ex09-is-enabled.js) |
| 10 | Làm việc với nhiều elements | Danh sách | [ex10](tests/exercises/ex10-find-multiple.js) |
| 11 | Scroll xuống | Gesture | [ex11](tests/exercises/ex11-scroll-down.js) |
| 12 | Scroll lên | Gesture | [ex12](tests/exercises/ex12-scroll-up.js) |
| 13 | Swipe trái | Gesture | [ex13](tests/exercises/ex13-swipe-left.js) |
| 14 | Swipe phải | Gesture | [ex14](tests/exercises/ex14-swipe-right.js) |
| 15 | Long press (nhấn giữ) | Gesture | [ex15](tests/exercises/ex15-long-press.js) |
| 16 | Alert — chấp nhận | Alert | [ex16](tests/exercises/ex16-alert-accept.js) |
| 17 | Alert — hủy | Alert | [ex17](tests/exercises/ex17-alert-dismiss.js) |
| 18 | Alert — lấy text | Alert | [ex18](tests/exercises/ex18-alert-text.js) |
| 19 | Chụp màn hình | Tiện ích | [ex19](tests/exercises/ex19-screenshot.js) |
| 20 | Kích thước màn hình | Tiện ích | [ex20](tests/exercises/ex20-screen-size.js) |
| 21 | Deep Link | Điều hướng | [ex21](tests/exercises/ex21-deep-link.js) |
| 22 | Nút Back | Điều hướng | [ex22](tests/exercises/ex22-back-button.js) |
| 23 | Nút Home & chuyển app | Điều hướng | [ex23](tests/exercises/ex23-home-button.js) |
| 24 | Xoay màn hình | Device | [ex24](tests/exercises/ex24-rotate.js) |
| 25 | Ẩn bàn phím | Device | [ex25](tests/exercises/ex25-hide-keyboard.js) |
| 26 | Page Object Model cơ bản | Pattern | [ex26](tests/exercises/ex26-page-object-basic.js) |
| 27 | POM với inheritance | Pattern | [ex27](tests/exercises/ex27-page-object-inheritance.js) |
| 28 | Test login hoàn chỉnh | E2E | [ex28](tests/exercises/ex28-login-flow.js) |
| 29 | Test đăng ký | E2E | [ex29](tests/exercises/ex29-register-flow.js) |
| 30 | Data-driven test | Pattern | [ex30](tests/exercises/ex30-data-driven.js) |
| 31 | Dữ liệu từ file JSON | Pattern | [ex31](tests/exercises/ex31-test-data-json.js) |
| 32 | Upload file | Nâng cao | [ex32](tests/exercises/ex32-upload-file.js) |
| 33 | Xử lý loading spinner | Wait | [ex33](tests/exercises/ex33-loading-spinner.js) |
| 34 | Chiến lược chờ đợi | Wait | [ex34](tests/exercises/ex34-wait-strategies.js) |
| 35 | Chụp ảnh khi test fail | Reporting | [ex35](tests/exercises/ex35-screenshot-on-fail.js) |
| 36 | Test nhiều thiết bị | Multi-device | [ex36](tests/exercises/ex36-multi-device.js) |
| 37 | Chạy test song song | Parallel | [ex37](tests/exercises/ex37-parallel-test.js) |
| 38 | CI/CD với GitHub Actions | DevOps | [ex38](tests/exercises/ex38-ci-setup.js) |
| 39 | Android + iOS cùng test | Cross-platform | [ex39](tests/exercises/ex39-cross-platform.js) |
| 40 | Test suite hoàn chỉnh | Tổng hợp | [ex40](tests/exercises/ex40-full-suite.js) |
