const express = require('express');
const router = express.Router();
const moment = require('moment');
const Promise = require('bluebird');
const {Announce, AnnounceWeek, getEmptyAnnounce} = require('../models/announce.model');

router.route('/')
    .get((req, res) => {
        const currentWeekDate = moment().startOf("isoWeek").utc(true).toDate().getTime();
        getWeekAnnounce(currentWeekDate).then(week => {
            res.status(200).json(week);
        }).catch(err => {
            if (err)
                throw err;
        });
    });

const getWeekAnnounce = (date) => {
    return new Promise((resolve, reject) => {
        return AnnounceWeek.findOne({date}).populate('items').then(week => {
            if (week == null) {
                Announce.create(getEmptyAnnounce(), (err, items) => {
                    if (err)
                        reject(err);

                    AnnounceWeek.create({
                            date,
                            items: Array.from(items, (i) => i._id)
                        },
                        (err, week) => {
                            if (err)
                                reject(err);

                            resolve({_id: week._id, date: week.date, items});
                        });
                });
            } else {
                resolve(week);
            }
        }).catch(reject);
    });
};

router.route('/:date')
    .get((req, res) => {
        getWeekAnnounce(req.params.date).then(week => {
            res.status(200).json(week);
        });
    });

router.route('/day/:id')
    .get((req, res) => {
        Announce.findById(req.params.id, (err, doc) => {
            res.status(200).json(doc);
        });
    })
    .put((req, res) => {
        const {education} = req.body;
        Announce.findByIdAndUpdate(req.params.id, {$set: {education}}, {new: true},
            (err, doc) => {
                res.status(200).json(doc);
                return req.app.emit('announce', req, res);
        });
    });

module.exports = router;
