import React, {PureComponent} from "react";
import SideMenuItem from "./SideMenuItem";

class SideMenu extends PureComponent {

    prevItem;

    onClickHandler = (target) => {
        const {onChangeItem} = this.props;
        if (this.prevItem !== target) {
            target.setState({selected: true});
            if (this.prevItem) {
                this.prevItem.setState({selected: false});
            }
            this.prevItem = target;
            onChangeItem(target);
        }
    };

    componentDidMount() {
        this.onClickHandler()
    }

    render() {
        const {items, sideMenuContainer} = this.props;
        return (
            <div style={sideMenuContainer}>
                {items.map((item, index) => {
                    return (
                        <SideMenuItem key={index} item={item} onClick={this.onClickHandler}>
                            {React.cloneElement(this.props.children, {item})}
                        </SideMenuItem>
                    )
                })}
            </div>
        );
    }
}

export default SideMenu;
