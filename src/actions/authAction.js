import {browserHistory} from 'react-router';
import axios from 'axios';
import {NotificationManager as notify} from 'react-notifications';
import {setToken, clearToken, getToken} from "../utils/authUtil"

import * as api from '../constants/api';
import {HOME, USER_HOME} from '../constants/common';
import * as message from '../constants/message';

import * as ActionType from '../constants/actionType';
import * as apiAction from './apiAction';

import history from '../history';


/**
 * Actions that are dispatched from authAction
 */
let authActions = {
  loginSuccess: function (token) {
    return {
      type: ActionType.LOG_IN_SUCCESS,
      payload: token
    }
  },

  logout: function () {
    return {type: ActionType.LOG_OUT}
  },

  signupSuccess: function (token) {
    return {
      type: ActionType.SIGNUP_SUCCESS,
      payload: token
    }
  },
};


export function login({email, password}) {
  return function (dispatch) {
    dispatch(apiAction.apiRequest());
    axios.post(api.API_LOGIN, {email, password}).then((response) => {
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


export function signup({name, email, password, passwordcopy}) {
  return function (dispatch) {
    if (!password) {
      notify.error(message.SIGNUP_NO_PASSWORD);
      return;
    }
    if (password !== passwordcopy) {
      notify.error(message.SIGNUP_PASSWORD_MATCH);
      return;
    }


    dispatch(apiAction.apiRequest());
    axios.post(api.API_SIGNUP, {name, email, password}).then((response) => {
      dispatch(authActions.signupSuccess(response.data.token));
      setToken(response.data.token);
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

export function logout() {
  return function (dispatch) {
    dispatch(authActions.logout());
    clearToken();
    history.push(HOME);
  };
}

export function authErrorHandler(dispatch, error, type) {
  let errorMessage = (error.data.message) ? error.data.message : error.data;

  // NOT AUTHENTICATED ERROR
  if (error.status === 401) {
    errorMessage = message.NOT_AUTHORISED;
  }

  dispatch({type, payload: errorMessage});
}
