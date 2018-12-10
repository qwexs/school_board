import React, {PureComponent} from 'react';
import GalleryComponent from "react-photo-gallery";
import Gallery from './Gallery';
import SelectedImage from "./SelectImage";
import Dropzone from 'react-dropzone';

class GalleryAlbum extends PureComponent {

    state = {
        photos: [],
        files: [],
        dropzoneActive: false
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {action, item} = nextProps;
        if (!item || !item.photos) return;
        let {photos} = item;
        switch (action) {
            case Gallery.ACTION_SELECT_ALL:
                photos.map(item => item.selected = true);
                break;
            case Gallery.ACTION_UN_SELECT_ALL:
                photos.map(item => item.selected = false);
                break;
            case Gallery.ACTION_DELETE:
                photos = photos.filter(item => !item.selected);
                break;
            default:
        }
        this.setState({photos});
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

    onDragEnter = () => {
        this.setState({
            dropzoneActive: true
        });
    };

    onDragLeave = () => {
        this.setState({
            dropzoneActive: false
        });
    };

    onDrop = (files) => {
        this.setState({
            files,
            dropzoneActive: false
        });
    };

    render() {
        const {contentStyle} = this.props;
        const {dropzoneActive} = this.state;
        return (
            <div style={{
                width: "100%",
                height: "100%"
            }} className="disable-select">
                <div style={contentStyle} ref={(ref) => this.listContainer = ref}>
                    <Dropzone
                        accept="image/jpeg, image/jpg, image/png"
                        disableClick
                        style={{position: "relative", opacity: dropzoneActive ? .5 : 1}}
                        onDrop={this.onDrop}
                        onDragEnter={this.onDragEnter}
                        onDragLeave={this.onDragLeave}
                    >
                        <GalleryComponent
                            photos={this.state.photos}
                            ImageComponent={SelectedImage}
                            onClick={this.selectPhoto}/>
                    </Dropzone>

                </div>
            </div>
        );
    }
}

export default GalleryAlbum;
