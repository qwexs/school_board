import React from "react";
import store from "../store";
import {connect} from "react-redux";

const withReducer = (key, reducer, mapStateToProps, mapDispatchToProps) => WrappedComponent => {

    const Extended = (props) => {
        store.injectReducer(key, reducer);

        WrappedComponent = connect(
            mapStateToProps ? () => mapStateToProps(store.getState(), props) : null,
            mapDispatchToProps ? () => mapDispatchToProps(store.dispatch, props) : null
        )(WrappedComponent);

        return <WrappedComponent {...props}
        />;
    };

    return Extended;
};

export { withReducer };
