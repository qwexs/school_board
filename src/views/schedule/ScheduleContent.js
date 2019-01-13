import React, {PureComponent} from 'react';
import TableList from "./TableList";
import {Button, Classes, EditableText, H4, Popover, PopoverInteractionKind} from "@blueprintjs/core";
import Radium from "radium";
import {FooterPanelConsumer} from "../../components/footer/FooterBarProvider";
import * as PropTypes from "prop-types";
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
        padding: "10px 5% 50px 5%",
    },
    tableCell: {
        boxSizing: "border-box",
        padding: "3px 2vw 5vh 3px",
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

    componentDidMount() {
        const {listData} = this.props;
        this.setState({text: listData.name});
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {listData} = nextProps;
        this.setState({text: listData.name});
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

                        <TableList days={this.props.listData.days} onConfirm={this.handleConfirmData} {...styles}/>
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
