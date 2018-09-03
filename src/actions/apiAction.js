import * as ActionType from '../constants/actionType';

/**
 * These are the actions dispatched whenever the API is used
 */

// Everytime an API request is made, this action gets called
export function apiRequest(details) {
  return {
    type: ActionType.API_REQUEST,
    payload: details
  };
}

// Everytime a response is received, this action gets called
export function apiResponse(details) {
  return {
    type: ActionType.API_RESPONSE,
    payload: details
  };
}

// Every time a component unmounts, this action gets called
export function apiClearState(details) {
  return {
    type: ActionType.API_CLEAR_STATE,
    payload: details
  };
}
