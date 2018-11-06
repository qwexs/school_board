import React, {Component} from 'react';
import { Button, Card, Elevation } from "@blueprintjs/core";

class AnnounceList extends Component {
    render() {
        const {list} = this.props;
        const education = list && list.education;
        let ev = education && education.ev;
        if (ev && !Array.isArray(ev))
            ev = [ev];
        console.log(ev);
        return (
            <div className="announce-container">
                {ev && ev.map((item, index) => {
                    return (
                        <Card className="announce-card" key={index} interactive={true} elevation={Elevation.ONE}>
                            {item._timeDay && (
                            <div className="announce-card-header">
                                <h3>{item._timeDay}</h3>
                            </div>)}
                            <p style={{paddingBottom: "10px"}}>{item.__text}</p>
                            <div style={{display: "flex", justifyContent: "flex-end", bottom:0}}>
                                <Button minimal small icon="edit">Редактировать</Button>
                                <Button minimal small icon="cross">Удалить</Button>
                            </div>
                        </Card>
                    );})}
            </div>
        );
    }
}

export default AnnounceList;
