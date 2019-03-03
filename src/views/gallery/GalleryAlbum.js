import React, {PureComponent} from 'react';
import GalleryComponent from "react-photo-gallery";
import SelectedImage from "./SelectImage";
import {Checkbox, Spinner} from "@blueprintjs/core";
import Dropzone from "react-dropzone";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {insertPhotos, patchAlbum, selectPhotos} from "../../store/reducers/gallery.reducer";
import * as PropTypes from "prop-types";

class GalleryAlbum extends PureComponent {

    static propTypes = {
        onInsertPhotos: PropTypes.func,
        slideShow: PropTypes.bool
    };

    handleSlideShowChange = (event) => {
        const {checked} = event.target;
        this.props.patchAlbum({slideShow: checked});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.selectedItem._id !== prevProps.selectedItem._id) {
            this.scrollTop();
        }
    }

    scrollTop() {
        if (this.listContainer) this.listContainer.scrollTop = 0;
        this.props.selectedItem.photos.map(item => item.selected = false);
    }

    handleSelectPhoto = (event, obj) => {
        this.props.selectPhotos(obj.index);
    };

    onDrop = (files) => {
        this.props.onInsertPhotos(files);
    };

    render() {
        const {contentStyle, selectedItem:{photos, slideShow}, isLoadingItem} = this.props;
        return (
            isLoadingItem
                ?
                <div style={{
                    position: "relative",
                    margin: "auto"
                }}>
                    <Spinner/>
                </div>
                :
                <div style={{
                    width: "100%",
                    height: "100%"
                }} className="disable-select">

                    <div style={{
                        position: "relative",
                        marginBottom: -50,
                        zIndex: 1,
                        paddingTop: 10,
                        height: 40,
                        maxWidth: 150,
                        float: "right",
                        right: 25
                    }}>
                        <div style={{
                            background: "#BFCCD6",
                            borderRadius: 3, height: "100%"
                        }}>
                            <div style={{padding: 5}}>
                                <Checkbox checked={slideShow} label="Слайд-шоу"
                                          onChange={this.handleSlideShowChange}/>
                            </div>
                        </div>
                    </div>
                    <div style={contentStyle} ref={(ref) => this.listContainer = ref}>
                        <Dropzone style={{width: "100%", height: "100%"}}
                                  disableClick
                                  accept="image/jpeg, image/jpg, image/png"
                                  onDrop={this.onDrop}
                        >
                            {({getRootProps, getInputProps, isDragActive}) => {
                                return (
                                    <div {...getRootProps()}
                                         style={{
                                             width: "100%", height: "100%",
                                             opacity: isDragActive ? .5 : 1
                                         }}>
                                        <GalleryComponent
                                            {...getInputProps()}
                                            photos={photos}
                                            ImageComponent={SelectedImage}
                                            onClick={this.handleSelectPhoto}/>
                                    </div>

                                );
                            }}
                        </Dropzone>
                    </div>
                </div>
        );
    }
}
const mapStateToProps = (state) => state.gallery;

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators({selectPhotos, insertPhotos, patchAlbum}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GalleryAlbum);
