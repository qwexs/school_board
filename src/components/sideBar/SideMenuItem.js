import React, {Component} from 'react';
import "../../App.css";
import Radium from 'radium';

const defaultColor = "#edf0f2",
    overColor = "#f5f8fa";

class SideMenuItem extends Component {

    state = {selected: false};

    onClick = () => {
        this.props.onClick(this);
    };

    style = {
        width: "100%",
        display: "block",
        border: "1px solid lightgrey",
        backgroundColor: defaultColor,
        selected: {
            backgroundColor: 'white',
            ':hover':{
                backgroundColor: "white",
            }
        },
        ':hover':{
            backgroundColor: overColor,
        },
        margin: 0,
        alignContent: "center",
        cursor: "pointer",
    };


    render() {
        return (
            <div className="bp3-text-large"  style={[this.style, this.state.selected && this.style.selected]}
                 onClick={this.onClick}
                >
                {this.props.children}
            </div>
        );
    }
}

export default Radium(SideMenuItem);
