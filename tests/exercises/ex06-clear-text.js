// Bài 06: Xóa text trong field
describe('Bài 06 - Xóa text', () => {
  it('xóa toàn bộ text', async () => {
    const field = await $('~search-input');
    await field.setValue('text cần xóa');
    await field.clearValue();
    await expect(field).toHaveValue('');
  });

  it('ghi đè text bằng setValue', async () => {
    const field = await $('~username-input');
    await field.setValue('old value');
    await field.setValue('new value');   // setValue tự clear trước khi gõ
    await expect(field).toHaveValue('new value');
  });
});
