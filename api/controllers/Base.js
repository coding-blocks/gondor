class BaseController {
  resolver = async (req, res) => {
    if (typeof this[req.method] === 'function') {
      try {
        await this[req.method](req, res);
      } catch (err) {
        console.log(err);
        res.send({ error: { message: 'There was some error.' } });
      }
      return;
    }

    const supportedMethods = [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'HEAD',
      'OPTIONS',
    ].filter((availableMethod) => typeof this[availableMethod] === 'function');

    res.setHeader('Allow', supportedMethods);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  };
}

BaseController.handler = function () {
  return (req, res) => {
    const controller = new this();

    return controller.resolver(req, res);
  };
};

export default BaseController;
