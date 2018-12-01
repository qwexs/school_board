import moment from "moment";

const WEEKDAYS_LONG = {
    en: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ],
    ru: [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
    ],
};
const WEEKDAYS_SHORT = {
    en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
};
const MONTHS = {
    en: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    ru: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ],
};

const FIRST_DAY = {
    en: 0,
    ru: 1, // Use Monday as first day of the week
};

function formatDay(d, locale = 'ru') {
    return `${WEEKDAYS_LONG[locale][d.getDay()]}, ${d.getDate()} ${
        MONTHS[locale][d.getMonth()]
        } ${d.getFullYear()}`;
}

function formatMonthTitle(d, locale = 'ru') {
    return `${MONTHS[locale][d.getMonth()]} ${d.getFullYear()}`;
}

function formatWeekdayShort(i, locale) {
    return WEEKDAYS_SHORT[locale][i];
}

function formatWeekdayLong(i, locale) {
    return WEEKDAYS_SHORT[locale][i];
}

function getFirstDayOfWeek(locale) {
    return FIRST_DAY[locale];
}

function getMonths(locale) {
    return MONTHS[locale];
}

export function momentFormatter(format) {
    return {
        formatDate: date => moment(date).format(format),
        parseDate: str => moment(str, format).toDate(),
        placeholder: `${format} (moment)`,
    };
}

export const DatePickerLocaleUtils = {
    formatDay,
    formatMonthTitle,
    formatWeekdayShort,
    formatWeekdayLong,
    getFirstDayOfWeek,
    getMonths
};
