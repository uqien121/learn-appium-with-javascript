# Hướng dẫn Appium với Golang

## Trước khi bắt đầu — đọc cái này

Go (Golang) **không phải lựa chọn tốt** cho Appium nếu bạn đang học từ đầu. Đây là lý do thực tế:

| | JavaScript | Python | Go |
|---|---|---|---|
| Thư viện Appium | WebdriverIO — chính thức, cập nhật thường xuyên | Appium-Python-Client — chính thức | go-selenium — cộng đồng, ít cập nhật |
| Tài liệu | Rất nhiều | Nhiều | Ít, khó tìm |
| Stack Overflow | Hàng nghìn câu trả lời | Hàng nghìn | Vài chục |
| Async handling | Tự nhiên (async/await) | Đơn giản | Phức tạp hơn |

**Khi nào nên dùng Go cho Appium?**
- Team của bạn viết Go, muốn tích hợp test vào codebase hiện tại
- Dự án cần hiệu năng cao (chạy hàng ngàn test song song)
- Bạn đã thành thạo Go và automation testing

**Nếu bạn đang học → học JavaScript hoặc Python trước.**

---

## Tổng quan

```
Your Go test code  →  go-selenium (WebDriver client)  →  Appium Server  →  Device
```

Thư viện chính: `github.com/tebeka/selenium` — ban đầu viết cho Selenium web, nhưng cũng dùng được với Appium vì cùng giao thức WebDriver.

---

## Cài đặt

```bash
# 1. Cài Appium server (npm — bắt buộc)
npm install -g appium
appium driver install uiautomator2

# 2. Khởi tạo Go project
go mod init learn-appium-go

# 3. Cài thư viện Go
go get github.com/tebeka/selenium
go get github.com/stretchr/testify/assert
```

---

## Cấu trúc project

```
golang/
├── capabilities/
│   └── android.go        ← Định nghĩa capabilities
├── pages/
│   ├── base_page.go      ← Method dùng chung
│   └── login_page.go     ← Page Object cho màn hình login
├── tests/
│   └── login_test.go     ← Các test case
├── go.mod
└── go.sum
```

---

## Capabilities

```go
// capabilities/android.go
package capabilities

import "github.com/tebeka/selenium"

// AndroidCaps trả về capabilities cho Android emulator
func AndroidCaps() selenium.Capabilities {
    return selenium.Capabilities{
        // Tên platform — bắt buộc
        "platformName": "Android",

        // Driver sử dụng — bắt buộc
        "appium:automationName": "UiAutomator2",

        // Tên emulator (xem bằng: adb devices)
        "appium:deviceName": "emulator-5554",

        // Phiên bản Android
        "appium:platformVersion": "14.0",

        // Đường dẫn đến file .apk
        "appium:app": "./apps/myapp-debug.apk",

        // false = xóa data app trước khi test
        "appium:noReset": false,

        // Timeout: đóng session nếu không có lệnh nào sau 240 giây
        "appium:newCommandTimeout": 240,
    }
}
```

---

## Test cơ bản

```go
// tests/login_test.go
package tests

import (
    "testing"
    "github.com/stretchr/testify/assert"
    "github.com/tebeka/selenium"
    "learn-appium-go/capabilities"
)

// setupDriver tạo kết nối Appium — dùng chung cho mọi test
func setupDriver(t *testing.T) selenium.WebDriver {
    caps := capabilities.AndroidCaps()

    // Kết nối đến Appium server đang chạy ở localhost:4723
    driver, err := selenium.NewRemote(caps, "http://localhost:4723")
    if err != nil {
        // Nếu không kết nối được → dừng test ngay
        t.Fatalf("Không kết nối được Appium: %v", err)
    }

    return driver
}

func TestLoginButtonVisible(t *testing.T) {
    driver := setupDriver(t)
    defer driver.Quit()   // đảm bảo session luôn được đóng dù test pass hay fail

    // Tìm element bằng Accessibility ID
    btn, err := driver.FindElement(selenium.ByAccessibilityID, "login-btn")

    assert.NoError(t, err, "Phải tìm được nút login")

    displayed, err := btn.IsDisplayed()
    assert.NoError(t, err)
    assert.True(t, displayed, "Nút login phải hiển thị")
}

func TestLoginSuccess(t *testing.T) {
    driver := setupDriver(t)
    defer driver.Quit()

    // Nhập username
    usernameField, err := driver.FindElement(selenium.ByAccessibilityID, "username")
    assert.NoError(t, err, "Phải tìm được ô username")
    usernameField.SendKeys("user@example.com")

    // Nhập password
    passwordField, err := driver.FindElement(selenium.ByAccessibilityID, "password")
    assert.NoError(t, err, "Phải tìm được ô password")
    passwordField.SendKeys("Password123!")

    // Click login
    loginBtn, err := driver.FindElement(selenium.ByAccessibilityID, "login-btn")
    assert.NoError(t, err)
    loginBtn.Click()

    // Kiểm tra home screen hiển thị
    homeScreen, err := driver.FindElement(selenium.ByAccessibilityID, "home-screen")
    assert.NoError(t, err, "Home screen phải xuất hiện sau khi login")

    displayed, _ := homeScreen.IsDisplayed()
    assert.True(t, displayed)
}
```

---

## Page Object Model trong Go

```go
// pages/base_page.go
package pages

import (
    "fmt"
    "time"
    "github.com/tebeka/selenium"
)

// BasePage chứa các method dùng chung cho tất cả màn hình
type BasePage struct {
    Driver selenium.WebDriver
}

// WaitForElement chờ element xuất hiện trong timeout giây
func (p *BasePage) WaitForElement(by, value string, timeout time.Duration) (selenium.WebElement, error) {
    deadline := time.Now().Add(timeout)

    for time.Now().Before(deadline) {
        el, err := p.Driver.FindElement(by, value)
        if err == nil {
            displayed, _ := el.IsDisplayed()
            if displayed {
                return el, nil
            }
        }
        // Chờ 500ms trước khi thử lại
        time.Sleep(500 * time.Millisecond)
    }

    return nil, fmt.Errorf("không tìm thấy element %s=%s sau %v", by, value, timeout)
}

// Tap tìm và click element
func (p *BasePage) Tap(by, value string) error {
    el, err := p.WaitForElement(by, value, 10*time.Second)
    if err != nil {
        return fmt.Errorf("Tap: %w", err)
    }
    return el.Click()
}

// TypeText xóa rồi nhập text vào field
func (p *BasePage) TypeText(by, value, text string) error {
    el, err := p.WaitForElement(by, value, 10*time.Second)
    if err != nil {
        return fmt.Errorf("TypeText: %w", err)
    }
    if err := el.Clear(); err != nil {
        return err
    }
    return el.SendKeys(text)
}
```

```go
// pages/login_page.go
package pages

import "github.com/tebeka/selenium"

// LoginPage đại diện cho màn hình đăng nhập
type LoginPage struct {
    BasePage
}

// NewLoginPage tạo LoginPage với driver
func NewLoginPage(driver selenium.WebDriver) *LoginPage {
    return &LoginPage{BasePage: BasePage{Driver: driver}}
}

// Login thực hiện đăng nhập
func (p *LoginPage) Login(username, password string) error {
    if err := p.TypeText(selenium.ByAccessibilityID, "username", username); err != nil {
        return err
    }
    if err := p.TypeText(selenium.ByAccessibilityID, "password", password); err != nil {
        return err
    }
    return p.Tap(selenium.ByAccessibilityID, "login-btn")
}
```

---

## Chạy test

```bash
# Chạy tất cả test trong project
go test ./...

# Chạy với output chi tiết
go test ./tests/... -v

# Chạy một test cụ thể
go test ./tests/... -run TestLoginSuccess -v

# Chạy với timeout
go test ./tests/... -timeout 120s -v
```

---

## Xử lý lỗi trong Go

Go không có exceptions như Python/JavaScript. Mọi lỗi đều trả về qua return value. Đây là pattern quan trọng khi viết test Go:

```go
func TestSomething(t *testing.T) {
    driver := setupDriver(t)
    defer driver.Quit()

    // Pattern: luôn kiểm tra err sau mỗi thao tác
    el, err := driver.FindElement(selenium.ByAccessibilityID, "btn")
    if err != nil {
        t.Fatalf("Không tìm thấy button: %v", err)  // dừng test ngay
    }

    if err := el.Click(); err != nil {
        t.Errorf("Không click được button: %v", err)  // ghi lỗi nhưng tiếp tục
    }

    // Dùng testify để viết assertions ngắn gọn hơn
    assert.NoError(t, err, "Click phải thành công")
}
```

---

## Tài liệu thêm

- [go-selenium GitHub](https://github.com/tebeka/selenium)
- [testify assertions](https://github.com/stretchr/testify)
- [Go testing package](https://pkg.go.dev/testing)
- [Appium Docs](https://appium.io/docs/en/3.2/)
