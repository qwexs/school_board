import React, {Component} from 'react';

class ScheduleSideItem extends Component {
    render() {
        const {item, sideItem, onClick} = this.props;
        return (
            <div className="disable-select" style={sideItem} onClick={onClick}>
                {item.name}
            </div>
        );
    }
}

export default ScheduleSideItem;
