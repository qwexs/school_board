import React from "react";
import {Redirect, Route} from "react-router-dom";
import {renderMergedProps} from "../../utils/renderMergedProps";

const PrivateRoute = ({ component, redirectTo, auth, ...rest }) => {
    return (
        <Route {...rest} render={routeProps => {
            return auth.isAuthenticated ? (
                renderMergedProps(component, routeProps, rest)
            ) : (
                <Redirect to={{
                    pathname: redirectTo,
                    state: { from: routeProps.location }
                }}/>
            );
        }}/>
    );
};

export default PrivateRoute;
