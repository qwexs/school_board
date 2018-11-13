import React from "react";
import TableDay from "./TableDay";

export default React.memo(({...props}) => {

    const {days, tableContainer, tableCell} = props;
    const day = days["den"];
    return (
        <div style={{
            width: "100%",
            height: "100%"
        }}>
            <div style={tableContainer}>
                {day && day.map((item, index) => {
                    let sparseCellData = {};
                    item["ur"].map((ur, index) =>
                        Object.assign(sparseCellData, {[index+"-0"]:ur["__text"] || "" , [index+"-1"]:ur["_cab"]}));

                    const dayData = {
                        columnNames: [item._id, "каб."],
                        sparseCellData: sparseCellData
                    };

                    return (
                        <div key={index} style={tableCell}>
                            <TableDay day={dayData} />
                        </div>
                    );
                })}
            </div>
        </div>

    );
});
