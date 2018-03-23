import {browserHistory} from 'react-router';
import axios from 'axios';
import {setToken, clearToken, getToken} from "../utils/authUtil"
import * as api from 'constants/api';
import * as message from 'constants/message';

import * as ActionType from '../constants/actionType';
import * as apiAction from './apiAction';
import * as FlashMessage from './flashMessage';


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
    axios.post(api.API_ROOT + 'auth/login', {email, password}).then((response) => {
      dispatch(authActions.loginSuccess(response.data.token));
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
      dispatch(authActions.loginSuccess(token));
    }
  };
}

export function logout(error) {
  return function (dispatch) {
    dispatch(authActions.logout());
    clearToken();
    window.location.href = '/';
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
