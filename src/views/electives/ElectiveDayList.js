import React, {PureComponent} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {reorder} from "../../utils/reorder";
import ElectiveDayItem from "./ElectiveDayItem";
import {Button} from "@blueprintjs/core";
import {ID} from "../../utils/ID";

const getItemStyle = (isDragging, draggableStyle) => ({
    margin: `0 0 ${25}px 0`,
    background: isDragging ? "#A7B6C2" : null,
    width: "100%",
    ...draggableStyle
});

const styles = {

    titleContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 10,
        color: "#5C7080",
    },

    titleLabel: {
        textAlign: "left",
        // paddingLeft: "7%",
        fontWeight: "bold",
        margin: 0
    },

    groupItemStyle: {
        paddingTop: 30,
        paddingBottom: 30
    },

    groupItemContainerStyle: {
        width: "90%",
        margin: "0 auto",
        minWidth: "35vw",
        maxWidth: "450px",
    },

    itemStyle: {
        height: 150,
        background: "#f5f8fa",
        padding: "5px"
    },
};

class ElectiveDayList extends PureComponent {

    state = {
        collectionList: [],
        isDragDisabled: false,
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {list: {less}} = nextProps;

        if (less !== undefined) {
            if (!Array.isArray(less))
                less = [less];

            const collectionList = [];
            less.map(item => {
                const timeRange = item.__text;
                const start = new Date();
                const end = new Date();
                const startStr = timeRange.substr(0, timeRange.indexOf(" "));
                const endStr = timeRange.substr(timeRange.indexOf(" ") + 1, timeRange.length);
                let times = startStr.split('.');
                start.setHours(Number(times[0]), Number(times[1]), 0);
                times = endStr.split('.');
                end.setHours(Number(times[0]), Number(times[1]), 0);
                collectionList.push({
                    id: ID(),
                    name: item._klass,
                    start, end
                });
                return item;
            });
            this.setState({collectionList});
        }
    }

    handleDraggableStop = () => {
        this.setState({isDragDisabled: true});
    };

    handleDraggableStart = () => {
        this.setState({isDragDisabled: false});
    };

    handleClickItemRemove = props => {
        const collectionList = this.state.collectionList.filter(item => item.id !== props.id);
        this.setState({
            collectionList,
        });
    };

    handleClickItemSave = props => {
        const {collectionList} = this.state;

        collectionList.map(item => {
            if (item.id === props.id){
                item = props;
            }
            return item;
        });
        this.setState({collectionList});
    };

    render() {
        return (
            <div style={styles.groupItemStyle}>
                <DragDropContext
                    onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <div ref={provided.innerRef} style={styles.groupItemContainerStyle}>
                                <div style={styles.titleContainer}>
                                    <label style={styles.titleLabel}
                                           className="bp3-label bp3-monospace-text">
                                        {this.props.list._id}
                                    </label>
                                    <Button minimal title="Добавить" icon="add-to-artifact"/>
                                </div>
                                {this.state.collectionList.map((item, index) => (
                                    <Draggable key={index} draggableId={`item-${index}`} index={index} isDragDisabled={this.state.isDragDisabled}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef}
                                                 {...provided.draggableProps}
                                                 {...provided.dragHandleProps}
                                                 style={getItemStyle(
                                                     snapshot.isDragging,
                                                     provided.draggableProps.style
                                                 )}
                                            >
                                                <ElectiveDayItem item={item} index={index} {...styles}
                                                                 handleDraggableStop={this.handleDraggableStop}
                                                                 handleDraggableStart={this.handleDraggableStart}
                                                                 handleClickItemSave={this.handleClickItemSave}
                                                                 handleClickItemRemove={this.handleClickItemRemove}/>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const collectionList = reorder(
            this.state.collectionList,
            result.source.index,
            result.destination.index
        );

        this.setState({
            collectionList,
        });
    };
}

export default ElectiveDayList;
