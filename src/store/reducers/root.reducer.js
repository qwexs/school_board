import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import footer from './footer.reducer';
import sideMenu from "./sidemenu.reducer";
import {createAction} from "redux-actions";

export const receiveList = createAction("RECEIVE_LIST",
    (list = null) => ({list, defaultList: list}));

export const receiveItem = createAction("RECEIVE_ITEM",
    (selectedItem = null) => ({selectedItem, defaultItem: selectedItem}));

export const sideMenuChangeItem = createAction("SIDE_MENU/CHANGE_ITEM",
    (selectedItem = null) => ({selectedItem}));

export const isFetching = createAction("IS_FETCHING",
    (isLoadingList = false, isLoadingItem = false) => ({isLoadingList, isLoadingItem}));

export const setOpenDialog = createAction("OPEN_DIALOG",
    (isDialogOpen, contentDialog = null) => ({isDialogOpen, contentDialog}));

const rootReducer = (history, asyncReducers) => combineReducers({
    router: connectRouter(history),
    footer,
    sideMenu,
    ...asyncReducers
});

export default rootReducer;
