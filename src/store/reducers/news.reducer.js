import {combineActions, createAction, handleActions} from "redux-actions";
import {isFetching, receiveItem, receiveList, sideMenuChangeItem} from "../actions";
import produce from "immer";
import {cancelChanges} from "../actions/footer.actions";
import {scheduleEditContent, scheduleEditTitle} from "./schedule.reducer";

export const newsEditItem = createAction("NEWS/EDIT_CONTENT",
    (index, keys, text) => ({index, keys, text}));

const news = handleActions(new Map([
    [combineActions(
        isFetching,
        receiveList,
    ), (state, action) => ({...state, ...action.payload})],
    [newsEditItem, (state, action) => produce(state, draft => {
        const {index, keys, text} = action.payload;
        draft.selectedItem.days[index]["less"][Number(keys[0])]["text"] = text;
    })],
    [cancelChanges, state => produce(state, draft => {
        draft.list = state.defaultList;
        draft.selectedItem = state.defaultItem;
    })],
]), initialState);

export default news;
