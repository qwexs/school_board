import produce from "immer";
import {combineActions, createAction, handleActions} from "redux-actions";
import {cancelChanges, saveChanges, setOpen} from "../actions/footer.actions";
import {sideMenuChangeItem} from "../actions";
import {isFetching, receiveItem, receiveList} from "../actions";

const initialState = {
    title: "",
    list: [],
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

export const changeItem = (item) => async (dispatch, getState) => {
    if (getState().footer.isOpen)
        dispatch(cancelChanges());
    dispatch(sideMenuChangeItem(item));
    dispatch(await refreshItem());
};

export const saveItem = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {selectedItem} = getState().schedule;
    try {
        dispatch(saveChanges());
        dispatch(isFetching(true));
        await api.setItem(selectedItem._id, selectedItem);
        dispatch(await refreshAll());
    } catch (err) {
        throw err;
    }
};

export const refreshAll = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    try {
        dispatch(isFetching(true));
        dispatch(receiveList(await api.getList()));
        dispatch(await refreshItem());
    }
    catch (err) {
        throw err;
    }
};

export const refreshItem = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {list, selectedItem} = getState().schedule;
    if (!list || !list.length)
        return;
    const newItem = (selectedItem && list.find(v => v["_id"] === selectedItem._id)) || list[0];
    try {
        dispatch(setOpen(false));
        dispatch(isFetching(false, true));
        dispatch(receiveItem(await api.getItem(newItem._id)));
    }
    catch (err) {
        throw err;
    } finally {
        dispatch(isFetching());
    }
};

export const addItem = (name) => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    dispatch(isFetching(true));
    const newItem = await api.createItem({name});
    dispatch(await refreshAll());
    dispatch(sideMenuChangeItem(newItem));
};

export const removeItem = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {selectedItem} = getState().schedule;
    try {
        await api.removeItem(selectedItem._id);
        dispatch(await refreshAll());
    }
    catch (err) {
        throw err;
    }
};

const schedule = handleActions(new Map([
    [combineActions(
        isFetching,
        receiveList,
        receiveItem,
        sideMenuChangeItem
    ), (state, action) => ({...state, ...action.payload})],
    [scheduleEditTitle, (state, action) => produce(state, draft => {
        draft.selectedItem.name = action.payload.text;
    })],
    [scheduleEditContent, (state, action) => produce(state, draft => {
        const {index, keys, text} = action.payload;
        draft.selectedItem.days[index]["less"][Number(keys[0])]["text"] = text;
    })],
    [cancelChanges, state => produce(state, draft => {
        //FIXME: take away persist state from localstorage
        draft.selectedItem = state.defaultItem;
    })],
]), initialState);

export default schedule;
