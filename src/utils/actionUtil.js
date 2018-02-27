import cookie from 'react-cookie';
export const setToken = token => cookie.save('token', token, {path: '/'});
export const getToken = () => cookie.load('token');
export const clearToken = () => cookie.remove('token', {path: '/'});
