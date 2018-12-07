import React, {PureComponent} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import ElectiveSideItem from "./ElectiveSideItem";
import ElectiveWeekList from "./ElectiveWeekList";
import FooterBar from "../../components/footer/FooterBar";
import {Button, ResizeSensor} from "@blueprintjs/core";
import * as ReactDOM from "react-dom";
import axios from "axios";
import ElectiveHeaderBar from "./ElectiveHeaderBar";
import {FooterPanelConsumer} from "../../components/footer/FooterBarProvider";

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
        flexGrow: 1,
        height: "100%",
        overflowY: "auto",
    },
    headerBar: {
        backgroundColor: "#E1E8ED",
        flexGrow: 1,
        justifyItems: "middle",
        justifyContent: "center",
        border: "1px solid lightgrey",
        height: 50,
        padding: 10
    }

};

class Elective extends PureComponent {

    static ACTION_EDIT_ITEM = "editItem";
    static ACTION_CHANGE_ITEM = "changeItem";
    static ACTION_SAVE_ITEM = "saveItem";

    state = {
        list: [],
        selectedItem: null,
        isLoadItem: true,
        isLoadList: true
    };

    componentDidMount() {
        this.refreshAll();
    }

    refreshAll = (selectedItem = null) => {
        axios.get('/elective').then(res => {
            const currentList = res.data;
            const currentItem = selectedItem ? selectedItem : currentList[0];
            this.setState({
                list: currentList,
                selectedItem: currentItem,
                isLoadList: false
            }, () => {
                this.sideMenuRef.scrollToSelect();
                this.props.setOpen(false)
            });
            if (currentItem)
                this.refreshItem(currentItem._id);
        });
    };

    refreshItem = (id) => {
        this.props.setOpen(false);
        axios.get(`/elective/${id}`).then(value => {
            this.setState({selectedItem: {...this.state.selectedItem, items: value.data}, isLoadItem: false});
        });
    };

    handleResizeView = (entries) => {
        if (entries) {
            const vWidth = entries[0].contentRect.width;
            const element = ReactDOM.findDOMNode(this.weekList);
            const offsetScroll = element.scrollHeight - element.scrollTop !== element.clientHeight;
            this.footerBarRef.setState({vWidth: `calc(${vWidth}px + ${offsetScroll ? 1 : 0}vw`});
        }
    };

    handleChangeItem = (item) => {
        this.setState({selectedItem: item, isLoadItem: true});
        this.refreshItem(item._id);
        this.weekList.scrollToTop();
    };

    handleElectiveAdd = (dataHeader) => {
        const {name, teacher, place, icon} = dataHeader;
        this.setState({isLoadItem: true});
        axios.post('/elective', {name, teacher, place, icon}).then(value => {
            this.refreshAll(value.data);
        });
    };

    handleElectiveRemove = () => {
        axios.delete(`/elective/${this.state.selectedItem._id}`).then(value => {
            this.refreshAll();
        });
    };

    handleClickSaveChanges = () => {
        this.props.setAction(Elective.ACTION_SAVE_ITEM, () => this.props.setAction(""));
    };

    handleClickCancelChanges = () => {
        this.props.setOpen(false);
    };

    handleSaveElective = (item) => {
        this.setState({isLoadItem: true});
        axios.put(`/elective/${item._id}`, item).then(value => {
            this.refreshAll(value.data);
        });
    };

    render() {
        const {windowStyle} = this.props;
        return (
            <FooterPanelConsumer>
                {({setAction, action, setOpen, isOpen}) => (
                    <div style={windowStyle}>
                        {!this.state.isLoadList &&
                            <SideMenu selectedItem={this.state.selectedItem}
                                      items={this.state.list}
                                      onChangeItem={this.handleChangeItem}
                                      ref={ref => this.sideMenuRef = ref}
                                      {...this.props}
                                      headerBar={
                                          <ElectiveHeaderBar style={styles.headerBar} onAdd={this.handleElectiveAdd}/>
                                      }>
                                <ElectiveSideItem {...styles}/>
                            </SideMenu>
                        }
                        <ResizeSensor onResize={this.handleResizeView}>
                            <ElectiveWeekList ref={input => this.weekList = input}
                                              isLoadItem={this.state.isLoadItem}
                                              setAction={setAction} action={action}
                                              setOpen={setOpen}
                                              onSaveElective={this.handleSaveElective}
                                              onRemoveElective={this.handleElectiveRemove}
                                              item={this.state.selectedItem} {...styles}/>
                        </ResizeSensor>
                        <FooterBar ref={ref => this.footerBarRef = ref} isOpen={isOpen}>
                            <Button minimal icon="undo" onClick={this.handleClickCancelChanges}>Отменить</Button>
                            <Button minimal icon="edit" onClick={this.handleClickSaveChanges}>Сохранить изменения</Button>
                        </FooterBar>
                    </div>
                )}
            </FooterPanelConsumer>
        );
    }
}

export default Elective;
