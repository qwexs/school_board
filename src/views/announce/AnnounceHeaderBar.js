import React from 'react';
import {Button, Popover, PopoverInteractionKind} from "@blueprintjs/core";
import DateWeekPicker from "../../components/day-picker/DateWeekPicker";

export default React.memo(({...props}) => {
    return (
        <div style={props.style}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
            }}>
                <h5 style={{color: "#5C7080", paddingTop: 10, paddingRight: 7}}
                    className="bp3-heading disable-select">Неделя</h5>
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
});
