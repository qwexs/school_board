import React, {PureComponent} from 'react';
import {Column, ColumnHeaderCell, EditableCell, EditableName, Table} from "@blueprintjs/table";
import {SelectionModes} from "@blueprintjs/table/lib/cjs/regions";

class TableDay extends PureComponent {

    static dataKey = (rowIndex, columnIndex) => {
        return `${rowIndex}-${columnIndex}`;
    };

    state = {
        columnNames: ["",""],
        sparseCellData: {}
    };

    componentWillMount() {
        const {day} = this.props;
        this.setState(day);
    }

    componentWillReceiveProps(nextProps) {
        const {day} = nextProps;
        this.setState(day);
    }

    handleConfirmData = (dataKey, text) => {
        this.props.onConfirm(this.props.index, dataKey, text);
    };

    render() {
        const columns = this.state.columnNames.map((_, index) => {
            return (
                <Column key={index} cellRenderer={this.renderCell} columnHeaderCellRenderer={this.renderColumnHeader} />
            );
        });
        return (
            <Table enableColumnResizing={false} enableRowResizing={false}
                   selectionModes={SelectionModes.ROWS_AND_CELLS}
                   enableMultipleSelection={false}
                   columnWidths={[150,50]} numRows={7} >{columns}</Table>
        );
    }

    renderCell = (rowIndex, columnIndex) => {
        const dataKey = TableDay.dataKey(rowIndex, columnIndex);
        const value = this.state.sparseCellData[dataKey];
        return (
            <EditableCell truncated={true} onConfirm={(text) => value !== text && this.handleConfirmData(dataKey, text)}
                value={value == null ? "" : value}
            />
        );
    };

    renderColumnHeader = (columnIndex) => {
        const nameRenderer = (name) => {
            return (
                <EditableName
                    name={name}
                />
            );
        };
        return <ColumnHeaderCell name={this.state.columnNames[columnIndex]} nameRenderer={nameRenderer} />;
    };

}

export default TableDay;
