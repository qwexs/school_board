import React, {PureComponent} from 'react';
import ScheduleSideItem from "./ScheduleSideItem";
import SideMenu from "../../components/sideBar/SideMenu";
import FooterBar from "../../components/footer/FooterBar";
import {Button, ResizeSensor} from "@blueprintjs/core";
import axios from "axios";
import ScheduleHeaderBar from "./ScheduleHeaderBar";
import Radium from "radium";
import ScheduleContent from "./ScheduleContent";
import {FooterPanelConsumer} from "../../components/footer/FooterBarProvider";
import * as ReactDOM from "react-dom";
import scheduleJSON from './scheduleData';
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
            vWidth: ""
        };

        this.scheduleList = React.createRef();
    }

    componentDidMount() {
        this.refreshAll();
    }

    handleResizeView = (entries) => {
        if (entries) {
            const vWidth = entries[0].contentRect.width;
            const element = ReactDOM.findDOMNode(this.scheduleList);
            const offsetScroll = element.scrollHeight - element.scrollTop !== element.clientHeight;
            this.footerBar.setState({vWidth: `calc(${vWidth}px + ${offsetScroll ? 1 : 0}vw`});
        }
    };

    handleAddKlass = () => {
        this.setState({
            selectedItem: JSON.parse(JSON.stringify(scheduleJSON))
        });
        this.props.setAction(Schedule.ACTION_ADD_ITEM, false);
    };

    handleRemoveKlass = () => {
        axios.delete(`/schedule/${this.state.selectedItem._id}`).then(this.refreshAll);
    };

    handleClickSave = () => {
        const schedule = this.scheduleList.getData();
        if (schedule._id) {
            axios.put(`/schedule/${schedule._id}`, schedule).then(this.refreshAll);
        }
        else {
            axios.post('/schedule/new', schedule).then(this.refreshAll);
        }
    };

    refreshAll = () => {
        axios.get('/schedule').then(res => {
            const currentList = res.data;
            const currentItem = (this.state.selectedItem
                && currentList.filter(item => item._id === this.state.selectedItem._id)[0])
                || currentList[0];
            if (currentItem)
                currentItem.selected = true;
            this.setState({
                list: currentList,
                selectedItem: currentItem
            }, () => {
            this.props.setAction(Schedule.ACTION_CHANGE_ITEM, false);
            });
        });
    };

    refreshItem = () => {
        axios.get(`/schedule/${this.state.selectedItem._id}`)
            .then((res) => {
                this.setState({selectedItem: res.data})
            })
    };

    handleChangeItem = (item) => {
        this.setState({selectedItem: item});
        this.props.setAction(Schedule.ACTION_CHANGE_ITEM, false);
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
                    <div style={[windowStyle]}>
                        <SideMenu {...{sideMenuContainer}}
                                  items={this.state.list}
                                  action={action}
                                  headerBar={
                                      <ScheduleHeaderBar style={styles.headerBar}
                                                         onAdd={this.handleAddKlass}
                                      />
                                  }
                                  onChangeItem={this.handleChangeItem}>
                            <ScheduleSideItem {...styles}/>
                        </SideMenu>

                        <IsNoPage notEmpty={this.state.selectedItem != null}>
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
