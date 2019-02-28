import {combineActions, createAction, handleActions} from "redux-actions";

const initialState = {
    vWidth: "0",
    isOpen: false
};

export const setOpen = createAction("FOOTER/SHOWING",
    isOpen => ({isOpen}));

export const setContentWidth = createAction("FOOTER/CHANGE_WITH",
    vWidth => ({vWidth}));

export const setCancelFooter = createAction("FOOTER/CANCEL",
    () => ({isOpen: false}));

const footer = handleActions(new Map([
    [combineActions(
        setOpen,
        setContentWidth,
        setCancelFooter
    ),
    (state, action) => ({...state, ...action.payload})]]),
    initialState);

export default footer;
