import React, {PureComponent} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import AnnounceBlock from "./AnnounceBlock";
import AnnounceDialog from "./AnnounceDialog";
import {ID} from "../../utils/ID";
import {reorder} from "../../utils/reorder";
import PropTypes from "prop-types";

const getItemStyle = (isDragging, draggableStyle) => ({
    margin: `0 0 ${25}px 0`,
    background: isDragging ? "#A7B6C2" : null,
    width: "100%",
    ...draggableStyle
});

class AnnounceList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            collectionList: [],
            items: [],
            isOpen: false,
            content: null
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        const {list} = nextProps;
        const education = list && list.education;
        let collectionList = education && education.ev;
        if (collectionList && !Array.isArray(collectionList))
            collectionList = [collectionList];

        collectionList.map((item, index) => item.id = ID()); //FIXME: fetch id
        this.setState({
            isOpen: nextProps.isOpen,
            collectionList,
            items: this.getItems(collectionList)
        });
    }

    getItems = (collectionList) => {
        const result = [];
        collectionList
            .map((item, index) => {
                return result.push({
                    id: `item-${index}`,
                    content: <AnnounceBlock item={item}
                                            onEditClickHandler={this.onEditClickHandler}
                                            onRemoveClickHandler={this.onRemoveClickHandler}/>
                })
            });
        return result;
    };

    onEditClickHandler = (item) => {
        this.setState({
            isOpen: true,
            content: item
        });
    };

    onRemoveClickHandler = (itemTarget) => {
        const collectionList = this.state.collectionList.filter(item => item !== itemTarget);
        this.setState({
            collectionList,
            items: this.getItems(collectionList)
        });
    };

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
            items: this.getItems(collectionList)
        });
    };

    onSaveDialogHandler = (content) => {
        const collectionList = this.state.collectionList;
        if (!content.hasOwnProperty("id")) { //is new
            collectionList.push({
                id: ID(),
                _timeDay: content.title,
                __text: content.description
            });
            this.props.onCloseDialog();
        } else {
            collectionList.filter(item => {
                if (item.id === content.id) {
                    item.__text = content.description;
                    item._timeDay = content.title;
                    return true;
                }
                return false;
            });
        }

        this.setState({
            isOpen: false,
            content: null,
            collectionList
        });
    };

    onCancelDialogHandler = () => {
        this.setState({
            isOpen: false,
            content: null
        });

        this.props.onCloseDialog();
    };

    render() {
        return (
            <div className="announce-container">
                <DragDropContext
                    onDragStart={this.onDragStart}
                    onDragUpdate={this.onDragUpdate}
                    onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <div ref={provided.innerRef} className="announce-card-container">
                                { this.getItems(this.state.collectionList).map((item, index) => (
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

                <AnnounceDialog isOpen={this.state.isOpen} content={this.state.content}
                                onSave={this.onSaveDialogHandler} onCancel={this.onCancelDialogHandler}/>
            </div>
        );
    }
}

AnnounceList.propTypes = {
    onCloseDialog: PropTypes.func
};

export default AnnounceList;
