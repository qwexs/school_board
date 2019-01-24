import React, {PureComponent} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import AnnounceSideItem from "./AnnounceSideItem";
import AnnounceList from "./AnnounceList";
import FooterBar from "../../components/footer/FooterBar";
import {Button, Spinner} from "@blueprintjs/core";
import {ResizeSensor} from "@blueprintjs/core";
import AnnounceHeaderBar from "./AnnounceHeaderBar";
import {FooterPanelConsumer} from "../../components/footer/FooterBarProvider";
import axios from "axios";
import * as ReactDOM from "react-dom";
import moment from "moment";

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
        justifyContent: "center",
        border: "1px solid lightgrey",
        height: 50,
        width: "100%"
    }
};

let isMounted = false;

class Announce extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedItem: null,
            selectedDate: null,
            isLoad:false,
            isLoadList:false
        };
    }

    componentDidMount() {
        isMounted = true;
        this.refreshAll();
    }

    componentWillUnmount() {
        isMounted = false;
    }

    refreshAll = () => {
        this.setState({isLoad: false});
        axios.get(`/announce${this.state.selectedDate ? "/" + 
            moment(this.state.selectedDate).startOf("isoWeek").utc(true).toDate().getTime() : ""}`).then(res => {
            const currentList = res.data.items;
            const currentItem = (this.state.selectedItem && currentList.filter(item => item._id === this.state.selectedItem._id)[0]) || currentList[0];
            isMounted && this.setState({
                list: currentList,
                selectedItem: currentItem,
                selectedDate: new Date(res.data.date),
                isLoad: true,
                isLoadList: true,
            }, () => this.props.setOpen(false));
        });
    };

    handleChangeItem = (item) => {
        this.props.setOpen(false);
        this.setState({selectedItem: JSON.parse(JSON.stringify(item))});
        this.componentList.scrollTop = 0;
    };

    handleResizeView = (entries) => {
        const element = ReactDOM.findDOMNode(this.componentList);
        if (entries && element && this.footerBar) {
            const vWidth = entries[0].contentRect.width;
            const offsetScroll = element.scrollHeight - element.scrollTop !== element.clientHeight;
            this.footerBar.setState({vWidth: `calc(${vWidth}px + ${offsetScroll ? 1 : 0}vw`});
        }
    };

    handleInsertItem = (itemList, callback = null) => {
        this.savedItem = itemList;
        this.props.setOpen(true, callback);
    };

    handleSaveItem = () => {
        axios.put(`/announce/day/${this.state.selectedItem._id}`, this.savedItem)
            .then(this.refreshAll);
    };

    handleCancelSave = () => {
        axios.get(`/announce/day/${this.state.selectedItem._id}`).then((value => {
            this.setState({selectedItem: value.data},
                () => this.props.setOpen(false));
        }));
    };

    handleChangeWeek = (date) => {
        this.setState({isLoadList: false});
        axios.get(`/announce/${date}`).then((value) => {
            this.setState(prevState => ({
                ...prevState,
                list: value.data.items,
                selectedItem: value.data.items[0],
                selectedDate: new Date(value.data.date),
                isLoadList: true
            }));
        });
    };

    render() {
        const {windowStyle, sideMenuContainer} = this.props;
        let indexDay = 0;
        const dateFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'};
        this.state.list.forEach((item, index) => {
            if (item._id === this.state.selectedItem._id) {
                indexDay = index + 1;
            }
        });
        return (
            <FooterPanelConsumer>
                {({setOpen, isOpen}) => (
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
                            {
                                !this.state.isLoadList
                                    ?
                                    <div style={{
                                        position: "relative",
                                        margin: "auto"
                                    }}>
                                        <Spinner/>
                                    </div>
                                    :
                                    <AnnounceList onInsert={this.handleInsertItem}
                                                  setOpen={setOpen}
                                                  ref={ref => this.componentList = ref}
                                                  titleDay={
                                                      moment(this.state.selectedDate).day(indexDay).toDate()
                                                          .toLocaleDateString('ru', dateFormatOptions)}
                                                  list={this.state.selectedItem} {...styles}/>
                            }
                        </ResizeSensor>
                        <FooterBar ref={input => this.footerBar = input} isOpen={isOpen}>
                            <Button minimal icon="undo" onClick={this.handleCancelSave}
                                    intent={"#"} style={{color:"#F5F8FA"}}>Отменить</Button>
                            <Button minimal icon="edit" onClick={this.handleSaveItem}
                                    intent={"#"} style={{color:"#F5F8FA"}}>Сохранить изменения</Button>
                        </FooterBar>
                    </div>
                )}
            </FooterPanelConsumer>
        );
    }
}

export default Announce;
