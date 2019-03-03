import React, {PureComponent} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import GallerySideItem from "./GallerySideItem";
import GalleryAlbum from "./GalleryAlbum";
import FooterBar from "../../components/footer/FooterBar";
import {Button, ProgressBar, ResizeSensor, Spinner, Toaster} from "@blueprintjs/core";
import GalleryHeaderBar from "./GalleryHeaderBar";
import Modal from "../../components/Modal";
import * as Classes from "@blueprintjs/core/lib/cjs/common/classes";
import {Intent} from "@blueprintjs/core/lib/cjs/common/intent";
import classNames from 'classnames';
import EmptyPage from "../../components/emptyPage";
import {withReducer} from "../../store/withReducer";
import galleryReducer, {
    addAlbum,
    changeItemSideMenu,
    deletePhotos, insertPhotos,
    refreshAll, removeAlbum,
    selectPhotos,
    setSelectAll,
    unSelectAll
} from "../../store/reducers/gallery.reducer";
import {bindActionCreators} from "redux";
import * as footerActions from "../../store/reducers/footer.reducer";

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
    headerBar: {
        backgroundColor: "#E1E8ED",
        flexGrow: 1,
        justifyItems: "middle",
        justifyContent: "center",
        border: "1px solid lightgrey",
        height: 50,
        padding: 10
    }

};

class Gallery extends PureComponent {

    componentDidMount() {
        this.props.refreshAll();
    }

    handleAddAlbum = ({name, files}) => {
        const toastKey = this.toaster.show(this.renderToastProgress(false));

        this.props.addAlbum({name, files}).then(() => {
            if (this.toaster) {
                this.toaster.show(this.renderToastProgress(true), toastKey);
            }
        });
    };

    handleInsertFiles = (files) => {
        const toastKey = this.toaster.show(this.renderToastProgress(false));
        this.props.insertPhotos(files).then(() => {
            if (this.toaster) {
                this.toaster.show(this.renderToastProgress(true), toastKey);
            }
        });
    };

    handleRemoveAlbum = (item) => {
        this.props.removeAlbum(item);
    };

    handleSelectAll = () => {
        this.props.selectAll();
    };

    handleUnSelectAll = () => {
        this.props.unSelectAll();
    };

    handleDeleteSelected = () => {
        this.props.deletePhotos();
    };

    handleSideMenuItemChange = (item) => {
        this.props.changeItemSideMenu(item);
    };

    renderToastProgress = (isComplete) => {
        return {
            icon: "cloud-upload",
            message: (
                <ProgressBar
                    className={classNames("docs-toast-progress", {[Classes.PROGRESS_NO_STRIPES]: isComplete})}
                    intent={!isComplete ? Intent.PRIMARY : Intent.SUCCESS}
                    value={1}
                />
            ),
            timeout: !isComplete ? 0 : 2000,
        };
    };

    refToastHandlers = {
        toaster: (ref) => (this.toaster = ref),
    };

    handleResizeView = (entries) => {
        if (entries) {
            const contentWidth = entries[0].contentRect.width;
            this.props.footer.setContentWidth(contentWidth + "px");
        }
    };

    render() {
        const {windowStyle, isLoadingList, selectedItem, list} = this.props;
        return (
            isLoadingList
                ?
                <div style={{
                    position: "relative",
                    margin: "auto"
                }}>
                    <Spinner/>
                </div>
                :
                <div style={windowStyle}>
                    <SideMenu onChange={this.handleSideMenuItemChange}
                              list={list} selectedItem={selectedItem}
                        headerBar={
                                  <GalleryHeaderBar onAdd={this.handleAddAlbum} style={styles.headerBar}/>
                              }>
                        <GallerySideItem onRemoveItem={this.handleRemoveAlbum} {...styles}/>
                    </SideMenu>
                    <Modal>
                        <Toaster ref={this.refToastHandlers.toaster}/>
                    </Modal>
                    <ResizeSensor onResize={this.handleResizeView}>
                        <EmptyPage notEmpty={selectedItem}>
                            <GalleryAlbum onInsertPhotos={this.handleInsertFiles} {...styles}/>
                        </EmptyPage>
                    </ResizeSensor>

                    <FooterBar>
                        <Button minimal icon="multi-select" intent={"#"} style={{color: "#F5F8FA"}}
                                onClick={this.handleSelectAll}>
                            Выбрать все</Button>
                        <Button minimal icon="disable" intent={"#"} style={{color: "#F5F8FA"}}
                                onClick={this.handleUnSelectAll}>
                            Снять выделение</Button>
                        <Button minimal icon="trash" intent={"#"} style={{color: "#F5F8FA"}}
                                onClick={this.handleDeleteSelected}>Удалить</Button>
                    </FooterBar>
                </div>
        );
    }
}
const mapStateToProps = (state) => state.gallery;

const mapDispatchToProps = dispatch => ({
    footer: bindActionCreators(footerActions, dispatch),
    ...bindActionCreators({
        refreshAll,
        addAlbum,
        removeAlbum,
        insertPhotos,
        selectPhotos,
        deletePhotos,
        changeItemSideMenu,
        selectAll: ()=> setSelectAll(),
        unSelectAll
    }, dispatch)
});
export default withReducer("gallery", galleryReducer, mapStateToProps, mapDispatchToProps)(Gallery);
