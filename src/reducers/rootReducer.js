import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// Import custom components
// import authReducer from './authReducer';
import crudReducer from './crudReducer';
import apiReducer from './apiReducer';
import flashMessageReducer from './flashMessageReducer';
// import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  crud: crudReducer,
  api: apiReducer,
  flash: flashMessageReducer,
  // auth: authReducer,
  // form: formReducer,  // ← redux-form
  routing: routerReducer
});

export default rootReducer;
