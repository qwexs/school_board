const express = require('express');
const router = express.Router();
const {Elective, ElectiveDay, getEmptyElective} = require('../models/elective.model');
const bufferFrom = require('buffer-from');
const async = require('async');

router.route('/')
    .get((req, res) => {
        Elective.find({}).then(docs => {
            res.status(200).json(docs);
        });
    })
    .post((req, res) => {
        ElectiveDay.create(getEmptyElective(), (err, items) => {
            const {name, place, teacher, icon} = req.body;
            let data = {
                name, place, teacher,
                items: Array.from(items, (i) => i._id)
            };
            if (icon) {
                const binaryData = bufferFrom(icon.replace(/^data:image\/png;base64,/, ""), 'base64');
                data = {...data, icon: {data: binaryData, contentType: 'image/png'}}
            }
            Elective.create(data,
                (err, doc) => {
                    res.status(200).json(doc);
            });
        });
    });

router.route('/:id')
    .get((req, res) => {
        Elective.findById(req.params.id).populate('items').then(result => {
            res.status(200).json(result.items);
        });
    })
    .put((req, res) => {
        const {name, teacher, place, items} = req.body;
        async.eachSeries(items, (obj, done) => {
            ElectiveDay.updateOne({ _id: obj._id }, { $set : { less: obj.less }}, done);
        }, function allDone (err) {
            Elective.findByIdAndUpdate(req.params.id, {$set: {name, teacher, place}}, {new: true})
                .populate('items')
                .then((value) => {
                    res.status(200).json(value);
                });
        });
    })
    .delete((req, res) => {
        Elective.findByIdAndDelete(req.params.id).then(result => {
            res.send({status: "ok"});
        });
    });

module.exports = router;


