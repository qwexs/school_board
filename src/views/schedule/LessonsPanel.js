import React, {PureComponent} from 'react';
import axios from "axios";
import {Button, Classes, H5, Icon, Intent, Label, Overlay, Spinner} from "@blueprintjs/core";
import {TimePicker} from "@blueprintjs/datetime";
import classNames from "classnames";
import Modal from "../../components/Modal";
import moment from "moment";

class LessonsPanel extends PureComponent {

    state = {
        loaded: false,
        isOpenLessons: false,
        list: [],
        vWidth: ""
    };

    handleSave = () => {
        axios.post('/schedule/lessons', this.state.list).then(() => {
            this.slideDownPanel();
        });
    };

    handleOpenLessons = () => {
        this.setState({isOpenLessons: true, loaded: false}, () => {
            if (this.overlayContent) {
                this.overlayContent.classList.remove("slide-down-animation");
                this.overlayContent.classList.add("slide-up-animation");
            }

            axios.get('/schedule/lessons').then(resolve => {
                this.setState({list:resolve.data, loaded: true});
            });
        });
    };

    handleCloseLessons = (event) => {
        if (this.overlayContent &&
            this.containsOverlayContent(event.target, this.overlayContent)) {
            return;
        }
        this.slideDownPanel();
    };

    slideDownPanel = () => {
        this.setState({isOpenLessons: false}, () => {
            if (this.overlayContent) {
                this.overlayContent.classList.remove("slide-up-animation");
                this.overlayContent.classList.add("slide-down-animation");
            }
        });
    };

    containsOverlayContent = (target, container) => {
        let parentNode = target;
        do {
            if (parentNode && parentNode === container) {
                return true;
            }
            parentNode = parentNode['parentNode'];
        }
        while (parentNode != null);

        return false;
    };

    render() {
        const classes = classNames(Classes.OVERLAY_CONTENT, "overlay");
        return (
            <div>
                <div style={{
                    display: "flex", flexDirection: "row",
                    justifyContent: "center",
                    position: "fixed",
                    bottom: 0, right: this.state.vWidth,
                    width: 300,
                    paddingTop: 10,
                    backgroundColor: "#738694",
                    borderRadius: "5px 5px 0 0",
                    boxShadow: "0 0 3px 0 #10161A",
                    transition: "transform 200ms ease-out",
                    transitionDelay: this.state.isOpenLessons ? "0s" : ".7s",
                    transform:  !this.state.isOpenLessons ? "translateY(0)" : "translateY(100%)"
                }} className="disable-select" onClick={this.handleOpenLessons}>
                    <Icon icon={"notifications"} color={"#F5F8FA"}/>
                    <H5 style={{color: "#F5F8FA", paddingLeft: 10}}>Расписание звонков</H5>
                </div>

                <Overlay transitionDuration={700}
                         onClose={this.handleCloseLessons}
                         isOpen={this.state.isOpenLessons}
                         enforceFocus={false}
                         autoFocus={true}
                         hasBackdrop={false}
                         canOutsideClickClose={true}
                >
                    <Modal>
                        <div ref={ref => this.overlayContent = ref} className={classes}
                             style={{color: "#F5F8FA", fontSize: 14, right: this.state.vWidth}}>
                            <div style={{
                                display: "flex", flexDirection: "row",
                                justifyContent: "center", paddingTop: 5
                            }}>
                                <Icon icon={"notifications"}/>
                                <H5 style={{color: "#F5F8FA", paddingLeft: 10}}>Расписание звонков</H5>
                            </div>
                            <div style={{
                                width: "100%", height: "100%",
                                overflowY: "auto",
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                padding: "10px 10px 110px 10px",
                                justifyContent: "space-around"
                            }}>
                                {
                                !this.state.loaded
                                    ?
                                    <div style={{position: "relative", margin: "auto"}}>
                                        <Spinner/>
                                    </div>
                                    :
                                    this.state.list.map((item, index) => {
                                        console.log(moment(item.beginTime).format());
                                        return (
                                            <Label key={index}
                                                   title={item.name}>
                                                {item.name}
                                                <div>
                                                    <div style={{paddingBottom: 5}}>
                                                        <TimePicker value={moment(item.beginTime).toDate()}
                                                                    showArrowButtons={false}
                                                                    selectAllOnFocus={true}
                                                                    onChange={time => {
                                                                        this.setState({
                                                                            list: Array.from(this.state.list, (d, i) => {
                                                                                if (i === index) {
                                                                                    d.beginTime = moment(time).toDate();
                                                                                    console.log(d.beginTime);
                                                                                }
                                                                                return d;

                                                                            })
                                                                        });
                                                                    }}
                                                                    />
                                                    </div>
                                                    <div>
                                                        <TimePicker value={moment(item.endTime).toDate()}
                                                                    showArrowButtons={false}
                                                                    selectAllOnFocus={true}
                                                                    onChange={time => {
                                                                        this.setState({
                                                                            list: Array.from(this.state.list, (d, i) => {
                                                                                if (i === index) {
                                                                                    d.endTime = moment(time).toDate();
                                                                                    console.log( d.endTime);
                                                                                }
                                                                                return d;
                                                                            })
                                                                        });
                                                                    }}
                                                                    />
                                                    </div>
                                                </div>
                                            </Label>
                                        );
                                    })
                                }
                                {
                                    this.state.loaded &&
                                    <Button intent={Intent.SUCCESS} onClick={this.handleSave}
                                            style={{flex:1}}>
                                        Сохранить
                                    </Button>
                                }

                            </div>
                        </div>
                    </Modal>
                </Overlay>
            </div>
        );
    }
}

export default LessonsPanel;
