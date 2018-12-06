const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const electiveSchema = new Schema({
    name: {
        type: Schema.Types.String
    },
    place: {
        type: Schema.Types.String
    },
    teacher: {
        type: Schema.Types.String
    },
    icon: {
        data: Schema.Types.Buffer, contentType: Schema.Types.String
    },
    items: [{type: Schema.Types.ObjectId, ref: 'ElectiveDay'}]
});

const electiveDaySchema = new Schema({
    title : {
        type: Schema.Types.String
    },
    less: {
        type: Schema.Types.Mixed
    }
});

const getEmptyElective = () => {
    return [
        {title:"Понедельник", less:[]},
        {title:"Вторник", less:[]},
        {title:"Среда", less:[]},
        {title:"Четверг", less:[]},
        {title:"Пятница", less:[]},
    ];
};

const Elective = mongoose.model('Elective', electiveSchema);
const ElectiveDay = mongoose.model('ElectiveDay', electiveDaySchema);

module.exports = {Elective, ElectiveDay, getEmptyElective};
