# Hướng dẫn Appium với Python

## Tổng quan

Python có lẽ là ngôn ngữ phổ biến nhất cho automation testing. Thư viện `Appium-Python-Client` là wrapper chính thức, được Appium team duy trì và update thường xuyên.

### Stack sử dụng

| Thứ | Là gì | Làm gì |
|---|---|---|
| `Appium-Python-Client` | Thư viện Python | Giao tiếp với Appium server |
| `pytest` | Test framework | Chạy test, quản lý fixture, báo cáo |
| `appium` (npm) | Server | Nhận lệnh, điều khiển device |

---

## Cài đặt

```bash
# 1. Cài Appium server (vẫn dùng npm — không phải pip)
npm install -g appium
appium driver install uiautomator2

# 2. Tạo virtual environment Python (khuyến nghị — tránh xung đột thư viện)
python -m venv venv
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows

# 3. Cài thư viện Python
pip install Appium-Python-Client pytest
```

> **Virtual environment là gì?** Hãy tưởng tượng mỗi dự án Python sống trong "hộp cát" riêng. Thư viện cài cho dự án A không ảnh hưởng dự án B. Đây là best practice bắt buộc khi làm Python.

---

## Cấu trúc test cơ bản

```python
# conftest.py — file cấu hình chung của pytest
# Đặt ở root của project

import pytest
from appium import webdriver
from appium.options import UiAutomator2Options


@pytest.fixture(scope='module')
def driver():
    """
    Fixture: tạo session Appium một lần cho cả module test.
    scope='module' nghĩa là driver được tạo 1 lần, dùng cho tất cả
    test trong file, không tạo lại sau mỗi test case.
    """
    options = UiAutomator2Options()
    options.platform_name = 'Android'
    options.device_name = 'emulator-5554'
    options.app = './apps/myapp-debug.apk'
    options.no_reset = False          # xóa data app trước mỗi session
    options.auto_grant_permissions = True   # tự cho phép khi app xin quyền

    # Kết nối đến Appium server đang chạy ở localhost:4723
    driver = webdriver.Remote('http://localhost:4723', options=options)

    yield driver    # trả driver cho các test dùng

    driver.quit()   # đóng session sau khi tất cả test xong
```

```python
# tests/test_login.py

from appium.webdriver.common.appiumby import AppiumBy


class TestLogin:
    """Nhóm các test liên quan đến màn hình login."""

    def test_login_button_visible(self, driver):
        """Kiểm tra nút login có hiển thị khi mở app."""
        # Tìm element bằng Accessibility ID
        btn = driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'login-btn')
        assert btn.is_displayed(), "Nút login phải hiển thị khi mở app"

    def test_login_success(self, driver):
        """Đăng nhập với thông tin hợp lệ → vào được home screen."""
        # Nhập username
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'username') \
              .send_keys('user@example.com')

        # Nhập password
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'password') \
              .send_keys('Password123!')

        # Click login
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'login-btn').click()

        # Kiểm tra kết quả
        home = driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'home-screen')
        assert home.is_displayed(), "Home screen phải hiển thị sau khi login"
```

---

## Locators trong Python

```python
from appium.webdriver.common.appiumby import AppiumBy

# Accessibility ID — dùng đầu tiên (giống ~ trong JS)
el = driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'login-btn')

# Resource ID (Android)
el = driver.find_element(AppiumBy.ID, 'com.example.app:id/loginButton')

# XPath — dùng khi không còn lựa chọn
el = driver.find_element(AppiumBy.XPATH, '//android.widget.Button[@text="Login"]')

# Tìm NHIỀU elements → trả về list
items = driver.find_elements(AppiumBy.ACCESSIBILITY_ID, 'list-item')
print(f"Số lượng: {len(items)}")
for item in items:
    print(item.text)
```

---

## Các thao tác cơ bản

```python
# Tìm và click
el = driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'btn')
el.click()

# Nhập text
field = driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'username')
field.clear()                   # xóa text cũ
field.send_keys('hello world')  # nhập text mới

# Lấy text hiển thị
text = el.text
print(text)  # "Xin chào!"

# Kiểm tra trạng thái
print(el.is_displayed())   # True/False
print(el.is_enabled())     # True/False

# Scroll xuống (Android)
driver.swipe(
    start_x=540, start_y=800,    # điểm bắt đầu (gần dưới)
    end_x=540, end_y=200,        # điểm kết thúc (gần trên)
    duration=1000                 # thời gian vuốt (ms)
)

# Xử lý alert
driver.switch_to.alert.accept()    # click OK
driver.switch_to.alert.dismiss()   # click Cancel
text = driver.switch_to.alert.text # lấy text của alert
```

---

## Chờ đợi đúng cách trong Python

Python không có built-in explicit wait như WebdriverIO, nhưng dùng `WebDriverWait` từ Selenium:

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from appium.webdriver.common.appiumby import AppiumBy


# Helper function — nên tạo trong BasePage
def wait_for_element(driver, by, value, timeout=10):
    """Chờ element xuất hiện, tối đa timeout giây."""
    return WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located((by, value))
    )


# Dùng trong test
el = wait_for_element(driver, AppiumBy.ACCESSIBILITY_ID, 'result-text')
assert el.is_displayed()
```

---

## Page Object Model trong Python

```python
# pages/base_page.py
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class BasePage:
    """Lớp cha chứa các method dùng chung cho tất cả màn hình."""

    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)

    def find(self, by, value):
        """Tìm và chờ element xuất hiện."""
        return self.wait.until(EC.visibility_of_element_located((by, value)))

    def tap(self, by, value):
        """Chờ rồi click element."""
        self.find(by, value).click()

    def type_text(self, by, value, text):
        """Xóa rồi nhập text."""
        el = self.find(by, value)
        el.clear()
        el.send_keys(text)

    def get_text(self, by, value):
        """Lấy text của element."""
        return self.find(by, value).text
```

```python
# pages/login_page.py
from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage


class LoginPage(BasePage):
    """Đại diện cho màn hình đăng nhập."""

    # Định nghĩa locator một chỗ
    USERNAME = (AppiumBy.ACCESSIBILITY_ID, 'username')
    PASSWORD = (AppiumBy.ACCESSIBILITY_ID, 'password')
    LOGIN_BTN = (AppiumBy.ACCESSIBILITY_ID, 'login-btn')
    ERROR_MSG = (AppiumBy.ACCESSIBILITY_ID, 'error-message')

    def login(self, username, password):
        """Thực hiện đăng nhập."""
        self.type_text(*self.USERNAME, username)
        self.type_text(*self.PASSWORD, password)
        self.tap(*self.LOGIN_BTN)

    def get_error(self):
        """Lấy text thông báo lỗi."""
        return self.get_text(*self.ERROR_MSG)
```

```python
# tests/test_login.py — sử dụng Page Object
from pages.login_page import LoginPage


class TestLogin:
    def test_login_success(self, driver):
        login_page = LoginPage(driver)
        login_page.login('user@example.com', 'Password123!')
        # Kiểm tra kết quả...

    def test_wrong_password(self, driver):
        login_page = LoginPage(driver)
        login_page.login('user@example.com', 'wrong')
        error = login_page.get_error()
        assert 'Sai' in error
```

---

## Chạy test

```bash
# Bước 1: Bật Appium server
appium --port 4723

# Bước 2: Bật emulator (trong Android Studio)

# Bước 3: Chạy test (terminal mới)
pytest tests/ -v              # -v: verbose, in tên từng test

# Chạy một file
pytest tests/test_login.py -v

# Chạy một test cụ thể
pytest tests/test_login.py::TestLogin::test_login_success -v

# Tạo report HTML
pytest tests/ --html=report.html
```

---

## So sánh Python vs JavaScript cho Appium

| | JavaScript (WebdriverIO) | Python (Appium-Python-Client) |
|---|---|---|
| Async/await | Built-in, tự nhiên | Không cần (sync bởi mặc định) |
| Tốc độ viết | Nhanh | Nhanh, code ngắn gọn hơn |
| Tài liệu | Nhiều, cập nhật | Nhiều, cộng đồng lớn |
| Dùng khi | Team JS/Node.js | Team Python, data scientist |

---

## Tài liệu thêm

- [Appium Python Client GitHub](https://github.com/appium/python-client)
- [pytest Documentation](https://docs.pytest.org/)
- [Selenium WebDriverWait](https://selenium-python.readthedocs.io/waits.html)
