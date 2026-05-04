import BasePage from './BasePage.js';

class LoginPage extends BasePage {
  get usernameField() { return $('~username'); }
  get passwordField() { return $('~password'); }
  get loginButton()   { return $('~login-btn'); }
  get errorMessage()  { return $('~error-message'); }

  async login(username, password) {
    await this.typeText('~username', username);
    await this.typeText('~password', password);
    await this.tap('~login-btn');
  }
}

export default new LoginPage();
