import React, {PureComponent} from 'react';
import SideMenu from "../../components/sideBar/SideMenu";
import ElectiveSideItem from "./ElectiveSideItem";
import ElectiveWeekList from "./ElectiveWeekList";
import FooterBar from "../../components/footer/FooterBar";
import {Button, ResizeSensor, Spinner} from "@blueprintjs/core";
import ElectiveHeaderBar from "./ElectiveHeaderBar";
import {withReducer} from "../../store/withReducer";
import EmptyPage from "../../components/emptyPage";
import electiveReducer, {
    addElective,
    changeItemSideMenu,
    refreshAll,
    removeElective,
    saveItem
} from "../../store/reducers/elective.reducer";
import {bindActionCreators} from "redux";
import * as footerActions from "../../store/reducers/footer.reducer";

const styles = {
    contentStyle: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        height: "100%",
        overflowY: "auto",
        minWidth: "220px",
        paddingTop:"10px"
    },
    headerBar: {
        backgroundColor: "#E1E8ED",
        justifyItems: "middle",
        justifyContent: "center",
        border: "1px solid lightgrey",
        height: 50,
    }

};

class Elective extends PureComponent {

    constructor(props) {
        super(props);
        this.weekListRef = React.createRef();
    }

    componentDidMount() {
        this.props.refreshAll();
    }

    handleElectiveAdd = (dataHeader) => {
        this.props.addElective(dataHeader);
    };

    handleElectiveRemove = () => {
        this.props.removeElective();
    };

    handleClickSaveChanges = () => {
        this.props.saveItem();
    };

    handleClickCancelChanges = () => {
        this.props.footer.setCancelFooter();
    };

    handleResizeView = (entries) => {
        if (entries)
            this.props.footer.setContentWidth(entries[0].contentRect.width + "px");
    };

    handleSideMenuItemChange = (item) => {
        if (this.weekListRef.current) {
            this.weekListRef.current.scrollTop = 0;
        }
        this.props.changeItemSideMenu(item);
    };

    render() {
        const {windowStyle, isLoadingList, list, selectedItem} = this.props;
        return (
            isLoadingList
                ?
                <div style={{
                    position: "relative",
                    margin: "auto",
                }}>
                    <Spinner/>
                </div>
                :
                <div style={windowStyle}>
                    <SideMenu onChange={this.handleSideMenuItemChange}
                              list={list} selectedItem={selectedItem}
                              headerBar={
                                  <ElectiveHeaderBar style={styles.headerBar}
                                                     onAdd={this.handleElectiveAdd}/>
                              }>
                        <ElectiveSideItem
                            onRemoveItem={this.handleElectiveRemove}/>
                    </SideMenu>
                    <EmptyPage
                        notEmpty={list.length}>
                        <ResizeSensor onResize={this.handleResizeView}>
                            <ElectiveWeekList {...this.props}
                                              ref={this.weekListRef}
                                              {...styles} />
                        </ResizeSensor>
                    </EmptyPage>
                    <FooterBar>
                        <Button minimal icon="undo" onClick={this.handleClickCancelChanges}
                                intent={"#"} style={{color: "#F5F8FA"}}>Отменить</Button>
                        <Button minimal icon="edit" onClick={this.handleClickSaveChanges}
                                intent={"#"} style={{color: "#F5F8FA"}}>Сохранить изменения</Button>
                    </FooterBar>
                </div>
        );
    }
}

const mapStateToProps = (state) => state.elective;

const mapDispatchToProps = dispatch => ({
    footer: bindActionCreators(footerActions, dispatch),
    ...bindActionCreators({refreshAll, saveItem, addElective, removeElective, changeItemSideMenu}, dispatch)
});

export default withReducer("elective", electiveReducer, mapStateToProps, mapDispatchToProps)(Elective);
