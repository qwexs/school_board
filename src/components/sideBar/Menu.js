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
            <img src={"/assets/lomonlogo1.png"}
                 alt={"Логотип"}
                 width={"70%"} height={"auto"}
                 style={{
                     margin: "0 0 0 auto",
                     marginRight: "25px",
                     paddingBottom: "25%"
                 }}/>

            {routes.map((item, index) =>
                <MenuButton key={index} path={item.path} label={item.title} onClick={menuClickHandler}/>
            )}
        </div>
    );
}));
