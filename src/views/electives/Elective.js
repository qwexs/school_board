import React, {PureComponent} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import ElectiveSideItem from "./ElectiveSideItem";
import xml2json from "../../utils/xml2json";
import ElectiveWeekList from "./ElectiveWeekList";
import FooterBar from "../../components/footer/FooterBar";
import {Button, ResizeSensor} from "@blueprintjs/core";
import * as ReactDOM from "react-dom";

const styles = {
    electiveContainerStyle: {
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        flexGrow: 1,
        padding: "30px 10px 10px 10px",
    },
    sideItem: {
        display: "flex",
        flexDirection: "row",
        width: "30vw",
        minWidth: 200,
        height: 120,
        margin: "auto",
        overflow: "hidden",
        textAlign: "left",
        justifyContent: "space-between"
    },
    contentStyle: {
        display: "flex",
        flexDirection: "column",
        // flexGrow: 1,
        height: "100%",
        overflowY: "auto",

    },

};

class Elective extends PureComponent {

    state = {
        list: [],
        selectedItem: null,
        isOpen: false,
        vWidth: 0
    };


    componentDidMount() {
        const data = xml2json("/assets/data/events.xml");
        const currentList = data["eventsDay"]["school"]["elective"];
        this.setState({
            list: currentList,
            selectedItem: currentList[0],
        });
    }

    handleResizeView = (entries) => {
        if (entries) {
            const vWidth = entries[0].contentRect.width;
            const element = ReactDOM.findDOMNode(this.componentList);
            const offsetScroll = element.scrollHeight - element.scrollTop !== element.clientHeight;
            this.footerBar.setState({vWidth: `calc(${vWidth}px + ${offsetScroll ? 1 : 0}vw`});
        }
    };

    onChangeItem = (item) => {
        this.setState({selectedItem: item});
    };

    render() {
        const {windowStyle} = this.props;
        return (
            <div style={windowStyle}>
                <SideMenu items={this.state.list} onChangeItem={this.onChangeItem} {...this.props}>
                    <ElectiveSideItem {...styles}/>
                </SideMenu>
                <ResizeSensor onResize={this.handleResizeView}>
                    <ElectiveWeekList ref={input => this.componentList = input} list={this.state.selectedItem} {...styles}/>
                </ResizeSensor>
                <FooterBar ref={input => this.footerBar = input}>
                    <Button minimal icon="undo">Отменить</Button>
                    <Button minimal icon="edit">Сохранить изменения</Button>
                </FooterBar>
            </div>
        );
    }
}

export default Elective;
