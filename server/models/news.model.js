const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
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
        type: Schema.Types.Number
    }
});

const News = mongoose.model('News', newsSchema);
module.exports = News;
