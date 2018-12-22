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

const Schedule = mongoose.model('Schedule', klassSchema);
const ScheduleDays = mongoose.model('ScheduleDays', daysSchema);

module.exports = {Schedule, ScheduleDays, getEmptySchedule};
