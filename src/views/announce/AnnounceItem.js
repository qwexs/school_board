import React, {PureComponent} from 'react';
import {Button, Card, Elevation, Text} from "@blueprintjs/core";

class AnnounceItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isRoll: false,
            content: null
        };
    }

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {item} = nextProps;
        this.setState(  {
            content: {index: item.index, title: item.timeDay, description: item.text}
        });
    }

    onOverHandler = (event) => {
        event.stopPropagation();
        this.setState({isRoll: true});
    };

    onOutHandler = (event) => {
        event.stopPropagation();
        this.setState({isRoll: false});
    };

    render() {
        const {style, onItemRemoveClick, onItemEditedClick} = this.props;
        return this.state.content && (
            <Card style={style} interactive={true} elevation={Elevation.ONE}
                  onMouseOver={this.onOverHandler} onMouseLeave={this.onOutHandler}>
                <div style={{height: 20}}>
                    {
                        this.state.isRoll &&
                        <div style={{display: "flex", justifyContent: "flex-end", paddingTop: 5}}>
                            <Button minimal icon="edit" title="Редактировать"
                                    onClick={() => onItemEditedClick(this.state.content)}>
                            </Button>
                            <Button minimal icon="cross" title="Удалить"
                                    onClick={() => onItemRemoveClick(this.props.item)}>
                            </Button>

                        </div>
                    }
                </div>
                {
                    this.state.content.title
                        ?
                        <div style={{
                            pointerEvents: "none",
                            borderBottom: "1px solid #d9e0e5",
                            paddingBottom: 5,
                            marginBottom: 10
                        }} className="bp3-ui-text"
                        >
                            <h3>{this.state.content.title}</h3>
                        </div>
                        :
                        <div style={{height: 5}}>
                        </div>
                }

                <div style={{paddingBottom: 20, pointerEvents: "none"}} className="bp3-ui-text">
                    <Text ellipsize={false}>
                        {this.state.content.description}
                    </Text>
                </div>

            </Card>
        );
    }
}

export default AnnounceItem;
