import React, {PureComponent} from 'react';
import xml2json from "../../utils/xml2json";
import ScheduleSideItem from "./ScheduleSideItem";
import SideMenu from "../../components/sideBar/SideMenu";
import TableList from "./TableList";
import FooterApply from "../../components/footer/FooterApply";
import {Button, ResizeSensor} from "@blueprintjs/core";

const styles = {
    sideItem: {
        width: "12vw",
        maxWidth: 150,
        height: "50px",
        margin: "auto",
        textAlign: "center",
        lineHeight: "50px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        padding: "0 5px 0 5px",
    },
    tableContainer: {
        display: "flex",
        flexWrap: "wrap",
        margin: "0 auto",
        alignItems: "center",
        justifyContent: "space-evenly",
        overflowY: "auto",
        overflowX: "hidden",
        padding: 30,
    },
    tableCell: {
        boxSizing: "border-box",
        padding: 10,
        overflow: "hidden",
    }
};


class Schedule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedItem: {},
            vWidth: 0
        };
    }

    componentDidMount() {
        const raspData = xml2json("/assets/data/rasp.xml");
        const currentList = raspData["school"]["klass"];
        this.setState({
            list: currentList,
            selectedItem: currentList[0]
        });
    }

    onChangeItem = (target) => {
        this.setState({selectedItem: target.props.item});
    };

    handleResizeView = (entries) => {
        if (entries) {
            this.setState({vWidth: entries[0].contentRect.width + styles.tableContainer.padding * 2});
        }
    };

    render() {
        const {windowStyle, sideMenuContainer} = this.props;
        return (
            <div style={windowStyle}>
                <SideMenu {...{sideMenuContainer}} items={this.state.list} onChangeItem={this.onChangeItem}>
                    <ScheduleSideItem {...styles}/>
                </SideMenu>
                <ResizeSensor onResize={this.handleResizeView}>
                    <TableList days={this.state.selectedItem} {...styles}/>
                </ResizeSensor>
                <FooterApply width={this.state.vWidth}>
                    <Button minimal icon="undo">Отменить</Button>
                    <Button minimal icon="edit">Сохранить изменения</Button>
                </FooterApply>
            </div>
        );
    }
}

export default Schedule;
