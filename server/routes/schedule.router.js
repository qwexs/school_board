const express = require('express');
const router = express.Router();
const async = require('async');

const {Schedule, ScheduleDays, Lessons, getEmptySchedule, getEmptyLessons} = require('../models/schedule.model');

router.route('/')
    .get((req, res) => {
        Schedule.find({}).then((doc) => {
            res.status(200).json(doc);
        });
    })
    .post((req, res) => {
        const {name} = req.body;
        ScheduleDays.create(getEmptySchedule(), (err, days) => {
            if (err) throw err;

            Schedule.create({name, days: Array.from(days, (i) => i._id), date: Date.now()})
                .then(doc => {
                    res.status(201).json(doc);
                    return req.app.emit('schedule', req, res);
                })
                .catch(err => {
                    res.status(500).json(err);
                });
        });
    });

router.route('/all')
    .get((req, res) => {
        Schedule.find({}).populate('days').then((doc) => {
            res.status(200).json(doc);
        });
    });

router.route('/lessons')
    .get((req, res) => {
        Lessons.find({}).then((doc) => {
            if (doc.length)
                res.status(200).json(doc);
            else {
                res.status(200).json(getEmptyLessons());
            }
        });
    })
    .post((req, res) => {
        const lessons = req.body;
        async.eachSeries(lessons, (lesson, done) => {
            const {name, beginTime, endTime} = lesson;
            Lessons.updateOne({name: name}, {$set: {name, beginTime, endTime}},{upsert: true}).then(() => done());
        }, function allDone(err) {
            if (err) throw err;

            res.status(200).json({status: "ok"});
            return req.app.emit('lessons', req, res);
        });
    });

router.route('/:id')
    .get((req, res) => {
        Schedule.findById(req.params.id).populate('days').then(value => {
            res.status(200).json(value);
        });
    })
    .put((req, res) => {
        const {name, days} = req.body;
        async.eachSeries(days, (day, done) => {
            const {title, less} = day;
            ScheduleDays.updateOne({_id: day._id}, {$set: {title, less}},{overwrite: true}).then(() => done());
        }, function allDone(err) {
            if (err) throw err;
            Schedule.findByIdAndUpdate(req.params.id, {$set: {name}}, {new: true}).populate('days').then(resolve => {
                res.status(200).json(resolve);
                return req.app.emit('schedule', req, res);
            });
        });
    })
    .delete((req, res) => {
        Schedule.findByIdAndDelete(req.params.id).then(() => {
            res.status(200).json({status: "ok"});
            return req.app.emit('schedule', req, res);
        });
    });


module.exports = router;
