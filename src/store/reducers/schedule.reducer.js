import produce from "immer";
import {combineActions, createAction, handleActions} from "redux-actions";
import {cancelChanges, setOpen} from "../actions/footer.actions";
import {sideMenuChangeItem} from "../actions";
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

export const scheduleEditTitle = createAction("SCHEDULE/EDIT_TITLE",
    (text) => ({text}));

export const scheduleEditContent = createAction("SCHEDULE/EDIT_CONTENT",
    (index, keys, text) => ({index, keys, text}));

export const editTitle = (text) => (dispatch) => {
    dispatch(scheduleEditTitle(text));
    dispatch(setOpen(true));
};

export const editContent = (...props) => (dispatch) => {
    dispatch(scheduleEditContent(...props));
    dispatch(setOpen(true));
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
    [scheduleEditContent, (state, action) => produce(state, draft => {
        const {index, keys, text} = action.payload;
        draft.selectedItem.days[index]["less"][Number(keys[0])]["text"] = text;
    })],
    [cancelChanges, state => produce(state, draft => {
        draft.list = state.defaultList;
        draft.selectedItem = state.defaultItem;
    })],
]), initialState);

export default schedule;
