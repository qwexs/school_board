const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: {
        type: Schema.Types.String
    },
    password: {
        type: Schema.Types.String
    },
    token: {
        type: Schema.Types.String
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
