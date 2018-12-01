import React from 'react';

export default React.memo(({...props}) => {

    return (
        <div style={props.style}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
            }}>
                <h5 style={{color: "#5C7080", paddingTop: 10}} className="bp3-heading disable-select">Неделя</h5>
            </div>
        </div>
    );
});
