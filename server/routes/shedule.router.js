const express = require('express');
const router = express.Router();
const async = require('async');

const {Schedule, ScheduleDays, getEmptySchedule} = require('../models/schedule.model');

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
                    res.status(201).json(doc)
                })
                .catch(err => {
                    res.status(500).json(err);
                });
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
        Schedule.findByIdAndUpdate(req.params.id, {$set: {name}}, {new: true}, function (err, schedule) {
            async.eachSeries(days, (day, done) => {
                const {title, less} = day;
                ScheduleDays.updateOne({_id: day._id}, {$set: {title, less}},{overwrite: true}).then(() => done());
            }, function allDone(err) {
                if (err) throw err;

                res.status(200).json(schedule);
            });
        });
    })
    .delete((req, res) => {
        Schedule.findByIdAndDelete(req.params.id).then(() => {
            res.status(200).json({status: "ok"});
        });
    });


module.exports = router;
