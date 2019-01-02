import React from 'react';
import {Alert, Card, H2, Icon, Spinner} from "@blueprintjs/core";
import axios from "axios";
import NewsDialog from "./NewsDialog";
import NewsItem from "./NewsItem";
import {Intent} from "@blueprintjs/core/lib/cjs/common/intent";

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

let isMounted = false;

class News extends React.PureComponent {


    state = {
        isDialogOpen: false,
        isAlertOpen: false,
        content: null,
        list: null,
        isNew: false,
    };

    componentDidMount() {
        isMounted = true;
        this.refreshAll();
    }

    componentWillUnmount() {
        isMounted = false;
    }

    refreshAll = () => {
        axios.get('/news').then(resolve => {
            isMounted && this.setState({list: resolve.data});
        });
    };

    handleClickNewItem = () => {
        this.setState({isDialogOpen: true, isNew: true});
    };

    handleClickEditItem = (content) => {
        this.setState({isDialogOpen: true, isNew: false, content});
    };

    handleRemoveItem = (content) => {
        this.setState({isAlertOpen: true, content});
    };

    handleSaveDialog = (content) => {
        const {title, text, image, isNew} = content;
        const formData = new FormData();
        formData.append('title', title || "");
        formData.append('text', text || "");
        if (image instanceof File) {
            formData.append('image', image);
        }
        if (isNew) {
            axios.post('/news', formData).then(this.refreshAll);
        } else {
            axios.put(`/news/${content._id}`, formData).then(this.refreshAll);
        }
        this.setState({isDialogOpen: false, content: null});
    };

    handleCancelDialog = () => {
        this.setState({isDialogOpen: false, content: null});
    };

    handleRemoveAlertCancel = () => this.setState({isAlertOpen: false, content: null});

    handleRemoveAlertConfirm = () => {
        this.setState(prevState => ({
            list: prevState.list.filter(item => item._id !== prevState.content._id),
            isAlertOpen: false,
            content: null
        }));
        axios.delete(`/news/${this.state.content._id}`).then(this.refreshAll);
    };

    render() {
        return (
            <div style={{overflowY: "auto", display: "flex", flexGrow: 1}}>
                {!this.state.list
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
                            <H2 style={{color: styles.cardLayout.color}}>Добавить новость</H2>
                        </Card>
                        {
                            this.state.list.map((item, index) => {
                                return (
                                    <NewsItem key={this.state.list.length-index}
                                              style={styles.cardLayout}
                                              item={item}
                                              onClick={this.handleClickEditItem}
                                              onRemove={this.handleRemoveItem}/>
                                );
                            })
                        }
                    </div>
                }

                <NewsDialog isOpen={this.state.isDialogOpen} isNew={this.state.isNew} content={this.state.content}
                            onSave={this.handleSaveDialog} onCancel={this.handleCancelDialog}>
                    новость
                </NewsDialog>
                <Alert
                    cancelButtonText="Отмена"
                    confirmButtonText="Удалить"
                    icon="trash"
                    canOutsideClickCancel
                    intent={Intent.DANGER}
                    isOpen={this.state.isAlertOpen}
                    onCancel={this.handleRemoveAlertCancel}
                    onConfirm={this.handleRemoveAlertConfirm}
                >
                    <p>
                        Вы действительно хотите удалить эту
                        новость?<br/><br/><b>{this.state.content && this.state.content.title}</b>
                    </p>
                </Alert>
            </div>
        );
    }
}

export default News
