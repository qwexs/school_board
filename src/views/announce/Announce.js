import React, {PureComponent} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import AnnounceSideItem from "./AnnounceSideItem";
import xml2json from "../../utils/xml2json";
import AnnounceList from "./AnnounceList";
import FooterBar from "../../components/footer/FooterBar";
import {Button} from "@blueprintjs/core";
import {ResizeSensor} from "@blueprintjs/core";

const styles = {
    announceContainer: {
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        flexGrow: 1,
        padding: "30px 10px 30px 10px",
        height: "100%"
    },
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
    announceItem: {
        minWidth: 150,
        maxWidth: 500,
        margin: "0 auto",
        background: "#F5F8FA",
        padding: "5px"
    }
};

class Announce extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedItem: null,
            isOpen: false,
            vWidth: 0
        };
    }

    componentDidMount() {
        const data = xml2json("/assets/data/anons.xml");
        const currentList = data["anonsFlow"]["eventDay"];
        this.setState({
            list: currentList,
            selectedItem: currentList[0],
        });
    }

    onChangeItem = (item) => {
        this.setState({selectedItem: item});
    };

    onCloseDialogHandler = () => {
        this.setState({isOpen: false});
    };

    onAddDialogHandler = () => {
        this.setState({isOpen: true})
    };

    handleResizeView = (entries) => {
        if (entries) {
            this.setState({vWidth: entries[0].contentRect.width});
        }
    };

    render() {
        const {windowStyle, sideMenuContainer} = this.props;
        return (
            <div style={windowStyle}>
                <SideMenu {...{sideMenuContainer}} items={this.state.list} onChangeItem={this.onChangeItem}>
                    <AnnounceSideItem {...styles}/>
                </SideMenu>
                <ResizeSensor onResize={this.handleResizeView}>
                    <AnnounceList list={this.state.selectedItem} isOpen={this.state.isOpen}
                                  onCloseDialog={this.onCloseDialogHandler} {...styles}/>
                </ResizeSensor>
                <FooterBar width={this.state.vWidth}>
                    <Button minimal icon="add-to-artifact" onClick={this.onAddDialogHandler}>Создать анонс</Button>
                    <Button minimal icon="undo">Отменить</Button>
                    <Button minimal icon="edit">Сохранить изменения</Button>
                </FooterBar>
            </div>
        );
    }
}

export default Announce;
