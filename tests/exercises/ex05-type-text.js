// Bài 05: Nhập text vào input field
describe('Bài 05 - Nhập text', () => {
  it('nhập text vào ô username', async () => {
    const field = await $('~username-input');
    await field.setValue('testuser@example.com');
    await expect(field).toHaveValue('testuser@example.com');
  });

  it('nhập text số điện thoại', async () => {
    const field = await $('~phone-input');
    await field.setValue('0901234567');
  });

  it('nhập text có ký tự đặc biệt', async () => {
    const field = await $('~search-input');
    await field.setValue('xin chào! @#$%');
  });
});
