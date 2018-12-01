const express = require('express');
const router = express.Router();

const Announce = require('../models/announce');
const empty = require('../models/emptyData');

router.route('/')
    .get((req, res) => {
        Announce.find({}).then((doc) => {
            if (!doc.length) {
                Announce.create(empty.getEmptyAnnounce(), (err, docs) => {
                    res.status(200).json(docs);
                });
            } else {
                res.status(200).json(doc);
            }
        });
    });

router.route('/:id')
    .get((req, res) => {
        Announce.findOne({_id: req.params.id}, (err, doc) => {
            res.status(200).json(doc);
        });
    })
    .put((req, res) => {
        const {date, education} = req.body;
        Announce.findByIdAndUpdate(req.params.id, {$set: {date, education}}, {new: true}, function (err, doc) {
            res.send(doc);
        });
    });

module.exports = router;
