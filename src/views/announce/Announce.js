import React, {Component} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import AnnounceItem from "./AnnounceItem";
import xml2json from "../../utils/xml2json";
import AnnounceList from "./AnnounceList";
import FooterApply from "../../components/footer/FooterApply";
import {Button} from "@blueprintjs/core";

class Announce extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedItem: null
        };
    }

    componentDidMount() {
        const data = xml2json("/assets/data/anons.xml");
        const currentList = data["anonsFlow"]["eventDay"];
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
            <div>
                <SideMenu items={this.state.list} onChangeItem={this.onChangeItem}>
                    <AnnounceItem/>
                </SideMenu>
                <AnnounceList list={this.state.selectedItem}/>
                <FooterApply>
                    <Button minimal icon="add-to-artifact" >Создать анонс</Button>
                    <Button minimal icon="undo">Отменить</Button>
                    <Button minimal icon="edit" >Сохранить изменения</Button>
                </FooterApply>
            </div>
        );
    }
}

export default Announce;
