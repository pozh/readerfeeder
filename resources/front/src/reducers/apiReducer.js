import _cloneDeep from 'lodash/cloneDeep';

import * as ActionType from 'constants/actionType';

const initialState = {
  isRequesting: false,
  numberOfRequests: 0
};

/**
 * A reducer takes two arguments, the current state and an action.
 */
export default function (state, action) {
  state = state || initialState;
  let newState;

  switch (action.type) {
    case ActionType.API_REQUEST:
      newState = _cloneDeep(state);
      newState.isRequesting = true;
      newState.numberOfRequests++;
      return newState;

    case ActionType.API_RESPONSE:
      newState = _cloneDeep(state);
      newState.numberOfRequests--;
      if (newState.numberOfRequests <= 0) {
        newState.isRequesting = false;
      }
      return newState;

    default:
      return state;
  }
}
