import React, {PureComponent} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import ElectiveDayItem from "./ElectiveDayItem";
import {Button} from "@blueprintjs/core";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {addLessItem, changeLessItem, removeLessItem, reorderLessList} from "../../store/reducers/elective.reducer";

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
        fontWeight: "bold",
        margin: 0
    },

    groupItemStyle: {
        paddingTop: 30,
        paddingBottom: 30
    },

    groupItemContainerStyle: {
        width: "95%",
        margin: "0 auto",
        minWidth: "35vw",
        maxWidth: "450px",
    },
};

class ElectiveDayList extends PureComponent {

    state = {
        isDragDisabled: false,
    };

    handleDraggableStop = (callback = null) => {
        this.setState({isDragDisabled: true}, callback);
    };

    handleDraggableStart = (callback = null) => {
        this.setState({isDragDisabled: false}, callback);
    };

    handleClickItemRemove = lessItem => {
        this.props.removeLessItem(lessItem, this.props.item);
    };

    handleClickItemSave = lessItem => {
        this.props.changeLessItem(lessItem, this.props.item);
        this.setState({
            isDragDisabled: this.props.item.less.some(item => item.isNew)
        });
    };

    handleClickItemAdd = () => {
        this.props.addLessItem(this.props.item);
        this.setState({
            isDragDisabled: true
        });
    };

    onDragEnd = (result) => {
        if (!result.destination)
            return;
        this.props.reorderLessList(this.props.item, result);
    };

    render() {
        const {item} = this.props;
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
                                        {item.title}
                                    </label>
                                    <Button minimal title="Добавить" icon="add-to-artifact"
                                            onClick={this.handleClickItemAdd}/>
                                </div>
                                {item.less.length
                                    ?
                                    item.less.map((item, index) => (
                                        <Draggable key={index} draggableId={`item-${index}`} index={index}
                                                   isDragDisabled={this.state.isDragDisabled}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef}
                                                     {...provided.draggableProps}
                                                     {...provided.dragHandleProps}
                                                     style={getItemStyle(
                                                         snapshot.isDragging,
                                                         provided.draggableProps.style
                                                     )}
                                                >
                                                    <ElectiveDayItem item={item} key={index} index={index} {...styles}
                                                                     handleDraggableStop={this.handleDraggableStop}
                                                                     handleDraggableStart={this.handleDraggableStart}
                                                                     handleClickItemSave={this.handleClickItemSave}
                                                                     handleClickItemRemove={this.handleClickItemRemove}/>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                    :
                                    <ElectiveDayItem {...styles}/>
                                }
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return state.elective.selectedItem;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({reorderLessList, changeLessItem, addLessItem, removeLessItem}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ElectiveDayList);
