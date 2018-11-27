import React from 'react';
import {H5} from "@blueprintjs/core";

export default React.memo(({...props}) => {

    const {notEmpty} = props;

    return (
        notEmpty
            ? props.children
            : <div style={{display:"flex", flexGrow:1, alignItems: "center", justifyContent: "center"}}>
                <H5 style={{color:"#5C7080",opacity:.5}}>Пустая страница</H5>
              </div>
    );
});
