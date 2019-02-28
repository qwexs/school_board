import React, {PureComponent} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import AnnounceItem from "./AnnounceItem";
import AnnounceDialog from "./AnnounceDialog";
import {Button, H5} from "@blueprintjs/core";
import EmptyPage from "../../components/emptyPage";
import {createSelector} from "reselect";
import {withReducer} from "../../store/withReducer";
import announceReducer, {
    reorderWeekList,
    saveItemWeek,
} from "../../store/reducers/announce.reducer";
import {setOpenDialog} from "../../store/reducers/root.reducer";
import moment from "moment";
import {bindActionCreators} from "redux";

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
        color: "#5C7080",
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

    componentDidMount() {
        this.forceUpdate();
    }

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        this.props.reorderWeekList({result});
    };

    handleAddAnnounce = () => {
        this.props.openDialog();
    };

    handleSaveDialog = (content) => {
        this.props.saveDialog(content);
    };

    handleCancelDialog = () => {
        this.props.closeDialog();
    };

    render() {
        return (
            <div style={styles.mainContainer}>
                <div style={styles.wrapperContainer}>
                    <div style={{width: "100%", minHeight: 0}}>
                        <div style={styles.topContainer}>
                            <H5 className="bp3-text-large"
                                style={styles.titleLabel}>{this.props.titleDay}</H5>
                            <Button minimal icon="add-to-artifact" onClick={this.handleAddAnnounce}/>
                        </div>
                        <EmptyPage notEmpty={this.props.educationList && this.props.educationList.length > 0}
                                    style={{height: `calc(100% - ${styles.topContainer.height})`}}>
                            <div
                                style={{...styles.listContainer, ...{paddingBottom: this.props.footer.isOpen ? 60 : 0}}}>
                                <DragDropContext
                                    onDragEnd={this.onDragEnd}>
                                    <Droppable droppableId="droppable">
                                        {(provided) => (
                                            <div ref={provided.innerRef} style={styles.announceContainer}>
                                                {this.props.educationList.map((item, index) => (
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
                        </EmptyPage>
                        <AnnounceDialog isOpen={this.props.isDialogOpen} content={this.props.contentDialog}
                                        onSave={this.handleSaveDialog}
                                        onCancel={this.handleCancelDialog}/>
                    </div>

                </div>
            </div>
        );
    }
}

const getItemStyle = (isDragging, draggableStyle) => ({
    margin: `0 0 ${25}px 0`,
    ...draggableStyle
});

const getEducationList = createSelector(
    [state => state.selectedItem ? state.selectedItem.education : []],
    (education) => education.map((item, index) => {
        item.index = index;
        return {
            id: `item-${index}`,
            content: <AnnounceItem style={styles.announceItem} item={item}/>
        };
    })
);

const getTitleDay = createSelector(
    [state => state.selectedDate,
    state => state.selectedItem,
    state => state.list],
    (selectedDate, selectedItem, list) => {
        const weekDay = selectedItem && selectedItem.title;
        if (!list) return "";
        return `${weekDay}, ${moment(selectedDate).day(list.findIndex(item => item._id === selectedItem._id) + 1).toDate()
            .toLocaleDateString('ru', {year: 'numeric', month: 'long', day: 'numeric'})}`;
    }
);

const mapStateToProps = (state) => {
    return {
        footer: state.footer,
        ...state.announce,
        educationList: getEducationList(state.announce),
        titleDay: getTitleDay(state.announce)
    }
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({
        saveDialog: (data) => saveItemWeek(data),
        openDialog: (data) => setOpenDialog(true, data),
        closeDialog: () => setOpenDialog(false),
        reorderWeekList
    }, dispatch);

export default withReducer("announce", announceReducer, mapStateToProps, mapDispatchToProps)(AnnounceList);
