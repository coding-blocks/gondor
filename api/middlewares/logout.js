export default next => (req, res) => {
  res.clearCookie('lotr');
  next();
};
