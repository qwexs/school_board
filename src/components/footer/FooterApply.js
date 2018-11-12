import React, {PureComponent} from 'react';
import Radium from "radium";

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
    paddingRight: "1%"

};

export default class FooterApply extends PureComponent {

    render() {
        const {children, width} = this.props;
        return (
            <div style={[style, {width: width}]}>
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

FooterApply = Radium(FooterApply);
