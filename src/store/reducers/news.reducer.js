import {combineActions, createAction, handleActions} from "redux-actions";
import {setOpenDialog, isFetching, receiveItem, receiveList} from "./root.reducer";

const initialState = {
    isDialogOpen: false,
    isAlertOpen: false,
    selectedItem: null,
    list: [],
    isLoadingList: false,
};

export const isAlertOpen = createAction("NEWS/OPEN_ALERT",
    (isAlertOpen) => ({isAlertOpen}));

export const showDialog = (isOpen = false, item = null) => dispatch => {
    dispatch(receiveItem(item));
    dispatch(setOpenDialog(isOpen));
};

export const showAlertRemove = (isOpen = false, item = null) => dispatch => {
    dispatch(receiveItem(item));
    dispatch(isAlertOpen(isOpen));
};

export const saveItem = (item) => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {title, text, image} = item;
    const formData = new FormData();
    formData.append('title', title || "");
    formData.append('text', text || "");
    if (image instanceof File) {
        formData.append('image', image);
    }

    try {
        dispatch(showDialog(false));
        dispatch(isFetching(true));
        if (item._id) {
            await api.setItem(item._id, formData);
        } else {
            await api.createItem(formData);
        }
        dispatch(receiveList(await api.getList()));
    }
    catch (err) {
        throw err;
    } finally {
        dispatch(isFetching());
    }
};

export const refreshAll = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    if (!api)
        return;
    try {
        dispatch(isFetching(true));
        dispatch(receiveList(await api.getList()));
    }
    catch (err) {
        throw err;
    } finally {
        dispatch(isFetching());
    }
};

export const removeItem = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    try {
        dispatch(isFetching(true));
        await api.removeItem(getState().news.selectedItem._id);
        dispatch(receiveList(await api.getList()));
    }
    catch (err) {
        throw err;
    } finally {
        dispatch(isFetching());
    }
};

const news = handleActions(new Map([
    [combineActions(
        isFetching,
        receiveList,
        receiveItem,
        setOpenDialog,
        isAlertOpen
    ), (state, action) => ({...state, ...action.payload})],
]), initialState);

export default news;
