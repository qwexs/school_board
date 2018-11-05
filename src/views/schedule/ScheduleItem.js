import React, {Component} from 'react';

class ScheduleItem extends Component {
    render() {
        const {item} = this.props;
        return (
            <div className="schedule-item disable-select">
                {item._id}
            </div>
        );
    }
}

export default ScheduleItem;
