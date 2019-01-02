import React, {PureComponent} from 'react';

class ScheduleSideItem extends PureComponent {
    render() {
        const {item, sideItem} = this.props;
        return (
            <div className="disable-select bp3-text-large" style={sideItem}>
                {item.name}
            </div>
        );
    }
}

export default ScheduleSideItem;
