import React, {PureComponent} from "react";
import {Button} from "@blueprintjs/core";
import Radium from "radium";
import * as PropTypes from 'prop-types';

class MenuButton extends PureComponent {

    static propTypes = {
        selected: PropTypes.bool.isRequired
    };

    render() {
        const {selected} = this.props;
        return (
            <Radium.StyleRoot>
                <div className="button-menu"
                     style={{
                     }}>
                    <div style={{
                        display: "flex",
                        float: "right",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        paddingBottom: "15px",
                        paddingRight: "5%",
                        '@media screen and (max-width: 600px)': {
                            display: "none"
                        },
                    }}>
                        <Button style={{
                            textAlign: "right",
                            color: selected ? "#325079" : "#E1E8ED",
                            fontSize: "12px",
                            fontWeight: "bold",
                            boxShadow: selected ? "0 1px 2px 0 #5C7080" : "",
                            backgroundColor: selected ? "#CED9E0" : ""
                        }}
                                active={selected}
                                minimal
                                onClick={(e) => this.props.onClick(e, this.props.path)}
                        text={this.props.title}/>
                    </div>

                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingBottom: "10%",
                        '@media screen and (min-width: 600px)': {
                            display: "none"
                        },
                    }}>
                        <Button title={this.props.title} style={{
                            height: "50px",
                            boxShadow: selected ? "0 1px 2px 0 #5C7080" : "",
                            backgroundColor: selected ? "#CED9E0" : ""
                        }}
                                active={selected}
                                minimal
                                onClick={(e) => this.props.onClick(e, this.props.path)}>
                            <img style={{maxHeight:"40px"}} src={this.props.icon} alt={"иконка"}/>
                        </Button>
                    </div>


                </div>
            </Radium.StyleRoot>
        );
    }
}
export default MenuButton;
