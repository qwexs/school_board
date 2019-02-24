import React from "react";
import {store} from "../index";
import * as PropTypes from 'prop-types';
import {connect} from "react-redux";

const withReducer = (key, reducer, mapStateToProps, mapDispatchToProps) => WrappedComponent => {

    const Extended = (props, context) => {
        store.injectReducer(key, reducer);

        WrappedComponent = connect(
            () => mapStateToProps(store.getState(), props),
            () => mapDispatchToProps(store.dispatch, props))(WrappedComponent);

        return <WrappedComponent {...props}
        />;
    };

    Extended.contextTypes = {
        store: PropTypes.object
    };

    return Extended;
};

export { withReducer };
