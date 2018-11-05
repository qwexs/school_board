import React, {Component} from "react";
import { Button } from "@blueprintjs/core";

class MenuButton extends Component {

    constructor(props) {
        super(props);
        this.onClickButton = this.onClickButton.bind(this);
    }

    componentDidMount() {

    }

    componentWillMount() {

    }

    onClickButton() {

    }

    render() {
        return(
            <div className="button-menu">
                <Button intent="none" minimal onClick={(e) => this.props.onClick(e, this.props.path)}>{this.props.label}</Button>
            </div>
        );
    }
}
export default MenuButton;
