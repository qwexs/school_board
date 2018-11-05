import React, {Component} from 'react';
import MenuButton from "./MenuButton";
import {withRouter} from "react-router-dom";

class Menu extends Component {

    menuClickHandler = (event, path) => {
        this.props.history.push(path);
    };

    render() {
        const {routes} = this.props;
        return (
            <div className="container-menu">
                {routes.map((item, index) =>
                      <MenuButton key={index} path={item.path} label={item.title} onClick={this.menuClickHandler}/>
                )}
            </div>

        );
    }
}
export default withRouter(Menu);
