import axios from 'axios';
import { NotificationManager as notify } from 'react-notifications';
import jwt_decode from 'jwt-decode';
import { setToken, clearToken, getToken } from '../utils/authUtil';
import { getAuthorized } from '../utils/apiService';

import * as api from '../constants/api';
import { HOME } from '../constants/common';
import * as message from '../constants/message';

import * as ActionType from '../constants/actionType';
import * as apiAction from './apiAction';

import history from '../history';


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
      dispatch(authActions.loginSuccess(response.data));
      history.push(HOME);
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
    if (token) {
      const tokenDecoded = jwt_decode(token);
      if (tokenDecoded.exp > Math.floor(Date.now() / 1000)) {
        dispatch(authActions.loginSuccess(token));
      } else clearToken();
    }
  };
}

export function logout() {
  return (dispatch) => {
    dispatch(authActions.logout());
    clearToken();
    history.push(HOME);
  };
}
