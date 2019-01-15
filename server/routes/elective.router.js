const express = require('express');
const router = express.Router();
const {Elective, ElectiveDay, getEmptyElective} = require('../models/elective.model');
const async = require('async');
const multer = require('multer');
const uniqid = require('uniqid');
const im = require('imagemagick');
const fs = require('fs-extra');
const STATIC_DIR = process.env.STATIC_DIR;
const PATH_DIR = "elective-files/";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `${STATIC_DIR}/${PATH_DIR}`;
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
            const {file} = req;
            let data = {
                name, place, teacher,
                items: Array.from(items, (i) => i._id)
            };
            if (file) {
                const icon =  PATH_DIR + file.filename;
                const filePath = file.destination + "/" + file.filename;
                im.resize({
                    srcPath: filePath,
                    dstPath: filePath,
                    width: "512", height: "512"}, (err) => {
                    if (err) throw err;

                    data = {...data, icon};
                    Elective.create(data,
                        (err, doc) => {
                            res.status(200).json(doc);
                            return req.app.emit('elective', req, res);
                        });
                });
            } else {
                res.status(200).json({error: "Необходимо загрузить файл иконки"});
            }

        });
    });

router.route('/:id')
    .get((req, res) => {
        Elective.findById(req.params.id).populate('items').then(result => {
            res.status(200).json(result.items);
        });
    })
    .put(upload.single("icon"), (req, res) => {
        const {name, teacher, place, items} = req.body;
        const {file} = req;
        const itemsResult = JSON.parse(items);
        async.eachSeries(itemsResult, (obj, done) => {
            ElectiveDay.updateOne({ _id: obj._id }, { $set : { less: obj.less }}, done);
        }, function allDone (err) {
            if (file) {
                const icon = PATH_DIR + file.filename;
                const filePath = file.destination + "/" + file.filename;
                im.resize({
                    srcPath: filePath,
                    dstPath: filePath,
                    width: "512", height: "512"
                }, (err) => {
                    if (err) throw err;

                    updateItem({name, teacher, place, icon});
                });
            } else {
                updateItem({name, teacher, place})
            }
        });

        function updateItem(params) {
            Elective.findByIdAndUpdate(req.params.id, {$set: params}, {new: true})
                .populate('items')
                .then((value) => {
                    res.status(200).json(value);
                    return req.app.emit('elective', req, res);
                });
        }
    })
    .delete((req, res) => {
        Elective.findByIdAndDelete(req.params.id).then(result => {
            const {icon} = result;
            if (icon) {
                fs.remove(`${STATIC_DIR}/${icon}`, (err) => {
                    if (err) throw err;

                    res.status(200).json({status: "ok"});
                    return req.app.emit('news', req, res);
                });
            }
            else {
                res.send({status: "ok"});
                return req.app.emit('elective', req, res);
            }
        });
    });

module.exports = router;


