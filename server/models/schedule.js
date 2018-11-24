const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    id: {
       type: 'Number'
    },
    days: {
        type: 'Array'
    },
    name: {
        type: 'String'
    }
});

const Schedule = mongoose.model('Schedule', schema);

module.exports = Schedule;
