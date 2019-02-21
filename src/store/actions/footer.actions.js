import {createAction} from "redux-actions";

export const setOpen = createAction("FOOTER/SHOWING",
    isOpen => ({isOpen}));

export const setContentWidth = createAction("FOOTER/CHANGE_WITH",
    vWidth => ({vWidth}));

export const cancelChanges = createAction("FOOTER/CANCEL",
    () => ({isOpen: false}));
export const saveChanges = createAction("FOOTER/SAVE",
    () => ({isOpen: false}));
