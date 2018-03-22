import Cookies from 'universal-cookie';
import { TOKEN } from 'constants/api';
import axios from 'axios';

import * as ActionType from '../constants/actionType';


export const setToken = token => {
  const cookies = new Cookies();
  cookies.set(TOKEN, token, {path: '/'});
};

export const isAuthenticated = () => {
  return (typeof getToken() !== 'undefined');
};

export const clearToken = () => {
  const cookies = new Cookies();
  cookies.remove(TOKEN);
};

export const getToken = () => {
  const cookies = new Cookies();
  return cookies.get(TOKEN);
};

export function login({email, password}) {
  return function (dispatch) {
    dispatch(apiAction.apiRequest());
    axios.post(api.API_ROOT + 'auth/login', {email, password}).then((response) => {
      dispatch({
        type: ActionType.LOG_IN_SUCCESS,
        payload: response.data.token
      });

      setToken(response.data.token);

      window.location.href = '/';
    })
      .catch((error) => {
        authErrorHandler(dispatch, error.response, ActionType.LOG_IN_FAILURE);
        dispatch(FlashMessage.addFlashMessage('error', 'Invalid username and password.'));
      });
  };
}

export function verifyToken() {
  return (dispatch) => {
    const token = getToken();
    // Update application state. User has token and is probably authenticated
    if (token) {
      dispatch({type: ActionType.LOG_IN_SUCCESS, payload: token});
    }
  };
}

export function logout(error) {
  return function (dispatch) {

    dispatch({type: ActionType.LOG_OUT});

    clearToken();

    window.location.href = api.ROOT_URL;
  };
}

export function authErrorHandler(dispatch, error, type) {
  let errorMessage = (error.data.message) ? error.data.message : error.data;

  // NOT AUTHENTICATED ERROR
  if (error.status === 401) {
    errorMessage = 'You are not authorized to do this. Please login and try again.';
  }

  dispatch({
    type,
    payload: errorMessage,
  });
}
