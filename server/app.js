const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const uri = 'mongodb://localhost/iboard';
const scheduleRouter = require('./routes/shedule.router');
const announceRouter = require('./routes/announce.router');
const electiveRouter = require('./routes/elective.router');

// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ parameterLimit: 100000, limit: '50mb', extended: true }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({parameterLimit: 100000, limit: '50mb', extended: true}));
app.use('/static', express.static('public'));

const connectDb = () => {
    mongoose.Promise = bluebird;
    mongoose.connect(uri, {useNewUrlParser: true, useFindAndModify: false})
        .then(() => startServer());
    return mongoose.connection;
};

const startServer = () => {
    app.use('/schedule', scheduleRouter);
    app.use('/announce', announceRouter);
    app.use('/elective', electiveRouter);
};

connectDb()
    .on('error', console.log)
    .on('disconnected', connectDb);


module.exports = app;


