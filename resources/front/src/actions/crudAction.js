import { NotificationManager as notify } from 'react-notifications';
import * as apiService from 'utils/apiService';
import * as Converter from 'utils/converter';

import * as ActionType from '../constants/actionType';
import * as message from '../constants/message';
import * as apiAction from './apiAction';
import history from '../utils/history';


/**
 * Actions that are dispatched from crudAction
 */
const commonActions = {
  list(entity, data) {
    return {
      type: ActionType.LIST,
      entity,
      data
    };
  },

  selectItem(entity, data) {
    return {
      type: ActionType.SELECT_ITEM,
      entity,
      data
    };
  },

  selectItemId(entity, data) {
    return {
      type: ActionType.SELECT_ITEM_ID,
      entity,
      data
    };
  },

  selectItemSlug(entity, data) {
    return {
      type: ActionType.SELECT_ITEM_SLUG,
      entity,
      data
    };
  },

  delete(entity, id) {
    return {
      type: ActionType.DELETE,
      entity,
      id
    };
  },

  notAuthorized() {
    return {
      type: ActionType.NOT_AUTHORIZED,
      payload: message.NOT_AUTHORIZED
    };
  },
};


/**
 * Error handler
 */
export function errorHandler(dispatch, response, type) {
  if (!response || !response.data) {
    notify.error(message.ERROR);
    // Do nothing
  } else if (response.status === 401) {
    // NOT AUTHENTICATED ERROR
    notify.error(message.NOT_AUTHORIZED);
    dispatch(commonActions.notAuthorized());
    history.push('/login');
  } else {
    dispatch({
      type,
      payload: (response.data.message) ? response.data.message : response.data,
    });
  }
}


/**
 * These are the actions every CRUD in the application uses.
 * Every time an action that requires the API is called, it first Dispatches an "apiRequest" action.
 * ApiService returns a promise which dispatches another action "apiResponse".
 * entity = 'Feed', 'Categories', ...
 */

export function fetchAll(entity) {
  return dispatch => {
    dispatch(apiAction.apiRequest());
    return apiService.fetch(entity).then((response) => {
      dispatch(apiAction.apiResponse());
      dispatch(commonActions.list(entity, response.data));
    })
      .catch((error) => {
        errorHandler(dispatch, error.response, ActionType.FAILURE);
      });
  };
}

export function fetchById(entity, id) {
  return dispatch => {
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
  return dispatch => {
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
  return dispatch => {
    dispatch(commonActions.selectItemSlug(entity, slug));
  };
}

export function storeItem(entity, data) {
  return dispatch => {
    dispatch(apiAction.apiRequest());
    return apiService.store(entity, data).then((response) => {
      dispatch(apiAction.apiResponse());
      notify.info(`${entity.charAt(0).toUpperCase() + entity.slice(1)} added successfully.`);
      history.goBack();
    })
      .catch((error) => {
        errorHandler(dispatch, error.response, ActionType.FAILURE);
      });
  };
}

export function updateItem(entity, data, id) {
  return dispatch => {
    dispatch(apiAction.apiRequest());
    return apiService.update(entity, data, id).then((response) => {
      dispatch(apiAction.apiResponse());
      notify.info(`${entity.charAt(0).toUpperCase() + entity.slice(1)} updated successfully.`);
      history.goBack();
    })
      .catch((error) => {
        errorHandler(dispatch, error.response, ActionType.FAILURE);
      });
  };
}

export function destroyItem(entity, id, data) {
  return dispatch => {
    dispatch(apiAction.apiRequest());
    return apiService.destroy(entity, id).then((response) => {
      dispatch(apiAction.apiResponse());
      notify.info(`${entity.charAt(0).toUpperCase() + entity.slice(1)} deleted successfully.`);
      dispatch(fetchAll(entity));
    })
      .catch((error) => {
        errorHandler(dispatch, error.response, ActionType.FAILURE);
      });
  };
}

export function submitForm(entity, data, id) {
  return dispatch => {
    if (id) {
      dispatch(updateItem(entity, data, id));
    } else {
      dispatch(storeItem(entity, data));
    }
  };
}

export function subscribe(id) {
  return dispatch => {
    dispatch(apiAction.apiRequest('Subscribe'));
    return apiService.store('subscription', { feed_id: id }).then((response) => {
      dispatch(apiAction.apiResponse(response.data));
      dispatch({
        type: ActionType.SUBSCRIBE,
        item: response.data
      });
    })
      .catch((error) => {
        errorHandler(dispatch, error.response, ActionType.FAILURE);
      });
  };
}

export function unsubscribe(id) {
  return dispatch => {
    dispatch(apiAction.apiRequest('Unsubscribe'));
    return apiService.destroy('subscription', id).then((response) => {
      dispatch(apiAction.apiResponse());
      dispatch(commonActions.delete('subscription', id));
    })
      .catch((error) => {
        errorHandler(dispatch, error.response, ActionType.FAILURE);
      });
  };
}

export function clearList(entity) {
  return {
    type: ActionType.CLEAR_LIST,
    entity
  };
}

export function updateSelectedItem(entity, key, value) {
  return {
    type: ActionType.UPDATE_SELECTED_ITEM,
    entity,
    key,
    value
  };
}

export function clearSelectedItem(entity) {
  return {
    type: ActionType.CLEAR_SELECTED_ITEM,
    entity
  };
}

export function fetchFeedItems(slug) {
  return dispatch => {
    dispatch(clearList('item'));
    dispatch(apiAction.apiRequest());
    return apiService.fetch(Converter.getPathParam('item', 'byslug', slug)).then((response) => {
      dispatch(apiAction.apiResponse());
      dispatch(commonActions.list('item', response.data));
    })
      .catch((error) => {
        errorHandler(dispatch, error.response, ActionType.FAILURE);
      });
  };
}
