import {combineActions, handleActions} from "redux-actions";
import {receiveItem, receiveList, sideMenuChangeItem} from "../actions";

const initialState = {
    list: [],
    selectedItem: null
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
