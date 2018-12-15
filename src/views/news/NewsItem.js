import React, {PureComponent} from 'react';
import {Button, Card, H5, Icon} from "@blueprintjs/core";
import * as PropTypes from "prop-types";

class NewsItem extends PureComponent {

    static propTypes = {
        style: PropTypes.object,
        item: PropTypes.any,
        onClick: PropTypes.func,
        onRemove: PropTypes.func,
    };

    state = {
        isOver: false,
        isOverEdit: false
    };

    handleClickRemoveItem = ((event) => {
        event.stopPropagation();
        this.props.onRemove(this.props.item);
    });

    handleMouseOver = () => {
        this.setState({isOver: true})
    };

    handleMouseLeave = () => {
        this.setState({isOver: false})
    };

    handleMouseOverIcon = () => {
        this.setState({isOverEdit: true})
    };

    handleMouseLeaveIcon = () => {
        this.setState({isOverEdit: false})
    };

    handleClick = () => {
        this.props.onClick(this.props.item);
    };

    render() {
        const {item, style} = this.props;
        return (
            <Card style={style} interactive
                  onMouseOver={this.handleMouseOver}
                  onMouseLeave={this.handleMouseLeave}>
                <div style={{display: "flex", flexDirection: "column", height: "100%", margin: 0}}>
                    <div style={{
                        height: 200,
                        overflow: "hidden",
                        margin: -20,
                        WebkitBoxShadow: "0 5px 5px -5px #8A9BA8",
                        MozBoxShadow: "0 5px 5px -5px #8A9BA8",
                        boxShadow: "0 5px 5px -5px #8A9BA8",
                    }}>
                        {this.state.isOver &&
                        <div style={{
                            position: "relative", float: "right", padding: 0, background: "#FFFFFF",
                            borderRadius: "1px", opacity: .8,
                            marginTop: -30, top: 30
                        }}>
                            <Button minimal icon="cross" title="Удалить"
                                    onClick={this.handleClickRemoveItem}/>
                        </div>
                        }
                        {this.state.isOver &&
                        <div style={{
                            position: "relative",
                            width: "80px",
                            height: "80px",
                            background: "#F5F8FA",
                            borderRadius: "50%",
                            opacity: this.state.isOverEdit ? 1 : .8,
                            marginTop: -80,
                            top: "calc(50% + 40px)",
                            left: "calc(50% - 40px)"
                        }}
                             onMouseOver={this.handleMouseOverIcon}
                             onMouseLeave={this.handleMouseLeaveIcon}
                             onClick={this.handleClick}>
                            <Icon style={{marginTop: 25}} iconSize={35} color={"#738694"}
                                  icon={"manually-entered-data"}/>
                        </div>
                        }
                        <img src={`/${item.image}`} width={"100%"} alt="Картинка"
                             className="newsImage"/>
                    </div>
                    <div style={{overflow: "hidden", maxHeight: "40px", marginTop: 30}}>
                        <H5>{item.title}</H5>
                    </div>
                    <div style={{
                        display: "block",
                        textAlign: "justify",
                        textOverflow: "ellipsis",
                        wordWrap: "break-word",
                        overflow: "hidden",
                        maxHeight: "40%",
                        lineHeight: "1.3em",
                        paddingTop: 5,
                        marginBottom: -5
                    }} className="bp3-running-text">
                        {item.text}
                    </div>
                </div>
            </Card>
        );
    }
}

export default NewsItem;
