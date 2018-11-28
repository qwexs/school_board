import React, {PureComponent} from 'react';
import GalleryComponent from "react-photo-gallery";
import Gallery from './Gallery';
import SelectedImage from "./SelectImage";

class GalleryAlbum extends PureComponent {

    state = {
        photos: [],
    };

    componentWillReceiveProps(nextProps, nextContext) {
        let {action, item: {photos}} = nextProps;
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

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.item.name !== this.props.item.name) {
            this.listContainer.scrollTop = 0;
            nextState.photos.map(item => item.selected = false);
        }
    }

    selectPhoto = (event, obj) => {
        const {photos} = this.state;
        photos[obj.index].selected = !photos[obj.index].selected;
        this.props.setOpen(photos.filter(item => item.selected).length > 0);
    };

    render() {
        const {contentStyle} = this.props;
        return (
            <div style={{
                width: "100%",
                height: "100%"
            }} className="disable-select">
                <div style={contentStyle} ref={(ref) => this.listContainer = ref}>
                    <GalleryComponent
                        photos={this.state.photos}
                        ImageComponent={SelectedImage}
                        onClick={this.selectPhoto}/>
                </div>
            </div>
        );
    }
}

export default GalleryAlbum;
