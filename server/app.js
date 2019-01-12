global.rootPath = require('app-root-path').path;
global.Promise = require('bluebird');
const express = require('express');
const app = module.exports = express();
const cors = require("cors");
const path = require('path');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const uri = 'mongodb://localhost/iboard';
const newsRouter = require('./routes/news.router');
const scheduleRouter = require('./routes/shedule.router');
const announceRouter = require('./routes/announce.router');
const electiveRouter = require('./routes/elective.router');
const galleryRouter = require('./routes/gallery.router');
const holidaysRouter = require('./routes/holidays.router');
const observerRouter = require('./routes/observer.router');
const userRouter = require('./routes/user.router');

app.use(cors({
    "origin": "*",
    "credentials": true,
}));
app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({parameterLimit: 100000, limit: '100mb', extended: true }));

if(process.env.NODE_ENV === 'production') {
    app.use(express.static("build"));
    app.get('/', function (req, res, next) {
        res.sendFile(path.resolve(path.join(__dirname, '/dist/index.html')));
        next();
    });
}

if(process.env.NODE_ENV === 'development') {
    app.use('/', express.static(path.join(__dirname, '../public')));
}

app.use(session({
    secret: 'iboard',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 604800000}
}));

const connectDb = () => {
    mongoose.Promise = bluebird;
    mongoose.connect(uri, {useNewUrlParser: true, useFindAndModify: false});
    return mongoose.connection;
};


app.use('/update', observerRouter);
app.use('/user', userRouter);
app.use('/news', newsRouter);
app.use('/schedule', scheduleRouter);
app.use('/announce', announceRouter);
app.use('/elective', electiveRouter);
app.use('/gallery', galleryRouter);
app.use('/holidays', holidaysRouter);

connectDb()
    .on('error', console.error.bind(console, 'connection error:'))
    .on('disconnected', connectDb);

module.exports = app;


