# learn-appium-with-javascript

Dự án học Appium với JavaScript — setup tối ưu, hướng dẫn đa ngôn ngữ, và 40 bài tập thực hành.

## Mục tiêu

- Tìm hiểu Bun có dùng được với Appium không (kết quả: xem [docs/bun-vs-npm.md](docs/bun-vs-npm.md))
- Best practice setup Appium với JavaScript
- Hướng dẫn cho JS | Python | Golang
- 40 bài tập thực hành test từ cơ bản đến nâng cao

---

## Cấu trúc dự án

```
learn-appium-with-javascript/
├── apps/                         # Đặt file .apk / .app vào đây
├── config/
│   ├── wdio.conf.js              # Config chung
│   ├── wdio.android.conf.js      # Config Android
│   └── wdio.ios.conf.js          # Config iOS
├── docs/
│   ├── bun-vs-npm.md             # So sánh Bun vs npm cho Appium
│   ├── best-practices.md         # Best practices setup
│   ├── guide-javascript.md       # Hướng dẫn JS
│   ├── guide-python.md           # Hướng dẫn Python
│   └── guide-golang.md           # Hướng dẫn Golang
├── src/
│   ├── pages/                    # Page Object Model
│   │   ├── BasePage.js
│   │   └── LoginPage.js
│   └── utils/
│       └── gestures.js
├── tests/
│   └── exercises/                # 40 bài tập
├── package.json
└── README.md
```

---

## Yêu cầu hệ thống

- **Node.js** >= 20.19.0
- **npm** >= 10.0.0
- **Java** >= 11 (cho Android)
- **Android Studio** + Android SDK (cho Android)
- **Xcode** (cho iOS — chỉ macOS)

---

## Cài đặt nhanh

### Bước 1: Cài Appium server

```bash
npm install -g appium
appium driver install uiautomator2      # Android
appium driver install xcuitest          # iOS (macOS only)
```

### Bước 2: Kiểm tra môi trường

```bash
npm install -g appium-doctor
appium-doctor --android
appium-doctor --ios
```

### Bước 3: Cài dependencies dự án

```bash
npm install
```

### Bước 4: Đặt file app

Đặt file `.apk` (Android) hoặc `.app` / `.ipa` (iOS) vào thư mục `apps/`.

---

## Chạy test

```bash
# Android
ANDROID_APP_PATH=./apps/myapp.apk npm run test:android

# iOS
IOS_APP_PATH=./apps/myapp.app npm run test:ios

# Chạy một bài cụ thể
npx wdio run config/wdio.android.conf.js --spec tests/exercises/01-find-element.js
```

---

## Tài liệu

| Tài liệu | Nội dung |
|---|---|
| [docs/bun-vs-npm.md](docs/bun-vs-npm.md) | Bun có dùng được với Appium không? |
| [docs/best-practices.md](docs/best-practices.md) | Best practices setup và coding |
| [docs/guide-javascript.md](docs/guide-javascript.md) | Học Appium với JavaScript |
| [docs/guide-python.md](docs/guide-python.md) | Học Appium với Python |
| [docs/guide-golang.md](docs/guide-golang.md) | Học Appium với Golang |

---

## 40 Bài tập thực hành

| # | Bài | Kỹ năng | File |
|---|---|---|---|
| 01 | Tìm element bằng Accessibility ID | Locator | [ex01](tests/exercises/ex01-find-by-accessibility-id.js) |
| 02 | Tìm element bằng ID | Locator | [ex02](tests/exercises/ex02-find-by-id.js) |
| 03 | Tìm element bằng XPath | Locator | [ex03](tests/exercises/ex03-find-by-xpath.js) |
| 04 | Click vào element | Interaction | [ex04](tests/exercises/ex04-click.js) |
| 05 | Nhập text vào field | Interaction | [ex05](tests/exercises/ex05-type-text.js) |
| 06 | Xóa text | Interaction | [ex06](tests/exercises/ex06-clear-text.js) |
| 07 | Lấy text từ element | Assertion | [ex07](tests/exercises/ex07-get-text.js) |
| 08 | Kiểm tra element hiển thị | Assertion | [ex08](tests/exercises/ex08-is-displayed.js) |
| 09 | Kiểm tra element enabled | Assertion | [ex09](tests/exercises/ex09-is-enabled.js) |
| 10 | Tìm nhiều elements | Locator | [ex10](tests/exercises/ex10-find-multiple.js) |
| 11 | Scroll xuống | Gesture | [ex11](tests/exercises/ex11-scroll-down.js) |
| 12 | Scroll lên | Gesture | [ex12](tests/exercises/ex12-scroll-up.js) |
| 13 | Swipe trái | Gesture | [ex13](tests/exercises/ex13-swipe-left.js) |
| 14 | Swipe phải | Gesture | [ex14](tests/exercises/ex14-swipe-right.js) |
| 15 | Long press | Gesture | [ex15](tests/exercises/ex15-long-press.js) |
| 16 | Xử lý Alert OK | Alert | [ex16](tests/exercises/ex16-alert-accept.js) |
| 17 | Xử lý Alert Cancel | Alert | [ex17](tests/exercises/ex17-alert-dismiss.js) |
| 18 | Lấy text Alert | Alert | [ex18](tests/exercises/ex18-alert-text.js) |
| 19 | Chụp màn hình | Utility | [ex19](tests/exercises/ex19-screenshot.js) |
| 20 | Lấy kích thước màn hình | Utility | [ex20](tests/exercises/ex20-screen-size.js) |
| 21 | Mở app bằng deep link | Navigation | [ex21](tests/exercises/ex21-deep-link.js) |
| 22 | Back button | Navigation | [ex22](tests/exercises/ex22-back-button.js) |
| 23 | Home button | Navigation | [ex23](tests/exercises/ex23-home-button.js) |
| 24 | Xoay màn hình | Device | [ex24](tests/exercises/ex24-rotate.js) |
| 25 | Ẩn bàn phím | Device | [ex25](tests/exercises/ex25-hide-keyboard.js) |
| 26 | Page Object Model cơ bản | POM | [ex26](tests/exercises/ex26-page-object-basic.js) |
| 27 | POM với inheritance | POM | [ex27](tests/exercises/ex27-page-object-inheritance.js) |
| 28 | Test login flow hoàn chỉnh | E2E | [ex28](tests/exercises/ex28-login-flow.js) |
| 29 | Test đăng ký tài khoản | E2E | [ex29](tests/exercises/ex29-register-flow.js) |
| 30 | Data-driven test | Pattern | [ex30](tests/exercises/ex30-data-driven.js) |
| 31 | Đọc dữ liệu từ JSON | Pattern | [ex31](tests/exercises/ex31-test-data-json.js) |
| 32 | Upload file | Advanced | [ex32](tests/exercises/ex32-upload-file.js) |
| 33 | Xử lý spinner/loading | Wait | [ex33](tests/exercises/ex33-loading-spinner.js) |
| 34 | Implicit vs Explicit wait | Wait | [ex34](tests/exercises/ex34-wait-strategies.js) |
| 35 | Chụp ảnh khi test fail | Reporting | [ex35](tests/exercises/ex35-screenshot-on-fail.js) |
| 36 | Test trên nhiều devices | Parallel | [ex36](tests/exercises/ex36-multi-device.js) |
| 37 | Chạy test song song | Parallel | [ex37](tests/exercises/ex37-parallel-test.js) |
| 38 | Setup CI/CD với GitHub Actions | CI/CD | [ex38](tests/exercises/ex38-ci-setup.js) |
| 39 | Cross-platform test (Android + iOS) | Cross-platform | [ex39](tests/exercises/ex39-cross-platform.js) |
| 40 | Test suite hoàn chỉnh + báo cáo | Full Suite | [ex40](tests/exercises/ex40-full-suite.js) |
