import React, {PureComponent} from 'react';
import ElectiveDayList from "./ElectiveDayList";
import {FooterPanelConsumer} from "../../components/footer/FooterBarProvider";
import {Button, EditableText, H4, H6, Popover, PopoverInteractionKind, Spinner} from "@blueprintjs/core";
import * as Classes from "@blueprintjs/core/lib/cjs/common/classes";
import * as PropTypes from "prop-types";

class ElectiveWeekList extends PureComponent {

    static propTypes = {
        onConfirm: PropTypes.func
    };

    state = {
        item: null
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const {item} = nextProps;

        this.setState({
            item
        });

        if (this.listContainer) {
            this.listContainer.scrollTop = 0;
        }
    }

    handleChangeTitle = (text) => {
        this.setState(prevState => {
            return {item: {...prevState.item, name: text}}
        });
    };

    handleChangeTeacher = (text) => {
        this.setState(prevState => {
            return {item: {...prevState.item, teacher: text}}
        });
    };

    handleChangePlace = (text) => {
        this.setState(prevState => {
            return {item: {...prevState.item, place: text}}
        });
    };

    handleConfirmData = () => {
        this.props.onConfirm(this.state.item);
    };

    render() {
        const {contentStyle, isLoadItem, item} = this.props;
        return (
            <FooterPanelConsumer>
                {({setAction, action}) => (
                    <div style={{
                        width: "100%",
                        height: "100%"
                    }}>
                        {isLoadItem
                            ?
                            <div style={{
                                position: "relative",
                                top: "50%"
                            }}>
                                <Spinner/>
                            </div>
                            :
                            <div style={contentStyle} ref={(ref) => this.listContainer = ref}>
                                <div style={{margin: 10}}>
                                    <Popover interactionKind={PopoverInteractionKind.CLICK}
                                         content={
                                             <div style={{padding: 5}}>
                                                 <Button icon="trash" text={"Удалить электив"} minimal
                                                         className={Classes.POPOVER_DISMISS}
                                                         onClick={this.props.onRemoveKlass}/>
                                             </div>

                                         }
                                         target={
                                             <H4 style={{color:"#394B59"}}>
                                                 <EditableText placeholder={"Название электива..."}
                                                               value={this.state.item.name}
                                                               maxLength={45}
                                                               minWidth={"15vw"}
                                                               onConfirm={this.handleConfirmData}
                                                               onChange={this.handleChangeTitle}
                                                 />
                                             </H4>
                                         }/>

                                    <H6 style={{color:"#394B59"}}>
                                        <EditableText placeholder={"Имя руководителя..."}
                                                      value={this.state.item.teacher}
                                                      maxLength={70}
                                                      minWidth={"15vw"}
                                                      onConfirm={this.handleConfirmData}
                                                      onChange={this.handleChangeTeacher}
                                        />
                                    </H6>
                                    <H6 style={{color:"#394B59"}}>
                                        <EditableText placeholder={"Место проведения..."}
                                                      value={this.state.item.place}
                                                      maxLength={30}
                                                      minWidth={"15vw"}
                                                      onConfirm={this.handleConfirmData}
                                                      onChange={this.handleChangePlace}
                                        />
                                    </H6>
                                </div>
                                <div style={{
                                    width: "90%", margin: "auto",
                                    borderBottom: "2px solid silver"
                                }}/>
                                {
                                    this.state.item.items.map((itemList, index) =>
                                        <ElectiveDayList key={index} list={itemList} {...contentStyle}/>)
                                }
                            </div>
                        }
                    </div>
                )}
            </FooterPanelConsumer>
        );
    }
}

export default ElectiveWeekList;
