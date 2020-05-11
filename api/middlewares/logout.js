import cookie from 'cookie';
import config from 'Config';

export default (req, res) => {
  const secure = process.env.NODE_ENV === 'production';

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('lotr', '', {
      httpOnly: secure,
      maxAge: -1,
      path: '/',
      domain: secure
        ? '.' + config.app.url.replace(/^http{s}?:/, '')
        : undefined,
      sameSite: secure ? 'lax' : undefined,
      secure,
    }),
  );
};
