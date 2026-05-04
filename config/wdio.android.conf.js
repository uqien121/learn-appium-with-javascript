/**
 * wdio.android.conf.js — Cấu hình cho Android
 *
 * Import toàn bộ config chung từ wdio.conf.js,
 * sau đó chỉ ghi đè (override) phần capabilities cho Android.
 */
import { config as baseConfig } from './wdio.conf.js';

export const config = {
  // Spread operator: lấy tất cả từ baseConfig, rồi override những thứ cần
  ...baseConfig,

  // Capabilities: mô tả thiết bị và app muốn test
  capabilities: [
    {
      // ===== THÔNG TIN PLATFORM =====

      // Loại platform: 'Android' hoặc 'iOS'
      platformName: 'Android',

      // Driver tự động hóa — UiAutomator2 là driver chính thức của Google cho Android
      // Đây là cầu nối giữa Appium và hệ thống Android
      'appium:automationName': 'UiAutomator2',

      // ===== THÔNG TIN THIẾT BỊ =====

      // Tên device — lấy bằng lệnh: adb devices
      // Emulator thường có tên: emulator-5554, emulator-5556...
      // Thiết bị thật: serial number như R3CN700WXYZ
      'appium:deviceName': process.env.ANDROID_DEVICE || 'emulator-5554',

      // Phiên bản Android trên thiết bị
      // Dùng để Appium chọn đúng cách kết nối
      'appium:platformVersion': '14.0',

      // ===== THÔNG TIN APP =====

      // Đường dẫn đến file .apk
      // Dùng biến môi trường để linh hoạt giữa các máy khác nhau
      // Ví dụ: ANDROID_APP_PATH=./apps/myapp-debug.apk npm run test:android
      'appium:app': process.env.ANDROID_APP_PATH || './apps/app.apk',

      // ===== RESET BEHAVIOR =====

      // noReset: false → xóa data app (cache, đăng nhập cũ) trước mỗi session
      //          true  → giữ nguyên data (đăng nhập rồi, test tiếp không cần login lại)
      // Khuyến nghị: false khi bắt đầu để đảm bảo mỗi test bắt đầu từ trạng thái sạch
      'appium:noReset': false,

      // fullReset: true → gỡ cài đặt app rồi cài lại (mạnh hơn noReset)
      // Dùng khi muốn test từ trạng thái install lần đầu
      'appium:fullReset': false,

      // ===== TIMEOUT =====

      // Đóng session nếu không nhận được lệnh nào sau X giây
      // 240 giây = 4 phút — đủ cho các thao tác chậm như upload
      'appium:newCommandTimeout': 240,

      // ===== TIỆN ÍCH =====

      // Tự động cấp permission khi app xin (camera, location, storage...)
      // Tiện khi test — không bị chặn bởi dialog permission
      'appium:autoGrantPermissions': true,
    },
  ],
};
