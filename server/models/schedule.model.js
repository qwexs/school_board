const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const klassSchema = new Schema({
    name: {
        type: Schema.Types.String
    },
    days: [{
        type: Schema.Types.ObjectId, ref: 'ScheduleDays'
    }],
    date: {
        type: Schema.Types.Number
    },
});

const daysSchema = new Schema({
    title : {
        type: Schema.Types.String
    },
    less: {
        type: Schema.Types.Mixed
    }
});

const lessonsSchema = new Schema({
    name: {
        type: Schema.Types.String
    },
    beginTime: {
        type: Schema.Types.Date
    },
    endTime: {
        type: Schema.Types.Date
    }
});

const getEmptySchedule = () => {
    const less = Array(9)
        .fill({
            "text": ""
        });

    return [
        {title:"Понедельник", less},
        {title:"Вторник", less},
        {title:"Среда", less},
        {title:"Четверг", less},
        {title:"Пятница", less},
    ];
};

const getEmptyLessons = () => {
    return Array.from(Array(9), (d, i) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0);
        return {
            name: (i+1) + " урок",
            beginTime: currentDate,
            endTime: currentDate
        };
    });
};

const Schedule = mongoose.model('Schedule', klassSchema);
const ScheduleDays = mongoose.model('ScheduleDays', daysSchema);
const Lessons = mongoose.model('Lessons', lessonsSchema);

module.exports = {Schedule, ScheduleDays, Lessons, getEmptySchedule, getEmptyLessons};
