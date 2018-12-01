const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    index: {
        type: 'Number'
    },
    days: {
        type: 'Mixed'
    },
    name: {
        type: 'String'
    }
});

const Schedule = mongoose.model('Schedule', schema);

module.exports = Schedule;
