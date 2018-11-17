import React, {Component} from 'react';

const FooterPanelContext = React.createContext({});
export const FooterPanelProvider = FooterPanelContext.Provider;
export const FooterPanelConsumer = FooterPanelContext.Consumer;

class FooterBarProvider extends Component {

    static ACTION_SELECT_ALL = "selectAll";
    static ACTION_UNSELECT_ALL = "unSelectAll";
    static ACTION_DELETE = "deleteFile";

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
                setOpen: value => {
                    this.setState({isOpen: value, action:""});
                },
                setAction: value => {
                    this.setState({action: value, isOpen: value !== FooterBarProvider.ACTION_UNSELECT_ALL});
                },
                isOpen: this.state.isOpen,
                action: this.state.action
            }}>
                {children}
            </FooterPanelProvider>
        );
    }
}

export default FooterBarProvider;
