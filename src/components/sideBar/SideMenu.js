import React, {PureComponent} from "react";
import SideMenuItem from "./SideMenuItem";
import Radium from "radium";

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
        const {items, sideMenuContainer, headerBar} = this.props;
        return (
            <div style={{height:"100%"}}>
                {headerBar && headerBar}
                <div style={[sideMenuContainer, {height: `calc(100% - ${headerBar ? headerBar.props.style.height : 0}px)`}]}>
                    {items.map((item, index) => {
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

export default Radium(SideMenu);
