/**
 * wdio.conf.js — Cấu hình chung cho WebdriverIO
 *
 * File này chứa các setting dùng chung cho cả Android và iOS.
 * Mỗi platform (android/ios) sẽ import file này và override phần capabilities.
 */
export const config = {
  // runner: 'local' nghĩa là chạy test trên máy bạn
  // Đối lập với 'browser-stack' hay 'sauce-labs' (chạy trên cloud)
  runner: 'local',

  // Port Appium server đang lắng nghe
  // Mặc định 4723 — khớp với 'appium --port 4723'
  port: 4723,

  // Danh sách file test cần chạy
  // '**' nghĩa là tìm trong tất cả thư mục con
  // '*.js' nghĩa là tất cả file .js
  specs: ['./tests/exercises/**/*.js'],

  // Các file bị loại trừ — không chạy dù khớp pattern ở trên
  exclude: [],

  // capabilities để trống ở đây — từng file android/ios conf sẽ điền vào
  capabilities: [],

  // Level của log:
  // 'silent' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
  // Dùng 'info' khi bình thường, 'debug' khi debug lỗi
  logLevel: 'info',

  // Dừng toàn bộ test sau bao nhiêu lỗi (0 = không dừng)
  bail: 0,

  // Thời gian chờ tối đa để kết nối Appium server (ms)
  connectionRetryTimeout: 120000,

  // Số lần thử kết nối lại nếu fail
  connectionRetryCount: 3,

  // Framework test — dùng để viết describe/it
  // Các lựa chọn: 'mocha' | 'jasmine' | 'cucumber'
  framework: 'mocha',

  // Cách in kết quả test ra terminal
  reporters: ['spec'],

  // Cấu hình riêng cho Mocha framework
  mochaOpts: {
    ui: 'bdd',        // bdd = behavior driven (describe/it syntax)
    timeout: 60000,   // mỗi test case tối đa 60 giây trước khi bị timeout
  },

  // Services: các plugin chạy cùng WebdriverIO
  services: [
    [
      'appium',
      {
        // Lệnh để khởi động Appium server
        command: 'appium',
        args: {
          // relaxedSecurity: cho phép dùng các command nâng cao
          // Cần thiết cho một số thao tác như inject image, clipboard...
          relaxedSecurity: true,
        },
      },
    ],
  ],

  // Hook: chạy SAU MỖI test case
  // Dùng để chụp ảnh khi test fail
  afterTest: async (test, _ctx, { error }) => {
    if (error) {
      // Tạo tên file an toàn (bỏ ký tự đặc biệt)
      const safeName = test.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const timestamp = Date.now();
      await driver.saveScreenshot(`./screenshots/FAIL-${safeName}-${timestamp}.png`);
    }
  },
};
