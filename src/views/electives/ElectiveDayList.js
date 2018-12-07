import React, {PureComponent} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {reorder} from "../../utils/reorder";
import ElectiveDayItem from "./ElectiveDayItem";
import {Button} from "@blueprintjs/core";
import {ID} from "../../utils/ID";
import Elective from "./Elective";

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
};

class ElectiveDayList extends PureComponent {

    state = {
        less: [],
        isDragDisabled: false,
    };

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {list: {less}} = nextProps;
        this.setState({less: less || []});

        if (nextProps.action === Elective.ACTION_SAVE_ITEM) {
            this.props.onSave({id:nextProps.list._id, less: this.state.less});
        }
    }

    handleDraggableStop = (callback = null) => {
        this.setState({isDragDisabled: true}, callback);
    };

    handleDraggableStart = (callback = null) => {
        this.setState({isDragDisabled: false}, callback);
    };

    handleClickItemRemove = props => {
        const less = this.state.less.filter(item => item.id !== props.id);
        this.props.setOpen(true, () => {
            this.setState({
                less,
            });
        });
    };

    handleClickItemSave = itemSave => {
        const {less} = this.state;
        less.forEach((item, index) => {
            if (item.id === itemSave.id) {
                less[index] = itemSave;
            }
        });
        this.props.setOpen(true, () => this.setState({
            less,
            isDragDisabled: false
        }));
    };

    handleClickItemAdd = () => {
        this.setState(prevState => prevState.less.filter(item => item.isNew).length === 0 &&
        {
            less: [...prevState.less, {id: ID(), isNew: true}],
            isDragDisabled: true
        });
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
                                        {this.props.list.title}
                                    </label>
                                    <Button minimal title="Добавить" icon="add-to-artifact"
                                            onClick={this.handleClickItemAdd}/>
                                </div>
                                {this.state.less.length
                                    ?
                                    this.state.less.map((item, index) => (
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

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const less = reorder(
            this.state.less,
            result.source.index,
            result.destination.index
        );

        this.props.setOpen(true, () => this.setState({less}));
    };
}

export default ElectiveDayList;
/*less && less.map(item => {
            const timeRange = item['time'];
            const start = new Date();
            const end = new Date();
            const startStr = timeRange.substr(0, timeRange.indexOf(" "));
            const endStr = timeRange.substr(timeRange.indexOf(" ") + 1, timeRange.length);
            let times = startStr.split('.');
            start.setHours(Number(times[0]), Number(times[1]), 0);
            times = endStr.split('.');
            end.setHours(Number(times[0]), Number(times[1]), 0);
            less.push({
                id: item._id,
                name: item['klass'],
                start, end
            });
            return item;
        });*/
