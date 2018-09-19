import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import { checkAuth } from './actions/authAction';
import history from './history';
import store from './store';
import App from './App';

import './assets/styles/admin.scss';

store.dispatch(checkAuth());

render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('app')
);
