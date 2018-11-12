import React, {Component} from 'react';

class ScheduleSideItem extends Component {
    render() {
        const {item, sideItem} = this.props;
        return (
            <div className="disable-select" style={sideItem}>
                {item._id}
            </div>
        );
    }
}

export default ScheduleSideItem;
