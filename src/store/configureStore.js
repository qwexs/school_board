import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import api from './api';
import {routerMiddleware} from 'connected-react-router';
import {createBrowserHistory} from 'history';

export const history = createBrowserHistory();

const store = createStore(
    rootReducer(history),
    applyMiddleware(thunk.withExtraArgument(api), routerMiddleware(history))
);

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept("./reducers", () => {
        store.replaceReducer(rootReducer(history));
    });
}

export default store;
