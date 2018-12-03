const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const path = require('path');
const uri = 'mongodb://localhost/iboard';
const scheduleRouter = require('./routes/sheduleRouter');
const announceRouter = require('./routes/announceRouter');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const connectDb = () => {
    mongoose.Promise = bluebird;
    mongoose.connect(uri, {useNewUrlParser: true, useFindAndModify: false});
    return mongoose.connection;
};

const startServer = () => {
    app.use('/schedule', scheduleRouter);
    app.use('/announce', announceRouter);
};

connectDb()
    .on('error', console.log)
    .on('disconnected', connectDb)
    .once('open', startServer);


module.exports = app;


