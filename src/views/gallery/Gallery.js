import React, {PureComponent} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import galleryJSON from "./gallery.json";
import GallerySideItem from "./GallerySideItem";
import GalleryAlbum from "./GalleryAlbum";
import FooterApply from "../../components/footer/FooterApply";
import {Button, ResizeSensor} from "@blueprintjs/core";

const styles = {
    sideItem: {
        display: "flex",
        flexDirection: "column",
        width: "20vw",
        minWidth: 150,
        height: 80,
        margin: "auto",
        overflow: "hidden",
        textAlign: "start",
        justifyContent: "space-evelyn"
    },
    contentStyle: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
    },

};

class Gallery extends PureComponent {

    constructor(props) {
        super(props);
        const currentList = galleryJSON.albums;
        this.state = {
            list: currentList,
            selectedItem: currentList[0],
            isOpen: false,
            vWidth: 0,
            footerVisible: false,
        };
    }

    componentDidMount() {

    }

    handleResizeView = (entries) => {
        if (entries) {
            this.setState({vWidth: entries[0].contentRect.width});
        }
    };

    onChangeItem = (target) => {
        this.setState({selectedItem: target.props.item});
    };

    handleChangeAlbum = (isSelected) => {
        this.setState({footerVisible: isSelected});
    };

    handleSelectAll = () => {

    };

    handleUnSelect = () => {

    };

    handleRemove = () => {

    };

    render() {
        const {windowStyle} = this.props;
        return (
            <div style={windowStyle}>
                <SideMenu items={this.state.list} onChangeItem={this.onChangeItem} {...this.props}>
                    <GallerySideItem {...styles}/>
                </SideMenu>
                <ResizeSensor onResize={this.handleResizeView}>
                    <GalleryAlbum item={this.state.selectedItem} onSelected={this.handleChangeAlbum} {...styles}/>
                </ResizeSensor>
                <FooterApply width={this.state.vWidth} visible={this.state.footerVisible}>
                    <Button minimal icon="multi-select" onClick={this.handleSelectAll}>Выбрать все</Button>
                    <Button minimal icon="disable" onClick={this.handleUnSelect}>Снять выделение</Button>
                    <Button minimal icon="trash" onClick={this.handleRemove}>Удалить</Button>
                </FooterApply>
            </div>
        );
    }
}

export default Gallery;
