import axios from 'axios';
import { NotificationManager as notify } from 'react-notifications';
import { setToken, clearToken, getToken } from '../utils/authUtil';
import { getAuthorized } from '../utils/apiService';

import * as api from '../constants/api';
import { HOME, USER_HOME } from '../constants/common';
import * as message from '../constants/message';

import * as ActionType from '../constants/actionType';
import * as apiAction from './apiAction';

import history from '../history';


/**
 * Actions that are dispatched from authAction
 */
const authActions = {
  loginSuccess(token) {
    return {
      type: ActionType.LOG_IN_SUCCESS,
      payload: token
    };
  },

  logout() {
    return { type: ActionType.LOG_OUT };
  },

  setUser(userData) {
    return {
      type: ActionType.SET_USER,
      payload: userData
    };
  },

  signupSuccess(token) {
    return {
      type: ActionType.SIGNUP_SUCCESS,
      payload: token
    };
  },
};

export function authErrorHandler(dispatch, error, type) {
  let errorMessage = '';
  if (error) errorMessage = (error.data.message) ? error.data.message : error.data;

  // NOT AUTHENTICATED ERROR
  if (error && error.status === 401) {
    errorMessage = message.NOT_AUTHORISED;
  }

  dispatch({ type, payload: errorMessage });
}

export function login({ email, password }) {
  return (dispatch) => {
    dispatch(apiAction.apiRequest());
    axios.post(api.API_LOGIN, { email, password }).then((response) => {
      dispatch(apiAction.apiResponse());
      setToken(response.data.token);
      dispatch(authActions.loginSuccess(response.data.token));
      history.push(USER_HOME);
    })
      .catch((error) => {
        authErrorHandler(dispatch, error.response, ActionType.LOG_IN_FAILURE);
        notify.error(message.INVALID_LOGIN_DATA);
      });
  };
}

export function signup({ first_name, email, password, password_confirmation }) {
  return (dispatch) => {
    if (!password) {
      notify.error(message.SIGNUP_NO_PASSWORD);
      return;
    }
    if (password.length < 6) {
      notify.error(message.SIGNUP_SHORT_PASSWORD);
      return;
    }
    if (password !== password_confirmation) {
      notify.error(message.SIGNUP_PASSWORD_MATCH);
      console.log(password, password_confirmation);
      return;
    }

    dispatch(apiAction.apiRequest());
    axios.post(api.API_SIGNUP, { first_name, email, password, password_confirmation })
      .then((response) => {
        dispatch(apiAction.apiResponse());
        setToken(response.data.token);
        dispatch(authActions.signupSuccess(response.data.token));
        history.push(USER_HOME);
      })
      .catch((error) => {
        authErrorHandler(dispatch, error.response, ActionType.SIGNUP_FAILURE);
        notify.error(message.SIGNUP_ERROR);
      });
  };
}

export function verifyToken() {
  return (dispatch) => {
    const token = getToken();
    // Update application state. User has token and is probably authenticated
    if (token) {
      dispatch(authActions.loginSuccess(token));
    }
  };
}

export function setUser() {
  return (dispatch) => {
    dispatch(apiAction.apiRequest());
    getAuthorized(api.API_ME).then((response) => {
      dispatch(apiAction.apiResponse());
      dispatch(authActions.setUser(response.data.data));
    })
      .catch((error) => {
        authErrorHandler(dispatch, error.response, ActionType.NOT_AUTHORISED);
      });
  };
}

export function logout() {
  return (dispatch) => {
    dispatch(authActions.logout());
    clearToken();
    history.push(HOME);
  };
}
