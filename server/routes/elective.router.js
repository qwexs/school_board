const express = require('express');
const router = express.Router();
const fs = require('fs');
const {Elective, ElectiveDay, getEmptyElective} = require('../models/elective.model');
const path = require('path');
const bufferFrom = require('buffer-from');
const async = require('async');

router.route('/')
    .get((req, res) => {
        Elective.find({}).then(docs => {
            res.status(200).json(docs);
        });
    })
    .post((req, res) => {
        const {name, place, teacher, icon} = req.body;
        const binaryData = bufferFrom(icon.replace(/^data:image\/png;base64,/,""), 'base64');
        ElectiveDay.create(getEmptyElective(), (err, items) => {
            Elective.create({name, place, teacher,
                    icon: {data: binaryData, contentType: 'image/png'},
                    items: Array.from(items, (i) => i._id)},
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
        async.eachSeries(items, function updateObject (obj, done) {
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

// const elective = new Elective({name: "test"});
//
// elective.icon.data = fs.readFileSync(path.join(__dirname, '../../public/iconElective.png'));
// elective.icon.contentType = 'image/png';
// elective.save(function (err, raw) {
//     if (err) throw err;
//
//     console.log(raw);
// });

// console.log(path.join(__dirname, '../../static'));
module.exports = router;


