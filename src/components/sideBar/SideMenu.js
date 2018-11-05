import React, {Component} from "react";
import SideMenuItem from "./SideMenuItem";

class SideMenu extends Component {

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
        const {items} = this.props;
        return (
            <div className="side-menu">
                {items.map((item, index) => {
                    return (
                        <SideMenuItem key={index} item={item} onClick={this.onClickHandler}>
                            {React.cloneElement(this.props.children, { item })}
                        </SideMenuItem>
                    )
                })}
            </div>
        );
    }
}

export default SideMenu;
