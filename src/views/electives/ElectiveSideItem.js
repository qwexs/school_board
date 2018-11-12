import React from 'react';

const styles = {
    title: {
        width: "100%",
        fontWeight: "500",
        fontSize: "14pt",
        color: "#808080",
        float: "left",
        paddingTop: "20px",
        paddingLeft: "50px"
    },
    info: {
        display: "inline-block",
        fontWeight: "500",
        width: "100%",
        color: "#808080",
        textAlign: "start",
        float: "left",
        paddingTop: 10,
        paddingLeft: 70,
    },
    icon: {
        display: "flex",
        justifyItems: "center",
        paddingRight: "1em"
    }
};

export default React.memo(({...props}) => {
    const {item, sideItem} = props;
    return (
        <div style={sideItem}>
            <div className="disable-select">
                <div style={styles.title} className="bp3-ui-text">{item._id}</div>
                <div style={styles.info} className="bp3-text-small">
                    <dl>
                        <dd>{item._teacher}</dd>
                        <dd>{item._place}</dd>
                    </dl>
                </div>
            </div>
            <div style={styles.icon}>
                <img  style={{margin:"auto", width: "5vw", height:"5vw"}} src={"/assets/iconElective.png"} alt={item._id}/>
            </div>
        </div>
    );
});
