import React, {PureComponent} from 'react';
import {Button, Card, Elevation, Text} from "@blueprintjs/core";

class AnnounceBlock extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editable: false,
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

    componentWillReceiveProps(nextProps) {
        const {item} = nextProps;
        this.setState({
            content: {id: item.id, title: item._timeDay, description: item.__text}
        });
    }

    onOverHandler = (event) => {
        event.stopPropagation();
        this.setState({editable: true});
    };

    onOutHandler = (event) => {
        event.stopPropagation();
        this.setState({editable: false});
    };

    render() {
        const {onRemoveClickHandler, onEditClickHandler} = this.props;
        return (
            <Card className="announce-card" interactive={true} elevation={Elevation.ONE}
                  onMouseOver={this.onOverHandler} onMouseLeave={this.onOutHandler}>
                <div style={{height: 20}}>
                    {this.state.editable &&
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
                {this.state.content.title
                    ?
                    <div className="announce-card-header">
                        <h3>{this.state.content.title}</h3>
                    </div>
                    :
                    <div style={{height: 5}}>
                    </div>
                }

                <div style={{paddingBottom: 20}}>
                    <Text ellipsize={false}>
                        {this.state.content.description}
                    </Text>
                </div>

            </Card>
        );
    }
}

export default AnnounceBlock;
