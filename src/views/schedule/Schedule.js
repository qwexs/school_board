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
import LessonsPanel from "./LessonsPanel";

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
        border: "1px solid lightgrey",
        height: 50,
        width: "100%"
    }
};

let isMounted = false;

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
            isLoadItem: true,
            vWidth: 0
        };

        this.scheduleList = React.createRef();
    }

    componentDidMount() {
        isMounted = true;
        this.refreshAll();
    }

    componentWillUnmount() {
        isMounted = false;
    }

    handleResizeView = (entries) => {
        if (entries && this.scheduleList && this.footerBarRef) {
            const vWidth = entries[0].contentRect.width;
            const element = ReactDOM.findDOMNode(this.scheduleList);
            const offsetScroll = element.scrollHeight - element.scrollTop !== element.clientHeight;
            this.setState({vWidth: `calc(${vWidth}px + ${offsetScroll ? 1 : 0}vw`});
            this.footerBarRef.setState({vWidth: `calc(${vWidth}px + ${offsetScroll ? 1 : 0}vw`});
            this.lessonsPanelRef.setState({vWidth: `calc(${vWidth / 2}px + ${offsetScroll ? 1 : 0}vw - 150px`});
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
        this.props.setOpen(false);
        axios.get('/schedule').then(res => {
            if (isMounted) {
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
            }
        });
    };

    refreshItem = (currentItem) => {
        this.setState({selectedItem: currentItem, isLoadItem: false});
        axios.get(`/schedule/${currentItem._id}`)
            .then((res) => {
                isMounted && this.setState({selectedItem: res.data, isLoadItem: true})
            });
    };

    handleChangeItem = (item) => {
        this.props.setOpen(false);
        this.refreshItem(item);
    };

    handleClickUndo = () => {
        this.props.setAction(Schedule.ACTION_CANCEL_SAVE, false, () => {
            this.refreshItem(this.state.selectedItem);
        });
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
                            margin: "auto",
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
                                        margin: "auto",
                                        minWidth: this.state.vWidth
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

                            <FooterBar ref={input => this.footerBarRef = input} isOpen={isOpen}>
                                <Button minimal icon="undo" onClick={this.handleClickUndo}
                                        intent={"#"} style={{color:"#F5F8FA"}}>Отменить</Button>
                                <Button minimal icon="edit" onClick={this.handleClickSave}
                                        intent={"#"} style={{color:"#F5F8FA"}}>Сохранить изменения</Button>
                            </FooterBar>
                            <LessonsPanel ref={input => this.lessonsPanelRef = input}/>
                        </div>
                )}
            </FooterPanelConsumer>
        );
    }
}

export default Radium(Schedule);
