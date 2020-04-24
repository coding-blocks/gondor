import axios from 'axios';
import config from 'Config';
import Models from 'Models';
import queryString from 'Utils/queryString';

export default class Auth {
  static redirectURI = `${config.app.url}/api/login/callback`;

  constructor(props) {
    this._user = props?.user;
    this._accessToken = this._user?.access_token;
    this.clientId = props?.clientId || config.oneauth.clientId;
    this.clientSecret = props?.clientSecret || config.oneauth.clientSecret;
    this.clientUrl = props?.clientUrl || config.oneauth.url;

    const headers = this._accessToken
      ? { Authorization: `Bearer ${this._accessToken}` }
      : {};
    this.request = axios.create({ baseURL: this.clientUrl, headers });
  }

  get user() {
    return this._user;
  }

  get accessToken() {
    return this._accessToken;
  }

  set user(value) {
    this._user = value;
    this._accessToken = value?.access_token;
  }

  set accessToken(value) {
    if (value !== this._accessToken) {
      const headers = value ? { Authorization: `Bearer ${value}` } : {};

      this.request = axios.create({
        baseURL: this.clientUrl,
        headers,
      });
    }

    this._accessToken = value;
  }

  login = (res) => {
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

  getAccessToken = async (code) => {
    const { data } = await this.request.post('/oauth/token', {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: Auth.redirectURI,
      grant_type: 'authorization_code',
    });

    this.accessToken = data.access_token;

    return data.access_token;
  };

  getProfile = async () => {
    const { data } = await this.request.get('/api/users/me');

    data.role = data.role === 'admin' ? 'Admin' : 'User';
    data.access_token = this._accessToken;

    return data;
  };
}
