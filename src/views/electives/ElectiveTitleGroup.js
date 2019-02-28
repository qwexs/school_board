import React, {PureComponent} from 'react';
import {Button, EditableText, H5, Label} from "@blueprintjs/core";
import * as PropTypes from "prop-types";
import {Intent} from "@blueprintjs/core/lib/cjs";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {changeTitleGroup} from "../../store/reducers/elective.reducer";

class ElectiveTitleGroup extends PureComponent {

    static propTypes = {
        item: PropTypes.object,
        setOpen: PropTypes.func
    };

    state = {
        name: "",
        teacher: "",
        place: "",
        icon: null,
        onOver: false
    };
    handleOverMouse = () => {
        this.setState({onOver: true});
    };
    handleOutMouse = () => {
        this.setState({onOver: false});
    };

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {name, teacher, place, icon} = nextProps;
        this.setState({name, teacher, place, icon});
    }

    handleChangeTitle = (name) => {
        this.setState(prevState => ({...prevState, name}));
    };

    handleChangeTeacher = (teacher) => {
        this.setState(prevState => ({...prevState, teacher}));
    };

    handleChangePlace = (place) => {
        this.setState(prevState => ({...prevState, place}));
    };

    handleInputIcon = (event) => {
        const files = event.target.files || event.dataTransfer.files;
        const inputFile = files[0];
        if (inputFile) {
            this.setState(prevState => ({...prevState, icon: inputFile}), () => {
                this.props.changeTitleGroup(this.state);
            });
        }
    };

    handleConfirmTitle = () => {
        this.props.changeTitleGroup(this.state);
    };

    handleConfirmTeacher = () => {
        this.props.changeTitleGroup(this.state);
    };

    handleConfirmPlace = () => {
        this.props.changeTitleGroup(this.state);
    };

    render() {
        const {name, teacher, place, icon} = this.state;
        const imgSrc = icon && typeof icon !== 'string'
            ? URL.createObjectURL(icon)
            : icon && `/${icon}`;
        return (
            <div style={{width: "90%", margin: "0 auto", paddingTop: "2%"}}
                 onMouseOver={this.handleOverMouse}
                 onMouseLeave={this.handleOutMouse}>
                <H5 style={{width: "100%", color: "#394B59", paddingBottom: "5px"}}>
                    <EditableText placeholder={"Название электива..."}
                                  value={name}
                                  maxLength={60}
                                  maxLines={2}
                                  multiline={true}
                                  onConfirm={this.handleConfirmTitle}
                                  onChange={this.handleChangeTitle}
                    />
                </H5>

                <Label style={{color: "#394B59", paddingBottom: "5px"}}>
                    <EditableText placeholder={"Имя руководителя..."}
                                  value={teacher}
                                  maxLength={100}
                                  maxLines={3}
                                  multiline={true}
                                  onConfirm={this.handleConfirmTeacher}
                                  onChange={this.handleChangeTeacher}
                    />
                </Label>
                <Label style={{color: "#394B59", paddingBottom: "5px"}}>
                    <EditableText placeholder={"Место проведения..."}
                                  value={place}
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
                             alt={name}/>
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

function mapStateToProps(state) {
    return state.elective.selectedItem;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({changeTitleGroup}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ElectiveTitleGroup);
