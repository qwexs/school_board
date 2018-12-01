const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: 'String'
    },
    date: {
        type: 'Date'
    },
    education: {
        type: 'Mixed'
    }
});

const Announce = mongoose.model('Announce', schema);

module.exports = Announce;
