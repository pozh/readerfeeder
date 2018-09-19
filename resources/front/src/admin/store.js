import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers/rootReducer';


/**
 * Redux store which holds the app state.
 */
const store = createStore(rootReducer, compose(
  applyMiddleware(thunkMiddleware, logger),

  // For working redux dev tools in chrome (https://github.com/zalmoxisus/redux-devtools-extension)
  window.devToolsExtension ? window.devToolsExtension() : f => f
));
export default store;
