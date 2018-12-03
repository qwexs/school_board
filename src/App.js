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
import axios from "axios";
import FooterBarProvider, {FooterPanelConsumer} from "./components/footer/FooterBarProvider";

class App extends Component {

    componentDidMount() {
        axios.create({
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

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
        minWidth: "10vw",
        overflowX: "hidden",
        paddingTop: "5%",
        background: "#8A9BA8",
        boxShadow: "inset -15px 0 1em -18px #1f1f1f",
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
        flexGrow:1,
        // backgroundColor: "#F5F8FA"
    },

    sideMenuContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        margin: "0 auto",
        overflowX: "hidden",
        overflowY: "auto",
        background: "#E1E8ED",
        border: "1px solid lightgrey",
        height: "100%",
    }
};

const AccessPage = React.memo(() => {
    return (
        <div style={styles.stageStyle}>
            <Menu style={styles.menuStyle} routes={routes}/>
            <FooterBarProvider>
                <FooterPanelConsumer>
                    {({setOpen, isOpen, setAction, action}) => (
                        <main style={styles.mainStyle}>
                            <Switch>
                                {routes.map((item, index) => (
                                    <PropsRoute key={index} path={item.path} title={item.title} component={item.component} {...styles}
                                                setAction={setAction} action={action} setOpen={setOpen} isOpen={isOpen}/>
                                ))}
                                <Route component={NoMatch}/>
                            </Switch>
                        </main>
                    )}
                </FooterPanelConsumer>
            </FooterBarProvider>
        </div>
    );
});

export default Radium(App);
