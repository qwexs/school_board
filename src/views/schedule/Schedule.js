import React, {PureComponent} from 'react';
import ScheduleSideItem from "./ScheduleSideItem";
import SideMenu from "../../components/sideBar/SideMenu";
import FooterBar from "../../components/footer/FooterBar";
import {Button, ResizeSensor, Spinner} from "@blueprintjs/core";
import ScheduleHeaderBar from "./ScheduleHeaderBar";
import ScheduleContent from "./ScheduleContent";
import * as ReactDOM from "react-dom";
import EmptyPage from "../../components/emptyPage";
import LessonsPanel from "./LessonsPanel";
import * as footerActions from "../../store/reducers/footer.reducer";
import {bindActionCreators} from "redux";
import scheduleReducer, {
    addItem,
    refreshAll,
    refreshItem,
    removeItem,
    saveItem
} from "../../store/reducers/schedule.reducer";
import {withReducer} from "../../store/withReducer";

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

    componentDidMount() {
        this.props.service.refreshAll();
    }

    handleAddKlass = (name) => {
        this.props.service.addItem(name);
    };

    handleRemoveKlass = () => {
        this.props.service.removeItem();
    };

    handleClickSave = () => {
        this.props.service.saveItem();
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
        const {windowStyle, isLoadingList, isLoadingItem} = this.props;
        return (
            isLoadingList
                ?
                <div style={{
                    position: "relative",
                    margin: "auto",
                }}>
                    <Spinner/>
                </div>
                :
                <div style={windowStyle}>
                    <SideMenu headerBar={
                            <ScheduleHeaderBar style={styles.headerBar}
                                               onAdd={this.handleAddKlass}
                            />
                        }>
                        <ScheduleSideItem {...styles}/>
                    </SideMenu>
                    {
                        isLoadingItem
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
                                notEmpty={this.props.selectedItem !== null
                                && this.props.selectedItem.days
                                && typeof this.props.selectedItem.days[0] !== 'string'}>
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

const mapStateToProps = (state) => state.schedule;

const mapDispatchToProps = dispatch => ({
    footer: bindActionCreators(footerActions, dispatch),
    service: bindActionCreators({refreshAll, refreshItem, removeItem, saveItem, addItem}, dispatch)
});


export default withReducer("schedule", scheduleReducer, mapStateToProps, mapDispatchToProps)(Schedule);
