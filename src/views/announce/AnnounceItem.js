import React, {PureComponent} from 'react';
import {Button, Card, Elevation, Text} from "@blueprintjs/core";
import {bindActionCreators} from "redux";
import {editItemWeek, removeItemWeek} from "../../store/reducers/announce.reducer";
import {connect} from "react-redux";

class AnnounceItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isRoll: false,
            content: null
        };
    }
    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {item} = nextProps;
        this.setState(  {
            content: {...item}
        });
    }

    handleEditItem = () => {
        this.props.editItemWeek(this.props.item);
    };

    handleRemoveItem = () => {
        this.props.removeItemWeek(this.props.item);
    };

    onOverHandler = (event) => {
        event.stopPropagation();
        this.setState({isRoll: true});
    };

    onOutHandler = (event) => {
        event.stopPropagation();
        this.setState({isRoll: false});
    };

    render() {
        const {style} = this.props;
        return this.state.content && (
            <Card style={style} interactive={true} elevation={Elevation.ONE}
                  onMouseOver={this.onOverHandler} onMouseLeave={this.onOutHandler}>
                <div style={{height: 20}}>
                    {
                        this.state.isRoll &&
                        <div style={{display: "flex", justifyContent: "flex-end", paddingTop: 5}}>
                            <Button minimal icon="edit" title="Редактировать"
                                    onClick={this.handleEditItem}>
                            </Button>
                            <Button minimal icon="cross" title="Удалить"
                                    onClick={this.handleRemoveItem}>
                            </Button>

                        </div>
                    }
                </div>
                {
                    this.state.content.timeDay
                        ?
                        <div style={{
                            pointerEvents: "none",
                            borderBottom: "1px solid #d9e0e5",
                            paddingBottom: 5,
                            marginBottom: 10
                        }} className="bp3-ui-text"
                        >
                            <h3>{this.state.content.timeDay}</h3>
                        </div>
                        :
                        <div style={{height: 5}}>
                        </div>
                }

                <div style={{paddingBottom: 20, pointerEvents: "none"}} className="bp3-ui-text">
                    <Text ellipsize={false}>
                        {this.state.content.text}
                    </Text>
                </div>

            </Card>
        );
    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators({editItemWeek, removeItemWeek}, dispatch);

export default connect(null, mapDispatchToProps)(AnnounceItem);
