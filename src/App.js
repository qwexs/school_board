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

class App extends Component {

  render() {
    return (
        <BrowserRouter>
            <div className="App">
                <Switch>
                    <PropsRoute exact path="/" redirectTo='/app/schedule' auth={setAuth} component={AuthLogin} />
                    <PrivateRoute path="/app" redirectTo='/' auth={setAuth} component={AccessPage} />
                    <Route component={NoMatch}/>
                </Switch>
            </div>
        </BrowserRouter>
    );
  }
}

class AccessPage extends Component {
    render() {
        return (
            <div style={{margin:0}}>
                <Menu routes={routes}/>
                <main className="Main">
                    <Switch>
                        {routes.map((item, index) => (
                            <PropsRoute key={index} path={item.path} title={item.title} component={item.component}/>
                        ))}
                        <Route component={NoMatch}/>
                    </Switch>
                </main>
            </div>
        );
    }
}

export default App;
