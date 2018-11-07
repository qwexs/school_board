import React, {Component} from 'react';

class AnnounceSideItem extends Component {
    render() {
        const {item} = this.props;
        return (
            <div className="schedule-item disable-select">
                {item._name}
            </div>
        );
    }
}

export default AnnounceSideItem;
