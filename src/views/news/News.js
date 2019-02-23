import React from 'react';
import {Alert, Card, H2, Icon, Spinner} from "@blueprintjs/core";
import NewsDialog from "./NewsDialog";
import NewsItem from "./NewsItem";
import {Intent} from "@blueprintjs/core/lib/cjs/common/intent";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {refreshAll, removeItem, saveItem, showDialog, showAlertRemove} from "../../store/reducers/news.reducer";

const styles = {
    tileLayout: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: "3% 0 0 3%",
    },
    cardLayout: {
        width: 270,
        height: 350,
        margin: "0 3% 5% 0",
        backgroundColor: "#F5F8FA",
        color: "#394B59"
    },
    emptyLayout: {
        width: 270,
        height: 350,
        margin: "0 3% 5% 0",
        backgroundColor: "#FFFFFF",
        color: "#394B59",
        opacity: .9
    }
};

class News extends React.PureComponent {

    componentDidMount() {
        this.props.refreshAll();
    }

    handleClickNewItem = () => {
        this.props.showDialog(true);
    };

    handleClickEditItem = (item) => {
        this.props.showDialog(true, item);
    };

    handleRemoveItem = (item) => {
        this.props.showAlertRemove(true, item);
    };

    handleSaveDialog = (content) => {
        this.props.saveItem(content);
    };

    handleCancelDialog = () => {
        this.props.showDialog(false);
    };

    handleRemoveAlertCancel = () => {
        this.props.showAlertRemove(false);
    };

    handleRemoveAlertConfirm = () => {
        this.props.removeItem();
    };

    render() {
        return (
            <div style={{overflowY: "auto", display: "flex", flexGrow: 1}}>
                {this.props.isLoadingList
                    ?
                    <div style={{margin: "auto"}}>
                        <Spinner/>
                    </div>
                    :
                    <div style={styles.tileLayout} className="disable-select">
                        <Card style={styles.emptyLayout} interactive onClick={this.handleClickNewItem}>
                            <img src={'/assets/news/newsIcon.png'} alt={"news"}/>
                            <p/>
                            <Icon icon={"add"} iconSize={35}/>
                            <p/>
                            <H2 style={{color: styles.cardLayout.color, paddingTop:"10px"}}>Добавить новость</H2>
                        </Card>
                        {
                            this.props.list.map((item, index) => {
                                return (
                                    <NewsItem key={this.props.list.length-index}
                                              style={styles.cardLayout}
                                              item={item}
                                              onClick={this.handleClickEditItem}
                                              onRemove={this.handleRemoveItem}/>
                                );
                            })
                        }
                    </div>
                }

                <NewsDialog isOpen={this.props.isDialogOpen} content={this.props.selectedItem}
                            onSave={this.handleSaveDialog} onCancel={this.handleCancelDialog}>
                    новость
                </NewsDialog>
                <Alert
                    cancelButtonText="Отмена"
                    confirmButtonText="Удалить"
                    icon="trash"
                    canOutsideClickCancel
                    intent={Intent.DANGER}
                    isOpen={this.props.isAlertOpen}
                    onCancel={this.handleRemoveAlertCancel}
                    onConfirm={this.handleRemoveAlertConfirm}
                >
                    <p>
                        Вы действительно хотите удалить эту
                        новость?<br/><br/><b>{this.props.content && this.props.content.title}</b>
                    </p>
                </Alert>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({...state.news});
const mapDispatchToProps = dispatch =>
    bindActionCreators({refreshAll, removeItem, showDialog, saveItem, showAlertRemove}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(News)
