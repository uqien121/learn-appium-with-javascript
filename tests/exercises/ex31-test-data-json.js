// Bài 31: Đọc dữ liệu test từ file JSON
import { readFileSync } from 'fs';
import { join } from 'path';

const testData = JSON.parse(
  readFileSync(join(process.cwd(), 'tests', 'data', 'users.json'), 'utf-8')
);

describe('Bài 31 - Test data từ JSON', () => {
  it('đăng nhập với user từ file JSON', async () => {
    const { email, password } = testData.validUser;
    await $('~username-input').setValue(email);
    await $('~password-input').setValue(password);
    await $('~login-btn').click();
    await expect($('~home-screen')).toBeDisplayed();
  });

  it('kiểm tra nhiều users từ file JSON', async () => {
    for (const user of testData.testUsers) {
      console.log(`Testing user: ${user.email}`);
      await $('~username-input').setValue(user.email);
      await $('~password-input').setValue(user.password);
      await $('~login-btn').click();

      if (user.expectedResult === 'success') {
        await expect($('~home-screen')).toBeDisplayed();
        await $('~logout-btn').click();
      } else {
        await expect($('~login-error-message')).toBeDisplayed();
      }
    }
  });
});
