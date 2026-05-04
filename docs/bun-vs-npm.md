# Bun có dùng được với Appium không?

## Câu trả lời nhanh

**Dùng npm cho Appium server. Bun cho phần còn lại thì tùy.**

Tài liệu chính thức của Appium ghi rõ:
> "Appium can be installed using npm (other package managers are not currently supported)"

---

## Giải thích đơn giản

### npm, pnpm, Bun là gì?

Tất cả đều là **package manager** — công cụ dùng để tải thư viện về máy. Giống như bạn có thể dùng Shopee, Lazada, hay Tiki để mua hàng — cuối cùng bạn cũng nhận được hàng, nhưng cách hoạt động và tốc độ khác nhau.

| Package manager | Đặc điểm | Tốc độ install |
|---|---|---|
| npm | Mặc định của Node.js, được hỗ trợ nhiều nhất | Trung bình |
| pnpm | Tiết kiệm ổ cứng, nhanh hơn npm | Nhanh |
| Bun | Rất nhanh, dùng engine riêng (không phải Node.js) | Nhanh nhất |

### Tại sao Appium server cần npm?

Appium không chỉ là một thư viện thông thường. Nó là **một server** (chương trình chạy nền). Khi bạn cài `appium` bằng npm, npm không chỉ tải code về — nó còn đăng ký lệnh `appium` vào hệ thống để bạn gõ được ở terminal.

Bun quản lý binary (lệnh dòng lệnh) khác với npm. Vì Appium chưa test với Bun, nên không đảm bảo lệnh `appium` và `appium driver install` sẽ hoạt động đúng.

---

## Bức tranh rõ hơn

```
Dự án Appium của bạn gồm 2 phần:

┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│  Appium Server (cài toàn cục)   │    │  Test project của bạn           │
│                                  │    │                                  │
│  npm install -g appium           │    │  npm install   (hoặc bun install)│
│  appium driver install ...       │    │  webdriverio, mocha...          │
│                                  │    │                                  │
│  → PHẢI DÙNG npm                 │    │  → Bun thường OK, nhưng         │
│                                  │    │    không chính thức hỗ trợ      │
└─────────────────────────────────┘    └─────────────────────────────────┘
```

---

## Kết luận thực tế

**Kịch bản bạn đang học → Dùng npm cho tất cả.** Đơn giản, không có rủi ro, được hỗ trợ chính thức.

```bash
# ✅ Cách khuyến nghị — dùng npm cho tất cả
npm install -g appium
appium driver install uiautomator2
npm install              # cài dependencies của test project
npm run test:android     # chạy test
```

**Khi nào có thể thử Bun?**

Khi bạn đã quen với Appium rồi và muốn thử tốc độ install nhanh hơn cho test project. Nhưng Appium server vẫn phải cài bằng npm.

---

## pnpm thì sao?

pnpm cũng chưa được hỗ trợ chính thức cho Appium server. Tuy nhiên, pnpm tương thích với Node.js hơn Bun, nên ít gặp vấn đề hơn. Vẫn khuyến nghị dùng npm khi học.

---

## Nguồn tham khảo

- [Appium Install Docs](https://appium.io/docs/en/3.2/quickstart/install/) — ghi rõ "only npm is supported"
- [Appium GitHub](https://github.com/appium/appium)
