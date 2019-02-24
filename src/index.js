import React from "react";
import ReactDOM from 'react-dom';
import App from "./App";
import "./index.css";
import {Provider} from 'react-redux';
import {createBrowserHistory} from "history";
import rootReducer from "./store/reducers";
import initializeStore from "./store/initializeStore";
import {ConnectedRouter} from "connected-react-router";

const history = createBrowserHistory();
export let store = initializeStore(history);
const rootElement = document.getElementById("root");
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App/>
        </ConnectedRouter>
    </Provider>,
    rootElement
);

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept("./store/reducers", () => {
        store.replaceReducer(rootReducer(history, store.asyncReducers));
    });
}
