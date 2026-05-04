// Bài 29: Test đăng ký tài khoản (E2E)
describe('Bài 29 - Register Flow E2E', () => {
  before(async () => {
    await $('~register-link').click();
    await expect($('~register-screen')).toBeDisplayed();
  });

  it('đăng ký thành công với thông tin hợp lệ', async () => {
    const timestamp = Date.now();
    await $('~fullname-input').setValue('Nguyễn Văn Test');
    await $('~email-input').setValue(`test${timestamp}@example.com`);
    await $('~password-input').setValue('Password123!');
    await $('~confirm-password-input').setValue('Password123!');
    await $('~terms-checkbox').click();
    await $('~register-btn').click();

    await $('~register-btn').waitForDisplayed({ timeout: 10000, reverse: true });
    await expect($('~home-screen')).toBeDisplayed();
  });

  it('không đăng ký được khi email đã tồn tại', async () => {
    await $('~email-input').setValue('existing@example.com');
    await $('~password-input').setValue('Password123!');
    await $('~confirm-password-input').setValue('Password123!');
    await $('~terms-checkbox').click();
    await $('~register-btn').click();

    await expect($('~email-error')).toBeDisplayed();
  });

  it('không đăng ký được khi password không khớp', async () => {
    await $('~email-input').setValue('new@example.com');
    await $('~password-input').setValue('Password123!');
    await $('~confirm-password-input').setValue('DifferentPass!');
    await $('~register-btn').click();

    await expect($('~confirm-password-error')).toBeDisplayed();
  });
});
