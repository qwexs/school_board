import React from "react";
import TableDay from "./TableDay";

export default React.memo(({...props}) => {

    const {days, tableContainer, tableCell} = props;
    let sparseCellData;

    const handleConfirmData = (index, dataKey, text) => {
        const keys = dataKey.split('-');
        days[index]["less"][Number(keys[0])][Number(keys[1]) ? "cab" : "text"] = text;
        props.onConfirm();
    };

    return (
        <div style={tableContainer}>
            {days && days.map((itemDay, index) => {
                sparseCellData = {};
                itemDay.less.map((item, index) =>
                    Object.assign(sparseCellData, {[index + "-0"]: item["text"] || "", [index + "-1"]: item["cab"]}));

                const dayData = {
                    columnNames: [itemDay.title, "каб."],
                    sparseCellData: sparseCellData
                };

                return (
                    <div key={index} style={tableCell}>
                        <TableDay index={index} day={dayData} onConfirm={handleConfirmData}/>
                    </div>
                );
            })}
        </div>
    );
});
