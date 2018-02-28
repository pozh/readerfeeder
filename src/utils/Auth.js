import cookie from 'react-cookie';

class Auth {
  static authenticate = token => cookie.save('token', token, {path: '/'});
  static isAuthenticated = () => (cookie.load('token') !== null);
  static deauthenticate = () => cookie.remove('token', {path: '/'});
  static getToken = () => cookie.load('token');
}
export default Auth;
