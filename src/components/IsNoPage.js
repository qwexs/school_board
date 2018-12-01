import React from 'react';
import {H5} from "@blueprintjs/core";
import PropTypes from 'prop-types';
import Radium from "radium";

const isNoPage = (({...props}) => {

    const styles = {
        container: {
            display: "flex",
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center"
        },
        title: {
            color: "#5C7080",
            opacity: .5
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

isNoPage.propTypes = {
    notEmpty: PropTypes.bool,
    style: PropTypes.object
};
