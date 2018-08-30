import Cookies from 'universal-cookie';
import { TOKEN } from 'constants/api';
import jwt_decode from 'jwt-decode';

export const setToken = token => {
  const cookies = new Cookies();
  cookies.set(TOKEN, token, {path: '/'});
};

export const clearToken = () => {
  const cookies = new Cookies();
  cookies.remove(TOKEN);
};

export const getToken = () => {
  const cookies = new Cookies();
  let token = cookies.get(TOKEN);
  if (!token) return null;
  let tokenDecoded = jwt_decode(token);
  if (tokenDecoded.exp < Math.floor(Date.now() / 1000)) {
    clearToken();
    return null;
  } else {
    return token;
  }
};
