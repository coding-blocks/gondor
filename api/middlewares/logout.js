import cookie from 'cookie';

export default (req, res, next) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('lotr', '', {
      httpOnly: true,
      maxAge: -1,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }),
  );

  return next(req, res);
};
