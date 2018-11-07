import React, {PureComponent} from 'react';
import {handleStringChange} from "@blueprintjs/docs-theme";
import {AnchorButton, Button, Classes, Code, Dialog, H5, Intent, Switch, TextArea, Tooltip} from "@blueprintjs/core";

class AnnounceDialog extends PureComponent {

    state = {
        autoFocus: true,
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        isOpen: false,
        usePortal: true,
    };

    componentWillReceiveProps(nextProps) {
        this.setState({isOpen: nextProps.isOpen});
    }

    render() {
        const {content} = this.props;
        if (!content) return null;
        console.log(content);
        return (
            <div>
                <Dialog
                    icon="add-to-artifact"
                    onClose={this.handleClose}
                    title={content.title}
                    {...this.state}
                >
                    <div className={Classes.DIALOG_BODY} style={{height:300}}>
                        <TextArea style={{height:"100%"}} fill={true} onChange={this.onInputChange} value={content.text} />
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Tooltip content="This button is hooked up to close the dialog.">
                                <Button onClick={this.handleClose}>Close</Button>
                            </Tooltip>
                            <AnchorButton
                                intent={Intent.PRIMARY}
                                href="https://www.palantir.com/palantir-foundry/"
                                target="_blank"
                            >
                                Visit the Foundry website
                            </AnchorButton>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }

    onInputChange = handleStringChange(content => this.setState({ content }));

    handleClose = () => this.setState({ isOpen: false });
}


export default AnnounceDialog;
