import React, {PureComponent} from 'react';
import "../../App.css";
import Radium from 'radium';
import * as PropTypes from 'prop-types';

const defaultColor = "#E1E8ED",
    overColor = "#EBF1F5";

class SideMenuItem extends PureComponent {

    static propTypes = {
        selected: PropTypes.bool
    };

    static defaultProps = {
        selected: false
    };

    onClick = () => {
        this.props.onClick(this.props.item);
    };

    style = {
        width: "100%",
        display: "block",
        border: "1px solid lightgrey",
        backgroundColor: defaultColor,
        selected: {
            backgroundColor: '#F5F8FA',
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
            <div className="bp3-text-large"  style={[this.style, this.props.selected && this.style.selected]}
                 onClick={this.onClick}
                >
                {this.props.children}
            </div>
        );
    }
}

export default Radium(SideMenuItem);
