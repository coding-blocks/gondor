import cookie from 'cookie';
import App from 'Services/App';
import OneAuth from 'Services/OneAuth';
import User from 'Services/User';
import BaseController from 'Controllers/Base';
import logout from 'Middlewares/decorators/logout';

class LoginCallback extends BaseController {
  @logout
  async GET(req, res) {
    try {
      const auth = new OneAuth();
      await auth.getAccessToken(req.query.code);
      const profile = await auth.getProfile();

      const user = new User();
      await user.loadByUsername(profile.username);
      if (user.exists) {
        await user.syncProfile(profile);
      } else {
        await user.create(profile);
      }

      const token = await user.generateToken();
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('lotr', token, {
          httpOnly: true,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        }),
      );

      return App.redirectToHome(res);
    } catch (err) {
      console.log(err);
      return App.redirectToHome(res);
    }
  }
}

export default LoginCallback.handler();
