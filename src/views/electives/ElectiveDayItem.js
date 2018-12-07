import React, {PureComponent} from 'react';
import {Button, Card, Elevation} from "@blueprintjs/core";
import * as Classes from "@blueprintjs/core/lib/cjs/common/classes";
import Radium from "radium";
import {TimePicker} from '@blueprintjs/datetime';
import * as PropTypes from "prop-types";

const styles = {
    viewContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: "100%"
    },
    labelBlockContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "50%",
        height: "100%",
    },
    labelItem: {
        fontSize: "12pt",
        margin: 0,
        width: "100%",
        height: 30,
        textAlign: "center",
        overflowWrap: "normal",
    },
    timeInput: {
        width: 55
    },
    lineElement: {
        borderTop: "1px solid #5C7080",
    },
    labelDescription: {
        width: "60%",
        color: "#5C7080",
    },
    editPanelContainer: {
        display: "flex",
        justifyContent: "flex-end",
        top: 0,
        paddingRight: 0
    },
    topPanelContainer: {
        height: 5, position: "relative"
    }
};

class ElectiveDayItem extends PureComponent {

    static propTypes = {
        handleDraggableStart: PropTypes.func,
        handleDraggableStop: PropTypes.func,
        handleClickItemSave: PropTypes.func,
        handleClickItemRemove: PropTypes.func,
    };

    state = {
        isRoll: false,
        edited: false,
        data: {
            id: "",
            name: "",
            start: new Date(),
            end: new Date()
        },
        isNew: false
    };

    timePickerStartValue;
    timePickerEndValue;

    componentDidMount() {
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {item} = nextProps;
        this.timePickerStartValue = new Date(new Date().setHours(15, 0));
        this.timePickerEndValue = new Date(new Date().setHours(16,0));
        const isNew = item && item.isNew;
        let data;
        if (isNew) {
            data = {id: item.id, name: "", start: this.timePickerStartValue, end: this.timePickerEndValue};
        } else if (item) {
            data = {...item, start: new Date(item.start), end: new Date(item.end)};
        }
        this.setState({
            data, isNew,
            edited: isNew || this.state.edited
        });
    }

    onOverHandler = (event) => {
        event.stopPropagation();
        this.setState({isRoll: true});
    };

    onOutHandler = (event) => {
        event.stopPropagation();
        this.setState({isRoll: false});
    };

    onItemEditedClick = () => {
        this.props.handleDraggableStop(() => this.setState({edited: true}));
    };

    onItemSaveClick = () => {
        const {data} = this.state;
        data.start = this.timePickerStartValue;
        data.end = this.timePickerEndValue;
        this.setState({edited: false}, () => {
            this.props.handleClickItemSave(data);
        });
    };

    onItemCancelClick = () => {
        if (this.state.isNew)
            this.onItemRemoveClick();
        else
            this.props.handleDraggableStart(() => this.setState({edited: false}));
    };

    onItemRemoveClick = () => {
        this.props.handleClickItemRemove(this.state.data);
    };

    handleStartValueChange = (value) => {
        this.timePickerStartValue = value;
    };

    handleEndValueChange = (value) => {
        this.timePickerEndValue = value;
    };

    onInputNameChange = (event) => {
        const {data} = this.state;
        data.name = event.target.value;
        this.setState({...data});
    };

    getTimeFormat = dateValue => {
        let hours = dateValue.getHours();
        let minutes = dateValue.getMinutes();
        let hoursStr = hours < 10 ? `0${hours}` : String(hours);
        let minutesStr = minutes < 10 ? `0${minutes}` : String(minutes);
        return `${hoursStr}.${minutesStr}`
    };

    getTimeText() {
        if (!this.state.data) return null;
        if (isNaN(this.state.data.start.getTime()))
        {
            return this.getTimeFormat(this.state.data.end);
        }
        else if (isNaN(this.state.data.end.getTime()))
        {
            return this.getTimeFormat(this.state.data.start);
        }
        return `${this.getTimeFormat(this.state.data.start)} -
                                ${this.getTimeFormat(this.state.data.end)}`;
    }

    render() {
        const itemStyle = {
            height: this.state.data ? 150 : 50,
                background: "#F5F8FA",
                padding: "5px"
        };
        return (
            <Card style={itemStyle} interactive={!this.state.edited && this.state.data} elevation={Elevation.ONE}
                  onMouseOver={this.onOverHandler} onMouseLeave={this.onOutHandler}>
                {
                    this.state.data
                        ?
                        <div style={{width:"100%", height:"100%"}}>
                            <div style={styles.topPanelContainer}>
                                {
                                    this.state.isRoll && (
                                        this.state.edited
                                            ?
                                            <div style={styles.editPanelContainer}>
                                                <Button minimal icon={"floppy-disk"} title={"Сохранить"}
                                                        onClick={this.onItemSaveClick}>
                                                </Button>
                                                <Button minimal icon={"disable"} title={"Отмена"}
                                                        onClick={this.onItemCancelClick}>
                                                </Button>

                                            </div>
                                            :
                                            <div style={styles.editPanelContainer}>
                                                <Button minimal icon={"edit"} title={"Редактировать"}
                                                        onClick={this.onItemEditedClick}>
                                                </Button>
                                                <Button minimal icon={"cross"} title={"Удалить"}
                                                        onClick={this.onItemRemoveClick}>
                                                </Button>

                                            </div>
                                    )}
                            </div>
                            <div style={styles.viewContainer} className="bp3-ui-text">
                                <div style={[styles.labelBlockContainer, {width:"30%"}]}>
                                    {this.state.edited
                                        ?
                                        <input autoFocus className={Classes.INPUT} style={[styles.labelItem, {width:"60%"}]}
                                               value={this.state.data.name} maxLength={12}
                                               onChange={this.onInputNameChange}/>
                                        :
                                        <label style={styles.labelItem}
                                               className="bp3-label disable-select">
                                            {this.state.data.name}
                                        </label>
                                    }

                                    <label style={styles.labelDescription} className="bp3-monospace-text disable-select">
                                        {!this.state.edited && <div style={styles.lineElement}/>}
                                        класс
                                    </label>
                                </div>
                                <div style={styles.labelBlockContainer}>
                                    {this.state.edited
                                        ?
                                        <div style={{display: "flex", flexDirection: "row"}}>
                                            {!isNaN(this.state.data.start) &&
                                            <TimePicker defaultValue={this.state.data.start} showArrowButtons={true} onChange={this.handleStartValueChange}/>}
                                            {!isNaN(this.state.data.end) &&
                                            <TimePicker defaultValue={this.state.data.end} showArrowButtons={true} onChange={this.handleEndValueChange}/>}
                                        </div>
                                        :
                                        <label style={styles.labelItem}
                                               className="bp3-label disable-select">
                                            {this.getTimeText()}
                                        </label>
                                    }
                                    <label style={styles.labelDescription} className="bp3-monospace-text disable-select">
                                        {!this.state.edited && <div style={styles.lineElement}/>}
                                        время
                                    </label>
                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <label style={{marginTop: 10}} className="bp3-label bp3-disabled disable-select">
                                Событий нет
                            </label>
                        </div>
                }
            </Card>
        );
    }
}

export default Radium(ElectiveDayItem)
