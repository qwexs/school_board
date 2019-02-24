import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import footer from './footer.reducer';
import sideMenu from "./sidemenu.reducer";

const rootReducer = (history, asyncReducers) => combineReducers({
    router: connectRouter(history),
    footer,
    sideMenu,
    ...asyncReducers
});

export default rootReducer;
