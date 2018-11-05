import React, {Component} from 'react';
import "../../App.css"

class SideMenuItem extends Component {

    state = {color: "#EEEEEE", selected: false};

    onClick = () => {
        this.props.onClick(this);
    };

    onOver = () => {
        if (!this.state.selected)
            this.setState({color: "#f5f5f5"});
    };

    onOut = () => {
        if (!this.state.selected)
            this.setState({color: "#EEEEEE"});
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.selected !== nextState.selected) {
            nextState.color = nextState.selected ? "#FFFFFF" : "#EEEEEE";
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
