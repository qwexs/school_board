const express = require('express');
const router = express.Router();

const Schedule = require('../models/schedule.model');

router.route('/')
    .get((req, res) => {
        Schedule.find({}).then((doc) => {
            res.status(200).json(doc);
        });
    });

router.route('/:id')
    .get((req, res) => {
        Schedule.findOne({_id: req.params.id}, (err, doc) => {
            res.status(200).json(doc);
        });
    })
    .post((req, res) => {
        const {days, name} = req.body;
        const newSchedule = new Schedule({name, days});
        newSchedule.save()
            .then(doc => {
                res.status(201).json(doc)
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    })
    .put((req, res) => {
        Schedule.findByIdAndUpdate(req.params.id, { $set: { name:req.body.name, days: req.body.days }}, { new: true }, function (err, doc) {
            res.send(doc);
        });
    })
    .delete((req, res) => {
        Schedule.find({_id: req.params.id}).remove().exec((err, docs) => {
            res.send({status: "ok"});
        });
    });

module.exports = router;
