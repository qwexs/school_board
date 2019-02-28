import produce from "immer";
import {combineActions, createAction, handleActions} from "redux-actions";
import {setCancelFooter, setOpen} from "./footer.reducer";
import {isFetching, receiveItem, receiveList} from "./root.reducer";
import {listenMiddleware} from "../../store";
import store from "../index";
import {sideMenuChangeItem} from "./sidemenu.reducer";

const initialState = {
    title: "",
    list: [],
    selectedItem: null,
    defaultItem: null,
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
 * action listeners
 */
listenMiddleware.addListener(sideMenuChangeItem.toString(), (dispatch, action) => {
    if (!store.getState().hasOwnProperty('schedule'))
        return null;
    return dispatch(refreshItem(action.payload.selectedItem));
});

/**
 * action dispatcher
 */
export const editTitle = (text) => (dispatch) => {
    dispatch(scheduleEditTitle(text));
    dispatch(setOpen(true));
};

export const editContent = (...data) => (dispatch) => {
    dispatch(scheduleEditContent(...data));
    dispatch(setOpen(true));
};

/**
 * action service
 */
export const saveItem = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {selectedItem} = getState().schedule;
    try {
        dispatch(setOpen(false));
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
    } catch (err) {
        throw err;
    }
};

export const refreshItem = (item = null) => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {list, selectedItem} = getState().schedule;
    if (!list || !list.length)
        return;
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
        receiveItem,
    ), (state, action) => ({...state, ...action.payload})],
    [scheduleEditTitle, (state, action) => produce(state, draft => {
        draft.selectedItem.name = action.payload.title;
    })],
    [scheduleEditContent, (state, action) => produce(state, draft => {
        const {index, keys, text} = action.payload;
        draft.selectedItem.days[index]["less"][Number(keys[0])]["text"] = text;
    })],
    [setCancelFooter, state => produce(state, draft => {
        //FIXME: take away persist state from localstorage
        draft.selectedItem = state.defaultItem;
    })],
]), initialState);

export default schedule;
