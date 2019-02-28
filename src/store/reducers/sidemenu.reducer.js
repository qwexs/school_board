import {combineActions, createAction, handleActions} from "redux-actions";
import {receiveItem, receiveList} from "./root.reducer";
import {setCancelFooter} from "./footer.reducer";

const initialState = {
    list: [],
    selectedItem: null
};

export const sideMenuChangeItem = createAction("SIDE_MENU/CHANGE_ITEM",
    (selectedItem = null) => ({selectedItem}));

export const changeItem = (item) => (dispatch, getState) => {
    if (getState().footer.isOpen)
        dispatch(setCancelFooter());
    dispatch(sideMenuChangeItem(item));
};

const sideMenu = handleActions(new Map([
        [combineActions(
            receiveList,
            receiveItem,
            sideMenuChangeItem,
        ), (state, action) => ({...state, ...action.payload})],
    ]),
    initialState);

export default sideMenu;
