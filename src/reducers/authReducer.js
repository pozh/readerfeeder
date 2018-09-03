import _ from 'lodash';

/**
 * Import all constants as an object.
 */
import * as ActionType from '../constants/actionType';

const initialState = {
  token: null,
  isAuthenticated: false,
  user: {},
};

/**
 * A reducer takes two arguments, the current state and an action.
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case ActionType.LOG_IN_SUCCESS:
      return _.assign({}, state, {
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user
      });

    case ActionType.LOG_IN_FAILURE:
      return _.assign({}, state, {
        isAuthenticated: false,
        token: null,
      });

    case ActionType.LOG_OUT:
      return _.assign({}, state, {
        isAuthenticated: false,
        token: null,
      });

    case ActionType.SIGNUP_SUCCESS:
      return _.assign({}, state, {
        isAuthenticated: true,
        token: action.payload,
      });

    case ActionType.SIGNUP_FAILURE:
      return _.assign({}, state, {
        isAuthenticated: false,
        token: null,
      });
    case ActionType.NOT_AUTHORISED:
      return _.assign({}, state, {
        isAuthenticated: false,
        token: null,
        user: null
      });
    default:
      return state;
  }
}
