import Account from './account.js'
import Login from './login.js';

class Routes {
  constructor() {
    this.account = new Account()
    this.login = new Login()
  }
}

export default Routes
