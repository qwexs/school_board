import React from 'react';

const ScheduleSideItem = ({item, sideItem}) => {
    return (
        <div className="disable-select bp3-text-large" style={sideItem}>
            {item.name}
        </div>
    );
};

export default ScheduleSideItem;
