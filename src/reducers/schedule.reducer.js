import produce from "immer";
import {combineActions, handleActions} from "redux-actions";
import {cancelChanges} from "../actions/footer.actions";
import {sideMenuChangeItem} from "../actions/index";
import {
    scheduleEditContent,
    scheduleEditTitle
} from "../actions/schedule.actions";
import {isFetching, receiveItem, receiveList} from "../actions";

const initialState = {
    title: "",
    list: [],
    defaultList: [],
    selectedItem: null,
    defaultItem: null,
    isLoadingList: false,
    isLoadingItem: false,
};

const schedule = handleActions(new Map([
    [combineActions(
        isFetching,
        receiveList,
        receiveItem,
        sideMenuChangeItem
    ), (state, action) => ({...state, ...action.payload})],
    [scheduleEditTitle, (state, action) => produce(state, draft => {
        draft.list.find(v => v._id === draft.selectedItem._id).name = action.payload.text;
        draft.selectedItem.name = action.payload.text;
    })],
    [cancelChanges, state => produce(state, draft => {
        draft.list = state.defaultList;
        draft.selectedItem = state.defaultItem;
    })],
    [scheduleEditContent, (state, action) => produce(state, draft => {
        const {index, keys, text} = action.payload;
        draft.selectedItem.days[index]["less"][Number(keys[0])]["text"] = text;
    })],
]), initialState);

export default schedule;
