import React, {PureComponent} from 'react';
import GalleryComponent from "react-photo-gallery";
import Gallery from './Gallery';
import SelectedImage from "./SelectImage";
import * as PropTypes from "prop-types";
import {Checkbox} from "@blueprintjs/core";
import Dropzone from "react-dropzone";

class GalleryAlbum extends PureComponent {

    static propTypes = {
        onDeleteItems: PropTypes.func,
        onChange: PropTypes.func,
        setOpen: PropTypes.func,
        onInsert: PropTypes.func
    };

    state = {
        photos: [],
        files: [],
        slideShow: false
    };

    handleSlideShowChange = (event) => {
        const {checked} = event.target;
        this.setState({slideShow: checked}, () => {
            this.props.onChange(this.state);
        });
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {action, item} = nextProps;
        if (!item || !item.photos) return;
        let {photos, slideShow} = item;
        switch (action) {
            case Gallery.ACTION_SELECT_ALL:
                photos.map(item => item.selected = true);
                break;
            case Gallery.ACTION_UN_SELECT_ALL:
                photos.map(item => item.selected = false);
                break;
            case Gallery.ACTION_DELETE:
                photos = photos.filter(item => !item.selected);
                this.props.onDeleteItems(photos);
                break;
            default:
        }
        this.setState({photos, slideShow});
    }

    scrollToTop() {
        if (this.listContainer) this.listContainer.scrollTop = 0;
        this.state.photos.map(item => item.selected = false);
    }

    selectPhoto = (event, obj) => {
        const {photos} = this.state;
        photos[obj.index].selected = !photos[obj.index].selected;
        this.forceUpdate(
            () => this.props.setOpen(photos.filter(item => item.selected).length > 0)
        );
    };

    onDrop = (files) => {
        this.props.onInsert(files);
    };

    render() {
        const {contentStyle} = this.props;
        return (
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
                            <Checkbox checked={this.state.slideShow} label="Слайд-шоу"
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
                                        photos={this.state.photos}
                                        ImageComponent={SelectedImage}
                                        onClick={this.selectPhoto}/>
                                </div>

                            );
                        }}
                    </Dropzone>
                </div>
            </div>
        );
    }
}

export default GalleryAlbum;
