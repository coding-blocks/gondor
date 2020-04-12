import App from 'Services/App';
import BaseController from 'Controllers/Base';
import logout from 'Middlewares/decorators/logout';

class Logout extends BaseController {
  @logout
  GET(req, res) {
    return App.redirectToHome(res);
  }
}

export default Logout.handler();
