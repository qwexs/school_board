import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import api from './api';
import {routerMiddleware} from 'connected-react-router';

const initializeStore = (history) => {
    const store = createStore(
        rootReducer(history),
        applyMiddleware(thunk.withExtraArgument(api), routerMiddleware(history))
    );

    store.asyncReducers = {};
    store.injectReducer = (key, reducer) => {
        store.asyncReducers = {[key]: reducer};
        store.replaceReducer(rootReducer(history, store.asyncReducers));
    };
    return store;
};

export default initializeStore;
