import React, {PureComponent} from 'react';
import {Button, Classes, EditableText, H4, Popover, PopoverInteractionKind} from "@blueprintjs/core";
import Radium from "radium";
import * as PropTypes from "prop-types";
import TableDay from "./TableDay";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as scheduleActions from "../../actions/schedule.actions";
import {createSelector} from "reselect";
import {editTitle, editContent} from "../../actions/schedule.actions";

const styles = {
    listContainer: {
        display: "block",
        overflowY: "auto",
        overflowX: "hidden",
        flexGrow: 1,
        paddingBottom: 15
    },
    tableContainer: {
        display: "flex",
        flexWrap: "wrap",
        flexShrink: 0,
        alignItems: "top",
        justifyContent: "space-evenly",
        padding: "10px 5% 50px 5%",
    },
    tableCell: {
        boxSizing: "border-box",
        padding: "3px 2vw 5vh 3px",
        overflow: "hidden",
    },
};

class ScheduleContent extends PureComponent {

    componentDidMount() {
        // console.log(this.props);
    }

    handleChangeTitle = (text) => {
        this.props.editTitle(text);
    };

    handleChangeContent = (index, dataKey, text) => {
        const keys = dataKey.split('-');
        this.props.editContent(index, keys, text);
    };

    render() {
        return (
            <div style={[styles.listContainer, {paddingBottom: this.props.isOpen ? 60 : 0}]}>
                <div style={{display: "flex", width: "100%"}}>
                    <div style={{marginTop: 10, width: "100%"}}>
                        <Popover interactionKind={PopoverInteractionKind.CLICK}
                                 content={
                                     <div style={{padding: 5}}>
                                         <Button icon="trash" text={"Удалить класс"} minimal
                                                 className={Classes.POPOVER_DISMISS}
                                                 onClick={this.props.onRemoveKlass}/>
                                     </div>
                                 }
                                 target={
                                     <H4>
                                         <EditableText placeholder={"Название класса..."}
                                                       value={this.props.title}
                                                       maxLength={20}
                                                       minWidth={"20vw"}
                                                       onConfirm={this.handleConfirmTitle}
                                                       onChange={this.handleChangeTitle}/>
                                     </H4>
                                 }/>
                        <div style={{
                            width: "90%", margin: "auto",
                            borderBottom: "2px solid silver"
                        }}/>
                    </div>
                </div>

                <div style={styles.tableContainer}>
                    {this.props.days.map((itemDay, index) => {
                        return (
                            <div key={index} style={styles.tableCell}>
                                <TableDay index={index} day={itemDay} onConfirm={this.handleChangeContent}/>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export const geTitleState = createSelector(
    [(state) => state.selectedItem.name],
    (title) => title
);

export const getDaysState = createSelector(
    [(state) => state.selectedItem.days],
    (days) => {
        return days.map(item => {
            let sparseCellData = {};
            item.less.forEach((item, index) => {
                Object.assign(sparseCellData, {[index + "-0"]: item["text"] || ""});
            });
            return {
                columnNames: [item.title],
                sparseCellData
            };
        });
    }
);

const mapStateToProps = state => {
    const {schedule, footer} = state;
    return {
        title: geTitleState(schedule),
        days: getDaysState(schedule),
        isOpen: footer.isOpen
    }
};

const mapDispatchToProps = dispatch => bindActionCreators({editTitle, editContent}, dispatch);

ScheduleContent.propTypes = {
    listData: PropTypes.object,
    onRemoveKlass: PropTypes.func
};

ScheduleContent = Radium(ScheduleContent);
export default connect(mapStateToProps, mapDispatchToProps)(ScheduleContent);
