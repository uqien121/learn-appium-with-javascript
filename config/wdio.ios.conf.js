/**
 * wdio.ios.conf.js — Cấu hình cho iOS
 *
 * Lưu ý: Test iOS chỉ chạy được trên macOS.
 * Trên Windows/Linux, bạn cần dịch vụ cloud (BrowserStack, Sauce Labs)
 * hoặc máy Mac riêng.
 */
import { config as baseConfig } from './wdio.conf.js';

export const config = {
  ...baseConfig,

  capabilities: [
    {
      // ===== THÔNG TIN PLATFORM =====

      platformName: 'iOS',

      // XCUITest là framework test chính thức của Apple, tích hợp vào Xcode
      'appium:automationName': 'XCUITest',

      // ===== THÔNG TIN THIẾT BỊ =====

      // Tên simulator — xem trong Xcode → Window → Devices and Simulators
      // Hoặc chạy: xcrun simctl list devices
      'appium:deviceName': process.env.IOS_DEVICE || 'iPhone 15',

      // Phiên bản iOS trên simulator
      'appium:platformVersion': '17.0',

      // UDID: ID duy nhất của thiết bị (cần khi có nhiều simulator cùng tên)
      // Lấy bằng: xcrun simctl list devices | grep "iPhone 15"
      // 'appium:udid': 'abc123...',

      // ===== THÔNG TIN APP =====

      // Đường dẫn đến file .app (simulator) hoặc .ipa (thiết bị thật)
      'appium:app': process.env.IOS_APP_PATH || './apps/app.app',

      // Bundle ID: tên định danh duy nhất của app trên iOS
      // Format: com.tencongty.tenapp
      // Tìm trong Info.plist của project Xcode
      // 'appium:bundleId': 'com.example.myapp',

      // ===== RESET BEHAVIOR =====

      'appium:noReset': false,
      'appium:fullReset': false,

      // ===== TIMEOUT =====

      'appium:newCommandTimeout': 240,

      // Thời gian chờ WebDriverAgent khởi động trên thiết bị (ms)
      // WebDriverAgent (WDA) là agent Appium cài lên iOS để điều khiển app
      // Thiết bị thật cần nhiều thời gian hơn simulator
      'appium:wdaLaunchTimeout': 120000,

      // Thời gian chờ kết nối với WDA sau khi launch
      'appium:wdaConnectionTimeout': 120000,
    },
  ],
};
