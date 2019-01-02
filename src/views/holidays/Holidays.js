import React, {PureComponent} from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './react_dates_overrides.css';
import {DayPickerSingleDateController} from "react-dates";
import moment from 'moment';
import 'moment/locale/ru';
import {Card, H2, Icon, ResizeSensor, Spinner} from "@blueprintjs/core";
import Radium from "radium";
import NewsDialog from "../news/NewsDialog";
import axios from "axios";
import HolidaysItem from "./HolidaysItem";

const styles = {
    cardLayout: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F8FA",
        color: "#394B59",
    },
};

let isMounted = false;

class Holidays extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            loaded:false,
            dates: null,
            focusedInput: null,
            date: null,
            content: null,
            daySize: 0,
            numberOfMonths: 1,
            isDialogOpen: false,
            isNew: false,
            items: null,
            vWidth:0,
        };
    }

    componentDidMount() {
        isMounted = true;
        this.setState({date: moment()});
        this.refreshAll();
    }

    componentWillUnmount() {
        isMounted = false;
    }

    renderMonthElement = ({month}) => {
        return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div>
                    {moment.months(month.month())}
                </div>
            </div>
        );
    };

    handleDateChange = (date) => {
        let content;
        const currentDayIndex = this.getDayHighlightedIndex(date);
        if (currentDayIndex !== -1) {
            content = this.state.items[currentDayIndex];
        }
        isMounted && this.setState({date, content});
    };

    handleResizeView = (entries) => {
        if (entries) {
            const vWidth = entries[0].contentRect.width;
            this.setState(prevState => {
                let numberOfMonths;
                if (vWidth < 565)
                    numberOfMonths = 1;
                else if (vWidth < 840)
                    numberOfMonths = 2;
                else
                    numberOfMonths = 3;
                return prevState.numberOfMonths !== numberOfMonths
                    && {numberOfMonths, vWidth};
            });
        }
    };

    handleClickNewItem = () => {
        this.setState({isDialogOpen: true, isNew: true});
    };

    handleSaveDialog = (content) => {
        const {title, text, image, isNew} = content;
        const formData = new FormData();
        formData.append('title', title || "");
        formData.append('text', text || "");
        formData.append('date', this.state.date.toDate());
        if (image instanceof File) {
            formData.append('image', image);
        }

        this.setState({isDialogOpen: false, loaded: false});
        if (isNew) {
            axios.post('/holidays', formData).then((resolve => {
                this.refreshAll(resolve.data);
            }));
        } else {
            axios.put(`/holidays/${content._id}`, formData).then(resolve => {
                this.refreshAll(resolve.data);
            });
        }
    };

    handleCancelDialog = () => {
        this.setState({isDialogOpen: false});
    };

    refreshAll = (selectedItem = null) => {
        if (isMounted) {
            this.setState({loaded: false});
            axios.get('/holidays').then(resolve => {
                const items = resolve.data;
                this.setState(prevState => ({
                    dates: Array.from(items, (item) => moment(item.date).toDate()),
                    items,
                    content: selectedItem || prevState.content,
                    loaded: true,
                }), () => {
                    this.handleDateChange(this.state.date);
                });
            });
        }
    };

    handleDayHighlighted = (day) => {
        return this.getDayHighlightedIndex(day) !== -1;
    };

    getDayHighlightedIndex(day) {
        let currentIndex = -1;
        const currentDay = day.format("DD MM");
        this.state.dates.some((item, index) => {
            if (moment(item).format("DD MM") === currentDay) {
                currentIndex = index;
                return true;
            }
            return false;
        });

        return currentIndex;
    };

    handleClickEditItem = () => {
        this.setState({isDialogOpen:true, isNew: false})
    };

    handleClickRemoveItem = () => {
        axios.delete(`/holidays/${this.state.content._id}`).then(this.refreshAll);
    };

    renderInfo = () => {
        return (
            <div style={{width:"100%"}}>
                {
                    !this.state.content ?
                        <div style={{position:"relative", opacity: this.state.date ? .9 : .6}}>
                            <Card style={styles.cardLayout}
                                  interactive={this.state.date} className="disable-select"
                                  onClick={this.handleClickNewItem}>
                                <img src={'/assets/holidays/holiday_icon.png'} alt={"holiday"}
                                     width={128} height={"auto"}/>
                                <p/>
                                <Icon icon={"add"} iconSize={35}/>
                                <p/>
                                <H2 style={{
                                    color: styles.cardLayout.color,
                                    textAlign: "center"
                                }}>Добавить праздник</H2>
                            </Card>
                        </div>
                        :
                        <HolidaysItem
                            content={this.state.content}
                            onEdit={this.handleClickEditItem}
                            onRemove={this.handleClickRemoveItem}/>
                }
            </div>
        );
    };

    render() {
        return (
            <div style={this.props.windowStyle}>
                {!this.state.dates || !this.state.loaded
                    ?
                    <div style={{margin: "auto"}}>
                        <Spinner/>
                    </div>
                    :
                    <ResizeSensor onResize={this.handleResizeView}>
                        <div style={{
                            display: "flex",
                            flexGrow: 1,
                            flexDirection: "column",
                            paddingTop: "3%",
                            paddingBottom: "5%",
                            overflow: "auto",
                        }}>
                            <div style={{margin: "0 auto"}}>
                                <DayPickerSingleDateController
                                    orientation={"horizontal"}
                                    daySize={35}
                                    numberOfMonths={this.state.numberOfMonths}
                                    isDayHighlighted={this.handleDayHighlighted}
                                    onDateChange={this.handleDateChange}
                                    renderCalendarInfo={this.renderInfo}
                                    renderMonthElement={this.renderMonthElement}
                                    onFocusChange={(focusedInput) => {
                                        isMounted && this.setState({focusedInput})
                                    }}
                                    date={this.state.date}
                                />
                            </div>

                        </div>
                    </ResizeSensor>
                }
                <NewsDialog isOpen={this.state.isDialogOpen} isNew={this.state.isNew} content={this.state.content}
                            onSave={this.handleSaveDialog} onCancel={this.handleCancelDialog}>
                    праздник
                </NewsDialog>
            </div>
        );
    }
}

export default Radium(Holidays);
