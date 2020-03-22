import axios from 'axios';
import config from 'Config';
import queryString from 'Utils/queryString';

export default class Auth {
  static redirectURI = `${config.app.url}/api/login/callback`;

  constructor(props) {
    this.user = props?.user;
    this._accessToken = this.user?.access_token;
    this.clientId = props?.clientId || config.oneauth.clientId;
    this.clientSecret = props?.clientSecret || config.oneauth.clientSecret;
    this.clientUrl = props?.clientUrl || config.oneauth.url;

    this.request = axios.create({ baseURL: this.clientUrl });
  }

  get accessToken() {
    return this._accessToken;
  }

  set accessToken(value) {
    if (value !== this.accessToken) {
      const headers = value ? { Authorization: `Bearer ${value}` } : {};
      this.request = axios.create({
        baseURL: this.clientUrl,
        headers,
      });
    }

    this._accessToken = value;
  }

  login = res => {
    const query = {
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: Auth.redirectURI,
    };

    return res
      .writeHead(302, {
        Location: `${this.clientUrl}/oauth/authorize${queryString(query)}`,
      })
      .end();
  };

  getAccessToken = async code => {
    try {
      const { data } = await this.request.post('/oauth/token', {
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: Auth.redirectURI,
        grant_type: 'authorization_code',
      });

      this.accessToken = data.access_token;

      return data.access_token;
    } catch (err) {
      return null;
    }
  };

  getProfile = async () => {
    try {
      const { data } = await this.request.get('/api/users/me');

      return data;
    } catch (err) {
      return null;
    }
  };
}
