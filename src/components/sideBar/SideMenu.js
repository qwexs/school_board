import React, {forwardRef, PureComponent} from "react";
import SideMenuItem from "./SideMenuItem";
import Radium from "radium";
import * as PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {changeItem} from "../../store/actions";

const styles = {
    sideMenuContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        margin: "0 auto",
        overflowX: "hidden",
        overflowY: "auto",
        background: "#E1E8ED",
        border: "1px solid lightgrey",
        height: "100%",
        scrollBehavior: "smooth"
    }
};

class SideMenu extends PureComponent {

    static propTypes = {
        headerBar: PropTypes.element,
    };

    componentDidMount() {
        this.scrollToSelect();
    }

    scrollToSelect() {
        if (this.selectedRef && this.selectedRef.current && this.containerRef) {
            this.containerRef.scrollTop =
                this.selectedRef.current.offsetTop -
                this.props.headerBar.props.style.height;
        }
    }

    onClickHandler = (item) => {
        if (item._id !== this.props.selectedItem._id)
            this.props.changeItem(item);
    };

    render() {
        const {list, headerBar, selectedItem} = this.props;
        return (
            <div style={{height: "100%"}}>
                {headerBar && headerBar}
                <div style={[
                    styles.sideMenuContainer,
                    {height: `calc(100% - ${headerBar ? headerBar.props.style.height : 0}px)`}
                ]} ref={(ref) => (this.containerRef = ref)}>
                    {list.map((item, index) => {
                        const selected = selectedItem && item._id === selectedItem._id;
                        const ref = React.createRef();
                        if (selected)
                            this.selectedRef = ref;
                        return (
                            <ForwardingSideMenuItem key={index} ref={ref}>
                                <SideMenuItem
                                    selected={selected}
                                    item={item}
                                    onClick={this.onClickHandler}>
                                    {React.cloneElement(this.props.children, {item})}
                                </SideMenuItem>
                            </ForwardingSideMenuItem>
                        );
                    })}
                </div>
            </div>
        );
    }
}

const ForwardingSideMenuItem = forwardRef((props, ref) => {
    return <div ref={ref}>{props.children}</div>;
});

const mapStateToProps = (state) => {
    const {selectedItem, list} = state.schedule;
    return {
        selectedItem, list
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({changeItem}, dispatch);

SideMenu = Radium(SideMenu);
export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
