import React,{PureComponent} from 'react';
import MenuButton from "./MenuButton";
import {withRouter} from "react-router-dom";
import Radium from "radium";

class Menu extends PureComponent {

    state = {
        selectedIndex: -1
    };

    componentDidMount() {
        this.setState({selectedIndex: this.getLocationPathByIndex(this.props.history.location.pathname)});
    }

    menuClickHandler = (event, path) => {
        this.props.history.push(path);
        this.setState({selectedIndex: this.getLocationPathByIndex(path)});
    };

    getLocationPathByIndex(path) {
        let currentIndex = -1;
        this.props.routes.some((item, index) => {
            const result = path === item.path;
            if (result) {
                currentIndex = index;
            }
            return result;
        });

        return currentIndex;
    }

    handleLogout = () => {
        this.props.auth.signOut(() => {
            this.props.history.push("/");
        });
    };

    render() {
        const {routes, style} = this.props;
        return (
            <div style={style}>
                <Radium.StyleRoot>
                    <div style={{
                        width: "100%",
                        '@media screen and (max-width: 600px)': {
                            display: "none"
                        }
                    }}>
                        <img src={"/assets/lomonlogo1.png"}
                             alt={"Логотип"} style={{maxWidth: "75%"}}
                             width={"80%"} height={"auto"}/>
                    </div>
                    <div style={{
                        '@media screen and (min-width: 600px)': {
                            display: "none"
                        }
                    }}>
                        <img src={"/assets/lomon_mini.png"}
                             alt={"Логотип"}
                             width={"40px"} height={"auto"}
                             style={{
                                 margin: "10px auto",

                             }}/>
                    </div>

                    <div style={{
                        display: "flex", flexDirection: "column", justifyContent: "center",
                        width: "100%", marginTop: "10%"
                    }}>
                        {routes.map((item, index) =>
                            <MenuButton key={index} {...item}
                                        selected={this.state.selectedIndex === index}
                                        onClick={this.menuClickHandler}/>
                        )}
                    </div>
                    <div style={{position:"fixed", left:"20px", bottom:"15px",
                        '@media screen and (max-width: 600px)': {
                            position: "relative",
                            left: 0,
                            top:15,
                            paddingBottom: 10,
                            margin: "0 auto"
                        }}}>
                        <a style={{color:"#E1E8ED"}} href="javascript:void(0)" onClick={this.handleLogout}>
                            Выйти
                        </a>
                    </div>
                </Radium.StyleRoot>
            </div>
        );
    }
}

export default withRouter(Menu);
