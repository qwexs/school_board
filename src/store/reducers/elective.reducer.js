import {isFetching, receiveItem, receiveList} from "./root.reducer";
import {combineActions, createAction, handleActions} from "redux-actions";
import produce from "immer";
import {setCancelFooter, setOpen} from "./footer.reducer";
import {listenMiddleware} from "../index";
import store from "../index";
import {reorder} from "../../utils/reorder";
import {sideMenuChangeItem} from "./sidemenu.reducer";

const initialState = {
    list: [],
    selectedItem: null,
    isLoadingList: false,
    isLoadingItem: false,
    titleGroupData: null,
};

/**
 * listeners
 */
listenMiddleware.addListener(sideMenuChangeItem.toString(), (dispatch, action) => {
    return store.getState().hasOwnProperty('elective')
        && dispatch(refreshItem(action.payload.selectedItem));
});

/**
 * action creators
 */
const setTitleGroup = createAction("ELECTIVE/SET_TITLE_GROUP",
    (name, teacher, place, icon) => ({name, teacher, place, icon}
));

const setChangeLessItem = createAction("ELECTIVE/SET_CHANGE_LESS_ITEM",
    (lessItem, dayItem) => ({lessItem, dayItem}));

const setAddLessItem = createAction("ELECTIVE/SET_ADD_LESS_ITEM",
    (dayItem) => ({dayItem}));

const setRemoveLessItem = createAction("ELECTIVE/SET_REMOVE_LESS_ITEM",
    (lessItem, dayItem) => ({lessItem, dayItem}));

const setReorderLessList = createAction("ELECTIVE/REORDER_LESS_LIST",
    (item, result) => ({item, result}));

/**
 * action dispatcher
 */
export const changeTitleGroup = (item) => (dispatch) => {
    const {name, teacher, place, icon} = item;
    dispatch(setTitleGroup(name, teacher, place, icon));
    dispatch(setOpen(true));
};

export const addLessItem = (dayItem) => dispatch => {
    if (!dayItem.less.some(item => item.isNew)) {
        dispatch(setAddLessItem(dayItem));
    }
};

export const changeLessItem = (lessItem, dayItem) => (dispatch) => {
    dispatch(setChangeLessItem(lessItem, dayItem));
    dispatch(setOpen(true));
};

export const removeLessItem = (lessItem, dayItem) => dispatch => {
    dispatch(setRemoveLessItem(lessItem, dayItem));
    dispatch(setOpen(true));
};

export const reorderLessList = (item, result) => (dispatch) => {
    dispatch(setReorderLessList(item, result));
    dispatch(setOpen(true));
};

/**
 * action service
 */
export const addElective = (data) => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    try {
        dispatch(isFetching(true));
        dispatch(receiveItem(await api.createItem(getFormSendData(data))));
        dispatch(refreshAll());
    } catch (err) {
        throw err;
    }
};

export const removeElective = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {selectedItem} = getState().elective;
    try {
        await api.removeItem(selectedItem._id);
        await dispatch(refreshAll());
    } catch (err) {
        throw err;
    }
};

export const refreshAll = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    try {
        dispatch(isFetching(true));
        dispatch(receiveList(await api.getList()));
        dispatch(refreshItem());
    } catch (err) {
        throw err;
    }
};

export const refreshItem = (item = null) => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {list, selectedItem} = getState().elective;
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

export const saveItem = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {selectedItem, list} = getState().elective;
    try {
        dispatch(setOpen(false));
        dispatch(isFetching(false, true));
        await dispatch(receiveItem(await api.setItem(selectedItem._id, getFormSendData(selectedItem))));
        dispatch(receiveList(list));
    } catch (err) {
        throw err;
    } finally {
        dispatch(isFetching());
    }
};

function getFormSendData(data) {
    const {name, teacher, place, icon, items} = data;
    const formSendData = new FormData();
    formSendData.append('name', name || "");
    formSendData.append('teacher', teacher || "");
    formSendData.append('place', place || "");
    formSendData.append('items', JSON.stringify(items));
    formSendData.append('icon', icon || undefined);
    return formSendData;
}

/**
 * action reducer
 */
const elective = handleActions(new Map([
    [combineActions(
        isFetching,
        receiveList,
        receiveItem,
    ), (state, action) => ({...state, ...action.payload})],
    [setTitleGroup, (state, action) => produce(state, draft => {
        const newItem = {...state.selectedItem, ...action.payload};
        const findIndex = state.list.findIndex(item => item._id === state.selectedItem._id);
        draft.selectedItem = newItem;
        if (findIndex !== -1) {
            draft.list[findIndex] = {...state.list[findIndex], ...action.payload};
        }
    })],
    [setReorderLessList, (state, action) => produce(state, draft => {
        const {item, result} = action.payload;
        const findIndex = state.selectedItem.items.findIndex(findItem => findItem._id === item._id);
        if (findIndex !== -1) {
            draft.selectedItem.items[findIndex].less = reorder(
                state.selectedItem.items[findIndex].less,
                result.source.index,
                result.destination.index
            );
        }
    })],
    [setAddLessItem, (state, action) => produce(state, draft => {
        const {dayItem} = action.payload;
        const findIndex = state.selectedItem.items.findIndex(findItem => findItem._id === dayItem._id);
        draft.selectedItem.items[findIndex].less.unshift({isNew: true});
    })],
    [setChangeLessItem, (state, action) => produce(state, draft => {
        const {lessItem, dayItem} = action.payload;
        const findIndex = state.selectedItem.items.findIndex(findItem => findItem._id === dayItem._id);
        draft.selectedItem.items[findIndex].less[lessItem.index] = lessItem;
    })],
    [setRemoveLessItem, (state, action) => produce(state, draft => {
        const {lessItem, dayItem} = action.payload;
        const findIndex = state.selectedItem.items.findIndex(findItem => findItem._id === dayItem._id);
        draft.selectedItem.items[findIndex].less.splice(lessItem.index, 1);

    })],
    [setCancelFooter, state => produce(state, draft => {
        //FIXME: take away persist state from localstorage
        draft.selectedItem = state.defaultItem;
        draft.list = state.defaultList;
    })],
]), initialState);

export default elective;
