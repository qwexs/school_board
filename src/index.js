import React from "react";
import ReactDOM from 'react-dom';
import App from "./App";
import "./index.css";
import {Provider} from 'react-redux';
import rootReducer from "./store/reducers/root.reducer";
import {ConnectedRouter} from "connected-react-router";
import store, {history} from "./store";

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
    module.hot.accept("./store/reducers/root.reducer", () => {
        store.replaceReducer(rootReducer(history, store.asyncReducers));
    });
}
