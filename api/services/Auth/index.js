import config from "Config";

class Auth {
  constructor(client) {
    const { oneauth } = config;

    this.url = client.url || oneauth.url;
    this.clientId = client.clientId || oneauth.clientId;
  }

  login = res =>
    res.redirect(
      `${this.url}/oauth/authorize?response_type=code&client_id=${this.clientId}&redirect_uri=${config.app.url}/api/login/callback/`
    );
}

export default Auth;
