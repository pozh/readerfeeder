import {browserHistory} from 'react-router';

import * as ActionType from '../constants/actionType';
import * as apiAction from './apiAction';
import * as apiService from '../utils/apiService';
import * as Converter from '../utils/converter';
import * as FlashMessage from './flashMessage';


/**
 * Actions that are dispatched from crudAction
 */
let authActions = {
  loginSuccess: function (entity, data) {
    return {
      type: ActionType.LOG_IN_SUCCESS,
      entity: entity,
      data: data
    }
  },

  selectItem: function (entity, data) {
    return {
      type: ActionType.SELECT_ITEM,
      entity: entity,
      data: data
    }
  },

  selectItemId: function (entity, data) {
    return {
      type: ActionType.SELECT_ITEM_ID,
      entity: entity,
      data: data
    }
  },

  selectItemSlug: function (entity, data) {
    return {
      type: ActionType.SELECT_ITEM_SLUG,
      entity: entity,
      data: data
    }
  },

  delete: function (entity, id) {
    return {
      type: ActionType.DELETE,
      entity: entity,
      id: id
    }
  },

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
