import React, {PureComponent} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import AnnounceItem from "./AnnounceItem";
import AnnounceDialog from "./AnnounceDialog";
import {reorder} from "../../utils/reorder";
import {FooterPanelConsumer} from "../../components/footer/FooterBarProvider";
import Radium from "radium";
import {Button, H4} from "@blueprintjs/core";
import {DateInput} from "@blueprintjs/datetime";
import {DatePickerLocaleUtils} from "../../components/DatePickerUtils";
import {Position} from "@blueprintjs/core/lib/cjs/common/position";
import IsNoPage from "../../components/IsNoPage";
import * as PropTypes from "prop-types";

const getItemStyle = (isDragging, draggableStyle) => ({
    margin: `0 0 ${25}px 0`,
    // background: isDragging ? "#A7B6C2" : null,
    // width: "100%",
    ...draggableStyle
});

const styles = {
    mainContainer: {
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        overflowY: "auto",
        paddingTop: "3vh"
    },
    wrapperContainer: {
        width: "100%",
        display: "flex",
        flexGrow: 1,
        minWidth: 150,
        maxWidth: 500,
        margin: "0 auto"
    },
    topContainer: {
        height: "40px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15
    },
    listContainer: {
        paddingTop: -10,
        display: "flex",
        justifyContent: "center",
    },
    titleLabel: {
        margin: 0,
        color: "#5C7080"
    },
    announceContainer: {
        display: "flex",
        flexDirection: "column",
        overflowY: "hidden",
        overflowX: "hidden",
        flexGrow: 1,
        flexShrink: 1,
        padding: "20px 10px 10px 10px",
    },
    announceItem: {
        margin: "0 auto",
        background: "#F5F8FA",
        padding: "0 1vw 0 1vw",
    },
};

class AnnounceList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            collectionList: [],
            isDialogOpen: false,
            content: null,
            title: "",
            date: null
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {list} = nextProps;
        if (!list)
            return;
        const collectionList = list.education;
        this.setState({
            isDialogOpen: false,
            collectionList,
            title: list.title,
            date: list.date ? new Date(list.date) : null
        });
    }

    getItems = () => {
        const result = [];
        this.state.collectionList
            .map((item, index) => {
                item.index = index;
                return result.push({
                    id: `item-${index}`,
                    content: <AnnounceItem style={styles.announceItem} item={item}
                                           onItemEditedClick={this.onItemEditedClick}
                                           onItemRemoveClick={this.onRemoveClickHandler}/>
                })
            });
        return result;
    };

    onItemEditedClick = (item) => {
        this.setState({
            isDialogOpen: true,
            content: item
        });
    };

    onRemoveClickHandler = (itemTarget) => {
        const collectionList = this.state.collectionList.filter(item => item !== itemTarget).slice(0);
        this.props.onInsert({date: this.state.date, education: collectionList}, () => {
            this.setState( {collectionList});
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

        this.props.onInsert({date: this.state.date, education: collectionList}, () => {
            this.setState({
                collectionList,
            });
        });
    };

    onSaveDialogHandler = (content) => {
        const collectionList = this.state.collectionList;
        console.log(content);
        if (content.isNew) { //is new
            collectionList.push({
                index: collectionList.length,
                timeDay: content.title,
                text: content.description
            });
        } else {
            collectionList.map(item => {
                if (item.index === content.index) {
                    item.text = content.description;
                    item.timeDay = content.title;
                }
            });
        }
        this.props.onInsert({date: this.state.date, education: collectionList},
            () => {
                this.setState({
                    collectionList,
                    isDialogOpen: false,
                    content: null,
                });
            });
    };

    onCancelDialogHandler = () => {
        this.setState({
            isDialogOpen: false,
            content: null
        });
    };

    handleAddAnnounce = () => {
        this.setState({isDialogOpen: true});
    };

    handleDateChange = (selectedDate, isUserChange) => {
        if (isUserChange) {
            this.props.onInsert({date: selectedDate, education: this.state.collectionList},
                () => this.setState({date: selectedDate}));
        }
    };

    render() {
        return this.state.collectionList && (
            <FooterPanelConsumer>
                {({setOpen, isOpen, setAction, action}) => (
                    <div style={styles.mainContainer}>
                        <div style={styles.wrapperContainer}>
                            <div style={{width:"100%", minHeight: 0}}>
                                <div style={styles.topContainer}>
                                    <H4 className="bp3-monospace-text" style={styles.titleLabel}>{this.state.title}</H4>
                                    <DateInput
                                        style={{textAlign: "center"}}
                                        formatDate={date => (date == null ? "" : date.toLocaleDateString())}
                                        defaultValue={new Date()}
                                        onChange={this.handleDateChange}
                                        parseDate={str => new Date(str)}
                                        placeholder={"Установите дату..."}
                                        locale={"ru"}
                                        value={this.state.date}
                                        popoverProps={{ position: Position.BOTTOM }}
                                        localeUtils={DatePickerLocaleUtils}
                                    />
                                    <Button minimal icon="add-to-artifact" onClick={this.handleAddAnnounce}/>
                                </div>
                                <IsNoPage notEmpty={this.state.collectionList.length > 0}
                                          style={{width:"100%", height:`calc(100% - ${styles.topContainer.height})`}}>
                                    <div style={[styles.listContainer, {paddingBottom: isOpen ? 60 : 0}]}>
                                        <DragDropContext
                                            onDragEnd={this.onDragEnd}>
                                            <Droppable droppableId="droppable">
                                                {(provided) => (
                                                    <div ref={provided.innerRef} style={styles.announceContainer}>
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
                                </IsNoPage>
                                <AnnounceDialog isOpen={this.state.isDialogOpen} content={this.state.content}
                                                onSave={this.onSaveDialogHandler} onCancel={this.onCancelDialogHandler}/>
                            </div>

                        </div>
                    </div>
                )}
            </FooterPanelConsumer>
        );
    }
}

AnnounceList.propTypes = {
    onInsert: PropTypes.func
};

export default Radium(AnnounceList);
