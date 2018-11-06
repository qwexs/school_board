import React, {Component} from 'react';
import xml2json from "../../utils/xml2json";
import ScheduleItem from "./ScheduleItem";
import SideMenu from "../../components/sideBar/SideMenu";
import TableList from "./TableList";
import FooterApply from "../../components/footer/FooterApply";
import {Button} from "@blueprintjs/core";
class Schedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedItem: {}
        };
    }

    componentDidMount() {
        const raspData = xml2json("/assets/data/rasp.xml");
        const currentList = raspData["school"]["klass"];
        this.setState({
            list: currentList,
            selectedItem: currentList[0]
        });
    }

    onChangeItem = (target) => {
        this.setState({selectedItem: target.props.item});
    };

    render() {
        return (
            <div className="schedule-window">
                <SideMenu items={this.state.list} onChangeItem={this.onChangeItem}>
                    <ScheduleItem/>
                </SideMenu>
                <TableList days={this.state.selectedItem}/>
                <FooterApply>
                    <Button minimal icon="undo">Отменить</Button>
                    <Button minimal icon="edit" >Сохранить изменения</Button>
                </FooterApply>
            </div>
        );
    }
}

export default Schedule;
