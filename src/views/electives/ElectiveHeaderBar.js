import React, {PureComponent} from 'react';
import {Button, FileInput, H5, Popover, PopoverInteractionKind} from "@blueprintjs/core";
import * as Classes from "@blueprintjs/core/lib/cjs/common/classes";

export default class ElectiveHeaderBar extends PureComponent {

    state = {
        name: "",
        teacher: "",
        place: "",
        icon: null,
    };

    handleClickAdd = () => {
        this.props.onAdd(this.state);
    };

    handleInputIcon = (event) => {
        event.persist();
        const files = event.target.files || event.dataTransfer.files;
        const inputFile = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            this.setState({iconName: inputFile.name, icon: event.target.result});
        };
        reader.readAsDataURL(inputFile);
    };

    handleClosingPopover = () => {
        this.setState({name: "", teacher: "", place: "", icon: null});
    };

    render() {
        return (
            <div style={this.props.style}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                }}>
                    <H5 style={{color: "#5C7080", paddingTop: 10, paddingRight: 7}}
                        className="disable-select">Элективные курсы</H5>

                    <Popover interactionKind={PopoverInteractionKind.CLICK} captureDismiss={true}
                             onClosed={this.handleClosingPopover}
                             content={
                                 <div style={{
                                     padding: 20, paddingBottom: 20,
                                     display: "flex", flexDirection: "column", flexGrow: 1,
                                     backgroundColor: "#F5F8FA", width: 300
                                 }}>
                                     <label className="bp3-label">
                                         Нименование
                                         <input className="bp3-input" type="text" placeholder="Элективный курс"
                                                dir="auto" style={{width: "100%"}}
                                                onChange={(event) => this.setState({name: event.target.value})}/>
                                     </label>
                                     <label className="bp3-label">
                                         Руководитель
                                         <input className="bp3-input" type="text" placeholder="ФИО"
                                                dir="auto" style={{width: "100%"}}
                                                onChange={(event) => this.setState({teacher: event.target.value})}/>
                                     </label>
                                     <label className="bp3-label">
                                         Место проведения
                                         <input className="bp3-input" type="text" placeholder="Кабинет"
                                                dir="auto" style={{width: "100%"}}
                                                onChange={(event) => this.setState({place: event.target.value})}/>
                                     </label>
                                     {this.state.icon
                                         ?
                                         <div style={{position: "relative", margin: "auto"}}>
                                             <img src={this.state.icon} width={"auto"} height={'auto'} alt={"icon"}/>
                                         </div>
                                         :
                                         <label className="bp3-label"
                                                style={{display: "flex", flexDirection: "column"}}>
                                             <FileInput fill
                                                        inputProps={{
                                                            multiple: false,
                                                            accept: "image/jpeg,image/jpg,image/png"
                                                        }}
                                                        title={"Обзор"}
                                                        text={"Выберите иконку..."}
                                                        onInputChange={this.handleInputIcon}/>
                                         </label>
                                     }
                                     <Button className={Classes.POPOVER_DISMISS}
                                             style={{float: "right", marginBottom: 0}} text={"Создать"}
                                             onClick={this.handleClickAdd}/>
                                 </div>
                             }
                             target={
                                 <Button icon="new-object" minimal title="Добавить"/>
                             }
                    />
                </div>
            </div>
        );
    }
}
