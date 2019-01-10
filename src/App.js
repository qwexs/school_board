import React, {Component} from "react";
import Menu from "./components/sideBar/Menu";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import "./App.css";
import routes from "./routes";
import NoMatch from "./views/NoMatch";
import AuthLogin from "./views/AuthLogin";
import PropsRoute from "./components/routes/PropsRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import {setAuth} from "./components/authentication/setAuth";
import Radium from 'radium';
import FooterBarProvider, {FooterPanelConsumer} from "./components/footer/FooterBarProvider";

class App extends Component {

    componentDidMount() {
    }

  render() {
    return (
        <BrowserRouter>
            <div className="App">
                <Switch>
                    <PropsRoute exact path="/" redirectTo='/app/news' auth={setAuth} component={AuthLogin} />
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
        height:"100vh"
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
        scrollBehavior: "smooth"
    }
};

const AccessPage = React.memo((...props) => {
    return (
        <div style={styles.stageStyle}>
            <Menu routes={routes} auth={setAuth}/>
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
