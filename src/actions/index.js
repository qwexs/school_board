import {createAction} from "redux-actions";
import {cancelChanges, saveChanges, setOpen} from "./footer.actions";

// export const apiRequest = createAction("API_REQUEST");
// export const apiSuccess = createAction("API_SUCCESS");
// export const apiFailure = createAction("API_FAILURE");

export const isFetching = createAction("IS_FETCHING",
    (isLoadingList = false, isLoadingItem = false) => ({isLoadingList, isLoadingItem}));

export const receiveList = createAction("RECEIVE_LIST",
    (list = null) => ({list, defaultList: list}));

export const receiveItem = createAction("RECEIVE_ITEM",
    (selectedItem = null) => ({selectedItem, defaultItem: selectedItem}));

export const sideMenuChangeItem = createAction("SIDE_MENU/CHANGE_ITEM",
    (selectedItem = null) => ({selectedItem}));

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
        dispatch(isFetching(false, true));
        dispatch(receiveItem(await api.setById(selectedItem._id, selectedItem)));
    } catch (err) {
        throw err;
    } finally {
        dispatch(isFetching());
    }
};

export const refreshAll = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    try {
        dispatch(isFetching(true));
        dispatch(receiveList(await api.getAll()));
        dispatch(await refreshItem());
    }
    catch (err) {
        throw err;
    }
};

export const refreshItem = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {list, selectedItem} = getState().schedule;
    const listIds = Array.from(list, (v) => v["_id"]);
    const selectedId = selectedItem ? selectedItem._id : list[0];
    const newIndex = listIds.indexOf(selectedId);
    try {
        dispatch(setOpen(false));
        dispatch(isFetching(false, true));
        dispatch(receiveItem(await api.getById(listIds[newIndex !== -1 ? newIndex : 0])));
    }
    catch (err) {
        throw err;
    } finally {
        dispatch(isFetching());
    }
};

export const addItem = (name) => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const newItem = await api.create(name);
    dispatch(await refreshAll());
    dispatch(sideMenuChangeItem(newItem));
};

export const removeItem = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {selectedItem} = getState().schedule;
    try {
        await api.removeById(selectedItem._id);
        dispatch(await refreshAll());
    }
    catch (err) {
        throw err;
    }
};
