import User from 'Services/User';
import Models from 'Models';
import config from 'Config';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  if (!req.cookies.lotr) return;

  req.viewer = await User.verifyAndFindFromToken(req.cookies.lotr);
};
