// Bài 38: Cấu hình CI/CD với GitHub Actions
// File này là hướng dẫn - xem .github/workflows/appium-test.yml

// Điểm quan trọng khi chạy Appium trên CI:
// 1. Dùng emulator Android (không cần thiết bị thật)
// 2. Khởi động emulator trước khi chạy test
// 3. Lưu screenshots và reports dưới dạng artifacts

// .github/workflows/appium-test.yml (tham khảo):
// name: Appium Tests
// on: [push, pull_request]
// jobs:
//   test:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//       - uses: actions/setup-node@v4
//         with:
//           node-version: '20'
//       - name: Install dependencies
//         run: npm install
//       - name: Install Appium
//         run: |
//           npm install -g appium
//           appium driver install uiautomator2
//       - name: Start Android Emulator
//         uses: reactivecircus/android-emulator-runner@v2
//         with:
//           api-level: 34
//           script: npm run test:android
//       - name: Upload screenshots
//         if: failure()
//         uses: actions/upload-artifact@v4
//         with:
//           name: screenshots
//           path: screenshots/

describe('Bài 38 - CI/CD Setup', () => {
  it('kiểm tra environment variables cho CI', async () => {
    const appPath = process.env.ANDROID_APP_PATH;
    const deviceName = process.env.ANDROID_DEVICE || 'emulator-5554';
    console.log('App path:', appPath);
    console.log('Device:', deviceName);
  });

  it('test nhanh để CI feedback ngay', async () => {
    // Smoke test: chỉ kiểm tra app khởi động được
    await expect($('~app-content')).toBeDisplayed();
  });
});
