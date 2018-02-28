import Cookies from 'universal-cookie';

export default class Auth {

  static authenticate = token => {
    const cookies = new Cookies();
    cookies.set('token', token, {path: '/'});
  };

  static isAuthenticated = () => {
    const cookies = new Cookies();
    let result = (typeof cookies.get('token') !== 'undefined');
    return result;
  };

  static deauthenticate = () => {
    const cookies = new Cookies();
    cookies.remove('token');
  };

  static getToken = () => {
    const cookies = new Cookies();
    return cookies.get('token');
  };
}
