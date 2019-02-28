import React, {PureComponent} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import AnnounceSideItem from "./AnnounceSideItem";
import AnnounceList from "./AnnounceList";
import FooterBar from "../../components/footer/FooterBar";
import {Button, Spinner} from "@blueprintjs/core";
import {ResizeSensor} from "@blueprintjs/core";
import AnnounceHeaderBar from "./AnnounceHeaderBar";
import {withReducer} from "../../store/withReducer";
import announceReducer, {changeDate, refreshAll, saveItem} from "../../store/reducers/announce.reducer";
import {bindActionCreators} from "redux";
import * as footerActions from "../../store/reducers/footer.reducer";

const styles = {
    sideItem: {
        width: "12vw",
        maxWidth: 150,
        height: "50px",
        margin: "auto",
        textAlign: "center",
        lineHeight: "50px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        padding: "0 5px 0 5px",
        color: "#394B59",
    },
    headerBar: {
        backgroundColor: "#E1E8ED",
        justifyContent: "center",
        border: "1px solid lightgrey",
        height: 50,
        width: "100%"
    }
};

class Announce extends PureComponent {

    componentDidMount() {
        this.props.refreshAll();
    }

    handleResizeView = (entries) => {
        if (entries) {
            const contentWidth = entries[0].contentRect.width;
            this.props.footer.setContentWidth(`${contentWidth}px`);
        }
    };

    handleSaveItem = () => {
        this.props.saveItem();
    };

    handleCancelItem = () => {
        this.props.footer.setCancelFooter();
    };

    handleChangeWeek = (date) => {
        this.props.changeDate(date);
    };

    render() {
        const {windowStyle} = this.props;
        return (
            this.props.isLoadingList
                ?
                <div style={{
                    position: "relative",
                    margin: "auto"
                }}>
                    <Spinner/>
                </div>
                :
                <div style={windowStyle}>
                    <SideMenu
                        headerBar={
                            <AnnounceHeaderBar style={styles.headerBar}
                                               value={this.props.selectedDate}
                                               onChange={this.handleChangeWeek}
                            />
                        }>
                        <AnnounceSideItem {...styles}/>
                    </SideMenu>
                    <ResizeSensor onResize={this.handleResizeView}>
                        <AnnounceList {...styles}/>
                    </ResizeSensor>
                    <FooterBar>
                        <Button minimal icon="undo" onClick={this.handleCancelItem}
                                intent={"#"} style={{color: "#F5F8FA"}}>Отменить</Button>
                        <Button minimal icon="edit" onClick={this.handleSaveItem}
                                intent={"#"} style={{color: "#F5F8FA"}}>Сохранить изменения</Button>
                    </FooterBar>
                </div>
        );
    }
}

const mapStateToProps = state => {
    return state.announce;
};

const mapDispatchToProps = dispatch => {
    return {
        footer: bindActionCreators(footerActions, dispatch),
        ...bindActionCreators({refreshAll, changeDate, saveItem}, dispatch)
    }
};

export default withReducer("announce", announceReducer, mapStateToProps, mapDispatchToProps)(Announce);
