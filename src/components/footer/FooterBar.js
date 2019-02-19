import React, {PureComponent} from 'react';
import Radium from "radium";
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';

const style = {
    height: "10vh",
    maxHeight: 45,
    minHeight: 30,
    background: "#0D8050",
    position: "fixed",
    overflow: "hidden",
    right: "0",
    bottom: "0",
    boxShadow: "0 -5px 3px -5px #202B33",
    justifyContent: "flex-end",
    display: "flex",
    paddingRight: "1%",
    zIndex: 1,
    transition: "transform 200ms ease-out"
};

class FooterBar extends PureComponent {

    static propTypes = {
        children: PropTypes.node,
        isOpen: PropTypes.bool,
        vWidth: PropTypes.string,
    };

    render() {
        const {children, isOpen, vWidth} = this.props;
        return (
            <div style={[style, {width: vWidth, transform: isOpen ? "translateY(0)" : "translateY(100%)"}]}>
                {children.map((element, index) => {
                    return (
                        <div key={index}
                             style={{height: "100%", paddingRight: 0, display: "flex", alignSelf: "center"}}>
                            {element}
                        </div>
                    );
                })}
            </div>
        );
    }

}

function mapStateToProps(state) {
    const {isOpen, vWidth} = state.footer;
    return {
        isOpen,
        vWidth
    };
}

export default connect(mapStateToProps)(Radium(FooterBar));
