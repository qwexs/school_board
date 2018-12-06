import React, {PureComponent} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import ElectiveSideItem from "./ElectiveSideItem";
import ElectiveWeekList from "./ElectiveWeekList";
import FooterBar from "../../components/footer/FooterBar";
import {Button, ResizeSensor, Spinner} from "@blueprintjs/core";
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
            this.refreshItem(currentItem._id);
        });
    };

    refreshItem = (id) => {
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
            console.log(vWidth);
        }
    };

    handleChangeItem = (item) => {
        this.setState({selectedItem: item, isLoadItem: true});
        this.refreshItem(item._id);
    };

    handleElectiveAdd = (dataHeader) => {
        const {name, teacher, place, icon} = dataHeader;
        this.setState({isLoadItem: true});
        axios.post('/elective', {name, teacher, place, icon}).then(value => {
            this.refreshAll(value.data);
        });
    };

    handleConfirmData = (item) => {
        console.log(item);
        this.props.setAction(Elective.ACTION_EDIT_ITEM);
    };

    render() {
        const {windowStyle} = this.props;
        return (
            <FooterPanelConsumer>
                {({setAction, action, isOpen}) => (
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
                            <ElectiveWeekList ref={input => this.weekList = input} isLoadItem={this.state.isLoadItem}
                                              setAction={setAction} onConfirm={this.handleConfirmData}
                                              item={this.state.selectedItem && this.state.selectedItem} {...styles}/>
                        </ResizeSensor>
                        <FooterBar ref={ref => this.footerBarRef = ref} isOpen={isOpen}>
                            <Button minimal icon="undo">Отменить</Button>
                            <Button minimal icon="edit">Сохранить изменения</Button>
                        </FooterBar>
                    </div>
                )}
            </FooterPanelConsumer>
        );
    }
}

export default Elective;
