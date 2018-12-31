const News = require('../models/news.model');
const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const async = require('async');
const im = require('imagemagick');
const multer = require('multer');
const uniqid = require('uniqid');

const PATH_DIR = "news-files/";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `./public/${PATH_DIR}`;
        fs.mkdirsSync(path);
        cb(null, path);
    },
    filename: (req, file, cb) => {
        let extension = file.originalname;
        extension = extension.substr(extension.lastIndexOf('.'), extension.length).toLowerCase();
        cb(null, uniqid("news_") + extension);
    }
});

const upload = multer({storage});

router.route('/')
    .get((req, res) => {
        News.find({}).sort({date: -1}).then(resolve => {
            res.status(200).send(resolve);
        });
    })
    .post(upload.single("image"), (req, res) => {
        const {title, text} = req.body;
        let image = "";
        if (req.file)
            image = PATH_DIR + req.file.filename;
        News.create({title, text, image, date: Date.now()}).then(() => {
            res.status(201).json({status: "ok"});
            return req.app.emit('news', req, res);
        });

    });

router.route('/:id')
    .put(upload.single("image"), (req, res) => {
        const {title, text} = req.body;
        let set = {
            title,
            text,
        };
        if (req.file) {
            set = {...set, image: PATH_DIR + req.file.filename}
        }
        News.findByIdAndUpdate(req.params.id, {$set: set}).then(resolve => {
            const {image} = resolve;
            if (image && req.file && image !== PATH_DIR + req.file.filename) {
                fs.remove(`./public/${image}`, (err) => {
                    if (err) throw err;
                    res.status(200).json({status: "ok"});
                    return req.app.emit('news', req, res);
                });
            } else {
                res.status(200).json({status: "ok"});
                return req.app.emit('news', req, res);
            }
        });
    })
    .delete((req, res) => {
        News.findByIdAndRemove(req.params.id).then(resolve => {
            const {image} = resolve;
            if (image) {
                fs.remove(`./public/${image}`, (err) => {
                    if (err) throw err;

                    res.status(200).json({status: "ok"});
                    return req.app.emit('news', req, res);
                });
            }
            else {
                res.status(200).json({status: "ok"});
                return req.app.emit('news', req, res);
            }

        })
    });

module.exports = router;
