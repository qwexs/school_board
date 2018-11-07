import React, {Component} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import AnnounceBlock from "./AnnounceBlock";
import AnnounceDialog from "./AnnounceDialog";

const getItemStyle = (isDragging, draggableStyle) => ({
    margin: `0 0 ${25}px 0`,
    background: isDragging ? "#A7B6C2" : null,
    width: "100%",
    ...draggableStyle
});

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

class AnnounceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: null,
            isEdit: false,
            content: null
        };
    }

    deleteItems = [];

    getItems = (props) => {
        const {list} = props;
        const education = list && list.education;
        let ev = education && education.ev;
        if (ev && !Array.isArray(ev))
            ev = [ev];

        const result = [];

        ev && ev.map((item, index) => {
            if (!this.deleteItems.includes(item.__text)) {
                result.push({
                    id: `item-${index}`,
                    content: <AnnounceBlock item={item}
                                            onEditClickHandler={this.onEditClickHandler}
                                            onRemoveClickHandler={this.onRemoveClickHandler}/>
                })
                }
            });

        return result;

    };

    onEditClickHandler = (item) => {
        this.setState({
            isEdit: true,
            content: item
        });
    };

    onRemoveClickHandler = (item) => {
        this.deleteItems.push(item.text);
        this.setState({
            items: this.getItems(this.props),
        });
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            items: this.getItems(nextProps),
        });
    }

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const items = reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );

        this.setState({
            items,
        });
    };

    render() {
        const {isEdit} = this.state;
        if (isEdit) {
            this.state.isEdit = false;
        }
        return (
            <div className="announce-container">
                <DragDropContext
                    onDragStart={this.onDragStart}
                    onDragUpdate={this.onDragUpdate}
                    onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <div ref={provided.innerRef} className="announce-card-container">
                                {this.state.items && this.state.items.map((item, index) => (
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

                <AnnounceDialog isOpen={isEdit} content={this.state.content}/>
            </div>
        );
    }
}

export default AnnounceList;
