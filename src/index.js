import React from "react";
import ReactDOM from 'react-dom';
import App from "./App";
import "./index.css";
import { Provider } from 'react-redux';
import store, {history} from './store/configureStore';
import { ConnectedRouter } from 'connected-react-router'

const rootElement = document.getElementById("root");

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    rootElement
);
