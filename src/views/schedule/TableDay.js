import React, {PureComponent} from 'react';
import { Example } from "@blueprintjs/docs-theme";
import { Column, ColumnHeaderCell, EditableCell, EditableName, Table } from "@blueprintjs/table";

class TableDay extends PureComponent {

    static dataKey = (rowIndex, columnIndex) => {
        return `${rowIndex}-${columnIndex}`;
    };

    state = {
        columnNames: ["",""],
        sparseCellData: {}
    };

    componentDidMount() {
        const {day} = this.props;
        this.setState(day);
    }

    componentWillReceiveProps(nextProps) {
        const {day} = nextProps;
        this.setState(day);
    }

    render() {
        const columns = this.state.columnNames.map((_, index) => {
            return (
                <Column key={index} cellRenderer={this.renderCell} columnHeaderCellRenderer={this.renderColumnHeader} />
            );
        });
        return (
            <Example options={false} showOptionsBelowExample={true} {...this.props}>
                <Table enableColumnResizing={false} columnWidths={[150,50]} numRows={7} >{columns}</Table>
            </Example>
        );
    }

    renderCell = (rowIndex, columnIndex) => {
        const dataKey = TableDay.dataKey(rowIndex, columnIndex);
        const value = this.state.sparseCellData[dataKey];
        return (
            <EditableCell
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

    // isValidValue(value) {
    //     return /^[a-zA-Z]*$/.test(value);
    // }

    // nameValidator = (index) => {
    //     return (name) => {
    //         const intent = this.isValidValue(name) ? null : Intent.DANGER;
    //         this.setArrayState("sparseColumnIntents", index, intent);
    //         this.setArrayState("columnNames", index, name);
    //     };
    // };

    // nameSetter = (index) => {
    //     return (name) => {
    //         this.setArrayState("columnNames", index, name);
    //     };
    // };

    // cellValidator = (rowIndex, columnIndex) => {
    //     const dataKey = TableDay.dataKey(rowIndex, columnIndex);
    //     return (value) => {
    //         const intent = this.isValidValue(value) ? null : Intent.DANGER;
    //         this.setSparseState("sparseCellIntent", dataKey, intent);
    //         this.setSparseState("sparseCellData", dataKey, value);
    //     };
    // };

    // cellSetter = (rowIndex, columnIndex) => {
    //     const dataKey = TableDay.dataKey(rowIndex, columnIndex);
    //     return (value) => {
    //         this.setSparseState("sparseCellData", dataKey, value);
    //         this.setSparseState("sparseCellIntent", dataKey);
    //     };
    // };

    // setArrayState(key, index, value) {
    //     const values = this.state[key].slice();
    //     values[index] = value;
    //     this.setState({ [key]: values });
    // }

    // setSparseState(stateKey, dataKey, value) {
    //     const stateData = this.state[stateKey];
    //     const values = { ...stateData, [dataKey]: value };
    //     this.setState({ [stateKey]: values });
    // }
}

export default TableDay;
