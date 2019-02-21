import React, {PureComponent} from 'react';
import ScheduleSideItem from "./ScheduleSideItem";
import SideMenu from "../../components/sideBar/SideMenu";
import FooterBar from "../../components/footer/FooterBar";
import {Button, ResizeSensor, Spinner} from "@blueprintjs/core";
import ScheduleHeaderBar from "./ScheduleHeaderBar";
import Radium from "radium";
import ScheduleContent from "./ScheduleContent";
import * as ReactDOM from "react-dom";
import EmptyPage from "../../components/emptyPage";
import LessonsPanel from "./LessonsPanel";
import {connect} from 'react-redux';
import * as footerActions from "../../store/actions/footer.actions";
import {bindActionCreators} from "redux";
import {addItem, refreshAll, refreshItem, removeItem, saveItem} from "../../store/actions";

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

class Schedule extends PureComponent {

    constructor(props) {
        super(props);
        this.scheduleList = React.createRef();
    }

    componentDidMount() {
        this.props.api.refreshAll();
    }

    handleAddKlass = (name) => {
        this.props.api.addItem(name);
    };

    handleRemoveKlass = () => {
        this.props.api.removeItem();
    };

    handleClickSave = () => {
        this.props.api.saveItem();
    };

    handleClickUndo = () => {
        this.props.footer.cancelChanges();
    };

    handleResizeView = (entries) => {
        if (entries && this.scheduleList) {
            const contentWidth = entries[0].contentRect.width;
            const element = ReactDOM.findDOMNode(this.scheduleList);
            const offsetScroll = element.scrollHeight - element.scrollTop !== element.clientHeight;
            this.props.footer.setContentWidth(`calc(${contentWidth}px + ${offsetScroll ? 1 : 0}vw)`);
            this.lessonsPanelRef.setState({vWidth: `calc(${contentWidth / 2}px + ${offsetScroll ? 1 : 0}vw - 150px)`});
        }
    };

    render() {
        const {windowStyle} = this.props;
        return (
            this.props.isLoadingList
                ?
                <div style={{
                    position: "relative",
                    margin: "auto",
                }}>
                    <Spinner/>
                </div>
                :
                <div style={windowStyle}>
                    <SideMenu ref={ref => this.sideMenuRef = ref}
                        headerBar={
                            <ScheduleHeaderBar style={styles.headerBar}
                                               onAdd={this.handleAddKlass}
                            />
                        }>
                        <ScheduleSideItem {...styles}/>
                    </SideMenu>
                    {
                        this.props.isLoadingItem
                            ?
                            <div style={{
                                position: "relative",
                                margin: "auto",
                                minWidth: this.props.vWidth
                            }}>
                                <Spinner/>
                            </div>
                            :
                            <EmptyPage
                                notEmpty={this.props.selectedItem !== null && typeof this.props.selectedItem.days[0] !== 'string'}>
                                <ResizeSensor onResize={this.handleResizeView}>
                                    <ScheduleContent ref={inputRef => (this.scheduleList = inputRef)}
                                                     onRemoveKlass={this.handleRemoveKlass}
                                                     {...styles}/>
                                </ResizeSensor>
                            </EmptyPage>
                    }

                    <FooterBar>
                        <Button minimal icon="undo" onClick={this.handleClickUndo}
                                intent={"#"} style={{color: "#F5F8FA"}}>Отменить</Button>
                        <Button minimal icon="edit" onClick={this.handleClickSave}
                                intent={"#"} style={{color: "#F5F8FA"}}>Сохранить изменения</Button>
                    </FooterBar>
                    <LessonsPanel ref={input => this.lessonsPanelRef = input}/>
                </div>
        );
    }
}

const mapStateToProps = (state) => ({...state.schedule});

const mapDispatchToProps = dispatch => {
    return {
        footer: bindActionCreators(footerActions, dispatch),
        api: bindActionCreators({refreshAll, refreshItem, removeItem, saveItem, addItem}, dispatch)
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Radium(Schedule));
