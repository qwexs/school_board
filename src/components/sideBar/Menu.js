import React,{PureComponent} from 'react';
import MenuButton from "./MenuButton";
import {withRouter} from "react-router-dom";
import Radium from "radium";

const styles = {
    root: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 0,
        flexShrink: 0,
        height: "100%",
        flexBasis: "20vw",
        overflowX: "hidden",
        background: "#27446a",
        boxShadow: "inset -15px 0 1em -18px #1f1f1f",
        paddingTop: "3vh",
    },
};

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
        const {routes} = this.props;
        return (
            <Radium.StyleRoot style={styles.root}>
                    <div style={{
                        width: "100%",
                        paddingBottom: "20%",
                        '@media screen and (max-width: 600px)': {
                            display: "none"
                        }
                    }}>
                        <img src={"/assets/lomonlogo1.png"}
                             alt={"Логотип"} style={{maxWidth: "75%"}}
                             width={"80%"} height={"auto"}/>
                    </div>
                    <div style={{
                        paddingBottom: "20%",
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
                        display: "flex", flexDirection: "column", justifyContent: "flex-start", flexGrow:1,
                    }}>
                        {routes.map((item, index) =>
                            <MenuButton key={index} {...item}
                                        selected={this.state.selectedIndex === index}
                                        onClick={this.menuClickHandler}/>
                        )}
                        <div style={{
                            marginBottom: "2vh",
                            paddingTop: "25px",
                            marginRight: "20px",
                            display:"flex", flexGrow:1,
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                            '@media screen and (max-width: 600px)': {
                                margin: "0 auto 2vh",
                            }}}>
                            <a style={{color:"#E1E8ED"}} href="javascript:void(0)" onClick={this.handleLogout}>
                                Выйти
                            </a>
                        </div>
                    </div>

            </Radium.StyleRoot>
        );
    }
}

export default withRouter(Menu);
