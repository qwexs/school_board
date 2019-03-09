import React from 'react';
import {Button, Classes, EditableText, H4, Popover, PopoverInteractionKind} from "@blueprintjs/core";
import * as PropTypes from "prop-types";
import TableDay from "./TableDay";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {createSelector} from "reselect";
import {editTitle, editContent} from "../../store/reducers/schedule.reducer";

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

const ScheduleContent = React.forwardRef((props, ref) => {

    const handleChangeTitle = (text) => {
        props.editTitle(text);
    };

    const handleChangeContent = (index, dataKey, text) => {
        const keys = dataKey.split('-');
        props.editContent(index, keys, text);
    };

    return (
        <div style={{...styles.listContainer, paddingBottom: props.isOpen ? 60 : 0}} ref={ref}>
            <div style={{display: "flex", width: "100%"}}>
                <div style={{marginTop: 10, width: "100%"}}>
                    <Popover interactionKind={PopoverInteractionKind.CLICK}
                             content={
                                 <div style={{padding: 5}}>
                                     <Button icon="trash" text={"Удалить класс"} minimal
                                             className={Classes.POPOVER_DISMISS}
                                             onClick={props.onRemoveKlass}/>
                                 </div>
                             }
                             target={
                                 <H4>
                                     <EditableText placeholder={"Название класса..."}
                                                   value={props.title}
                                                   maxLength={20}
                                                   minWidth={"20vw"}
                                                   onChange={handleChangeTitle}/>
                                 </H4>
                             }/>
                    <div style={{
                        width: "90%", margin: "auto",
                        borderBottom: "2px solid silver"
                    }}/>
                </div>
            </div>

            <div style={styles.tableContainer}>
                {props.days.map((itemDay, index) => {
                    return (
                        <div key={index} style={styles.tableCell}>
                            <TableDay index={index} day={itemDay} onConfirm={handleChangeContent}/>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

ScheduleContent.propTypes = {
    onRemoveKlass: PropTypes.func
};

const getTitleState = createSelector(
    [(state) => state.selectedItem.name],
    (title) => title
);

const getDaysState = createSelector(
    [(state) => state.selectedItem.days],
    (days) => days.map(item => {
        let sparseCellData = {};
        item.less.forEach((item, index) => {
            Object.assign(sparseCellData, {[index + "-0"]: item["text"] || ""});
        });
        return {
            columnNames: [item.title],
            sparseCellData
        };
    })
);

const mapStateToProps = state => {
    const {schedule, footer} = state;
    return {
        title: getTitleState(schedule),
        days: getDaysState(schedule),
        isOpen: footer.isOpen
    }
};

const mapDispatchToProps = dispatch => bindActionCreators({editTitle, editContent}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ScheduleContent));
