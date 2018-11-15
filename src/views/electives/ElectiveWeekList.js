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
            collectionList,
        });

        this.listContainer.scrollTop = 0;
    }

    render() {
        const {contentStyle} = this.props;
        return (
            <div style={{
                width: "100%",
                height: "100%"
            }}>
                <div style={contentStyle} ref={(ref) => this.listContainer = ref}>
                    {
                        this.state.collectionList.map((itemList, index) =>
                            <ElectiveDayList key={index} list={itemList} {...contentStyle}/>)
                    }
                </div>
            </div>
        );
    }
}

export default ElectiveWeekList;
