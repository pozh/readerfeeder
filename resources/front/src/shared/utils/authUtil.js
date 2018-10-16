import Cookies from 'universal-cookie';
import { TOKEN } from 'constants/api';

export const setToken = token => {
  const cookies = new Cookies();
  cookies.set(TOKEN, token, { path: '/' });
};

export const clearToken = () => {
  const cookies = new Cookies();
  cookies.remove(TOKEN, { path: '/' });
};

export const getToken = () => {
  const cookies = new Cookies();
  return cookies.get(TOKEN, { path: '/' });
};
