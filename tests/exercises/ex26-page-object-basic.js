// Bài 26: Page Object Model cơ bản
// Mục tiêu: tách locators và actions ra khỏi test

class SearchPage {
  get searchInput()  { return $('~search-input'); }
  get searchBtn()    { return $('~search-btn'); }
  get resultList()   { return $$('~search-result-item'); }
  get emptyMessage() { return $('~no-results-message'); }

  async search(keyword) {
    await this.searchInput.setValue(keyword);
    await this.searchBtn.click();
  }

  async getResultCount() {
    const results = await this.resultList;
    return results.length;
  }
}

const searchPage = new SearchPage();

describe('Bài 26 - Page Object Model', () => {
  it('tìm kiếm và kiểm tra có kết quả', async () => {
    await searchPage.search('áo thun');
    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  it('tìm kiếm từ không tồn tại', async () => {
    await searchPage.search('xyzxyz12345xyz');
    await expect(searchPage.emptyMessage).toBeDisplayed();
  });
});
