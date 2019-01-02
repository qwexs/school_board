import React, {PureComponent} from 'react';
import {EditableText, H5, Label} from "@blueprintjs/core";
import * as PropTypes from "prop-types";

class ElectiveTitleGroup extends PureComponent {

    static propTypes = {
        item: PropTypes.object,
        setOpen: PropTypes.func
    };

    state = {
        item: {}
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {item} = nextProps;
        this.setState({item})
    }

    handleChangeTitle = (text) => {
        this.setState(prevState => ({item: {...prevState.item, name: text}}));
    };

    handleChangeTeacher = (text) => {
        this.setState(prevState => ({item: {...prevState.item, teacher: text}}));
    };

    handleChangePlace = (text) => {
        this.setState(prevState => ({item: {...prevState.item, place: text}}));
    };

    handleConfirmTitle = (text) => {
        this.props.setOpen(true, () => {
            this.handleChangeTitle(text)
        });
    };

    handleConfirmTeacher = (text) => {
        this.props.setOpen(true, () => {
            this.handleChangeTeacher(text)
        });
    };

    handleConfirmPlace = (text) => {
        this.props.setOpen(true, () => {
            this.handleChangePlace(text)
        });
    };

    render() {
        return (
            <div style={{width: "90%", margin: "0 auto", marginTop: "2%"}}>
                <H5 style={{width: "100%", color: "#394B59", paddingBottom: "5px"}}>
                    <EditableText placeholder={"Название электива..."}
                                  value={this.state.item.name}
                                  maxLength={60}
                                  maxLines={2}
                                  multiline={true}
                                  onConfirm={this.handleConfirmTitle}
                                  onChange={this.handleChangeTitle}
                    />
                </H5>

                <Label style={{color: "#394B59", paddingBottom: "5px"}}>
                    <EditableText placeholder={"Имя руководителя..."}
                                  value={this.state.item.teacher}
                                  maxLength={100}
                                  maxLines={3}
                                  multiline={true}
                                  onConfirm={this.handleConfirmTeacher}
                                  onChange={this.handleChangeTeacher}
                    />
                </Label>
                <Label style={{color: "#394B59", paddingBottom: "5px"}}>
                    <EditableText placeholder={"Место проведения..."}
                                  value={this.state.item.place}
                                  maxLength={30}
                                  maxLines={1}
                                  multiline={true}
                                  onConfirm={this.handleConfirmPlace}
                                  onChange={this.handleChangePlace}
                    />
                </Label>
            </div>
        );
    }
}

export default ElectiveTitleGroup;
