import _ from 'lodash';
import * as ActionType from 'constants/actionType';
import { pluralize } from 'utils/converter';


const initialState = {
  items: {
    feeds: [],
    items: [],
    categories: [],
    subscriptions: [],
  },
  // For stuff editing purposes inside admin and user cp interfaces
  selectedItem: {
    feed: {},
    category: {},
  },
};


/**
 * A reducer takes two arguments, the current state and an action.
 */
export default function (state = initialState, action) {
  let newState;

  switch (action.type) {
    case ActionType.LIST:
      newState = _.cloneDeep(state);
      newState.items[pluralize(action.entity)] = _.cloneDeep(action.data.data);
      return newState;

    case ActionType.SELECT_ITEM:
      newState = _.cloneDeep(state);
      newState.selectedItem[action.entity] = action.data.data;
      return newState;

    case ActionType.SELECT_ITEM_SLUG:
      newState = _.cloneDeep(state);
      const items = newState.items[pluralize(action.entity)];
      const item = _.find(items, { slug: action.data });
      newState.selectedItem[action.entity] = item;
      return newState;

    case ActionType.UPDATE_SELECTED_ITEM:
      newState = _.cloneDeep(state);
      newState.selectedItem[action.entity][action.key] = action.value;
      return newState;

    case ActionType.DELETE:
      newState = _.cloneDeep(state);
      const data = newState.items[pluralize(action.entity)];
      let index = _.indexOf(data, _.find(data, { id: action.id }));
      data.splice(index, 1);
      return newState;

    case ActionType.SUBSCRIBE:
      newState = _.cloneDeep(state);
      const subs = newState.items.subscriptions;
      index = _.indexOf(subs, _.find(subs, { feed_id: action.item.feed_id }));
      if (index < 0) newState.items.subscriptions.push(action.item);
      return newState;

    case ActionType.CLEAR_LIST:
      newState = _.cloneDeep(state);
      newState.items[pluralize(action.entity)] = {};
      return newState;

    case ActionType.CLEAR_SELECTED_ITEM:
      newState = _.cloneDeep(state);
      newState.selectedItem[action.entity] = {};
      return newState;

    case ActionType.NOT_AUTHORIZED:
      newState = _.cloneDeep(state);
      newState.items.subscriptions = [];
      return newState;

    default:
      return state;
  }
}
