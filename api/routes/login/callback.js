import BaseController from 'Controllers/Base';
import App from 'Services/App';
import Auth from 'Services/Auth';
import logout from 'Middlewares/logout';

class LoginCallback extends BaseController {
  @logout
  async GET(req, res) {
    const auth = new Auth();

    const token = await auth.getAccessToken(req.query.code);
    if (!token) return App.redirectToHome(res);

    const user = await auth.getProfile();

    res.send({ user });
  }
}

export default LoginCallback.handler();
