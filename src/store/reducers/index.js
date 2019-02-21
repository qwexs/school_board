import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import footer from './footer.reducer';
import schedule from './schedule.reducer';

const rootReducer = history => combineReducers({
    router: connectRouter(history),
    footer,
    schedule
});

export default rootReducer;
