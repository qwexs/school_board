import React from "react";
import TableDay from "./TableDay";

export default React.memo(({...props}) => {

    const {days, tableContainer, tableCell} = props;
    const lessons = (days && days.days) || [];
    let sparseCellData;

    const handleConfirmData = (index, dataKey, text) => {
        const keys = dataKey.split('-');
        lessons[index]["less"][Number(keys[0])][Number(keys[1]) ? "cab" : "text"] = text;
        props.onConfirm();
    };

    return (
        <div style={tableContainer}>
            {lessons && lessons.map((item, index) => {
                sparseCellData = {};
                item["less"].map((item, index) =>
                    Object.assign(sparseCellData, {[index + "-0"]: item["text"] || "", [index + "-1"]: item["cab"]}));

                const dayData = {
                    columnNames: [item.title, "каб."],
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
