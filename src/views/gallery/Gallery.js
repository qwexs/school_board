import React, {PureComponent} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import galleryJSON from "./gallery.json";
import GallerySideItem from "./GallerySideItem";
import GalleryAlbum from "./GalleryAlbum";
import FooterBar from "../../components/footer/FooterBar";
import {Button, ResizeSensor} from "@blueprintjs/core";
import {FooterPanelConsumer} from "../../components/footer/FooterBarProvider";

const styles = {
    sideItem: {
        display: "flex",
        flexDirection: "column",
        width: "20vw",
        minWidth: 150,
        height: 80,
        margin: "auto",
        overflow: "hidden",
        textAlign: "left",
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

    static ACTION_SELECT_ALL = "selectAll";
    static ACTION_UN_SELECT_ALL = "unSelectAll";
    static ACTION_DELETE = "deleteFile";

    constructor(props) {
        super(props);
        const currentList = galleryJSON.albums;
        this.state = {
            list: currentList,
            selectedItem: currentList[0],
            vWidth: 0,
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {

    }

    handleResizeView = (entries) => {
        if (entries) {
            const vWidth = entries[0].contentRect.width;
            this.footerBar.setState({vWidth})
        }
    };

    onChangeItem = (item) => {
        this.setState({selectedItem: item});
    };

    render() {
        const {windowStyle} = this.props;
        return (
            <FooterPanelConsumer>
                {({setOpen, isOpen, setAction, action}) => (
                <div style={windowStyle}>
                    <SideMenu items={this.state.list} onChangeItem={this.onChangeItem} {...this.props}>
                        <GallerySideItem {...styles}/>
                    </SideMenu>
                    <ResizeSensor onResize={this.handleResizeView}>
                        <GalleryAlbum item={this.state.selectedItem}
                                      setOpen={setOpen}
                                      action={action}
                                      {...styles}/>
                    </ResizeSensor>

                    <FooterBar ref={input => this.footerBar = input} isOpen={isOpen}>
                        <Button minimal icon="multi-select" onClick={() => setAction(Gallery.ACTION_SELECT_ALL)}>Выбрать все</Button>
                        <Button minimal icon="disable" onClick={() => setAction(Gallery.ACTION_UN_SELECT_ALL, false)}>Снять выделение</Button>
                        <Button minimal icon="trash" onClick={() => setAction(Gallery.ACTION_DELETE)}>Удалить</Button>
                    </FooterBar>

                </div>
            )}
            </FooterPanelConsumer>
        );
    }
}

export default Gallery;
