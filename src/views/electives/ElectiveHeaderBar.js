import React, {PureComponent} from 'react';
import {Button, FileInput, Popover, PopoverInteractionKind} from "@blueprintjs/core";
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
        const files = event.target.files || event.dataTransfer.files;
        const inputFile = files[0];
        this.setState(prevState => ({...prevState, icon: inputFile}));
    };

    handleClosingPopover = () => {
        this.setState({name: "", teacher: "", place: "", icon: null});
    };

    render() {
        const imgSrc = this.state.icon && URL.createObjectURL(this.state.icon);
        return (
            <div style={this.props.style}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%"
                }}>
                    <div style={{height: 20}}>
                        <h5 style={{color: "#5C7080"}} className="bp3-heading disable-select">Элективы</h5>
                    </div>

                    <Popover interactionKind={PopoverInteractionKind.CLICK} captureDismiss={true}
                             onClosed={this.handleClosingPopover}
                             content={
                                 <div style={{
                                     padding: 20, paddingBottom: 20,
                                     display: "flex", flexDirection: "column", flexGrow: 1,
                                     backgroundColor: "#F5F8FA", width: 300
                                 }}>
                                     <label className="bp3-label">
                                         Наименование
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
                                             <img src={imgSrc} width={"144px"} height={'auto'} alt={"icon"}/>
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
