import React, {PureComponent} from 'react';
import {ID} from "../../utils/ID";
import ElectiveDayList from "./ElectiveDayList";

class ElectiveWeekList extends PureComponent {

    state = {
        collectionList: []
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const {list} = nextProps;
        let collectionList = list && list['sunday'];
        if (collectionList && !Array.isArray(collectionList))
            collectionList = [collectionList];

        collectionList.map((item) => item.id = ID()); //FIXME: fetch id

        this.setState({
            // isOpen: nextProps.isOpen,
            collectionList,
        });
    }

    render() {
        const {contentStyle} = this.props;
        return (
            <div style={contentStyle}>
                {
                    this.state.collectionList.map((itemList, index) =>
                        <ElectiveDayList key={index} list={itemList} {...contentStyle}/>)
                }
            </div>
        );
    }
}

export default ElectiveWeekList;