import React, {Component} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import AnnounceSideItem from "./AnnounceSideItem";
import xml2json from "../../utils/xml2json";
import AnnounceList from "./AnnounceList";
import FooterApply from "../../components/footer/FooterApply";
import {Button} from "@blueprintjs/core";

class Announce extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedItem: null,
            isOpen: false
        };
    }

    componentDidMount() {
        const data = xml2json("/assets/data/anons.xml");
        const currentList = data["anonsFlow"]["eventDay"];
        this.setState({
            list: currentList,
            selectedItem: currentList[0],
        });
    }

    onChangeItem = (target) => {
        this.setState({selectedItem: target.props.item});
    };

    onSaveDialogHandler = () => {
        this.setState({isOpen: false});
    };

    onCancelDialogHandler = () => {
        this.setState({isOpen: false});
    };

    onAddClickHandler = (event) => {
        this.setState({isOpen: true})
    };

    render() {
        return (
            <div>
                <SideMenu items={this.state.list} onChangeItem={this.onChangeItem}>
                    <AnnounceSideItem/>
                </SideMenu>
                <AnnounceList list={this.state.selectedItem} isOpen={this.state.isOpen} onCloseDialog={this.onSaveDialogHandler}/>
                <FooterApply>
                    <Button minimal icon="add-to-artifact" onClick={this.onAddClickHandler}>Создать анонс</Button>
                    <Button minimal icon="undo">Отменить</Button>
                    <Button minimal icon="edit" >Сохранить изменения</Button>
                </FooterApply>
            </div>
        );
    }
}

export default Announce;
