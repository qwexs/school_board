import React, {Component} from "react";
import { Button } from "@blueprintjs/core";

class MenuButton extends Component {

    render() {
        return(
            <div className="button-menu"
            style={{
                right: 0,
                width: "100%",
                float: "right",
                position: "relative",
                paddingBottom: 20,
                paddingRight: "5%"
            }}>
                <Button style={{textAlign: "right", color:"#E1E8ED", fontSize:"12px", fontWeight:"bold"}}
                    intent="none" minimal onClick={(e) => this.props.onClick(e, this.props.path)}>{this.props.label}</Button>
            </div>
        );
    }
}
export default MenuButton;
