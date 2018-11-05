import React, {Component} from "react";
import TableDay from "./TableDay";

class TableList extends Component {

    render() {
        const {days} = this.props;
        const day = days["den"];
        return (
            <div className="schedule-row">
                {day && day.map((item, index) => {
                    let sparseCellData = {};
                    item["ur"].map((ur, index) =>
                        Object.assign(sparseCellData, {[index+"-0"]:ur["__text"] || "" , [index+"-1"]:ur["_cab"]}));

                    const dayData = {
                        columnNames: [item._id, "каб."],
                        sparseCellData: sparseCellData
                    };

                    return (
                        <div key={index} className="schedule-column">
                            <TableDay day={dayData}/>
                        </div>
                    );
                })}
            </div>
        )
    }
}

export default TableList;
