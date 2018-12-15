import React from 'react';
import {Redirect} from 'react-router-dom'
import {Button, H5} from "@blueprintjs/core";

class AuthLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false
        };
        this.onLogin = this.onLogin.bind(this);
    }

    onLogin() {
        const {auth} = this.props;
        auth.signIn(() => {
            this.setState(() => ({
                redirectToReferrer: true
            }));
        });
    };

    render() {
        const {redirectTo} = this.props;
        const {from} = this.props.location.state || {from: {pathname: redirectTo}};
        const {redirectToReferrer} = this.state;

        if (redirectToReferrer === true) {
            return <Redirect to={from}/>
        }

        return (
            <div style={{position:"relative", marginTop:"25%"}}>
                <H5>Для входа в систему Вам необходимо авторизоваться</H5>
                <Button icon="key" onClick={this.onLogin}>Вход</Button>
            </div>
        )
    }
}

export default AuthLogin;
