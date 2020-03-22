import config from 'Config';

export default class App {
  static redirectToHome(res) {
    return res.writeHead(302, { Location: config.app.url }).end();
  }
}
