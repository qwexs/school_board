import React from 'react';

const styles = {
    title: {
        width: "100%",
        fontWeight: "500",
        fontSize: "12pt",
        color: "#394B59",
        float: "left",
        textAlign: "left",
        paddingTop: "5%",
        paddingLeft: "10%",
        textOverflow: "ellipsis",
    },
    info: {
        display: "inline-block",
        fontWeight: "500",
        width: "100%",
        color: "#5C7080",
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

export default React.memo(({...props}) => {
    const {item, sideItem} = props;
    return (
        <div style={sideItem}>
            <div style={{width:"100%"}} className="disable-select">
                <div style={styles.title} className="bp3-ui-text">{item.name}</div>
                <div style={styles.info} className="bp3-text-small">
                    <dl>
                        <dd>{item.teacher}</dd>
                        <dd>{item.place}</dd>
                    </dl>
                </div>
            </div>
            <div style={styles.icon}>
                <img width="auto" height="auto" style={{margin:"auto"}} src={`/${item.icon}`} alt={item.name}/>
            </div>
        </div>
    );
});
