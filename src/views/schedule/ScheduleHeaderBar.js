import React from 'react';
import {Button} from "@blueprintjs/core";

export default React.memo(({...props}) => {

    return (
        <div style={props.style}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <div style={{height: 20, paddingRight: 7}}>
                    <h5 style={{color: "#5C7080"}} className="bp3-heading disable-select">Классы</h5>
                </div>
                <Button icon="folder-new" minimal onClick={props.onAdd} title="Добавить"/>
            </div>
        </div>
    );
});
