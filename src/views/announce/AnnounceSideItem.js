import React from 'react';

const AnnounceSideItem = ({item, sideItem}) => {
    return (
        <div className="disable-select" style={sideItem}>
            {item.title}
        </div>
    );
};

export default AnnounceSideItem;
