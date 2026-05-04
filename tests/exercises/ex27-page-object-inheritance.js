// Bài 27: POM với inheritance - BasePage chứa các method dùng chung
import BasePage from '../../src/pages/BasePage.js';

class ProductListPage extends BasePage {
  get productCards() { return $$('~product-card'); }
  get sortButton()   { return $('~sort-btn'); }
  get filterButton() { return $('~filter-btn'); }

  async getProductNames() {
    const cards = await this.productCards;
    return Promise.all(cards.map(card => card.$('~product-name').getText()));
  }

  async tapFirstProduct() {
    const cards = await this.productCards;
    await cards[0].click();
  }
}

class ProductDetailPage extends BasePage {
  get title()      { return $('~product-title'); }
  get price()      { return $('~product-price'); }
  get addToCart()  { return $('~add-to-cart-btn'); }
  get backButton() { return $('~back-btn'); }
}

const productList = new ProductListPage();
const productDetail = new ProductDetailPage();

describe('Bài 27 - POM với Inheritance', () => {
  it('điều hướng từ list sang detail', async () => {
    await productList.tapFirstProduct();
    await expect(productDetail.title).toBeDisplayed();
  });

  it('kiểm tra giá sản phẩm hiển thị', async () => {
    await productList.tapFirstProduct();
    const priceText = await productDetail.price.getText();
    expect(priceText).toMatch(/\d+/);
  });

  it('quay lại list từ detail', async () => {
    await productList.tapFirstProduct();
    await productDetail.tap('~back-btn');
    await expect(productList.sortButton).toBeDisplayed();
  });
});
