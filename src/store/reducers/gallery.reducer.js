import {combineActions, createAction, handleActions} from "redux-actions";
import {changeItem, isFetching, receiveItem, receiveList} from "./root.reducer";
import {setCancelFooter, setOpen} from "./footer.reducer";
import {produce} from "immer";
import {ID} from "../../utils/ID";

const initialState = {
    list: [],
    selectedItem: null,
    isLoadingList: false,
    isLoadingItem: false,
    slideShow: false,
    isToaster: false,
};

export const setSelectAll = createAction("GALLERY/SELECT_ALL");
export const setUnSelectAll = createAction("GALLERY/UN_SELECT_ALL");
const setSelectPhoto = createAction("GALLERY/SELECT_PHOTO");

export const addAlbum = (data) => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const formData = new FormData();
    const {name, files} = data;
    console.log(name, files);

    try {
        dispatch(isFetching(false, true));
        formData.append('id', ID());
        formData.append('name', name);
        files.forEach((file) =>
            formData.append('photos', file));
        dispatch(receiveItem(await api.createItem(formData,
            {headers: {'Content-Type': 'multipart/form-data'}, timeout: 7000000})));
        return await dispatch(await refreshAll());
    } catch (e) {
        throw e;
    } finally {
        dispatch(isFetching(false));
    }
};

export const removeAlbum = (item) => async (dispatch, getState, getAPI) => {
    const api = getAPI();

    try {
        dispatch(isFetching(false, true));
        await api.removeItem(item._id);
        dispatch(refreshAll());
    } catch (e) {
        throw e;
    }

};

export const changeItemSideMenu = (item) => (dispatch, getState) => {
    const {isOpen} = getState().footer;
    if (isOpen)
        dispatch(setCancelFooter());
    dispatch(changeItem(item));
};

export const selectPhotos = (index) => (dispatch, getState) => {
    dispatch(setSelectPhoto(index));
    const {selectedItem} = getState().gallery;
    dispatch(setOpen(selectedItem.photos.some(item => item.selected)));
};

export const unSelectAll = () => (dispatch) => {
    dispatch(setOpen(false));
    dispatch(setUnSelectAll());
};

export const patchAlbum = (data) => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {selectedItem} = getState().gallery;
    try {
        dispatch(receiveItem(await api.patchItem(selectedItem._id, data)));
    } catch (err) {
        throw err;
    }
};

export const insertPhotos = (files) => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const formData = new FormData();
    const {selectedItem} = getState().gallery;
    const {dirName} = selectedItem;
    try {
        formData.append('id', dirName.substring(dirName.indexOf("_"), dirName.indexOf("/")));
        files.forEach((file) =>
            formData.append('photos', file));
        return await dispatch(receiveItem(await api.insertItem(selectedItem._id, formData,
            {headers: {'Content-Type': 'multipart/form-data'}, timeout: 7000000})));
    } catch (e) {
        throw e;
    }
};

export const deletePhotos = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {selectedItem} = getState().gallery;
    const {photos} = selectedItem;
    try {
        dispatch(isFetching(false, true));
        dispatch(receiveItem(await api.setItem(selectedItem._id, {items: photos.filter(item => !item.selected)})));
        dispatch(setOpen(false));
    } catch (e) {
        throw e;
    } finally {
        dispatch(isFetching(false));
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
    } finally {
        dispatch(isFetching());
    }
};

export const refreshItem = () => (dispatch, getState) => {
    const {list, selectedItem} = getState().gallery;
    const currentItem = selectedItem && list.find(item => item._id === selectedItem._id) || list[0];
    dispatch(receiveItem(currentItem));
};

const gallery = handleActions(new Map([
    [combineActions(
        isFetching,
        receiveList,
        changeItem,
    ), (state, action) => ({...state, ...action.payload})],
    [setSelectAll, (state) =>  produce(state, draft => {
        draft.selectedItem.photos.map(item => {
            item.selected = true;
        });
    })],
    [setUnSelectAll, (state) =>  produce(state, draft => {
        draft.selectedItem.photos.map(item => {
            item.selected = false;
        });
    })],
    [receiveItem, (state, action) => produce(state, draft => {
        const {selectedItem} = action.payload;
        const newItem = draft.list.find(item => item._id === selectedItem._id);
        if (newItem) {
            Object.assign(newItem, selectedItem);
        }
        draft.selectedItem = newItem;
    })],
    [setSelectPhoto, (state, action) => produce(state, draft => {
        const index = action.payload;
        draft.selectedItem.photos[index].selected = !state.selectedItem.photos[index].selected;
    })],
]), initialState);


export default gallery;
