import produce from "immer";
import {combineActions, createAction, handleActions} from "redux-actions";
import {setCancelFooter, setOpen} from "./footer.reducer";
import {changeItem, isFetching, receiveItem, receiveList} from "./root.reducer";

const initialState = {
    title: "",
    list: [],
    selectedItem: null,
    defaultItem: null,
    defaultList: null,
    isLoadingList: false,
    isLoadingItem: false,
};

/**
 * action creators
 */
export const scheduleEditTitle = createAction("SCHEDULE/EDIT_TITLE",
    (title) => ({title}));

export const scheduleEditContent = createAction("SCHEDULE/EDIT_CONTENT",
    (index, keys, text) => ({index, keys, text}));

/**
 * action dispatcher
 */
export const changeItemSideMenu = (item) => (dispatch, getState) => {
    const {isOpen} = getState().footer;
    isOpen &&
    dispatch(setCancelFooter());
    dispatch(changeItem(item));
};

export const editTitle = (text) => (dispatch) => {
    dispatch(scheduleEditTitle(text));
    dispatch(setOpen(true));
};

export const editContent = (...data) => (dispatch) => {
    dispatch(scheduleEditContent(...data));
    dispatch(setOpen(true));
};

export const saveItem = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {selectedItem} = getState().schedule;
    try {
        dispatch(setOpen(false));
        dispatch(isFetching(false, true));
        dispatch(receiveItem(await api.setItem(selectedItem._id, selectedItem)));
    } catch (err) {
        throw err;
    }
    finally {
        dispatch(isFetching());
    }
};

export const refreshAll = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {selectedItem} = getState().schedule;
    if (!api)
        return;
    try {
        dispatch(isFetching(true));
        const list = await api.getList();
        const newItem = (selectedItem && list.find(v => v["_id"] === selectedItem._id)) || list[0];
        dispatch(receiveList(list));
        dispatch(receiveItem(newItem));
    } catch (err) {
        throw err;
    } finally {
        dispatch(isFetching());
    }
};

export const refreshItem = (item = null) => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    if (!api)
        return;
    const {list, selectedItem} = getState().schedule;
    const newItem = item || (selectedItem && list.find(v => v["_id"] === selectedItem._id)) || list[0];
    try {
        dispatch(setOpen(false));
        dispatch(isFetching(false, true));
        dispatch(receiveItem(await api.getItem(newItem._id)));
    } catch (err) {
        throw err;
    } finally {
        dispatch(isFetching());
    }
};

export const addItem = (name) => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    try {
        dispatch(isFetching(true));
        dispatch(receiveItem(await api.createItem({name})));
        dispatch(refreshAll());
    } catch (err) {
        throw err;
    }
};

export const removeItem = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {selectedItem} = getState().schedule;
    try {
        await api.removeItem(selectedItem._id);
        await dispatch(refreshAll());
    } catch (err) {
        throw err;
    }
};

/**
 * action reducer
 */
const schedule = handleActions(new Map([
    [combineActions(
        isFetching,
        receiveList,
        changeItem,
    ), (state, action) => ({...state, ...action.payload})],
    [receiveItem, (state, action) => produce(state, draft => {
        const {selectedItem} = action.payload;
        const findIndex = state.list.findIndex(item => item._id === selectedItem._id);
        if (findIndex !== -1) {
            Object.assign(draft.list[findIndex], selectedItem);
        } else {
            draft.list.push(selectedItem);
        }
        draft.selectedItem = selectedItem;
        draft.defaultItem = selectedItem;
        draft.defaultList = draft.list;
    })],
    [scheduleEditTitle, (state, action) => produce(state, draft => {
        draft.selectedItem.name = action.payload.title;
        const findIndex = state.list.findIndex(item => item._id === state.selectedItem._id);
        if (findIndex !== -1)
            draft.list[findIndex].name = action.payload.title;
    })],
    [scheduleEditContent, (state, action) => produce(state, draft => {
        const {index, keys, text} = action.payload;
        draft.selectedItem.days[index]["less"][Number(keys[0])]["text"] = text;
    })],
    [setCancelFooter, (state, action) => produce(state, draft => {
        //FIXME: use persist state from localstorage
        draft.selectedItem = state.defaultItem;
        draft.list = state.defaultList;
        draft.isOpen = action.payload.isOpen;
    })],
]), initialState);

export default schedule;
