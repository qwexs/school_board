import React, {PureComponent} from 'react';
import {handleStringChange} from "@blueprintjs/docs-theme";
import PropTypes from 'prop-types';
import {AnchorButton, Button, Classes, Dialog, FormGroup, InputGroup, Intent, TextArea} from "@blueprintjs/core";

class AnnounceDialog extends PureComponent {

    state = {
        autoFocus: true,
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        isOpen: false,
        usePortal: true,
        content: {title: "", description: ""}
    };

    componentWillReceiveProps(nextProps) {
        let {content} = nextProps;
        if (content == null) {
            content = {title: "", description: ""};
        }
        this.setState({isOpen: nextProps.isOpen, content});
    }

    render() {
        let {content} = this.state;
        return (
            <div>
                <Dialog className="bp3-ui-text"
                    icon="add-to-artifact"
                    onClose={this.onCancelSaveHandler}
                    title={content.title}
                    {...this.state}
                >
                    <div className={Classes.DIALOG_BODY} style={{height: 300}}>
                        <FormGroup
                            label="Заголовок"
                            labelFor="text-input"
                            labelInfo="(время и место)"
                        >
                            <InputGroup id="text-input"
                                        onChange={this.onInputChangeTitle}
                                        value={this.state.content.title}/>
                        </FormGroup>

                        <FormGroup
                            label="Описание события"
                        >
                            <TextArea style={{height: 210}} fill={true}
                                      onChange={this.onInputChangeDescription}
                                      value={this.state.content.description}/>
                        </FormGroup>
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <AnchorButton
                                intent={Intent.PRIMARY}
                                onClick={this.onClickSaveHandler}
                            >
                                Сохранить
                            </AnchorButton>
                            <Button onClick={this.onCancelSaveHandler}>Отмена</Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }

    onClickSaveHandler = () => {
        this.props.onSave(this.state.content);
    };

    onCancelSaveHandler = () => {
        this.props.onCancel(this);
    };

    onInputChangeTitle = handleStringChange(text => {
        const {content} = this.state;
        content.title = text;
        this.setState({...content});
    });

    onInputChangeDescription = handleStringChange(text => {
        const {content} = this.state;
        content.description = text;
        this.setState({...content});
    });

}

AnnounceDialog.propTypes = {
    onSave: PropTypes.func,
    onCancel: PropTypes.func
};


export default AnnounceDialog;
