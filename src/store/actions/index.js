import {createAction} from "redux-actions";
import {cancelChanges, saveChanges, setOpen} from "./footer.actions";
import routes from "../routes";

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
    const {selectedItem} = factoryCurrentState(getState());
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
    const {list, selectedItem} = factoryCurrentState(getState());
    if (!list || !list.length)
        return;
    const newItem = selectedItem && list.find(v => v["_id"] === selectedItem._id) || list[0];
    try {
        dispatch(setOpen(false));
        dispatch(isFetching(false, true));
        dispatch(receiveItem(await api.getById(newItem._id)));
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
    const newItem = await api.create(name);
    dispatch(await refreshAll());
    dispatch(sideMenuChangeItem(newItem));
};

export const removeItem = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {selectedItem} = factoryCurrentState(getState());
    try {
        await api.removeById(selectedItem._id);
        dispatch(await refreshAll());
    }
    catch (err) {
        throw err;
    }
};

function factoryCurrentState(reducers) {
    const {router} = reducers;
    const {pathname} = router.location;
    const name = routes.find(v => v.path === pathname).name;
    return reducers[name];
}
