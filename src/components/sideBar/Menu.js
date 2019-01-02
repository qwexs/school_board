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
                </Radium.StyleRoot>
            </div>
        );
    }
}

export default withRouter(Menu);
