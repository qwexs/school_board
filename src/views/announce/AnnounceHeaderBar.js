import React from 'react';
import {Button, Popover, PopoverInteractionKind} from "@blueprintjs/core";
import DateWeekPicker from "../../components/day-picker/DateWeekPicker";

export default ({...props}) => {
    return (
        <div style={props.style}>
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
                    <h5 style={{color: "#5C7080"}} className="bp3-heading disable-select">Неделя</h5>
                </div>
                <Popover interactionKind={PopoverInteractionKind.CLICK}
                         content={
                             <DateWeekPicker
                                 {...props}
                             />
                         }
                         target={<Button icon="timeline-events" minimal title="Выберите неделю"/>}
                />

            </div>
        </div>
    );
};
