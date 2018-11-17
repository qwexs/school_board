import React, {PureComponent} from 'react';
import Gallery from "react-photo-gallery";
import SelectedImage from "./SelectImage";
import * as PropTypes from "prop-types";
import FooterBarProvider from "../../components/footer/FooterBarProvider";

class GalleryAlbum extends PureComponent {

    state = {
        photos: [],
    };

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {action, item: {photos}} = nextProps;

        switch (action) {
            case FooterBarProvider.ACTION_SELECT_ALL:
                photos.map(item => item.selected = true);
                break;
            case FooterBarProvider.ACTION_UNSELECT_ALL:
                photos.map(item => item.selected = false);
                break;
            case FooterBarProvider.ACTION_DELETE:
                photos = photos.filter(item => !item.selected);
                break;
            default:
        }

        this.setState({photos});
    }

    selectPhoto = (event, obj) => {
        const {photos} = this.state;
        photos[obj.index].selected = !photos[obj.index].selected;
        this.props.onSelected(photos.filter(item => item.selected).length > 0);
        this.setState({photos});
    };

    render() {
        const {contentStyle} = this.props;
        return (
            <div style={{
                width: "100%",
                height: "100%"
            }} className="disable-select">
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
