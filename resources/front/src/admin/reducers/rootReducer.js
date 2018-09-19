import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authReducer from './authReducer';
import crudReducer from './crudReducer';
import apiReducer from './apiReducer';

const rootReducer = combineReducers({
  crud: crudReducer,
  api: apiReducer,
  auth: authReducer,
  routing: routerReducer
});

export default rootReducer;
