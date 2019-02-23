import {createAction} from "redux-actions";

export const isFetching = createAction("IS_FETCHING",
    (isLoadingList = false, isLoadingItem = false) => ({isLoadingList, isLoadingItem}));

export const receiveList = createAction("RECEIVE_LIST",
    (list = null) => ({list}));

export const receiveItem = createAction("RECEIVE_ITEM",
    (selectedItem = null) => ({selectedItem, defaultItem: selectedItem}));

export const sideMenuChangeItem = createAction("SIDE_MENU/CHANGE_ITEM",
    (selectedItem = null) => ({selectedItem}));
