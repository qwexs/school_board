import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import footer from './footer.reducer';
import schedule from './schedule.reducer';
import sideMenu from "./sidemenu.reducer";
import news from "./news.reducer";

const rootReducer = history => combineReducers({
    router: connectRouter(history),
    footer,
    sideMenu,
    news,
    schedule
});

export default rootReducer;
