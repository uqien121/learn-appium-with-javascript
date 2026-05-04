// Bài 40: Test suite hoàn chỉnh với báo cáo
// Bài tập tổng hợp: viết một test suite đầy đủ cho luồng mua hàng
// Áp dụng: POM, data-driven, wait, screenshot khi fail, cleanup

import LoginPage from '../../src/pages/LoginPage.js';
import BasePage from '../../src/pages/BasePage.js';

class ShopPage extends BasePage {
  get productList()    { return $$('~product-card'); }
  get cartIcon()       { return $('~cart-icon'); }
  get cartBadge()      { return $('~cart-badge'); }
  get checkoutBtn()    { return $('~checkout-btn'); }
  get orderSuccessMsg(){ return $('~order-success'); }

  async addFirstProductToCart() {
    const products = await this.productList;
    await products[0].$('~add-to-cart').click();
  }

  async getCartCount() {
    return parseInt(await this.cartBadge.getText());
  }

  async checkout() {
    await this.tap('~cart-icon');
    await this.tap('~checkout-btn');
  }
}

const shop = new ShopPage();

describe('Bài 40 - Full Test Suite: Luồng Mua Hàng', () => {
  before(async () => {
    await LoginPage.login('user@example.com', 'Password123!');
    await expect($('~home-screen')).toBeDisplayed();
  });

  after(async () => {
    // Logout và cleanup
    await $('~menu-btn').click();
    await $('~logout-btn').click();
  });

  afterEach(async function() {
    // Chụp ảnh nếu test fail
    if (this.currentTest?.state === 'failed') {
      const name = this.currentTest.title.replace(/\s+/g, '-');
      await driver.saveScreenshot(`./screenshots/FAIL-${name}.png`);
    }
  });

  describe('Xem danh sách sản phẩm', () => {
    it('danh sách sản phẩm phải hiển thị', async () => {
      await expect($('~product-list')).toBeDisplayed();
    });

    it('phải có ít nhất 1 sản phẩm', async () => {
      const count = (await shop.productList).length;
      expect(count).toBeGreaterThan(0);
    });
  });

  describe('Thêm vào giỏ hàng', () => {
    it('thêm sản phẩm vào giỏ hàng', async () => {
      await shop.addFirstProductToCart();
      const count = await shop.getCartCount();
      expect(count).toBe(1);
    });

    it('số lượng giỏ hàng tăng khi thêm tiếp', async () => {
      await shop.addFirstProductToCart();
      const count = await shop.getCartCount();
      expect(count).toBe(2);
    });
  });

  describe('Thanh toán', () => {
    it('checkout thành công', async () => {
      await shop.checkout();

      await $('~payment-method-card').click();
      await $('~place-order-btn').click();

      await $('~order-success').waitForDisplayed({ timeout: 15000 });
      await expect(shop.orderSuccessMsg).toBeDisplayed();
    });

    it('giỏ hàng trống sau khi đặt hàng', async () => {
      await driver.back();
      await expect(shop.cartBadge).not.toBeDisplayed();
    });
  });
});
