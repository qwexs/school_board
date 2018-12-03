const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const daySchema = new Schema({
    title: {
        type: Schema.Types.String
    },
    education: {
        type: Schema.Types.Mixed
    }
});

const weekSchema = new Schema({
    date: {type: Schema.Types.Date},
    items: [{type: Schema.Types.ObjectId, ref: 'Announce'}]
});

const getEmptyAnnounce = () => {
    return [
        {title:"Понедельник", education:[]},
        {title:"Вторник", education:[]},
        {title:"Среда", education:[]},
        {title:"Четверг", education:[]},
        {title:"Пятница", education:[]},
        {title:"Суббота", education:[]},
        {title:"Воскресенье", education:[]},
    ];
};
const AnnounceWeek = mongoose.model('AnnounceWeek', weekSchema);
const Announce = mongoose.model('Announce', daySchema);

module.exports = {Announce, AnnounceWeek, getEmptyAnnounce};
