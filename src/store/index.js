import {createBrowserHistory} from "history";
import {applyMiddleware, createStore} from "redux";
import rootReducer from "./reducers/root.reducer";
import thunk from "redux-thunk";
import api from "./api";
import {routerMiddleware} from "connected-react-router";
import {createMiddleware} from 'redux-listeners';

export const listenMiddleware = createMiddleware();

const initializeStore = (history) => {
    const store = createStore(
        rootReducer(history),
        applyMiddleware(thunk.withExtraArgument(api), routerMiddleware(history), listenMiddleware)
    );

    store.asyncReducers = {};
    store.injectReducer = (key, reducer) => {
        store.asyncReducers = {[key]: reducer};
        store.replaceReducer(rootReducer(history, store.asyncReducers));
    };
    return store;
};

export const history = createBrowserHistory();
const store = initializeStore(history);

export default store;



