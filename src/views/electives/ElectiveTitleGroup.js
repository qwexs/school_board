import React, {PureComponent} from 'react';
import {Button, EditableText, H5, Label} from "@blueprintjs/core";
import * as PropTypes from "prop-types";
import {Intent} from "@blueprintjs/core/lib/cjs";

class ElectiveTitleGroup extends PureComponent {

    static propTypes = {
        item: PropTypes.object,
        setOpen: PropTypes.func
    };

    state = {
        item: {},
        onOver: false
    };
    handleOverMouse = () => {
        this.setState({onOver: true});
    };
    handleOutMouse = () => {
        this.setState({onOver: false});
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

    handleInputIcon = (event) => {
        const files = event.target.files || event.dataTransfer.files;
        const inputFile = files[0];
        if (inputFile) {
            this.props.setOpen(true, () => {
                this.setState(prevState => ({item: {...prevState.item, icon: inputFile}}));
            });
        }
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
        const {item} = this.state;
        const imgSrc = item.icon && typeof item.icon !== 'string'
            ? URL.createObjectURL(item.icon)
            : `/${item.icon}`;
        return (
            <div style={{width: "90%", margin: "0 auto", paddingTop: "2%"}}
                 onMouseOver={this.handleOverMouse}
                 onMouseLeave={this.handleOutMouse}>
                <H5 style={{width: "100%", color: "#394B59", paddingBottom: "5px"}}>
                    <EditableText placeholder={"Название электива..."}
                                  value={item.name}
                                  maxLength={60}
                                  maxLines={2}
                                  multiline={true}
                                  onConfirm={this.handleConfirmTitle}
                                  onChange={this.handleChangeTitle}
                    />
                </H5>

                <Label style={{color: "#394B59", paddingBottom: "5px"}}>
                    <EditableText placeholder={"Имя руководителя..."}
                                  value={item.teacher}
                                  maxLength={100}
                                  maxLines={3}
                                  multiline={true}
                                  onConfirm={this.handleConfirmTeacher}
                                  onChange={this.handleChangeTeacher}
                    />
                </Label>
                <Label style={{color: "#394B59", paddingBottom: "5px"}}>
                    <EditableText placeholder={"Место проведения..."}
                                  value={item.place}
                                  maxLength={30}
                                  maxLines={1}
                                  multiline={true}
                                  onConfirm={this.handleConfirmPlace}
                                  onChange={this.handleChangePlace}
                    />
                </Label>
                <div
                    style={{
                        height: "100px",
                        display: "flex",
                        justifyItems: "center",
                        margin: "auto",
                        paddingBottom: "15px",
                    }}>
                    <div style={{margin:"auto",  height:"100%",
                        display: "block",
                        position: "relative",
                        overflow: "hidden",
                    }}>
                        <img style={{
                            maxHeight: '100%',
                            width: "auto",
                            margin: "auto",
                        }} src={imgSrc}
                             alt={item.name}/>
                        <input style={{
                            opacity: 0,
                            lineHeight:4,
                            position: "absolute",
                            left:0,
                        }} type="file" multiple={false} accept="image/jpeg,image/jpg,image/png"
                               onChange={this.handleInputIcon}/>
                    </div>

                    {
                        this.state.onOver &&
                        <div style={{
                            pointerEvents: "none",
                            display: "block",
                            position: "relative",
                            margin: "auto -15px",
                            right: "50%",
                            borderRadius: "50%",
                            backgroundColor: "rgba(57, 75, 89, .8)",

                        }}>
                            <Button style={{color: "#FFFFFF"}} intent={Intent.PRIMARY} minimal icon="edit"
                                    title="Редактировать"/>
                        </div>
                    }

                </div>
            </div>
        );
    }
}

export default ElectiveTitleGroup;
