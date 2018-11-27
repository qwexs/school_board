import React, {PureComponent} from 'react';
import TableList from "./TableList";
import {Button, EditableText, H4, Intent, Popover, PopoverInteractionKind} from "@blueprintjs/core";
import axios from "axios";
import Radium from "radium";
import {FooterPanelConsumer} from "../../components/footer/FooterBarProvider";
import PropTypes from "prop-types";
import IsNoPage from "../../components/IsNoPage";
import Schedule from "./Schedule";

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
        edited: false,
        maxLength: 13,
        contentHeight: 0
    };

    getData() {
        return {name: this.state.text, days: this._data};
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.listData && nextProps.action === Schedule.ACTION_CHANGE_ITEM)
            this.setState({text: nextProps.listData.name});
        else if (nextProps.action === Schedule.ACTION_REMOVE_ITEM) {

        }
    }

    handleChangeTitle = (text) => {
        this.setState({text, edited: true}, () => this.props.setOpen(true));
    };

    handleConfirmData = (data) => {
        this._data = data;
        this.props.setOpen(true);
    };

    handleRemoveKlass = () => {
        axios.delete(`/schedule/${this.props.listData._id}`).then(this.props.refresh);
    };

    render() {
        return (
            <IsNoPage notEmpty={this.props.listData}>
                <FooterPanelConsumer>
                    {({isOpen, setAction}) => (
                        <div style={[styles.listContainer, {paddingBottom: isOpen ? 60 : 0}]}>
                            <div style={{display: "flex", width: "100%"}}>
                                <div style={{marginTop: 10, width: "100%"}}>
                                    <Popover interactionKind={PopoverInteractionKind.CLICK}
                                             content={
                                                 <div style={{padding: 5}}>
                                                     <Button icon="trash" text={"Удалить класс"} minimal
                                                             onClick={this.handleRemoveKlass}/>
                                                 </div>

                                             }
                                             target={
                                                 <H4>
                                                     <EditableText intent={Intent.NONE}
                                                                   placeholder={"Название класса..."}
                                                                   value={this.state.text}
                                                                   maxLength={this.state.maxLength}
                                                                   minWidth={180}
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
            </IsNoPage>
        );
    }
}

ScheduleContent.propTypes = {
    listData: PropTypes.object
};

ScheduleContent.defaultProps = {
    listData: {}
};

export default Radium(ScheduleContent);
