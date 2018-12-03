import React, {PureComponent} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import AnnounceSideItem from "./AnnounceSideItem";
import AnnounceList from "./AnnounceList";
import FooterBar from "../../components/footer/FooterBar";
import {Button} from "@blueprintjs/core";
import {ResizeSensor} from "@blueprintjs/core";
import AnnounceHeaderBar from "./AnnounceHeaderBar";
import {FooterPanelConsumer} from "../../components/footer/FooterBarProvider";
import axios from "axios";
import * as ReactDOM from "react-dom";

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
        color: "#394B59",
    },
    headerBar: {
        backgroundColor: "#E1E8ED",
        flexGrow: 1,
        justifyItems: "middle",
        justifyContent: "center",
        border: "1px solid lightgrey",
        height: 50
    }
};

class Announce extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedItem: null,
            vWidth: 0,
            selectedDate: null
        };
    }

    componentDidMount() {
        this.refreshAll();
    }

    refreshAll = () => {
        axios.get('/announce').then(res => {
            console.log(res.data.date);
            const currentList = res.data.items;
            const currentItem = (this.state.selectedItem && currentList.filter(item => item._id === this.state.selectedItem._id)[0]) || currentList[0];
            if (currentItem)
                currentItem.selected = true;
            this.setState({
                list: currentList,
                selectedItem: currentItem,
                selectedDate: new Date(res.data.date)
            }, () => this.props.setOpen(false));
        });
    };

    handleChangeItem = (item) => {
        this.props.setOpen(false);
        this.setState({selectedItem: JSON.parse(JSON.stringify(item))});
    };

    handleResizeView = (entries) => {
        if (entries) {
            const vWidth = entries[0].contentRect.width;
            const element = ReactDOM.findDOMNode(this.componentList);
            const offsetScroll = element.scrollHeight - element.scrollTop !== element.clientHeight;
            this.footerBar.setState({vWidth: `calc(${vWidth}px + ${offsetScroll ? 1 : 0}vw`});
        }
    };

    handleInsertItem = (itemList, callback = null) => {
        this.savedItem = itemList;
        this.props.setOpen(true, callback);
    };

    handleSaveItem = () => {
        axios.put(`/announce/${this.state.selectedItem._id}`, this.savedItem)
            .then(() => this.refreshAll());
    };

    handleCancelSave = () => {
        axios.get(`/announce/${this.state.selectedItem._id}`).then((value => {
            this.setState({selectedItem: value.data},
                () => this.props.setOpen(false));
        }));
    };

    handleChangeWeek = (date) => {
        axios.patch('/announce', {date}).then(() => {
            this.setState(prevState => ({...prevState, selectedDate: date}));
        });
    };

    render() {
        const {windowStyle, sideMenuContainer} = this.props;
        return (
            <FooterPanelConsumer>
                {({setOpen, isOpen}) => (
                    <div style={windowStyle}>
                        <SideMenu {...{sideMenuContainer}}
                                  items={this.state.list}
                                  headerBar={
                                      <AnnounceHeaderBar style={styles.headerBar}
                                                         value={this.state.selectedDate}
                                                         onChange={this.handleChangeWeek}
                                      />
                                  }
                                  onChangeItem={this.handleChangeItem}>
                            <AnnounceSideItem {...styles}/>
                        </SideMenu>
                        <ResizeSensor onResize={this.handleResizeView}>
                            <AnnounceList onInsert={this.handleInsertItem}
                                          setOpen={setOpen}
                                          ref={input => this.componentList = input}
                                          list={this.state.selectedItem} {...styles}/>
                        </ResizeSensor>
                        <FooterBar ref={input => this.footerBar = input} isOpen={isOpen}>
                            <Button minimal icon="undo" onClick={this.handleCancelSave}>Отменить</Button>
                            <Button minimal icon="edit" onClick={this.handleSaveItem}>Сохранить изменения</Button>
                        </FooterBar>
                    </div>
                )}
            </FooterPanelConsumer>
        );
    }
}

export default Announce;
