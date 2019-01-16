import React from 'react';
import {Redirect} from 'react-router-dom'
import {Button, H3, H5, InputGroup, Intent, Label, Position, Spinner, Tooltip} from "@blueprintjs/core";

class AuthLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            login: "admin",
            password: "",
            oldPassword: "",
            showPassword: false,
            changePassword: false,
            redirectToReferrer: false,
            isValid: true,
            loaded: false
        };
        this.onLogin = this.onLogin.bind(this);
    }

    componentDidMount() {
        const {auth} = this.props;
        auth.getSession((isAuth) => {
            this.setState(() => ({
                redirectToReferrer: isAuth,
                isValid: true,
                loaded: true
            }));
        });
    }

    onLogin() {
        const {auth} = this.props;
        const {login, password} = this.state;
        auth.signIn({login, password}, (result) => {
            this.setState(() => ({
                redirectToReferrer: result,
                isValid: result
            }));
        });
    };

    onChangePassword() {
        const {auth} = this.props;
        const {login, oldPassword, password} = this.state;
        auth.newPassword({login, oldPassword, password}, (result) => {
            this.setState(() => {
                return {changePassword: !result, isValid: result};
            });
        });
    }

    handleLockClick = () => this.setState({showPassword: !this.state.showPassword});

    handleChangePasswordClick = () => {
        this.setState(prevState => ({changePassword: !prevState.changePassword, isValid: true,
            password:"", oldPassword: ""}));
    };

    handleKeyPress = (event) => {
        if(event.key === 'Enter') {
            this.enterKeyPassword();
        }
    };

    enterKeyPassword = () => {
        if (!this.state.changePassword) {
            this.onLogin();
        }
        else {
            this.onChangePassword();
        }
    };

    render() {
        const {redirectTo} = this.props;
        const {from} = this.props.location.state || {from: {pathname: redirectTo}};
        const {
            redirectToReferrer, login, isValid,
            showPassword, changePassword, loaded
        } = this.state;

        if (redirectToReferrer === true) {
            return <Redirect to={from}/>
        }

        const lockButton = (
            <Tooltip content={`${showPassword ? "Не показывать" : "Показать"} пароль`}
                     position={Position.TOP_RIGHT}>
                <Button style={{margin: "auto"}}
                        icon={showPassword ? "unlock" : "lock"}
                        intent={Intent.WARNING}
                        minimal={true}
                        onClick={this.handleLockClick}
                />
            </Tooltip>
        );

        return ( !loaded ?
            <div style={{
                position: "absolute",
                left: "50%", top: "50%",
                transform: "translate(-50%,-50%)"
            }}>
                <Spinner />
            </div>
            :
            <div style={{display: "flex", height: "100vh", overflowY: "auto"}}>
                <div style={{
                    margin: "auto",
                    width: 400,
                    padding: 20
                }}>
                    <img src={"/assets/logo_iboard.png"} width={"35%"} alt={"logo"}/>
                    <H3 style={{padding: "10px 0 0 0", color: "#5C7080",fontWeight:"500"}}
                    >Информационная <br/>доска</H3>
                    <H5 style={{padding: "20px 0 10px 0", color: "#27446a"}}
                        className="bp3-ui-text">
                        {changePassword ? "Установить новый пароль" : "Вход в систему"}
                    </H5>
                    <div style={{
                        width: "60%",
                        display: "flex",
                        flexDirection: "column",
                        margin: "0 auto",
                        paddingBottom: "10px",
                        alignItems: "flex-end"
                    }}>
                        <Label>
                            {
                                changePassword ?
                                    <InputGroup
                                        intent={isValid ? Intent.NONE : Intent.DANGER}
                                        style={{margin: "0 auto"}}
                                        onChange={(event) => this.setState({oldPassword: event.target.value})}
                                        placeholder="Старый пароль"
                                        leftIcon="key"
                                        rightElement={lockButton}
                                        type={showPassword ? "text" : "password"}
                                        value={this.state.oldPassword}
                                    />
                                    :

                                    <InputGroup
                                        style={{margin: "0 auto"}}
                                        leftIcon="user"
                                        onChange={(event) => this.setState({login: event.target.value})}
                                        placeholder="Логин"
                                        disabled={true}
                                        value={login}
                                    />
                            }
                        </Label>

                        <Label>
                            <InputGroup intent={isValid ? Intent.NONE : Intent.DANGER}
                                        style={{margin: "0 auto"}}
                                        onChange={(event) => this.setState({password: event.target.value})}
                                        onKeyPress={this.handleKeyPress}
                                        placeholder={changePassword ? "Новый пароль" : "Пароль"}
                                        leftIcon="key"
                                        rightElement={lockButton}
                                        type={showPassword ? "text" : "password"}
                                        value={this.state.password}
                                        autoFocus={!changePassword}
                            />
                        </Label>
                        {/*eslint-disable-next-line*/}
                        <a href="javascript:void(0)" onClick={this.handleChangePasswordClick}>
                            {changePassword ? "Отмена" : "Изменить пароль"}
                        </a>
                        <Button intent={changePassword ? Intent.SUCCESS : Intent.PRIMARY}
                                style={{width: "40%", minWidth: "80px", marginTop: 15}}
                                onClick={this.enterKeyPassword}>
                            {changePassword ? "Сохранить" : "Вход"}
                        </Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default AuthLogin;
