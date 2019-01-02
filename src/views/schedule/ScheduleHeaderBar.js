import React from 'react';
import {Button, Popover, PopoverInteractionKind} from "@blueprintjs/core";
import * as Classes from "@blueprintjs/core/lib/cjs/common/classes";

export default class ScheduleHeaderBar extends React.PureComponent {

    state = {
        name: ""
    };

    handleClickAddKlass = () => {
        this.props.onAdd(this.state.name);
    };

    handleClosingPopover = () => {
        this.setState({name: ""});
    };

    render() {
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
                        <h5 style={{color: "#5C7080"}} className="bp3-heading disable-select">Классы</h5>
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
                                         <input autoFocus={true} className="bp3-input" type="text" placeholder="Название класса"
                                                dir="auto" style={{width: "100%"}}
                                                onChange={(event) => this.setState({name: event.target.value})}/>
                                     </label>
                                     <Button className={Classes.POPOVER_DISMISS}
                                             style={{float: "right", marginBottom: 0}} text={"Создать класс"}
                                             onClick={this.handleClickAddKlass}/>
                                 </div>
                             }
                             target={
                                 <Button icon="folder-new" minimal title="Добавить класс"/>
                             }
                    />
                </div>
            </div>
        );
    }
};
