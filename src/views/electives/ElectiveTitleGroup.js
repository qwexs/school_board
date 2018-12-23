import React, {PureComponent} from 'react';
import {Button, EditableText, H5, Label, Popover, PopoverInteractionKind} from "@blueprintjs/core";
import * as Classes from "@blueprintjs/core/lib/cjs/common/classes";
import * as PropTypes from "prop-types";

class ElectiveTitleGroup extends PureComponent {

    static propTypes = {
        item: PropTypes.object,
        onRemoveElective: PropTypes.func,
        setOpen: PropTypes.func
    };

    state = {
        item: {}
    };

    componentWillMount() {
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
            <div>
                <div style={{margin: 10}}>
                    <Popover interactionKind={PopoverInteractionKind.CLICK}
                             content={
                                 <div style={{padding: 5}}>
                                     <Button icon="trash" text={"Удалить электив"} minimal
                                             className={Classes.POPOVER_DISMISS}
                                             onClick={this.props.onRemoveElective}/>
                                 </div>

                             }
                             target={
                                 <H5 style={{ width:"100%", color:"#394B59"}}>
                                     <EditableText placeholder={"Название электива..."}
                                                   value={this.state.item.name}
                                                   maxLength={60}
                                                   maxLines={2}
                                                   multiline={true}
                                                   onConfirm={this.handleConfirmTitle}
                                                   onChange={this.handleChangeTitle}
                                     />
                                 </H5>
                             }/>

                    <Label style={{color:"#394B59"}}>
                        <EditableText placeholder={"Имя руководителя..."}
                                      value={this.state.item.teacher}
                                      maxLength={100}
                                      maxLines={3}
                                      multiline={true}
                                      onConfirm={this.handleConfirmTeacher}
                                      onChange={this.handleChangeTeacher}
                        />
                    </Label>
                    <Label style={{color:"#394B59"}}>
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
            </div>
        );
    }
}

export default ElectiveTitleGroup;
