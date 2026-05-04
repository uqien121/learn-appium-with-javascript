export default class BasePage {
  async waitForDisplayed(selector, timeout = 10000) {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout });
    return el;
  }

  async tap(selector) {
    const el = await this.waitForDisplayed(selector);
    await el.click();
  }

  async typeText(selector, text) {
    const el = await this.waitForDisplayed(selector);
    await el.setValue(text);
  }

  async getText(selector) {
    const el = await this.waitForDisplayed(selector);
    return el.getText();
  }

  async isDisplayed(selector, timeout = 5000) {
    try {
      const el = await $(selector);
      await el.waitForDisplayed({ timeout });
      return true;
    } catch {
      return false;
    }
  }
}
