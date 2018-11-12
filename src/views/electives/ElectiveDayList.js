import React, {PureComponent} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {reorder} from "../../utils/reorder";
import ElectiveDayItem from "./ElectiveDayItem";

const getItemStyle = (isDragging, draggableStyle) => ({
    margin: `0 0 ${25}px 0`,
    background: isDragging ? "#A7B6C2" : null,
    width: "100%",
    ...draggableStyle
});

const styles = {

    groupItemStyle: {

    },

    groupItemContainerStyle: {
        width: "80%",
        margin: "0 auto",
        minWidth: "150px",
        maxWidth: "450px"
    },

    itemStyle: {
        background: "#f5f8fa",
        padding: "5px"
    },
};

class ElectiveDayList extends PureComponent {

    state = {
        collectionList: [],
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {list: {less}} = nextProps;

        if (less !== undefined) {
            if (!Array.isArray(less))
                less = [less];
            this.setState({collectionList: less});
        }
    }

    getItems = () => {
        const result = [];
        this.state.collectionList
            .map((item, index) => {
                return result.push({
                    id: `item-${index}`,
                    content: <ElectiveDayItem item={item} {...styles}
                                              onEditClickHandler={this.onEditClickHandler}
                                              onRemoveClickHandler={this.onRemoveClickHandler}/>
                })
            });
        return result;
    };

    render() {
        return (
            <div style={styles.groupItemStyle}>
                <DragDropContext
                    onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <div ref={provided.innerRef} style={styles.groupItemContainerStyle}>
                                {this.getItems().map((item, index) => (
                                    <Draggable key={index} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef}
                                                 {...provided.draggableProps}
                                                 {...provided.dragHandleProps}
                                                 style={getItemStyle(
                                                     snapshot.isDragging,
                                                     provided.draggableProps.style
                                                 )}
                                            >
                                                {item.content}
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
