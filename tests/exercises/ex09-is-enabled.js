// Bài 09: Kiểm tra element có thể tương tác không (enabled/disabled)
describe('Bài 09 - Kiểm tra trạng thái enabled', () => {
  it('nút submit bị disabled khi form trống', async () => {
    const submitBtn = await $('~submit-btn');
    await expect(submitBtn).not.toBeEnabled();
  });

  it('nút submit enabled sau khi điền form', async () => {
    await $('~username-input').setValue('user@example.com');
    await $('~password-input').setValue('password123');
    const submitBtn = await $('~submit-btn');
    await expect(submitBtn).toBeEnabled();
  });

  it('checkbox enabled/disabled', async () => {
    const checkbox = await $('~terms-checkbox');
    await expect(checkbox).toBeEnabled();
    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });
});
