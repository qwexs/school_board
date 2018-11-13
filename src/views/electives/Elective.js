import React, {PureComponent} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import ElectiveSideItem from "./ElectiveSideItem";
import xml2json from "../../utils/xml2json";
import ElectiveWeekList from "./ElectiveWeekList";
import FooterApply from "../../components/footer/FooterApply";
import {Button, ResizeSensor} from "@blueprintjs/core";

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
        minWidth: 350,
        height: 120,
        margin: "auto",
        overflow: "hidden",
        textAlign: "start",
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
            this.setState({vWidth: entries[0].contentRect.width});
        }
    };

    onChangeItem = (target) => {
        this.setState({selectedItem: target.props.item});
    };

    render() {
        const {windowStyle} = this.props;
        return (
            <div style={windowStyle}>
                <SideMenu items={this.state.list} onChangeItem={this.onChangeItem} {...this.props}>
                    <ElectiveSideItem {...styles}/>
                </SideMenu>
                <ResizeSensor onResize={this.handleResizeView}>
                    <ElectiveWeekList list={this.state.selectedItem} {...styles}/>
                </ResizeSensor>
                <FooterApply width={this.state.vWidth}>
                    <Button minimal icon="add-to-artifact" onClick={this.onAddDialogHandler}>Создать событие</Button>
                    <Button minimal icon="undo">Отменить</Button>
                    <Button minimal icon="edit">Сохранить изменения</Button>
                </FooterApply>
            </div>
        );
    }
}

export default Elective;
