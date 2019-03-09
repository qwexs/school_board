import React from 'react';
import ElectiveDayList from "./ElectiveDayList";
import {Spinner} from "@blueprintjs/core";
import ElectiveTitleGroup from "./ElectiveTitleGroup";

const ElectiveWeekList = React.forwardRef(({contentStyle, isLoadingItem, selectedItem, footer}, ref) => {

    const {isOpen} = footer;

    return (
        <div style={{
            width: "100%",
            height: "100%"
        }}>
            {isLoadingItem
                ?
                <div style={{
                    position: "relative",
                    minWidth: contentStyle.minWidth,
                    top: "50%"
                }}>
                    <Spinner/>
                </div>
                :
                <div style={{...contentStyle, ...{paddingBottom: isOpen ? 60 : 0}}}
                     ref={ref}>
                    <ElectiveTitleGroup item={selectedItem}/>
                    <div style={{
                        width: "90%", margin: "auto",
                        borderBottom: "2px solid silver"
                    }}/>
                    {
                        selectedItem.items && selectedItem.items.map((item, index) =>
                            <ElectiveDayList key={index} item={item} {...contentStyle}/>)
                    }
                </div>
            }
        </div>
    );
});

export default React.memo(ElectiveWeekList);
