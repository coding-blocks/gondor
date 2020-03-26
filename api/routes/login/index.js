import BaseController from 'Controllers/Base';
import OneAuth from 'Services/OneAuth';
import logout from 'Middlewares/decorators/logout';

class Login extends BaseController {
  @logout
  GET(req, res) {
    return new OneAuth().login(res);
  }
}

export default Login.handler();
