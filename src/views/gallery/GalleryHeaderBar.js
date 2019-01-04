import React, {PureComponent} from 'react';
import {Button, FileInput, H5, Popover, PopoverInteractionKind, Spinner} from "@blueprintjs/core";
import * as Classes from "@blueprintjs/core/lib/cjs/common/classes";
import * as PropTypes from "prop-types";
import {validFileName} from "../../utils/validFileName";
import moment from "moment";
import 'moment/locale/ru';

export default class GalleryHeaderBar extends PureComponent {

    static propTypes = {
        onAdd: PropTypes.func
    };

    state = {
        name: "",
        files: [],
        loaded: false,
        isValid: true
    };

    handleClickAdd = () => {
        let {name, files} = this.state;
        if (name === "") {
            name = moment().locale('ru').format("YYYY-MM-DD HH.mm.ss");
        }
        this.props.onAdd({name, files});
    };

    handleInputFiles = (event) => {
        this.setState({loaded: true});
        const acceptedFiles = event.target.files || event.dataTransfer.files;
        acceptedFiles &&
            this.setState({files: Array.from(acceptedFiles), loaded: false});
    };

    handleClosingPopover = () => {
        this.setState({name: "", files:[]});
    };

    handleChangeName = (event) => {
        const name = event.target.value;
        if (name === "" || validFileName(name)) {
            this.setState({name: event.target.value, isValid: true});
        }
        else {
            this.setState({isValid: false});
        }
    };

    render() {

        const imgSrc = this.state.files.length && URL.createObjectURL(this.state.files[0]);
        return (
            <div style={this.props.style}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                }}>
                    <H5 style={{color: "#5C7080", paddingTop: 10, paddingRight: 7}}
                        className="disable-select">Альбомы</H5>

                    <Popover interactionKind={PopoverInteractionKind.CLICK} captureDismiss={true}
                             onClosed={this.handleClosingPopover}
                             content={
                                 <div style={{
                                     padding: 20, flexGrow: 1,
                                     display: "flex", flexDirection: "column",
                                     backgroundColor: "#F5F8FA", width: 300
                                 }}>
                                     <label className="bp3-label">
                                         Наименование
                                         <input className={`bp3-input ${!this.state.isValid && "bp3-intent-danger"}`} type="text" placeholder="Имя альбома"
                                                dir="auto" style={{width: "100%"}} value={this.state.name}
                                                onChange={this.handleChangeName}/>
                                     </label>
                                     {
                                         this.state.loaded
                                             ?
                                             <div style={{position: "relative", margin: "auto"}}>
                                                 <Spinner size={30}/>
                                             </div>
                                             :
                                             this.state.files.length
                                                 ?
                                                 <div style={{position: "relative", margin: "auto"}}>
                                                     <img
                                                         src={imgSrc}
                                                         width={"144px"} height={'auto'} alt={"photoImage"}/>
                                                 </div>
                                                 :
                                                 <label className="bp3-label"
                                                        style={{display: "flex", flexDirection: "column"}}>
                                                     <FileInput fill inputProps={{
                                                         multiple: true,
                                                         accept: "image/jpeg,image/jpg,image/png"
                                                     }}
                                                                title={"Обзор"}
                                                                text={"Выберите изображения..."}
                                                                onInputChange={this.handleInputFiles}/>
                                                 </label>
                                     }
                                     <Button className={Classes.POPOVER_DISMISS}
                                             style={{marginTop: 10}} text={"Создать"}
                                             onClick={this.handleClickAdd}/>
                                 </div>
                             }
                             target={
                                 <Button icon="media" minimal title="Добавить"/>
                             }
                    />
                </div>
            </div>
        );
    }
}
