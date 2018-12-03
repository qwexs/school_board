const express = require('express');
const router = express.Router();
const moment = require('moment');
const {Announce, AnnounceWeek, getEmptyAnnounce} = require('../models/announce');

router.route('/')
    .get((req, res) => {
        AnnounceWeek.findOne({}).populate('items').then(week => {
            if (week == null) {
                Announce.create(getEmptyAnnounce(), (err, items) => {
                    AnnounceWeek.create({date: moment(new Date()).startOf("isoWeek").toDate(), items: Array.from(items, (i) => i._id)},
                        (err, week) => {
                            res.status(200).json({_id: week._id, date: week.date, items});
                        });
                });
            } else {
                res.status(200).json(week);
            }
        });
    })
    .patch((req, res) => {
        const date = moment(req.body.date).startOf("isoWeek").toDate();
        AnnounceWeek.updateOne({date}, (err, doc) => {
            res.status(200 ).json(date);
        });
    });

router.route('/:id')
    .get((req, res) => {
        Announce.findById({id: req.params.id}, (err, doc) => {
            res.status(200).json(doc);
        });
    })
    .put((req, res) => {
        const {education} = req.body;
        Announce.findByIdAndUpdate(req.params.id, {$set: {education}}, {new: true},
            (err, doc) => {
                res.send(doc);
        });
    });

module.exports = router;
