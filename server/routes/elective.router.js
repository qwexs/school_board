const express = require('express');
const router = express.Router();
const {Elective, ElectiveDay, getEmptyElective} = require('../models/elective.model');
const bufferFrom = require('buffer-from');
const async = require('async');
const multer = require('multer');
const uniqid = require('uniqid');
const fs = require('fs-extra');

const PATH_DIR = "elective-files/";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `./public/${PATH_DIR}`;
        fs.mkdirsSync(path);
        cb(null, path);
    },
    filename: (req, file, cb) => {
        let extension = file.originalname;
        extension = extension.substr(extension.lastIndexOf('.'), extension.length).toLowerCase();
        cb(null, uniqid("elective_") + extension);
    }
});

const upload = multer({storage});

router.route('/all')
    .get((req, res) => {
        Elective.find({}).populate('items').then(docs => {
            res.status(200).json(docs);
        });
    });

router.route('/')
    .get((req, res) => {
        Elective.find({}).then(docs => {
            res.status(200).json(docs);
        });
    })
    .post(upload.single("icon"), (req, res) => {
        ElectiveDay.create(getEmptyElective(), (err, items) => {
            const {name, place, teacher, icon} = req.body;
            let data = {
                name, place, teacher,
                items: Array.from(items, (i) => i._id)
            };
            if (req.file) {
                const icon =  PATH_DIR + req.file.filename;
                console.log(icon);
                data = {...data, icon}
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


