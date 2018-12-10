import React, {PureComponent} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import GallerySideItem from "./GallerySideItem";
import GalleryAlbum from "./GalleryAlbum";
import FooterBar from "../../components/footer/FooterBar";
import {Button, ProgressBar, ResizeSensor, Toaster} from "@blueprintjs/core";
import {FooterPanelConsumer} from "../../components/footer/FooterBarProvider";
import {ID} from "../../utils/ID";
import GalleryHeaderBar from "./GalleryHeaderBar";
import axios from "axios";
import Modal from "../../components/Modal";
import * as Classes from "@blueprintjs/core/lib/cjs/common/classes";
import {Intent} from "@blueprintjs/core/lib/cjs/common/intent";
import classNames from 'classnames';
import IsNoPage from "../../components/IsNoPage";

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

    static ACTION_SELECT_ALL = "selectAll";
    static ACTION_UN_SELECT_ALL = "unSelectAll";
    static ACTION_DELETE = "deleteFile";

    constructor(props) {
        super(props);

        this.state = {
            list: [],
            selectedItem: null,
            vWidth: 0,
            isLoadItem: true,
        };
    }

    componentDidMount() {
        this.refreshAll();
    }

    refreshAll = (selectedItem = null) => {
        axios.get('/gallery').then(value => {
            const currentList = value.data;
            this.props.setOpen(false, () => {
                this.setState({
                    list: currentList,
                    selectedItem: selectedItem || currentList[0],
                }, () => {
                    this.sideMenuRef && this.sideMenuRef.scrollToSelect();
                });
            });
        });
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

    refreshItem = (id) => {
        this.props.setOpen(false);
        axios.get(`/gallery/${id}`).then(value => {
            this.setState({selectedItem: value.data, isLoadItem: false});
        });
    };

    handleResizeView = (entries) => {
        if (entries) {
            const vWidth = entries[0].contentRect.width;
            this.footerBar.setState({vWidth})
        }
    };

    onChangeItem = (item) => {
        this.props.setOpen(false);
        this.setState({selectedItem: item});
        this.albumList.scrollToTop();
    };

    handleAddAlbum = (data) => {
        const {name, files} = data;
        let fromData = new FormData();
        fromData.append('name', name);
        fromData.append('id', ID());
        files.forEach((file, index) => {
            if (index < 50) {
                fromData.append('photos', file);
            } else {
                return false;
            }
        });

        const toastKey = this.toaster.show(this.renderToastProgress(false));

        axios.post('/gallery', fromData,
            {headers: {'Content-Type': 'multipart/form-data'}, timeout: 7000000}).then(value => {
            this.refreshAll(value.data);
            if (this.toaster) {
                this.toaster.show(this.renderToastProgress(true), toastKey);
            }
        });
    };

    handleRemoveAlbum = (item) => {
        axios.delete(`/gallery/${item._id}`).then(value => {
            this.refreshAll();
        });
    };

    render() {
        const {windowStyle} = this.props;
        return (
            <FooterPanelConsumer>
                {({setOpen, isOpen, setAction, action}) => (
                    <div style={windowStyle}>
                        <SideMenu selectedItem={this.state.selectedItem}
                                  items={this.state.list}
                                  ref={ref => this.sideMenuRef = ref}
                                  onChangeItem={this.onChangeItem}
                                  {...this.props}
                                  headerBar={
                                      <GalleryHeaderBar onAdd={this.handleAddAlbum} style={styles.headerBar}/>
                                  }>
                            <GallerySideItem onRemoveItem={this.handleRemoveAlbum} {...styles}/>
                        </SideMenu>
                        <Modal>
                            <Toaster ref={this.refToastHandlers.toaster}/>
                        </Modal>
                        <ResizeSensor onResize={this.handleResizeView}>
                            <IsNoPage notEmpty={this.state.selectedItem}>
                                <GalleryAlbum ref={input => this.albumList = input}
                                              item={this.state.selectedItem}
                                              setOpen={setOpen}
                                              action={action}
                                              {...styles}/>
                            </IsNoPage>
                        </ResizeSensor>

                        <FooterBar ref={input => this.footerBar = input} isOpen={isOpen}>
                            <Button minimal icon="multi-select" onClick={() => setAction(Gallery.ACTION_SELECT_ALL)}>Выбрать
                                все</Button>
                            <Button minimal icon="disable"
                                    onClick={() => setAction(Gallery.ACTION_UN_SELECT_ALL, false)}>Снять
                                выделение</Button>
                            <Button minimal icon="trash"
                                    onClick={() => setAction(Gallery.ACTION_DELETE)}>Удалить</Button>
                        </FooterBar>

                    </div>
                )}
            </FooterPanelConsumer>
        );
    }
}

export default Gallery;
