import {combineActions, handleActions} from "redux-actions";
import {setOpen, setContentWidth, cancelChanges, saveChanges} from "../actions/footer.actions";

const initialState = {
    vWidth: "0",
    isOpen: false
};

const footer = handleActions(
    combineActions(
        setOpen,
        setContentWidth,
        cancelChanges,
        saveChanges
    ),
    (state, action) => ({...state, ...action.payload}),
    initialState);

export default footer;
