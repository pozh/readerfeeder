import {NotificationManager as notify} from 'react-notifications';

import * as ActionType from '../constants/actionType';
import * as apiAction from './apiAction';
import * as apiService from '../utils/apiService';
import * as Converter from '../utils/converter';
import * as message from 'constants/message';

import history from '../history';


/**
 * Actions that are dispatched from crudAction
 */
let commonActions = {
  list: function (entity, data) {
    return {
      type: ActionType.LIST,
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


/**
 * These are the actions every CRUD in the application uses.
 * Every time an action that requires the API is called, it first Dispatches an "apiRequest" action.
 * ApiService returns a promise which dispatches another action "apiResponse".
 * entity = 'Feed', 'Categories', ...
 */


export function fetchAll(entity, data) {
  return function (dispatch) {
    dispatch(apiAction.apiRequest());
    return apiService.fetch(entity, data).then((response) => {
      dispatch(apiAction.apiResponse());
      dispatch(commonActions.list(entity, response.data));
    })
      .catch((error) => {
        errorHandler(dispatch, error.response, ActionType.FAILURE);
      });
  };
}

export function fetchById(entity, id) {
  return function (dispatch) {
    dispatch(apiAction.apiRequest());
    return apiService.fetch(Converter.getPathParam(entity, id)).then((response) => {
      dispatch(apiAction.apiResponse());
      dispatch(commonActions.selectItem(entity, response.data));
    })
      .catch((error) => {
        errorHandler(dispatch, error.response, ActionType.FAILURE);
      });
  };
}

export function fetchBySlug(entity, slug) {
  return function (dispatch) {
    dispatch(apiAction.apiRequest());
    return apiService.fetch(Converter.getPathParam(entity, 'byslug', slug)).then((response) => {
      dispatch(apiAction.apiResponse());
      dispatch(commonActions.selectItem(entity, response.data));
    })
      .catch((error) => {
        errorHandler(dispatch, error.response, ActionType.FAILURE);
      });
  };
}

export function selectItem(entity, data) {
  return dispatch => dispatch(commonActions.selectItem(entity, data));
}

export function selectBySlug(entity, slug) {
  return function (dispatch) {
    dispatch(commonActions.selectItemSlug(entity, slug));
  }
}

export function storeItem(entity, data) {
  return function (dispatch) {
    dispatch(apiAction.apiRequest());
    return apiService.store(entity, data).then((response) => {
      dispatch(apiAction.apiResponse());
      notify.info(entity.charAt(0).toUpperCase() + entity.slice(1) + ' added successfully.');
      history.goBack();
    })
      .catch((error) => {
        errorHandler(dispatch, error.response, ActionType.FAILURE);
      });
  };
}

export function updateItem(entity, data, id) {
  return function (dispatch) {
    dispatch(apiAction.apiRequest());
    return apiService.update(entity, data, id).then((response) => {
      dispatch(apiAction.apiResponse());
      notify.info(entity.charAt(0).toUpperCase() + entity.slice(1) + ' updated successfully.');
      history.goBack();
    })
      .catch((error) => {
        errorHandler(dispatch, error.response, ActionType.FAILURE);
      });
  };
}

export function destroyItem(entity, id, data) {
  return function (dispatch) {
    dispatch(apiAction.apiRequest());
    return apiService.destroy(entity, id).then((response) => {
      dispatch(apiAction.apiResponse());
      notify.info(entity.charAt(0).toUpperCase() + entity.slice(1) + ' deleted successfully.');
      dispatch(fetchAll(entity, data));
    })
      .catch((error) => {
        errorHandler(dispatch, error.response, ActionType.FAILURE);
      });
  };
}

export function submitForm(entity, data, id) {
  return function (dispatch) {
    if (id) {
      dispatch(updateItem(entity, data, id));
    } else {
      dispatch(storeItem(entity, data));
    }
  }
}

export function subscribe(id) {
  return function (dispatch) {
    dispatch(apiAction.apiRequest());
    return apiService.store('subscription', {feed_id: id}).then((response) => {
      dispatch({
        type: ActionType.SUBSCRIBE,
        item: response.data.data
      });
    })
      .catch((error) => {
        errorHandler(dispatch, error.response, ActionType.FAILURE);
      });
  }
}

export function unsubscribe(id) {
  return {
    type: ActionType.UNSUBSCRIBE,
    item: id
  }
}

export function clearList(entity) {
  return {
    type: ActionType.CLEAR_LIST,
    entity: entity
  }
}

export function updateSelectedItem(entity, key, value) {
  return {
    type: ActionType.UPDATE_SELECTED_ITEM,
    entity: entity,
    key: key,
    value: value
  }
}

export function clearSelectedItem(entity) {
  return {
    type: ActionType.CLEAR_SELECTED_ITEM,
    entity: entity
  }
}

export function errorHandler(dispatch, error, type) {
  let errorMessage = (error.data.message) ? error.data.message : error.data;

  // NOT AUTHENTICATED ERROR
  if (error.status === 401) {
    errorMessage = message.NOT_AUTHORISED;
    type = ActionType.NOT_AUTHORISED;
  }

  dispatch({
    type,
    payload: errorMessage,
  });
}
