import User from 'Services/User';
import config from 'Config';
import jwt from 'jsonwebtoken';
import Policy from 'Services/AuthorizationPolicy';

export default async (req, res) => {
  if (!req.cookies.lotr) return;

  const user = new User();
  await user.verifyAndLoadFromToken(req.cookies.lotr);
  req.viewer = await user.instance;

  if (
    req.cookies.iuid &&
    Policy.can(user?.instance).perform('user:impersonate').on(null)
  ) {
    req.viewer = (await User.findById(req.cookies.iuid)) || req.viewer;
  }
};
