import User from 'Services/User';
import config from 'Config';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  if (!req.cookies.lotr) return;

  const user = new User();
  await user.verifyAndLoadFromToken(req.cookies.lotr);

  req.viewer = await user.instance;
};
