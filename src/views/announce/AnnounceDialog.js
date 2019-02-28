import React, {PureComponent} from 'react';
import {handleStringChange} from "@blueprintjs/docs-theme";
import * as PropTypes from 'prop-types';
import {AnchorButton, Button, Classes, Dialog, FormGroup, InputGroup, Intent, TextArea} from "@blueprintjs/core";
import produce from "immer";

class AnnounceDialog extends PureComponent {

    static propTypes = {
        onSave: PropTypes.func,
        onCancel: PropTypes.func
    };

    state = {
        autoFocus: true,
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        isOpen: false,
        usePortal: true,
        isNew: true,
        content: {title: "", text: ""}
    };

    componentWillReceiveProps(nextProps, nextContext) {
        let {content} = nextProps;
        let isNew = content == null;
        if (isNew)
            content = {timeDay: "", text: ""};

        this.setState({
            isOpen: nextProps.isOpen,
            content,
            isNew
        });
    }

    render() {
        let {content, isNew} = this.state;
        return (
            <div>
                <Dialog className="bp3-ui-text"
                        icon="add-to-artifact"
                        onClose={this.onCancelHandler}
                        {...this.state}
                        title={isNew ? "Новое событие" : "Редактирование события"}
                >
                    <div className={Classes.DIALOG_BODY} style={{height: 300}}>
                        <FormGroup
                            label="Заголовок"
                            labelFor="text-input"
                            labelInfo="(время и место)"
                        >
                            <InputGroup id="text-input"
                                        onChange={this.onInputChangeTitle}
                                        value={content.timeDay}/>
                        </FormGroup>

                        <FormGroup
                            label="Описание события"
                        >
                            <TextArea style={{height: 210}} fill={true}
                                      onChange={this.onInputChangeDescription}
                                      value={content.text}/>
                        </FormGroup>
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={this.onCancelHandler}>Отмена</Button>
                            <AnchorButton
                                intent={Intent.SUCCESS}
                                onClick={this.onClickSaveHandler}
                            >
                                Сохранить
                            </AnchorButton>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }

    onClickSaveHandler = () => {
        this.props.onSave(this.state.content);
    };

    onCancelHandler = () => {
        this.props.onCancel();
    };

    onInputChangeTitle = handleStringChange(title => {
        this.setState(state => produce(state, draft => {
            draft.content.timeDay = title;
        }));
    });

    onInputChangeDescription = handleStringChange(text => {
        this.setState(state => produce(state, draft => {
            draft.content.text = text;
        }));
    });
}

export default (AnnounceDialog);
