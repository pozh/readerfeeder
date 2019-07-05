import _assign from 'lodash/assign';

/**
 * Import all constants as an object.
 */
import * as ActionType from 'constants/actionType';

const initialState = {
  token: null,
  isAuthenticated: false,
  user: {},
  usermeta: {}
};

/**
 * A reducer takes two arguments, the current state and an action.
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case ActionType.LOG_IN_SUCCESS:
      let theMeta = action.payload.usermeta;
      if (theMeta === undefined) theMeta = {};
      return _assign({}, state, {
        isAuthenticated: true,
        token: action.payload.token,
        usermeta: theMeta,
        user: action.payload.user
      });

    case ActionType.LOG_IN_FAILURE:
      return _assign({}, state, {
        isAuthenticated: false,
        token: null,
      });

    case ActionType.LOG_OUT:
      return _assign({}, state, {
        isAuthenticated: false,
        token: null,
        usermeta: {},
        user: {},
      });

    case ActionType.SIGNUP_SUCCESS:
      return _assign({}, state, {
        user: action.payload,
      });

    case ActionType.SIGNUP_FAILURE:
      return _assign({}, state, {
        isAuthenticated: false,
        token: null,
        user: null,
      });

    case ActionType.NOT_AUTHORIZED:
      return _assign({}, state, {
        isAuthenticated: false,
        token: null,
        usermeta: null,
        user: null
      });

    case ActionType.SETTINGS_SAVED:
      return _assign({}, state, {
        user: action.payload.user
      });

    default:
      return state;
  }
}
