import BaseController from 'Controllers/Base';
import Auth from 'Services/Auth';
import logout from 'Middlewares/logout';

class Login extends BaseController {
  @logout
  GET(req, res) {
    return new Auth().login(res);
  }
}

export default Login.handler();
