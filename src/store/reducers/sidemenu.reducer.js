import {combineActions, handleActions} from "redux-actions";
import {receiveItem, receiveList, sideMenuChangeItem} from "./root.reducer";
import {setCancelFooter} from "./footer.reducer";

const initialState = {
    list: [],
    selectedItem: null
};

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
