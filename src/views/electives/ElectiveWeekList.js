import React, {PureComponent} from 'react';
import ElectiveDayList from "./ElectiveDayList";
import {FooterPanelConsumer} from "../../components/footer/FooterBarProvider";
import {Spinner} from "@blueprintjs/core";
import * as PropTypes from "prop-types";
import ElectiveTitleGroup from "./ElectiveTitleGroup";
import Elective from "./Elective";
import IsNoPage from "../../components/IsNoPage";

class ElectiveWeekList extends PureComponent {

    static propTypes = {
        onRemoveElective: PropTypes.func,
        onSaveElective: PropTypes.func
    };

    state = {
        item: null
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const {item, action, isLoadItem} = nextProps;

        this.setState({item});

        if (!isLoadItem && action === Elective.ACTION_SAVE_ITEM) {
            const {name, teacher, place} = this.titleGroupRef.state.item;
            this.setState({item:{...this.state.item, name, teacher, place}}, () => {
                nextProps.onSaveElective(this.state.item);
            });
        }
    }

    scrollToTop() {
        if (this.listContainerRef) {
            this.listContainerRef.scrollTop = 0;
        }
    }

    handleSaveList = (dayList) => {
        const {id, less} = dayList;
        const newItem = this.state.item;
        newItem.items.forEach(itemDay => {
            if (itemDay._id === id) {
                itemDay.less = less;
            }
        });
    };

    render() {
        const {contentStyle, isLoadItem} = this.props;
        return (
            <FooterPanelConsumer>
                {({setOpen, setAction, action}) => (
                    <div style={{
                        width: "100%",
                        height: "100%"
                    }}>
                        <IsNoPage notEmpty={this.state.item && this.state.item.items && this.state.item.items.length}>
                            {isLoadItem
                                ?
                                <div style={{
                                    position: "relative",
                                    top: "50%"
                                }}>
                                    <Spinner/>
                                </div>
                                :
                                <div style={contentStyle} ref={(ref) => this.listContainerRef = ref}>
                                    <ElectiveTitleGroup ref={ref => this.titleGroupRef = ref}
                                                        item={this.state.item} setOpen={setOpen}
                                                        onRemoveElective={this.props.onRemoveElective}/>
                                    <div style={{
                                        width: "90%", margin: "auto",
                                        borderBottom: "2px solid silver"
                                    }}/>
                                    {
                                        this.state.item && this.state.item.items.map((itemList, index) =>
                                            <ElectiveDayList key={index} list={itemList}
                                                             setOpen={setOpen} onSave={this.handleSaveList}
                                                             setAction={setAction} action={action}
                                                             {...contentStyle}/>)
                                    }
                                </div>
                            }
                        </IsNoPage>
                    </div>
                )}
            </FooterPanelConsumer>
        );
    }
}

export default ElectiveWeekList;
