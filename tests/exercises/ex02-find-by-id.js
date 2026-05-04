// Bài 02: Tìm element bằng Resource ID (Android) hoặc name (iOS)
describe('Bài 02 - Tìm element bằng ID', () => {
  it('tìm bằng resource-id đầy đủ (Android)', async () => {
    // Format: com.package.name:id/element_id
    const el = await $('id=com.example.app:id/loginButton');
    await expect(el).toBeDisplayed();
  });

  it('tìm bằng id ngắn', async () => {
    const el = await $('#loginButton');
    await expect(el).toBeDisplayed();
  });
});
