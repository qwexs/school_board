import React from 'react';

const styles = {
    title: {
        width: "100%",
        fontWeight: "500",
        fontSize: "12pt",
        color: "#808080",
        float: "left",
        textAlign: "start",
        paddingTop: "5%",
        paddingLeft: "10%",
        textOverflow: "ellipsis",
    },
    info: {
        display: "inline-block",
        fontWeight: "500",
        width: "100%",
        color: "#808080",
        textAlign: "start",
        float: "left",
        paddingTop: 7,
        paddingLeft: "17%",
        textOverflow: "ellipsis",
    },
};

export default React.memo(({...props}) => {
    const {item, sideItem} = props;
    return (
        <div style={sideItem} className="disable-select">
            <div style={styles.title} className="bp3-ui-text">{item.name}</div>
            <div style={styles.info} className="bp3-text-small">{`${item.quantity} фотографмй`}</div>
        </div>
    );
});
