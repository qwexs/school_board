import React, {Component} from 'react';

class AnnounceItem extends Component {
    render() {
        const {item} = this.props;
        return (
            <div className="schedule-item disable-select">
                {item._name}
            </div>
        );
    }
}

export default AnnounceItem;
