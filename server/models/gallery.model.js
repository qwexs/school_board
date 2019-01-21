const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gallerySchema = new Schema({
    name: {
        type: Schema.Types.String
    },
    quantity: {
        type: Schema.Types.Number
    },
    dirName: {
        type: Schema.Types.String
    },
    photos: {
        type: Schema.Types.Mixed
    },
    slideShow: {
        type: Schema.Types.Boolean, default: true
    },
    date: {
        type: Schema.Types.Number
    }
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
