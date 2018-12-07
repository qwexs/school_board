import React, {forwardRef, PureComponent} from "react";
import SideMenuItem from "./SideMenuItem";
import Radium from "radium";
import PropTypes from 'prop-types';

class SideMenu extends PureComponent {

    static propTypes = {
        headerBar: PropTypes.element,
        items: PropTypes.array.isRequired,
        selectedItem: PropTypes.object,
        onChangeItem: PropTypes.func.isRequired
    };

    static defaultProps = {
        selectedItem: null,
        items: []
    };

    onClickHandler = (item) => {
        const {onChangeItem} = this.props;
        if (this.props.selectedItem._id !== item._id) {
            onChangeItem(item);
        }
    };

    scrollToSelect() {
        if (this.selectedRef && this.selectedRef.current && this.containerRef) {
            this.containerRef.scrollTo({
                top: this.selectedRef.current.offsetTop - this.props.headerBar.props.style.height,
                behavior: "smooth"
            });
        }
    }

    render() {
        const {items, sideMenuContainer, headerBar, selectedItem} = this.props;
        return (
            <div style={{height: "100%"}}>
                {headerBar && headerBar}
                <div style={[
                    sideMenuContainer,
                    {height: `calc(100% - ${headerBar ? headerBar.props.style.height : 0}px)`}
                ]} ref={ref => this.containerRef = ref}>
                    {items.map((item, index) => {
                        const selected = selectedItem && item._id === selectedItem._id;
                        const ref = React.createRef();
                        if (selected)
                            this.selectedRef = ref;
                        return (
                            <ForwardingSideMenuItem key={index} ref={ref}>
                                <SideMenuItem
                                    selected={selected}
                                    item={item}
                                    onClick={this.onClickHandler}>
                                    {React.cloneElement(this.props.children, {item})}
                                </SideMenuItem>
                            </ForwardingSideMenuItem>
                        );
                    })}
                </div>
            </div>
        );
    }
}

const ForwardingSideMenuItem = forwardRef((props, ref) => {
    return <div ref={ref}>{props.children}</div>;
});

export default Radium(SideMenu);
