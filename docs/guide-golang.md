# Hướng dẫn Appium với Golang

## Tổng quan stack

| Thành phần | Package | Vai trò |
|---|---|---|
| WebDriver client | `github.com/go-rod/rod` hoặc `appium-go-client` | Giao tiếp với Appium |
| Test framework | `testing` (built-in) + `testify` | Chạy và assertions |
| Appium server | `appium` (npm) | Nhận lệnh, điều khiển device |

> **Lưu ý**: Golang ecosystem cho Appium ít mature hơn JS/Python. Thư viện phổ biến nhất là `github.com/zljohn-ux/appium-go-client` (fork từ Selenium Go bindings).

---

## Cài đặt

```bash
# 1. Cài Appium server (npm - bắt buộc)
npm install -g appium
appium driver install uiautomator2

# 2. Khởi tạo Go module
go mod init learn-appium-golang

# 3. Cài dependencies
go get github.com/tebeka/selenium
go get github.com/stretchr/testify/assert
```

---

## Cấu trúc dự án Go

```
golang/
├── pages/
│   ├── base_page.go
│   └── login_page.go
├── tests/
│   └── login_test.go
├── config/
│   └── capabilities.go
├── go.mod
└── go.sum
```

---

## Setup capabilities

```go
// config/capabilities.go
package config

import "github.com/tebeka/selenium"

func AndroidCaps() selenium.Capabilities {
    return selenium.Capabilities{
        "platformName":           "Android",
        "appium:automationName":  "UiAutomator2",
        "appium:deviceName":      "emulator-5554",
        "appium:platformVersion": "14.0",
        "appium:app":             "./apps/app.apk",
        "appium:noReset":         false,
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
    "learn-appium-golang/config"
)

func setupDriver(t *testing.T) selenium.WebDriver {
    caps := config.AndroidCaps()
    driver, err := selenium.NewRemote(caps, "http://localhost:4723")
    if err != nil {
        t.Fatalf("Không thể kết nối Appium: %v", err)
    }
    return driver
}

func TestFindLoginButton(t *testing.T) {
    driver := setupDriver(t)
    defer driver.Quit()

    el, err := driver.FindElement(selenium.ByAccessibilityID, "login-btn")
    assert.NoError(t, err)

    displayed, err := el.IsDisplayed()
    assert.NoError(t, err)
    assert.True(t, displayed, "Nút đăng nhập phải hiển thị")
}

func TestLoginSuccess(t *testing.T) {
    driver := setupDriver(t)
    defer driver.Quit()

    username, _ := driver.FindElement(selenium.ByAccessibilityID, "username")
    username.SendKeys("user@example.com")

    password, _ := driver.FindElement(selenium.ByAccessibilityID, "password")
    password.SendKeys("password123")

    loginBtn, _ := driver.FindElement(selenium.ByAccessibilityID, "login-btn")
    loginBtn.Click()

    welcome, err := driver.FindElement(selenium.ByAccessibilityID, "welcome-text")
    assert.NoError(t, err)

    displayed, _ := welcome.IsDisplayed()
    assert.True(t, displayed)
}
```

---

## Page Object Model trong Go

```go
// pages/base_page.go
package pages

import (
    "time"
    "github.com/tebeka/selenium"
)

type BasePage struct {
    Driver selenium.WebDriver
}

func (p *BasePage) FindElement(by, value string) (selenium.WebElement, error) {
    return p.Driver.FindElement(by, value)
}

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
        time.Sleep(500 * time.Millisecond)
    }
    return nil, fmt.Errorf("element %s=%s không tìm thấy sau %v", by, value, timeout)
}

func (p *BasePage) Tap(by, value string) error {
    el, err := p.FindElement(by, value)
    if err != nil {
        return err
    }
    return el.Click()
}
```

```go
// pages/login_page.go
package pages

import "github.com/tebeka/selenium"

type LoginPage struct {
    BasePage
}

func (p *LoginPage) Login(username, password string) error {
    usernameEl, err := p.FindElement(selenium.ByAccessibilityID, "username")
    if err != nil {
        return err
    }
    usernameEl.SendKeys(username)

    passwordEl, err := p.FindElement(selenium.ByAccessibilityID, "password")
    if err != nil {
        return err
    }
    passwordEl.SendKeys(password)

    return p.Tap(selenium.ByAccessibilityID, "login-btn")
}
```

---

## Chạy test

```bash
# Chạy tất cả test
go test ./tests/...

# Chạy với verbose
go test ./tests/... -v

# Chạy một test cụ thể
go test ./tests/... -run TestLoginSuccess -v

# Chạy với timeout
go test ./tests/... -timeout 120s
```

---

## So sánh JS vs Python vs Go cho Appium

| Tiêu chí | JavaScript (WebdriverIO) | Python (Appium-Python-Client) | Go |
|---|---|---|---|
| Ecosystem | Rất mạnh, nhiều plugin | Mạnh, phổ biến nhất | Hạn chế |
| Tốc độ viết test | Nhanh | Nhanh | Chậm hơn |
| Tốc độ chạy | Trung bình | Trung bình | Nhanh nhất |
| Tài liệu | Phong phú nhất | Phong phú | Ít nhất |
| Khuyến nghị | Dùng cho dự án chính | Dùng nếu team Python | Chỉ khi team Go |

---

## Tài liệu thêm

- [go-selenium GitHub](https://github.com/tebeka/selenium)
- [testify assertions](https://github.com/stretchr/testify)
- [Appium Docs](https://appium.io/docs/en/3.2/)
