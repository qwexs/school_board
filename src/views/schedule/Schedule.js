import React, {PureComponent} from 'react';
import ScheduleSideItem from "./ScheduleSideItem";
import SideMenu from "../../components/sideBar/SideMenu";
import FooterBar from "../../components/footer/FooterBar";
import {Button, ResizeSensor} from "@blueprintjs/core";
import axios from "axios";
import ScheduleHeaderBar from "./ScheduleHeaderBar";
import Radium from "radium";
import ScheduleList from "./ScheduleContent";
import FooterBarProvider, {FooterPanelConsumer} from "../../components/footer/FooterBarProvider";
import * as ReactDOM from "react-dom";
import scheduleJSON from './scheduleData';

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
    headerBar: {
        backgroundColor: "#edf0f2",
        padding: 10,
        border: "1px solid lightgrey",
        height: 50
    }

};

class Schedule extends PureComponent {

    static ACTION_ADD_ITEM = "addItem";
    static ACTION_REMOVE_ITEM = "removeItem";
    static ACTION_CHANGE_ITEM = "changeItem";

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
        // const raspData = xml2json("/assets/data/rasp.xml");
        // const currentList = raspData["school"]["klass"];
        // console.log(currentList);
        // console.log(JSON.stringify(currentList));

        // this.setState({
        //     list: currentList,
        //     selectedItem: currentList[0]
        // });
        // this.setState({
        //     list: [scheduleJSON],
        //     selectedItem: scheduleJSON
        // });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log(nextProps);
    }

    handleChangeItem = (target) => {
        this.setState({selectedItem: target.props.item});
    };

    handleResizeView = (entries) => {
        const element = ReactDOM.findDOMNode(this.scheduleList);
        const offsetScroll = element.scrollHeight - element.scrollTop !== element.clientHeight;
        if (entries) {
            this.setState({vWidth: `calc(${entries[0].contentRect.width}px + ${offsetScroll ? 1 : 0}vw`});
        }
    };

    handleAddKlass = () => {
        this.setState({
            // list: [scheduleJSON],
            selectedItem: JSON.parse(JSON.stringify(scheduleJSON))
        });
    };

    handleRemoveKlass = () => {

    };

    handleSaveData = () => {
        axios.post('/schedule', this.scheduleList.getData()).then(this.refreshAll);
    };

    refreshAll = () => {
        axios.get('/schedule').then(res => {
            const currentList = res.data;
            this.setState({
                list: currentList,
                selectedItem: currentList[0]
            });
            // console.log(res.data);
        });
    };

    refreshItem = () => {
        axios.get(`/schedule/${this.state.selectedItem.days._id}`).then((res) => this.setState({selectedItem: res.data}))
    };

    render() {
        const {windowStyle, sideMenuContainer} = this.props;
        return (
            <FooterPanelConsumer>
                {({setOpen, isOpen, setAction, action}) => (
                    <div style={[windowStyle]}>
                        <SideMenu {...{sideMenuContainer}}
                                  items={this.state.list}
                                  headerBar={
                                      <ScheduleHeaderBar style={styles.headerBar}
                                                         onAdd={()=> this.setState({
                                                             selectedItem: JSON.parse(JSON.stringify(scheduleJSON))
                                                         }, () => setAction(Schedule.ACTION_ADD_ITEM, false))}
                                                         />
                                  }
                                  onChangeItem={(target) => this.setState({selectedItem: target.props.item},
                                      () => setAction(Schedule.ACTION_CHANGE_ITEM, false))}>
                            <ScheduleSideItem {...styles}/>
                        </SideMenu>

                            <ResizeSensor onResize={this.handleResizeView}>
                                <ScheduleList ref={(item) => this.scheduleList = item}
                                              listData={this.state.selectedItem}
                                              setOpen={setOpen}
                                              action={action}
                                              refresh={this.refreshAll}
                                              {...styles}/>
                            </ResizeSensor>
                        <FooterBar width={this.state.vWidth} isOpen={isOpen}>
                            <Button minimal icon="undo" onClick={() => setOpen(false)}>Отменить</Button>
                            <Button minimal icon="edit" onClick={this.handleSaveData}>Сохранить изменения</Button>
                        </FooterBar>
                    </div>
                )}
            </FooterPanelConsumer>
        );
    }
}

export default Radium(Schedule);
