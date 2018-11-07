import React, {PureComponent} from 'react';
import {Button, Card, Elevation, Text} from "@blueprintjs/core";

class AnnounceBlock extends PureComponent {
    constructor(props) {
        super(props);
        const {item} = props;
        this.state = {editable: true, content: {title: item._timeDay, text:item.__text}};
    }

    componentWillReceiveProps(nextProps) {
        const {item} = nextProps;
        this.setState({
            ...this.state, content: {title: item._timeDay, text:item.__text}
        });
    }

    render() {
        const {onRemoveClickHandler, onEditClickHandler} = this.props;
        return (
            <Card className="announce-card" interactive={true} elevation={Elevation.ONE}>
                {this.state.content.title && (
                        <div className="announce-card-header">
                            <h3>{this.state.content.title}</h3>
                        </div>
                )}
                <div style={{paddingBottom: 15}}>
                    <Text ellipsize={false}>
                        {this.state.content.text}
                    </Text>
                </div>
                <div style={{display: "flex", justifyContent: "flex-end", bottom:0}}>
                    <Button minimal small icon="edit" onClick={() => onEditClickHandler(this.state.content)}>Редактировать</Button>
                    <Button minimal small icon="cross" onClick={() => onRemoveClickHandler(this.state.content)}>Удалить</Button>
                </div>
            </Card>
        );
    }
}

export default AnnounceBlock;
