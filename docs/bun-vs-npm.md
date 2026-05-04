# Bun có dùng được với Appium không?

## Kết luận nhanh

| Tình huống | Bun | npm | Khuyến nghị |
|---|---|---|---|
| Cài Appium server (`appium` package) | Không chính thức | Chính thức hỗ trợ | Dùng **npm** |
| Cài WebdriverIO và dependencies test | Hoạt động | Hoạt động | Tùy chọn |
| Chạy Appium server (`appium` CLI) | Cần Node.js | Cần Node.js | Không liên quan |

**Tóm lại: Dùng `npm` để cài Appium. Bun có thể dùng cho phần còn lại nhưng không được hỗ trợ chính thức.**

---

## Chi tiết

### Appium server yêu cầu gì?

Appium 3 yêu cầu:
- Node.js `^20.19.0 || ^22.12.0 || >=24.0.0`
- npm `>=10.0.0`

Tài liệu chính thức của Appium ghi rõ:

> "Appium can be installed using npm (other package managers are not currently supported)"

### Tại sao Bun gặp vấn đề với Appium server?

Appium server là một Node.js process chạy các driver (UiAutomator2, XCUITest...). Các driver này được cài qua CLI riêng của Appium (`appium driver install`), không phải qua `package.json`. Nếu Bun cài `appium`, đường dẫn binary và quản lý driver có thể bị lệch.

### Bun dùng được ở đâu trong dự án này?

```
learn-appium-with-javascript/
├── package.json          ← Bun install hoạt động OK cho test deps
├── tests/                ← Bun có thể chạy test (nếu runner hỗ trợ)
└── appium (CLI toàn cục) ← Phải cài bằng npm -g
```

Bun chạy hầu hết npm packages kể từ v1.0+. WebdriverIO và các test dependencies thường hoạt động bình thường với Bun.

---

## Hướng dẫn setup thực tế

### Cài Appium (bắt buộc dùng npm)

```bash
# Cài Appium server toàn cục - PHẢI dùng npm
npm install -g appium

# Cài driver Android
appium driver install uiautomator2

# Cài driver iOS (chỉ trên macOS)
appium driver install xcuitest

# Kiểm tra cài đặt
appium driver list --installed
```

### Cài test dependencies (có thể dùng npm hoặc bun)

```bash
# Dùng npm (khuyến nghị - nhất quán với Appium)
npm install

# Hoặc dùng bun (thường hoạt động nhưng không chính thức)
bun install
```

---

## pnpm thì sao?

pnpm cũng **không được hỗ trợ chính thức** cho Appium server. Nhưng pnpm hoạt động tốt hơn Bun cho các dependencies phức tạp vì:
- Tương thích với Node.js ecosystem cao hơn
- Không có vấn đề về binary path như Bun có thể gặp

Nếu muốn dùng pnpm: cài Appium toàn cục bằng npm, còn dependencies dùng pnpm.

---

## Nguồn tham khảo

- [Appium 3 Install Docs](https://appium.io/docs/en/3.2/quickstart/install/)
- [Appium GitHub](https://github.com/appium/appium)
- [Bun vs Node.js 2026](https://strapi.io/blog/bun-vs-nodejs-performance-comparison-guide)
