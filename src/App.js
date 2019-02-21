import React from "react";
import Menu from "./components/sideBar/Menu";
import "./App.css";
import routes from "./store/routes";
import AuthLogin from "./views/AuthLogin";
import {setAuth} from "./components/authentication/setAuth";
import FooterBarProvider, {FooterPanelConsumer} from "./components/footer/FooterBarProvider";
import {Redirect, Route, Switch} from "react-router";
import {renderMergedProps} from "./utils/renderMergedProps";
import emptyPage from "./components/emptyPage";

const styles = {
    stageStyle: {
        display: "flex",
        flexDirection: "row",
        height: "100vh"
    },
    mainStyle: {
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
    },
    windowStyle: {
        margin: "0 auto",
        display: "flex",
        overflow: "hidden",
        flexGrow: 1,
    },
};


const App = () => {
    return (
        <div className="App">
            <Switch>
                <PropsRoute exact path="/" redirectTo='/app/news' auth={setAuth} component={AuthLogin}/>
                <PrivateRoute path="/app" redirectTo='/' auth={setAuth} component={MainContainer}/>
            </Switch>
        </div>
    );
};

const MainContainer = () => {
    return (
        <div style={styles.stageStyle}>
            <Menu routes={routes} auth={setAuth}/>
            <FooterBarProvider>
                <FooterPanelConsumer>
                    {({setOpen, isOpen, setAction, action}) => (
                        <main style={styles.mainStyle}>
                            <Switch>
                                {routes.map((item, index) => (
                                    <PropsRoute key={index} path={item.path} title={item.title}
                                                component={item.component} {...styles}
                                                setAction={setAction} action={action} setOpen={setOpen}
                                                isOpen={isOpen}/>
                                ))}
                                <Route component={emptyPage}/>
                            </Switch>
                        </main>
                    )}
                </FooterPanelConsumer>
            </FooterBarProvider>
        </div>
    );
};

const PrivateRoute = ({component, redirectTo, auth, ...rest}) =>
    <Route {...rest} render={routeProps => {
        return auth.isAuthenticated ? (
            renderMergedProps(component, routeProps, rest)
        ) : (
            <Redirect to={{
                pathname: redirectTo,
                state: {from: routeProps.location}
            }}/>
        );
    }}/>;

const PropsRoute = ({component, ...rest}) =>
    <Route {...rest} render={routeProps => renderMergedProps(component, routeProps, rest)}/>;


export default App;
