import React, {PureComponent} from 'react';

const FooterPanelContext = React.createContext({});
export const FooterPanelProvider = FooterPanelContext.Provider;
export const FooterPanelConsumer = FooterPanelContext.Consumer;

class FooterBarProvider extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            action: ""
        };
    }

    render() {
        const {children} = this.props;
        return (
            <FooterPanelProvider value={{
                setOpen: (isOpen, callback = null) => this.setState({isOpen, action: ""}, callback),
                setAction: (action, isOpen = true) => this.setState({action, isOpen}),
                isOpen: this.state.isOpen,
                action: this.state.action
            }}>
                {children}
            </FooterPanelProvider>
        );
    }
}

export default FooterBarProvider;
