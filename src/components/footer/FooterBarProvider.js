import React, {Component} from 'react';

const FooterPanelContext = React.createContext({});
export const FooterPanelProvider = FooterPanelContext.Provider;
export const FooterPanelConsumer = FooterPanelContext.Consumer;

class FooterBarProvider extends Component {

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
                setOpen: isOpen => this.setState({isOpen, action: ""}),
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
