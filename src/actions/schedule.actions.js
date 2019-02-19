import {setOpen} from "./footer.actions";
import {createAction} from "redux-actions";

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



