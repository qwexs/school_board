import React, {PureComponent} from "react";
import SideMenuItem from "./SideMenuItem";
import Radium from "radium";
import PropTypes from 'prop-types';

class SideMenu extends PureComponent {

    state = {
        prevItem: null
    };

    onClickHandler = (item) => {
        const {onChangeItem, items} = this.props;
        if (this.state.prevItem !== item) {
            if (items)
                items.map(itemData => itemData.selected = itemData === item);
            this.setState({prevItem: item});
            onChangeItem(item);
        }
    };

    render() {
        const {items, sideMenuContainer, headerBar} = this.props;
        return (
            <div style={{height:"100%"}}>
                {headerBar && headerBar}
                <div style={[
                    sideMenuContainer,
                    {height: `calc(100% - ${headerBar ? headerBar.props.style.height : 0}px)`}
                    ]}>
                    {items && items.map((item, index) => {
                        return (
                            <SideMenuItem key={index} item={item} onClick={this.onClickHandler}>
                                {React.cloneElement(this.props.children, {item})}
                            </SideMenuItem>
                        )
                    })}
                </div>
            </div>

        );
    }
}

SideMenu.propTypes = {
    headerBar: PropTypes.element
};

export default Radium(SideMenu);
