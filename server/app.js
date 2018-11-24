const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const path = require('path');
const uri = 'mongodb://localhost/iboard';
const scheduleRouter = require('./routes/sheduleRouter');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const connectDb = () => {
    mongoose.Promise = bluebird;
    mongoose.connect(uri, {useNewUrlParser: true});
    return mongoose.connection;
};

const startServer = () => {
    app.use('/schedule', scheduleRouter);
};

connectDb()
    .on('error', console.log)
    .on('disconnected', connectDb)
    .once('open', startServer);



// app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, '../build', 'index.html'));
// });

module.exports = app;


