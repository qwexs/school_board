import React, {PureComponent} from 'react';
import {DatePickerLocaleUtils} from "../DatePickerUtils";
import moment from "moment";
import DayPicker from "react-day-picker";
import 'react-day-picker/lib/style.css'
import * as PropTypes from "prop-types";

class DateWeekPicker extends PureComponent {

    static propTypes = {
        onChange: PropTypes.func,
        value: PropTypes.instanceOf(Date)
    };

    state = {
        hoverRange: null,
        selectedRange: null
    };

    componentDidMount() {
        this.setState({selectedRange: this.weekFromDay(this.props.value)})
    }

    weekFromDay = date => ({
        from: moment(date)
            .startOf("isoWeek")
            .toDate(),
        to: moment(date)
            .endOf("isoWeek")
            .toDate()
    });

    handelDayChange = (date, modifiers, e) => {
        const { onChange } = this.props;

        onChange(date);

        this.setState(prevState => ({
            ...prevState,
            selectedRange: this.weekFromDay(date)
        }));
    };

    handleDayEnter = date => {
        this.setState(prevState => ({
            ...prevState,
            hoverRange: this.weekFromDay(date)
        }));
    };

    handleDayLeave = () => {
        this.setState(prevState => ({
            ...prevState,
            hoverRange: null
        }));
    };

    render() {
        const { hoverRange, selectedRange } = this.state;
        const modifiers = {
            hoverRange,
            selectedRange,
            hoverRangeStart: hoverRange && hoverRange.from,
            hoverRangeEnd: hoverRange && hoverRange.to,
            selectedRangeStart: selectedRange && selectedRange.from,
            selectedRangeEnd: selectedRange && selectedRange.to
        };

        return (
            <DayPicker className="bp3-ui-text"
                       showOutsideDays
                       month={this.state.selectedRange && this.state.selectedRange.from}
                       selectedDays={selectedRange}
                       onDayClick={this.handelDayChange}
                       onDayMouseEnter={this.handleDayEnter}
                       onDayMouseLeave={this.handleDayLeave}
                       modifiers={modifiers}
                       locale={"ru"}
                       localeUtils={DatePickerLocaleUtils}
            />
        );
    }
}

export default DateWeekPicker;
