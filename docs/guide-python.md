# Hướng dẫn Appium với Python

## Tổng quan stack

| Thành phần | Package | Vai trò |
|---|---|---|
| WebDriver client | `Appium-Python-Client` | Giao tiếp với Appium server |
| Test framework | `pytest` | Chạy và quản lý test |
| Assertions | `pytest` built-in | Kiểm tra kết quả |
| Appium server | `appium` (npm) | Nhận lệnh, điều khiển device |

---

## Cài đặt

```bash
# 1. Cài Appium server (npm - bắt buộc)
npm install -g appium
appium driver install uiautomator2
appium driver install xcuitest   # macOS only

# 2. Cài Python dependencies
pip install Appium-Python-Client pytest

# 3. Tạo file requirements.txt
# Appium-Python-Client>=3.0.0
# pytest>=8.0.0
# pytest-html>=4.0.0
```

---

## Cấu trúc test cơ bản

```python
# conftest.py
import pytest
from appium import webdriver
from appium.options import UiAutomator2Options


@pytest.fixture(scope='module')
def driver():
    options = UiAutomator2Options()
    options.platform_name = 'Android'
    options.device_name = 'emulator-5554'
    options.app = './apps/app.apk'
    options.no_reset = False

    driver = webdriver.Remote('http://localhost:4723', options=options)
    yield driver
    driver.quit()
```

```python
# tests/test_login.py
from appium.webdriver.common.appiumby import AppiumBy


class TestLogin:
    def test_find_login_button(self, driver):
        btn = driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'login-btn')
        assert btn.is_displayed()

    def test_login_success(self, driver):
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'username').send_keys('user@example.com')
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'password').send_keys('password123')
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'login-btn').click()

        welcome = driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'welcome-text')
        assert welcome.is_displayed()
```

---

## Locators

```python
from appium.webdriver.common.appiumby import AppiumBy

# Accessibility ID (khuyến nghị nhất)
el = driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'login-btn')

# Resource ID (Android)
el = driver.find_element(AppiumBy.ID, 'com.example.app:id/loginButton')

# XPath (hạn chế dùng)
el = driver.find_element(AppiumBy.XPATH, '//android.widget.Button[@text="Login"]')

# Class Name
el = driver.find_element(AppiumBy.CLASS_NAME, 'android.widget.EditText')
```

---

## Các thao tác cơ bản

```python
# Tìm element
el = driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'my-element')

# Click
el.click()

# Nhập text
el.send_keys('hello world')
el.clear()

# Lấy text
text = el.text

# Kiểm tra
is_displayed = el.is_displayed()
is_enabled = el.is_enabled()

# Swipe
driver.swipe(start_x=540, start_y=800, end_x=540, end_y=200, duration=1000)

# Scroll đến element
driver.execute_script('mobile: scroll', {'direction': 'down'})

# Alert
driver.switch_to.alert.accept()
driver.switch_to.alert.dismiss()
```

---

## Page Object Model trong Python

```python
# pages/base_page.py
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from appium.webdriver.common.appiumby import AppiumBy


class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)

    def find(self, locator):
        return self.driver.find_element(*locator)

    def tap(self, locator):
        self.find(locator).click()

    def type_text(self, locator, text):
        el = self.find(locator)
        el.clear()
        el.send_keys(text)
```

```python
# pages/login_page.py
from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage


class LoginPage(BasePage):
    USERNAME = (AppiumBy.ACCESSIBILITY_ID, 'username')
    PASSWORD = (AppiumBy.ACCESSIBILITY_ID, 'password')
    LOGIN_BTN = (AppiumBy.ACCESSIBILITY_ID, 'login-btn')
    ERROR_MSG = (AppiumBy.ACCESSIBILITY_ID, 'error-message')

    def login(self, username, password):
        self.type_text(self.USERNAME, username)
        self.type_text(self.PASSWORD, password)
        self.tap(self.LOGIN_BTN)
```

---

## Chạy test

```bash
# Chạy tất cả test
pytest tests/

# Chạy một file
pytest tests/test_login.py

# Chạy với report HTML
pytest tests/ --html=report.html

# Chạy với verbose
pytest tests/ -v
```

---

## Tài liệu thêm

- [Appium Python Client GitHub](https://github.com/appium/python-client)
- [Appium Python Client Docs](https://appium.github.io/python-client-sphinx/)
- [pytest Docs](https://docs.pytest.org/)
