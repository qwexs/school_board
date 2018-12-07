import React from 'react';
import {H5} from "@blueprintjs/core";
import Radium from "radium";

const isNoPage = (({...props}) => {

    const styles = {
        container: {
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center"
        },
        title: {
            color: "#5C7080",
            opacity: .5,
            margin: "0 auto"
        }
    };

    const {notEmpty, style} = props;

    return (
        notEmpty
            ? props.children
            : <div style={[styles.container, style]}>
                <H5 style={styles.title}>Пустая страница</H5>
              </div>
    );

});

export default Radium(isNoPage);
