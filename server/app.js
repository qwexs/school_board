require('dotenv').config();
global.rootPath = require('app-root-path').path;
global.Promise = require('bluebird');
const express = require('express');
const app = module.exports = express();
const cors = require("cors");
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const uri = 'mongodb://localhost/iboard';
const newsRouter = require('./routes/news.router');
const scheduleRouter = require('./routes/shedule.router');
const announceRouter = require('./routes/announce.router');
const electiveRouter = require('./routes/elective.router');
const galleryRouter = require('./routes/gallery.router');
const holidaysRouter = require('./routes/holidays.router');
const observerRouter = require('./routes/observer.router');

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({parameterLimit: 100000, limit: '100mb', extended: true }));
app.use(express.static('/public'));

const connectDb = () => {
    mongoose.Promise = bluebird;
    mongoose.connect(uri, {useNewUrlParser: true, useFindAndModify: false})
        .then(() => startServer());
    return mongoose.connection;
};

const startServer = () => {
    app.use('/update', observerRouter);
    app.use('/news', newsRouter);
    app.use('/schedule', scheduleRouter);
    app.use('/announce', announceRouter);
    app.use('/elective', electiveRouter);
    app.use('/gallery', galleryRouter);
    app.use('/holidays', holidaysRouter);
};

connectDb()
    .on('error', console.log)
    .on('disconnected', connectDb);


module.exports = app;


