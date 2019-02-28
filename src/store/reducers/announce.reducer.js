import {combineActions, createAction, handleActions} from "redux-actions";
import {setOpenDialog, isFetching, receiveItem, receiveList, sideMenuChangeItem} from "./root.reducer";
import {setCancelFooter, setOpen} from "./footer.reducer";
import produce from "immer";
import {reorder} from "../../utils/reorder";
import moment from "moment";

const initialState = {
    list: [],
    selectedItem: null,
    selectedDate: null,
    isLoadingList: false,
    isLoadingItem: false,
    isDialogOpen: false,
    contentDialog: null
};

/**
 * action creators
 */
const receiveDate = createAction("ANNOUNCE/RECEIVE_DATE",
    (selectedDate = null) => ({selectedDate}));
const setRemoveWeekItem = createAction("ANNOUNCE/REMOVE_WEEK_ITEM");
const setSaveWeekItem = createAction("ANNOUNCE/SAVE_WEEK_ITEM");
const setReorderWeekList = createAction("ANNOUNCE/REORDER_WEEK_LIST");

/**
 * action dispatcher
 */
export const removeItemWeek = (item) => (dispatch) => {
    dispatch(setOpen(true));
    dispatch(setRemoveWeekItem(item));
};

export const editItemWeek = (item) => (dispatch) => {
    dispatch(setOpenDialog(true, Object.assign({}, item)));
};

export const saveItemWeek = (item) => (dispatch) => {
    dispatch(setOpenDialog(false));
    dispatch(setSaveWeekItem(item));
    dispatch(setOpen(true));
};

export const reorderWeekList = (result) => (dispatch) => {
    dispatch(setReorderWeekList(result));
    dispatch(setOpen(true));
};

/**
 * action service
 */
export const saveItem = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {selectedItem} = getState().announce;
    try {
        dispatch(setOpen(false));
        dispatch(isFetching(true));
        await api.setItem(selectedItem._id, selectedItem);
        dispatch(await refreshAll());
    } catch (err) {
        throw err;
    }
};

export const changeDate = (date) => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    try {
        dispatch(isFetching(true));
        const list = await api.getItem(date);
        const items = list.items;
        dispatch(receiveList(items));
        dispatch(receiveDate(new Date(list.date)));
        dispatch(receiveItem(items[0]));
    } catch (err) {
        throw err;
    } finally {
        dispatch(isFetching());
    }
};

export const refreshAll = () => async (dispatch, getState, getAPI) => {
    const api = getAPI();
    const {selectedItem, selectedDate} = getState().announce;
    const weekDate = selectedDate && moment(selectedDate).startOf("isoWeek").utc(true).toDate().getTime();
    try {
        dispatch(isFetching(true));
        const list = weekDate ? await api.getItem(weekDate) : await api.getList();
        const items = list.items;
        const currentItem = selectedItem || items[0];
        dispatch(receiveList(items));
        dispatch(receiveDate(new Date(list.date)));
        dispatch(receiveItem(currentItem));
    } catch (err) {
        throw err;
    } finally {
        dispatch(isFetching());
    }
};

/**
 * action reducer
 */
const announce = handleActions(new Map([
    [combineActions(
        isFetching,
        receiveList,
        receiveItem,
        receiveDate,
        sideMenuChangeItem,
        setOpenDialog,
    ), (state, action) => ({...state, ...action.payload})],
    [setCancelFooter, state => produce(state, draft => {
        //FIXME: take away persist state from localstorage
        draft.selectedItem = state.defaultItem;
    })],
    [setReorderWeekList, (state, action) => produce(state, draft => {
        const {result} = action.payload;
        draft.selectedItem.education = reorder(
            state.selectedItem.education,
            result.source.index,
            result.destination.index
        );
    })],
    [setSaveWeekItem, (state, action) => produce(state, draft => {
        const findIndex = state.selectedItem.education.findIndex(item => item.index === action.payload.index);
        if (findIndex !== -1)
            draft.selectedItem.education[findIndex] = {...action.payload};
        else
            draft.selectedItem.education.push({...action.payload});
    })],
    [setRemoveWeekItem, (state, action) => produce(state, draft => {
        draft.selectedItem.education = state.selectedItem.education.filter(item => item.index !== action.payload.index);
    })]
]), initialState);

export default announce;

