import {browserHistory} from 'react-router';
import axios from 'axios';
import {setToken, clearToken, getToken} from "../utils/authUtil"

import * as api from '../constants/api';
import {HOME, USER_HOME} from '../constants/common';
import * as message from '../constants/message';

import * as ActionType from '../constants/actionType';
import * as apiAction from './apiAction';
import * as FlashMessage from './flashMessage';

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
};


export function login({email, password}) {
  return function (dispatch) {
    dispatch(apiAction.apiRequest());
    axios.post(api.API_LOGIN, {email, password}).then((response) => {
      dispatch(authActions.loginSuccess(response.data.token));
      setToken(response.data.token);
      history.push(USER_HOME);
    })
      .catch((error) => {
        authErrorHandler(dispatch, error.response, ActionType.LOG_IN_FAILURE);
        dispatch(FlashMessage.addFlashMessage('error', message.INVALID_LOGIN_DATA));
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
