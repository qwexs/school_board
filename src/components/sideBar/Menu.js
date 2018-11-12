import React from 'react';
import MenuButton from "./MenuButton";
import {withRouter} from "react-router-dom";

export default withRouter(React.memo(({...props}) => {

    const menuClickHandler = (event, path) => {
        props.history.push(path);
    };

    const {routes, style} = props;
    return (
        <div style={style} className="bp3-text-large">
            {routes.map((item, index) =>
                  <MenuButton key={index} path={item.path} label={item.title} onClick={menuClickHandler}/>
            )}
        </div>

    );
}));
