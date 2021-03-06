import React from 'react';
import * as PropTypes from "prop-types";
import {Button, H5, Popover, PopoverInteractionKind, Text} from "@blueprintjs/core";
import {Intent, PopoverPosition} from "@blueprintjs/core/lib/cjs";
import * as Classes from "@blueprintjs/core/lib/cjs/common/classes";
import Radium from "radium";

const styles = {
    sideItem: {
        display: "flex",
        flexDirection: "row",
        height: 120,
        margin: "auto",
        overflow: "hidden",
        textAlign: "left",
        justifyContent: "space-between",
    },

    title: {
        width: "100%",
        fontWeight: "500",
        fontSize: "12pt",
        color: "#394B59",
        float: "left",
        textAlign: "left",
        paddingTop: "5%",
        paddingLeft: "10%",
        textOverflow: "ellipsis",
    },
    info: {
        display: "inline-block",
        fontWeight: "500",
        width: "100%",
        color: "#5C7080",
        textAlign: "left",
        float: "left",
        paddingTop: 7,
        paddingLeft: "17%",
        textOverflow: "ellipsis",
    },
    icon: {
        display: "flex",
        justifyItems: "center",
        width: "25%",
        height: "70%",
        margin: "auto",
        padding: "0 5% 0 0",
        '@media (max-width: 550px)': {
            width: "70%",
            padding: 0,
            margin: "auto"
        },
    }
};

class ElectiveSideItem extends React.PureComponent {

    static propTypes = {
        onRemoveItem: PropTypes.func
    };

    state = {
        onOver: false
    };

    render() {
        const {item} = this.props;
        const imgSrc = item.icon && typeof item.icon !== 'string'
            ? URL.createObjectURL(item.icon)
            : `/${item.icon}`;
        return (
            <Radium.StyleRoot>
                <div style={styles.sideItem} className="disable-select"
                     onMouseOver={() => this.setState({onOver: true})}
                     onMouseLeave={() => this.setState({onOver: false})}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        '@media (max-width: 550px)': {
                            display: "none"
                        },
                    }}>
                        <div style={styles.title} className="bp3-ui-text">{item.name}</div>
                        <div style={styles.info} className="bp3-text-small">
                            <dl>
                                <dd>{item.teacher}</dd>
                                <dd>{item.place}</dd>
                            </dl>
                        </div>
                    </div>
                    <div style={styles.icon}>
                        <img style={{maxWidth: '100%', maxHeight: '100%', margin: "auto"}} src={imgSrc}
                             alt={item.name}/>
                    </div>

                    {this.state.onOver &&
                    <div style={{position: "relative", marginRight: -30, right: 30}}>
                        <div style={{float: "right"}}>
                            <Popover interactionKind={PopoverInteractionKind.CLICK} captureDismiss={true}
                                     enforceFocus={false} position={PopoverPosition.RIGHT} usePortal={true}
                                     modifiers={{
                                         arrow: {enabled: false},
                                         flip: {enabled: false},
                                         keepTogether: {enabled: false},
                                         hide: {enabled: false},
                                         preventOverflow: {enabled: false},
                                     }}
                                     content={
                                         <div style={{padding: 15, width: "30vw"}}>
                                             <H5 style={{
                                                 textOverflow: "ellipsis",
                                                 overflow: "hidden",
                                                 whiteSpace: "nowrap",
                                                 width: "100%"
                                             }}>{item.name}</H5>
                                             <Text>Вы действительно хотите удалить выбранный электив?</Text>
                                             <div style={{display: "flex", justifyContent: "flex-end", marginTop: 15}}>
                                                 <Button className={Classes.POPOVER_DISMISS} style={{marginRight: 10}}>
                                                     Отмена
                                                 </Button>
                                                 <Button intent={Intent.DANGER} className={Classes.POPOVER_DISMISS}
                                                         onClick={() => this.props.onRemoveItem(item)}>
                                                     Удалить
                                                 </Button>
                                             </div>
                                         </div>
                                     }
                                     target={
                                         <Button minimal icon="cross" title="Удалить"/>
                                     }
                            />
                        </div>

                    </div>
                    }
                </div>
            </Radium.StyleRoot>
        );
    }
}

export default ElectiveSideItem;
