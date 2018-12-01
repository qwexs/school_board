import React, {Component} from 'react';

class AnnounceSideItem extends Component {
    render() {
        const {item, sideItem} = this.props;
        return (
            <div className="disable-select" style={sideItem}>
                {item.title}
            </div>
        );
    }
}

export default AnnounceSideItem;
