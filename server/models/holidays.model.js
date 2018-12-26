const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const holidaysSchema = new Schema({
    title: {
        type: Schema.Types.String
    },
    text: {
        type: Schema.Types.String
    },
    image: {
        type: Schema.Types.String,
    },
    date: {
        type: Schema.Types.Date
    }
});

const Holidays = mongoose.model('Holidays', holidaysSchema);
module.exports = Holidays;
