import React, {PureComponent} from 'react';
import Radium from "radium";
import {Button, H5, Popover, PopoverInteractionKind, Spinner, Text} from "@blueprintjs/core";
import * as PropTypes from 'prop-types';
import {Intent, PopoverPosition} from "@blueprintjs/core/lib/cjs";
import * as Classes from "@blueprintjs/core/lib/cjs/common/classes";

const styles = {
    mainStyle: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
    },
    backgroundStyle: {
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E1E8ED",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center"
    }
};

class HolidaysItem extends PureComponent {

    static propTypes = {
        onEdit: PropTypes.func,
        onRemove: PropTypes.func
    };

    state = {
        loaded: true,
        isOver: true
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {image} = this.props.content;
        if (image) {
            const imageLoader = new Image();
            imageLoader.src = `../${image}`;
            imageLoader.onload = () => {
                this.setState({loaded: true});
            }
        }
        else
            this.setState({loaded: true});
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.content.image !== this.props.content.image)
            this.setState({loaded: false});
    }

    handleClickEditItem = () => {
        this.props.onEdit();
    };

    handleClickRemoveItem = () => {
        this.props.onRemove();
    };

    render() {
        const {title, text, image} = this.props.content;
        return (
            <div style={styles.mainStyle}>
                <p/>
                <H5 style={{margin: "0 auto"}}>
                    {title}
                </H5>
                <p/>
                <div>
                    {this.state.isOver &&
                    <div style={{
                        display: "flex", flexDirection: "row",
                        position: "relative", float: "right", padding: 0,
                        borderRadius: "1px",
                        marginTop: -30, top: 40, marginRight: -70, right: 80
                    }}>
                        <div style={{
                            border: "solid 1.3px #A7B6C2", background: "rgba(255, 255, 255, 0.8)",
                            borderRadius: 3, marginRight: 5
                        }}>
                            <Button minimal icon="edit" title="Редактировать"
                                    onClick={this.handleClickEditItem}/>
                        </div>
                        <div style={{
                            border: "solid 1.3px #A7B6C2", background: "rgba(255, 255, 255, 0.8)",
                            borderRadius: 3,
                        }}>
                            <Popover interactionKind={PopoverInteractionKind.CLICK} captureDismiss={true}
                                     enforceFocus={false} position={PopoverPosition.LEFT_TOP}
                                     content={
                                         <div style={{padding: 15, width: "30vw"}}>
                                             <H5 style={{
                                                 textOverflow: "ellipsis",
                                                 overflow: "hidden",
                                                 whiteSpace: "nowrap",
                                                 width: "100%"
                                             }}>{title}</H5>
                                             <Text>Вы действительно хотите удалить выбранный праздник?</Text>
                                             <div style={{display: "flex", justifyContent: "flex-end", marginTop: 15}}>
                                                 <Button className={Classes.POPOVER_DISMISS} style={{marginRight: 10}}>
                                                     Отмена
                                                 </Button>
                                                 <Button intent={Intent.DANGER} className={Classes.POPOVER_DISMISS}
                                                         onClick={this.handleClickRemoveItem}>
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
                    <div style={[styles.backgroundStyle, {backgroundImage: `url(/${image})`}]}>
                        {!this.state.loaded &&
                        <Spinner/>
                        }
                    </div>
                </div>
                <p/>
                <div style={{
                    padding: "3% 5% 4% 5%",
                    textAlign: "justify"
                }} className="bp3-ui-text">{text}</div>
            </div>
        );
    }
}

export default Radium(HolidaysItem);
