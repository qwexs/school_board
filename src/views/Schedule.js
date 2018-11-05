import React, {Component} from 'react';
import xml2json from "../utils/xml2json";
import ScheduleItem from "./schedule/ScheduleItem";
import SideMenu from "../components/sideBar/SideMenu";
import TableList from "./schedule/TableList";
import FooterApply from "../components/footer/FooterApply";
class Schedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedItem: {}
        };
    }

    onChangeItem = (target) => {
        this.setState({selectedItem: target.props.item});
    };

    componentDidMount() {
        const raspData = xml2json("/assets/data/rasp.xml");
        const currentList = raspData["school"]["klass"];
        this.setState({
            list:raspData["school"]["klass"],
            selectedItem: currentList[0]
        });
    }

    render() {
        return (
            <div className="schedule-window">
                <SideMenu items={this.state.list} onChangeItem={this.onChangeItem}>
                    <ScheduleItem/>
                </SideMenu>
                <TableList days={this.state.selectedItem}/>
                <FooterApply/>
            </div>
        );
    }
}

export default Schedule;
