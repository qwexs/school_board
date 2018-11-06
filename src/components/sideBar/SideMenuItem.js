import React, {Component} from 'react';
import "../../App.css"

class SideMenuItem extends Component {

    static defaultColor = "#edf0f2";
    static overColor = "#f5f8fa";

    state = {color: SideMenuItem.defaultColor, selected: false};

    onClick = () => {
        this.props.onClick(this);
    };

    onOver = () => {
        if (!this.state.selected)
            this.setState({color: SideMenuItem.overColor});
    };

    onOut = () => {
        if (!this.state.selected)
            this.setState({color: SideMenuItem.defaultColor});
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.selected !== nextState.selected) {
            nextState.color = nextState.selected ? "#FFFFFF" : SideMenuItem.defaultColor;
        }
        return true;
    }


    render() {
        return (
            <div className="sideBar_items" style={{background: this.state.color}}
                 onMouseOver={this.onOver} onMouseOut={this.onOut} onClick={this.onClick}>
                {this.props.children}
            </div>
        );
    }
}

export default SideMenuItem;
