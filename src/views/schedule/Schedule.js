import React, {PureComponent} from 'react';
import ScheduleSideItem from "./ScheduleSideItem";
import SideMenu from "../../components/sideBar/SideMenu";
import FooterBar from "../../components/footer/FooterBar";
import {Button, ResizeSensor, Spinner} from "@blueprintjs/core";
import axios from "axios";
import ScheduleHeaderBar from "./ScheduleHeaderBar";
import Radium from "radium";
import ScheduleContent from "./ScheduleContent";
import {FooterPanelConsumer} from "../../components/footer/FooterBarProvider";
import * as ReactDOM from "react-dom";
import IsNoPage from "../../components/IsNoPage";

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
        color: "#394B59"
    },
    headerBar: {
        backgroundColor: "#E1E8ED",
        padding: 10,
        border: "1px solid lightgrey",
        height: 50
    }
};

class Schedule extends PureComponent {

    static ACTION_ADD_ITEM = "addItem";
    static ACTION_EDIT_ITEM = "editItem";
    static ACTION_REMOVE_ITEM = "removeItem";
    static ACTION_CHANGE_ITEM = "changeItem";
    static ACTION_CANCEL_SAVE = "cancelSave";

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedItem: null,
            isLoad: false,
            isLoadItem: true
        };

        this.scheduleList = React.createRef();
    }

    componentWillMount() {
        this.refreshAll();
    }

    handleResizeView = (entries) => {
        if (entries && this.scheduleList && this.footerBar) {
            const vWidth = entries[0].contentRect.width;
            const element = ReactDOM.findDOMNode(this.scheduleList);
            const offsetScroll = element.scrollHeight - element.scrollTop !== element.clientHeight;
            this.footerBar.setState({vWidth: `calc(${vWidth}px + ${offsetScroll ? 1 : 0}vw`});
        }
    };

    handleAddKlass = (name) => {
        this.setState({selectedItem: null, isLoadItem: false});
        axios.post("/schedule", {name}).then(resolve => {
            this.refreshAll(resolve.data);
        });
    };

    handleRemoveKlass = () => {
        this.setState({isLoadItem: false});
        axios.delete(`/schedule/${this.state.selectedItem._id}`).then(this.refreshAll);
    };

    handleClickSave = () => {
        const schedule = this.scheduleList.getData();
        axios.put(`/schedule/${schedule._id}`, schedule).then(value => {
            this.refreshAll(value.data);
        });
    };

    refreshAll = (selectedItem = null) => {
        console.log(selectedItem);
        this.props.setOpen(false);
        axios.get('/schedule').then(res => {
            const currentList = res.data;
            const currentItem = (selectedItem
                && currentList.filter(item => item._id === selectedItem._id)[0])
                || currentList[0];
            this.setState({
                list: currentList,
                selectedItem: currentItem || null,
                isLoad: true,
                isLoadItem: true,
            });
            if (currentItem)
                this.refreshItem(currentItem);
        });
    };

    refreshItem = (currentItem) => {
        this.setState({selectedItem: currentItem, isLoadItem: false});
        axios.get(`/schedule/${currentItem._id}`)
            .then((res) => {
                this.setState({selectedItem: res.data, isLoadItem: true})
            });
    };

    handleChangeItem = (item) => {
        this.refreshItem(item);
    };

    handleClickUndo = () => {
        this.props.setAction(Schedule.ACTION_CANCEL_SAVE, false);
        this.refreshAll();
    };

    render() {
        const {windowStyle, sideMenuContainer} = this.props;
        return (
            <FooterPanelConsumer>
                {({isOpen, setAction, action}) => (
                    !this.state.isLoad
                        ?
                        <div style={{
                            position: "relative",
                            margin: "auto"
                        }}>
                            <Spinner/>
                        </div>
                        :
                        <div style={windowStyle}>
                            <SideMenu {...{sideMenuContainer}}
                                      items={this.state.list}
                                      selectedItem={this.state.selectedItem}
                                      action={action}
                                      headerBar={
                                          <ScheduleHeaderBar style={styles.headerBar}
                                                             onAdd={this.handleAddKlass}
                                          />
                                      }
                                      onChangeItem={this.handleChangeItem}>
                                <ScheduleSideItem {...styles}/>
                            </SideMenu>
                            {
                                !this.state.isLoadItem
                                    ?
                                    <div style={{
                                        position: "relative",
                                        margin: "auto"
                                    }}>
                                        <Spinner/>
                                    </div>
                                    :
                                    <IsNoPage
                                        notEmpty={this.state.selectedItem !== null && typeof this.state.selectedItem.days[0] !== 'string'}>
                                        <ResizeSensor onResize={this.handleResizeView}>
                                            <ScheduleContent ref={(item) => this.scheduleList = item}
                                                             listData={this.state.selectedItem}
                                                             setAction={setAction}
                                                             action={action}
                                                             onRemoveKlass={this.handleRemoveKlass}
                                                             refresh={this.refreshAll}
                                                             {...styles}/>
                                        </ResizeSensor>
                                    </IsNoPage>
                            }

                            <FooterBar ref={input => this.footerBar = input} isOpen={isOpen}>
                                <Button minimal icon="undo" onClick={this.handleClickUndo}>Отменить</Button>
                                <Button minimal icon="edit" onClick={this.handleClickSave}>Сохранить изменения</Button>
                            </FooterBar>
                        </div>
                )}
            </FooterPanelConsumer>
        );
    }
}

export default Radium(Schedule);
