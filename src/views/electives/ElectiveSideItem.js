import React from 'react';

const styles = {
    title: {
        width: "100%",
        fontWeight: "500",
        fontSize: "12pt",
        color: "#808080",
        float: "left",
        textAlign: "left",
        paddingTop: "5%",
        paddingLeft: "10%"
    },
    info: {
        display: "inline-block",
        fontWeight: "500",
        width: "100%",
        color: "#808080",
        textAlign: "left",
        float: "left",
        paddingTop: 7,
        paddingLeft: "17%",
        textOverflow: "ellipsis",
    },
    icon: {
        display: "flex",
        justifyItems: "center",
        paddingRight: "5%",
        paddingLeft: "3%",
    }
};

function parseIconURL(pathName) {
    return `/assets/${String(pathName).substr(0, pathName.indexOf("."))}.png`;
}

export default React.memo(({...props}) => {
    const {item, sideItem} = props;
    return (
        <div style={sideItem}>
            <div style={{width:"100%"}} className="disable-select">
                <div style={styles.title} className="bp3-ui-text">{item._id}</div>
                <div style={styles.info} className="bp3-text-small">
                    <dl>
                        <dd>{item._teacher}</dd>
                        <dd>{item._place}</dd>
                    </dl>
                </div>
            </div>
            <div style={styles.icon}>
                <img style={{margin:"auto"}} src={parseIconURL(item._ic)} alt={item._id}/>
            </div>
        </div>
    );
});
