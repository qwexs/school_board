import {TimePicker} from "@blueprintjs/datetime";
import * as ReactDOM from "react-dom";

class TimePickerFixed extends TimePicker {

    isEnterDown = false;

    componentDidMount() {
        ReactDOM.findDOMNode(this).addEventListener("keydown", this.onDownKeyHandler);
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.isEnterDown) {
            nextProps.onEnter(nextState.value);
            this.isEnterDown = false;
        }
    }

    onDownKeyHandler = (e) => {
        if (e.keyCode === 13) { //Enter
            this.isEnterDown = true;
        }
    };

    componentWillUnmount() {
        ReactDOM.findDOMNode(this).removeEventListener("keydown", this.onDownKeyHandler);
    }
}

export default TimePickerFixed;
