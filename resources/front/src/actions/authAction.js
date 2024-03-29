import axios from 'axios';
import { NotificationManager as notify } from 'react-notifications';
import jwt_decode from 'jwt-decode';
import { setToken, clearToken, getToken } from '../utils/authUtil';
import history from '../utils/history';
import * as api from '../constants/api';
import * as message from '../constants/message';
import * as ActionType from '../constants/actionType';
import * as apiAction from './apiAction';


/**
 * Actions that are dispatched from authAction
 */
const authActions = {
  loginSuccess(data) {
    return {
      type: ActionType.LOG_IN_SUCCESS,
      payload: data
    };
  },

  logout() {
    return { type: ActionType.LOG_OUT };
  },

  signupSuccess(data) {
    return {
      type: ActionType.SIGNUP_SUCCESS,
      payload: data
    };
  },

  settingsSaved(data) {
    return {
      type: ActionType.SETTINGS_SAVED,
      payload: data
    };
  },
};

export function authErrorHandler(dispatch, error, type) {
  let errorMessage = '';
  if (error) errorMessage = (error.data.message) ? error.data.message : error.data;

  // NOT AUTHENTICATED ERROR
  if (error && error.status === 401 && !errorMessage) {
    errorMessage = message.NOT_AUTHORIZED;
  }

  dispatch({ type, payload: errorMessage });
}

export function login({ email, password }) {
  return (dispatch) => {
    dispatch(apiAction.apiRequest());
    axios.post(api.API_LOGIN, { email, password })
      .then(response => {
        dispatch(apiAction.apiResponse());
        axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
        setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('usermeta', JSON.stringify(response.data.usermeta));
        dispatch(authActions.loginSuccess(response.data));
        history.push('/');
      })
      .catch(error => {
        authErrorHandler(dispatch, error.response, ActionType.LOG_IN_FAILURE);
        notify.error(message.INVALID_LOGIN_DATA);
      });
  };
}

export function loginSocial({ provider, data }) {
  return (dispatch) => {
    const { tokenId, profileObj } = data;
    const { email, name } = profileObj;
    // const tokenDecoded = jwt_decode(tokenId);

    dispatch(apiAction.apiRequest({
      provider, token: tokenId, name, email
    }));
    axios.post(api.API_LOGIN_SOCIAL, {
      provider, token: tokenId, name, email
    })
      .then(response => {
        dispatch(apiAction.apiResponse(response.data));
        axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
        setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('usermeta', JSON.stringify(response.data.usermeta));
        dispatch(authActions.loginSuccess(response.data));
        history.push('/');
      })
      .catch(error => {
        authErrorHandler(dispatch, error.response, ActionType.LOG_IN_FAILURE);
        notify.error(message.SOCIAL_AUTH_ERROR);
      });
  };
}


export function signup({
  fName, email, password, passwordCopy
}) {
  return (dispatch) => {
    if (!password) {
      notify.error(message.SIGNUP_NO_PASSWORD);
      return;
    }
    if (password.length < 6) {
      notify.error(message.SIGNUP_SHORT_PASSWORD);
      return;
    }
    if (password !== passwordCopy) {
      notify.error(message.SIGNUP_PASSWORD_MATCH);
      return;
    }

    dispatch(apiAction.apiRequest());
    axios.post(api.API_SIGNUP, {
      first_name: fName,
      email,
      password,
      password_confirmation: passwordCopy
    })
      .then((response) => {
        dispatch(apiAction.apiResponse());
        dispatch(authActions.signupSuccess(response.data.user));
        notify.success(message.SIGNUP_SUCCESS);
        history.push('/login');
      })
      .catch((error) => {
        authErrorHandler(dispatch, error.response, ActionType.SIGNUP_FAILURE);
        notify.error(message.SIGNUP_ERROR);
      });
  };
}

export function checkAuth() {
  return (dispatch) => {
    const token = getToken();
    const user = JSON.parse(localStorage.getItem('user'));
    let localUserMeta = localStorage.getItem('usermeta');
    if (localUserMeta === 'undefined') localUserMeta = '{}';
    const usermeta = JSON.parse(localUserMeta);
    if (token) {
      const tokenDecoded = jwt_decode(token);
      if (tokenDecoded.exp > Math.floor(Date.now() / 1000)) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        setToken(token);
        dispatch(authActions.loginSuccess({ user, usermeta, token }));
      } else clearToken();
    }
  };
}

export function logout() {
  return (dispatch) => {
    dispatch(authActions.logout());
    clearToken();
    localStorage.removeItem('user');
    localStorage.removeItem('usermeta');
    window.location.assign('/');
  };
}

export function updateSettings({ id, fName, kindleEmail }) {
  return (dispatch) => {
    if (!fName || !kindleEmail) {
      notify.error(message.SETTINGS_MISSING_VALUE);
      return;
    }
    dispatch(apiAction.apiRequest({ fName, kindleEmail }));
    axios.post(`${api.API_USER}/${id}`, { fName, kindleEmail })
      .then((response) => {
        dispatch(apiAction.apiResponse());
        dispatch(authActions.settingsSaved(response.data));
        notify.success(message.SETTINGS_SAVED);
      })
      .catch((error) => {
        authErrorHandler(dispatch, error.response, ActionType.SIGNUP_FAILURE);
        notify.error(
          error && error.response.data.message ? error.response.data.message : message.ERROR
        );
      });
  };
}
