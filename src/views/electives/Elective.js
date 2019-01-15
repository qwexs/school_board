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
import IsNoPage from "../../components/IsNoPage";

const styles = {
    contentStyle: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        height: "100%",
        overflowY: "auto",
        minWidth: "220px",
        paddingTop:"10px"
    },
    headerBar: {
        backgroundColor: "#E1E8ED",
        justifyItems: "middle",
        justifyContent: "center",
        border: "1px solid lightgrey",
        height: 50,
    }

};

let isMounted = false;

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
        isMounted = true;
        this.refreshAll();
    }

    componentWillUnmount() {
        isMounted = false;
    }

    refreshAll = (selectedItem = null) => {
        axios.get('/elective').then(res => {
            if (isMounted) {
                const currentList = res.data;
                const currentItem = selectedItem ? selectedItem : currentList[0];
                this.setState({
                    list: currentList,
                    selectedItem: currentItem,
                    isLoadList: false
                }, () => {
                    this.sideMenuRef && this.sideMenuRef.scrollToSelect();
                    this.props.setOpen(false)
                });
                if (currentItem)
                    this.refreshItem(currentItem._id);
            }

        });
    };

    refreshItem = (id) => {
        this.props.setOpen(false);
        axios.get(`/elective/${id}`).then(value => {
            isMounted &&
            this.setState({
                selectedItem: {...this.state.selectedItem, items: value.data},
                isLoadItem: false
            });
        });
    };

    handleResizeView = (entries) => {
        if (entries && this.weekList && this.footerBarRef) {
            const vWidth = entries[0].contentRect.width;
            const element = ReactDOM.findDOMNode(this.weekList);
            const offsetScroll = element.scrollHeight - element.scrollTop !== element.clientHeight;
            this.footerBarRef.setState({vWidth: `calc(${vWidth}px + ${offsetScroll ? 1 : 0}vw`});
        }
    };

    handleChangeItem = (item) => {
        this.setState({selectedItem: item, isLoadItem: true});
        this.refreshItem(item._id);
        if (this.weekList) {
            this.weekList.scrollToTop();
        }
    };

    handleElectiveAdd = (dataHeader) => {
        this.setState({isLoadItem: true});
        const {name, teacher, place, icon} = dataHeader;
        const formData = new FormData();
        formData.append('name', name || "");
        formData.append('teacher', teacher || "");
        formData.append('place', place || "");
        formData.append('icon', icon || undefined);
        axios.post('/elective', formData).then(value => {
            this.refreshAll(value.data);
        });
    };

    handleElectiveRemove = (item) => {
        this.setState({isLoadItem: true});
        axios.delete(`/elective/${item._id}`).then(value => {
            this.refreshAll();
        });
    };

    handleClickSaveChanges = () => {
        this.props.setAction(Elective.ACTION_SAVE_ITEM, () => this.props.setAction(""));
    };

    handleClickCancelChanges = () => {
        if (this.state.selectedItem)
            this.refreshItem(this.state.selectedItem._id);
    };

    handleSaveElective = (item) => {
        this.setState({isLoadItem: true});
        const {name, teacher, place, icon, items} = item;
        const formDataSend = new FormData();
        formDataSend.append('name', name || "");
        formDataSend.append('teacher', teacher || "");
        formDataSend.append('place', place || "");
        formDataSend.append('items', JSON.stringify(items));
        formDataSend.append('icon', icon);
        axios.put(`/elective/${item._id}`, formDataSend).then(value => {
            this.refreshAll(value.data);
        });
    };

    render() {

        const {windowStyle} = this.props;
        const {selectedItem} = this.state;
        const isNotEmpty = (selectedItem && selectedItem.items && selectedItem.items.length)
            || this.state.isLoadList;
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
                                          <ElectiveHeaderBar style={styles.headerBar}
                                                             onAdd={this.handleElectiveAdd}/>
                                      }>
                                <ElectiveSideItem
                                                  onRemoveItem={this.handleElectiveRemove}/>
                            </SideMenu>
                        }
                            <ResizeSensor onResize={this.handleResizeView}>
                                <IsNoPage notEmpty={isNotEmpty}>
                                    <ElectiveWeekList ref={input => this.weekList = input}
                                                      isLoadItem={this.state.isLoadItem}
                                                      setAction={setAction} action={action}
                                                      setOpen={setOpen}
                                                      onSaveElective={this.handleSaveElective}
                                                      item={this.state.selectedItem} {...styles}/>
                                </IsNoPage>
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
