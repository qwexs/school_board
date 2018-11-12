import React, {PureComponent} from 'react';
import {Button, Card, Elevation, Text} from "@blueprintjs/core";

class AnnounceItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isRoll: false,
            content: {
                id: "",
                title: "",
                description: ""
            }
        };
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {item} = nextProps;
        this.setState({
            content: {id: item.id, title: item._timeDay, description: item.__text}
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
        const {style, onRemoveClickHandler, onEditClickHandler} = this.props;
        return (
            <Card style={style} interactive={true} elevation={Elevation.ONE}
                  onMouseOver={this.onOverHandler} onMouseLeave={this.onOutHandler}>
                <div style={{height: 20}}>
                    {
                        this.state.isRoll &&
                        <div style={{display: "flex", justifyContent: "flex-end", top: 0, paddingRight: 0}}>
                            <Button minimal icon="edit"
                                    onClick={() => onEditClickHandler(this.state.content)}>
                            </Button>
                            <Button minimal icon="cross"
                                    onClick={() => onRemoveClickHandler(this.props.item)}>
                            </Button>

                        </div>
                    }
                </div>
                {
                    this.state.content.title
                        ?
                        <div style={{
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

                <div style={{paddingBottom: 20}} className="bp3-ui-text">
                    <Text ellipsize={false}>
                        {this.state.content.description}
                    </Text>
                </div>

            </Card>
        );
    }
}

export default AnnounceItem;
