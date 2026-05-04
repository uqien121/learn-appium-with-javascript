// Bài 30: Data-driven test - chạy cùng test với nhiều bộ dữ liệu
const loginTestCases = [
  { desc: 'email hợp lệ', email: 'user@example.com', password: 'Pass123!', expectSuccess: true },
  { desc: 'email sai format', email: 'notanemail', password: 'Pass123!', expectSuccess: false },
  { desc: 'password quá ngắn', email: 'user@example.com', password: '123', expectSuccess: false },
  { desc: 'email trống', email: '', password: 'Pass123!', expectSuccess: false },
  { desc: 'password trống', email: 'user@example.com', password: '', expectSuccess: false },
];

describe('Bài 30 - Data-driven Test', () => {
  loginTestCases.forEach(({ desc, email, password, expectSuccess }) => {
    it(`đăng nhập với ${desc}`, async () => {
      await $('~username-input').setValue(email);
      await $('~password-input').setValue(password);

      if (email && password) {
        await $('~login-btn').click();
      }

      if (expectSuccess) {
        await expect($('~home-screen')).toBeDisplayed();
      } else {
        await expect($('~login-form')).toBeDisplayed();
      }
    });
  });
});
