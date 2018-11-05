import React from 'react';
import {Redirect} from 'react-router-dom'

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
            <div>
                <p>Для входа в систему Вам необходимо авторизоваться</p>
                <button onClick={this.onLogin}>Вход</button>
            </div>
        )
    }
}

export default AuthLogin;
