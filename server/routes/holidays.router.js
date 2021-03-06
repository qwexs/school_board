const Holidays = require('../models/holidays.model');
const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const im = require('imagemagick');
const multer = require('multer');
const uniqid = require('uniqid');
const STATIC_DIR = process.env.STATIC_DIR;
const PATH_DIR = "holidays-files/";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `${STATIC_DIR}/${PATH_DIR}`;
        fs.mkdirsSync(path);
        cb(null, path);
    },
    filename: (req, file, cb) => {
        let extension = file.originalname;
        extension = extension.substr(extension.lastIndexOf('.'), extension.length).toLowerCase();
        cb(null, uniqid("holidays_") + extension);
    }
});

const upload = multer({storage});

router.route('/')
    .get((req, res) => {
        Holidays.find({}).sort({date: "ascending"}).then(resolve => {
            res.status(200).send(resolve);
        });
    })
    .post(upload.single("image"), (req, res) => {
        const {title, text, date} = req.body;
        const {file} = req;
        let image = "";
        if (file) {
            image = PATH_DIR + file.filename;
            const filePath = file.destination + "/" + file.filename;
            im.resize({
                srcPath: filePath,
                dstPath: filePath,
                width: "1000", height: "1000"
            }, (err) => {
                if (err) throw err;
                createHolidays(res, {title, text, image, date});
                return req.app.emit('holidays', req, res);
            });
        } else {
            createHolidays(res, {title, text, image, date});
            return req.app.emit('holidays', req, res);
        }
    });

createHolidays = (res, params) => {
    Holidays.create(params).then((resolve) => {
        res.status(201).json(resolve);
    });
};

editHolidays = (req, res, set) => {
    Holidays.findByIdAndUpdate(req.params.id, {$set: set}, {new: true}).then(resolve => {
        const {image} = resolve;
        if (image && req.file && image !== PATH_DIR + req.file.filename) {
            fs.remove(`${STATIC_DIR}/${image}`, (err) => {
                if (err) throw err;
                res.status(200).json(resolve);
            });
        } else {
            res.status(200).json(resolve);
        }
    });
};

router.route('/:id')
    .put(upload.single("image"), (req, res) => {
        const {title, text, image} = req.body;
        const {file} = req;
        let set = {
            title,
            text,
        };
        if (file) {
            set = {...set, image: PATH_DIR + file.filename};
            const filePath = file.destination + "/" + file.filename;
            im.resize({
                srcPath: filePath,
                dstPath: filePath,
                width: "1440", height: "1440"
            }, (err) => {
                if (err) throw err;
                editHolidays(req, res, set);
                return req.app.emit('holidays', req, res);
            });
        }
        else {
            editHolidays(req, res, set);
            return req.app.emit('holidays', req, res);
        }

    })
    .delete((req, res) => {
        Holidays.findByIdAndDelete(req.params.id).then(resolve => {
            const {image} = resolve;
            if (image) {
                fs.remove(`${STATIC_DIR}/${image}`, (err) => {
                    if (err) throw err;

                    res.status(200).json({status: "ok"});
                    return req.app.emit('holidays', req, res);
                });
            }
            else {
                res.status(200).json({status: "ok"});
                return req.app.emit('holidays', req, res);
            }

        })
    });


module.exports = router;
