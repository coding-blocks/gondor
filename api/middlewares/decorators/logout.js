import logout from 'Middlewares/logout';

export default (target, property, descriptor) => {
  const next = descriptor.value;
  descriptor.value = (req, res) => logout(req, res, next);
  return descriptor;
};
