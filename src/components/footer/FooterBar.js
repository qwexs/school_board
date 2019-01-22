import React, {PureComponent} from 'react';
import Radium from "radium";
import PropTypes from 'prop-types';

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

export default class FooterBar extends PureComponent {

    static propTypes = {
        isOpen: PropTypes.bool
    };

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
