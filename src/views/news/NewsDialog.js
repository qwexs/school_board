import React, {PureComponent} from 'react';
import {AnchorButton, Button, Dialog, FileInput, FormGroup, InputGroup, Intent, TextArea} from "@blueprintjs/core";
import * as PropTypes from "prop-types";
import * as Classes from "@blueprintjs/core/lib/esm/common/classes";
import {handleStringChange} from "@blueprintjs/docs-theme";

class NewsDialog extends PureComponent {

    static propTypes = {
        isNew: PropTypes.bool,
        onSave: PropTypes.func,
        onCancel: PropTypes.func,
        content: PropTypes.object
    };

    emptyState = {
        _id: "",
        isOpen: false,
        isNew: false,
        title: "",
        text: "",
        image: ""
    };

    state = Object.create(this.emptyState);

    componentWillReceiveProps(nextProps, nextContext) {
        const {isOpen, isNew} = nextProps;
        this.setState({...nextProps.content || this.emptyState, isOpen, isNew});
    }

    handleChangeInputTitle = handleStringChange(text => {
        this.setState(prevState => ({...prevState , title:text}));
    });

    handleChangeInputText = handleStringChange(text => {
        this.setState(prevState => ({...prevState , text}));
    });

    handleInputFiles = (event) => {
        const acceptedFiles = event.target.files || event.dataTransfer.files;
        acceptedFiles &&
            this.setState({image: acceptedFiles[0]});
    };

    handleClickSaveDialog = () => {
        this.props.onSave(this.state);
    };

    handleClickCloseDialog = () => {
        this.props.onCancel();
    };

    render() {
        const imageText = this.state.image instanceof File
            ? this.state.image.name
            : this.state.image
            || "Выберите изображение...";
        return (
            <div>
                <Dialog className="bp3-ui-text"
                        icon={this.state.isNew ? "add" : "manually-entered-data"}
                        onClose={this.handleClickCloseDialog}
                        isOpen={this.state.isOpen}
                        title={this.state.isNew ? `Добавить ${this.props.children}` : `Редактировать ${this.props.children}`}
                >
                    <div className={Classes.DIALOG_BODY} style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        alignItems: "stretch",
                        justifyContent: "stretch"
                    }}>
                        <FormGroup
                            label="Заголовок"
                            labelFor="text-input"
                        >
                            <InputGroup id="text-input"
                                        onChange={this.handleChangeInputTitle}
                                        value={this.state.title}/>
                        </FormGroup>

                        <FormGroup
                            label="Изображение"
                            labelFor="file-input"
                        >
                            <FileInput fill inputProps={{
                                multiple: false,
                                accept: "image/jpeg,image/jpg,image/png,image/gif"
                            }}
                                       title={"Обзор"}
                                       text={imageText}
                                       onInputChange={this.handleInputFiles}/>
                        </FormGroup>

                        <FormGroup
                            label="Основной текст"
                        >
                            <TextArea fill={true} style={{height: "40vh"}}
                                      onChange={this.handleChangeInputText}
                                      value={this.state.text}/>
                        </FormGroup>
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <AnchorButton
                                intent={Intent.PRIMARY}
                                onClick={this.handleClickSaveDialog}
                            >
                                Сохранить
                            </AnchorButton>
                            <Button onClick={this.handleClickCloseDialog}>Отмена</Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default NewsDialog;
