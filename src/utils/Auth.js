import Cookies from 'universal-cookie';


export const authenticate = token => {
  const cookies = new Cookies();
  cookies.set('token', token, {path: '/'});
}

export const isAuthenticated = () => {
  const cookies = new Cookies();
  let result = (typeof cookies.get('token') !== 'undefined');
  return result;
}

export const deauthenticate = () => {
  const cookies = new Cookies();
  cookies.remove('token');
}

export const getToken = () => {
  const cookies = new Cookies();
  return cookies.get('token');
}
