import React, { Component } from "react";
import Menu from "./components/sideBar/Menu";
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import "./App.css";
import routes from "./routes";
import NoMatch from "./views/NoMatch";
import AuthLogin from "./views/AuthLogin";
import PropsRoute from "./components/routes/PropsRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import {setAuth} from "./components/authentication/setAuth";
import Radium from 'radium';

class App extends Component {

  render() {
    return (
        <BrowserRouter>

                <div className="App">
                    <Switch>
                        <PropsRoute exact path="/" redirectTo='/app/announce' auth={setAuth} component={AuthLogin} />
                        <PrivateRoute path="/app" redirectTo='/' auth={setAuth} component={AccessPage} />
                        <Route component={NoMatch}/>
                    </Switch>
                </div>
        </BrowserRouter>
    );
  }
}

const styles = {
    stageStyle: {
        display: "flex",
        flexDirection: "row",
        margin: 0,
        height: "100vh",
        flexFlow: "nowrap"
    },

    menuStyle: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: "20vw",
        minWidth: 150,
        overflowX: "hidden",
        paddingTop: "5%",
        background: "#d6d9db",
        boxShadow: "inset -15px 0 1em -18px #1f1f1f"
    },

    mainStyle: {
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
    },

    windowStyle: {
        margin: "auto",
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden"
    },

    sideMenuContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        margin: "0 auto",
        flexShrink: "0",
        overflowX: "hidden",
        overflowY: "auto",
        background: "#edf0f2",
        border: "1px solid lightgrey"
    }
};

const AccessPage = React.memo(() => {
    return (
        <div style={styles.stageStyle}>
            <Menu style={styles.menuStyle} routes={routes}/>
            <main style={styles.mainStyle}>
                <Switch>
                    {routes.map((item, index) => (
                        <PropsRoute key={index} path={item.path} title={item.title} component={item.component} {...styles}/>
                    ))}
                    <Route component={NoMatch}/>
                </Switch>
            </main>
        </div>
    );
});

export default Radium(App);
