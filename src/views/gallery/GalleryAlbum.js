import React, {PureComponent} from 'react';
import Gallery from "react-photo-gallery";
import SelectedImage from "./SelectImage";
import * as PropTypes from "prop-types";

class GalleryAlbum extends PureComponent {

    state = {
        photos: []
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {item: {photos}} = nextProps;
        this.setState({photos});
    }

    selectPhoto = (event, obj) => {
        let photos = this.state.photos;
        photos[obj.index].selected = !photos[obj.index].selected;
        this.forceUpdate();
        this.props.onSelected(photos.filter(item => item.selected).length > 0);
    };

    render() {
        const {contentStyle} = this.props;
        return (
            <div style={{
                width: "100%",
                height: "100%"
            }}>
                <div style={contentStyle}>
                    <Gallery
                        photos={this.state.photos}
                        ImageComponent={SelectedImage}
                        onClick={this.selectPhoto}/>
                </div>
            </div>
        );
    }
}

GalleryAlbum.propTypes = {
    onSelected: PropTypes.func
};

export default GalleryAlbum;
