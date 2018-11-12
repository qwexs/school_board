import React, {PureComponent} from 'react';
import {Button, Card, Elevation} from "@blueprintjs/core";

class ElectiveDayItem extends PureComponent {

    state = {
        isRoll: false,
        content: null
    };


    componentDidMount() {
        // this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(nextProps, nextContext) {

        // console.log("day item",nextProps);
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
        const {
            onRemoveClickHandler,
            onEditClickHandler,
            itemStyle
        } = this.props;
        return (
            <Card style={itemStyle} interactive={true} elevation={Elevation.ONE}
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
                <div style={{paddingBottom: 20}} className="bp3-ui-text">

                </div>

            </Card>
        );
    }
}

export default ElectiveDayItem;
