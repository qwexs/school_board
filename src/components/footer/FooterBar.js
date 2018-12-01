import React, {PureComponent} from 'react';
import Radium from "radium";
import PropTypes from 'prop-types';

const style = {
    height: "10vh",
    maxHeight: 45,
    minHeight: 30,
    background: "#f5f8fa",
    position: "fixed",
    overflow: "hidden",
    right: "0",
    bottom: "0",
    border: "1px solid lightgrey",
    boxShadow: "0 -5px 1em -10px #1f1f1f",
    justifyContent: "flex-end",
    display: "flex",
    paddingRight: "1%",
    zIndex: 1,
    transition: "transform 200ms ease-out"
};

export default class FooterBar extends PureComponent {

    state = {
        vWidth: 0
    };

    render() {
        const {children, isOpen} = this.props;
        return (
            <div style={[style, {width: this.state.vWidth, transform: isOpen ? "translateY(0)" : "translateY(100%)"}]}>
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

FooterBar = Radium(FooterBar);

FooterBar.propTypes = {
    isOpen: PropTypes.bool,
};
