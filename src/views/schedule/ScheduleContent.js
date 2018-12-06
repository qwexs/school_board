import React, {PureComponent} from 'react';
import TableList from "./TableList";
import {Button, EditableText, H4, Intent, Popover, PopoverInteractionKind} from "@blueprintjs/core";
import Radium from "radium";
import {FooterPanelConsumer} from "../../components/footer/FooterBarProvider";
import PropTypes from "prop-types";
import Schedule from "./Schedule";
import * as Classes from "@blueprintjs/core/lib/cjs/common/classes";

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
        padding: "10px 5% 10px 5%",
    },
    tableCell: {
        boxSizing: "border-box",
        padding: 10,
        overflow: "hidden",
    },
};

class ScheduleContent extends PureComponent {

    state = {
        text: "",
    };

    getData() {
        return {name: this.state.text, days: this.props.listData.days, _id: this.props.listData['_id']};
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {action, listData} = nextProps;
        switch (action) {
            case Schedule.ACTION_ADD_ITEM:
                this.setState({text: ""});
                break;
            case Schedule.ACTION_CANCEL_SAVE:
            case Schedule.ACTION_CHANGE_ITEM:
                this.setState({text: listData && listData.name});
                break;
            default:
                break;
        }
    }

    handleChangeTitle = (text) => {
        this.setState({text});
    };

    handleConfirmData = () => {
        this.props.setAction(Schedule.ACTION_EDIT_ITEM);
    };

    render() {
        return (
            <FooterPanelConsumer>
                {({isOpen}) => (
                    <div style={[styles.listContainer, {paddingBottom: isOpen ? 60 : 0}]}>
                        <div style={{display: "flex", width: "100%"}}>
                            <div style={{marginTop: 10, width: "100%"}}>
                                <Popover interactionKind={PopoverInteractionKind.CLICK}
                                         disabled={!this.props.listData.hasOwnProperty("_id")}
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
                                                               value={this.state.text}
                                                               maxLength={20}
                                                               minWidth={"20vw"}
                                                               onConfirm={this.handleConfirmData}
                                                               onChange={this.handleChangeTitle}/>
                                             </H4>
                                         }/>
                                <div style={{
                                    width: "90%", margin: "auto",
                                    borderBottom: "2px solid silver"
                                }}/>
                            </div>
                        </div>

                        <TableList days={this.props.listData} onConfirm={this.handleConfirmData} {...styles}/>
                    </div>
                )}
            </FooterPanelConsumer>
        );
    }
}

ScheduleContent.propTypes = {
    listData: PropTypes.object,
    onRemoveKlass: PropTypes.func
};

ScheduleContent.defaultProps = {
    listData: {}
};

export default Radium(ScheduleContent);
