const Gallery = require('../models/gallery.model');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs-extra');
const async = require('async');
const im = require('imagemagick');
const uniqid = require('uniqid');
const gcdMath = require('../utils/gcdMath');
const STATIC_DIR = process.env.STATIC_DIR;
const UPLOAD_DIR = STATIC_DIR + "/gallery-files/";
const Promise = require('bluebird');
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            let {id} = req.body;
            const albumName = "album" + id;
            let path = UPLOAD_DIR + albumName;
            fs.mkdirsSync(path);
            fs.mkdirsSync(path + "/full");
            fs.mkdirsSync(path + "/thumbs");
            callback(null, path + "/full");
        },
        filename: (req, file, cb) => {
            let extension = file.originalname;
            extension = extension.substr(extension.lastIndexOf('.'), extension.length).toLowerCase();
            cb(null, uniqid("photo_") + extension);
        }
    })});

router.route('/')
    .get((req, res) => {
        Gallery.find({}).sort({date: -1}).then((result) => {
            res.status(200).json(result);
        });

    })
    .post(upload.array('photos'), (req, res) => {
        const {name, id} = req.body;
        const {files} = req;
        const dirName = "album" + id;

        processingImage(dirName, files).then(photos => {
            return Gallery.create({
                name, quantity: files.length,
                dirName: dirName + "/full", photos,
                date: Date.now()
            }).then((value) => {
                res.status(201).json(value);
                return res.app.emit('gallery', req, res);
            });
        }).catch(err => {
            if (err)
                throw err;
        });
    });

router.route("/:id")
    .delete((req, res) => {
        Gallery.findByIdAndRemove(req.params.id, (err, value) => {
            const {dirName} = value;
            const dirPath = UPLOAD_DIR + dirName.replace("full", "");
            fs.remove(dirPath, (err) => {
                if (err) throw err;

                res.status(200).send({value});
                return req.app.emit('gallery', req, res);
            });
        });
    })
    .put((req, res) => {
        const {items} = req.body;
        Gallery.findById(req.params.id, (err, value) => {
            const currentAlbum = value;
            const {photos} = currentAlbum;
            const useful = photos.filter(photo => items.some(item => item.src === photo.src));
            const useless = Array.from(photos.filter(photo => !useful.some(item => item.src === photo.src)), el => el.src);
            currentAlbum.photos = useful;
            currentAlbum.quantity = useful.length;
            async.eachSeries(useless, (filePath, done) => {
                const absolutePath = STATIC_DIR + filePath;
                fs.remove(absolutePath, err => {
                    if (err) throw err;
                    fs.remove(absolutePath.replace("full", "thumbs"), err => {
                        if (err) throw err;
                        done();
                    });
                });
            }, function allDone(err) {
                if (err)
                    throw err;

                currentAlbum.save(() => {
                    res.status(200).send(currentAlbum);
                    return res.app.emit('gallery', req, res);
                });
            });
        });
    })
    .patch((req, res) => {
        const {slideShow} = req.body;
        Gallery.findByIdAndUpdate(req.params.id, {$set: {slideShow}}, {new: true}).then((value) => {
            res.status(200).send(value);
            return res.app.emit('gallery', req, res);
        });
    })
    .post(upload.array('photos'), (req, res) => {
        const {id} = req.params;
        const {files} = req;

        Gallery.findById(id).then(gallery => {
            const dirName = gallery.dirName.replace("/full", "");
            processingImage(dirName, files).then(photos => {
                gallery.photos = gallery.photos.concat(photos);
                gallery.quantity = gallery.photos.length;
                return gallery.save(function (err, resolve) {
                    if (err)
                        throw err;

                    res.status(201).json(resolve);
                    return res.app.emit('gallery', req, res);
                });
            }).catch(err => {
                if (err)
                    throw err;
            });
        });
    });

const processingImage = (dirName, files) => {
    const photos = [];
    return new Promise((resolve, reject) => {
        async.eachSeries(files, (file, done) => {
            const filePath = file.destination + "/" + file.filename;
            im.resize({
                srcPath: filePath,
                dstPath: filePath,
                width: "1600", height: "1200"}, (err) => {
                if (err) throw err;

                im.identify(['-format', '%wx%h', filePath], (err, features) => {
                    if (err) throw err;

                    const [width, height] = features.split('x');
                    const gcd = gcdMath(width, height);
                    photos.push({
                        src: '/gallery-files/' + dirName + '/full/' + file.filename,
                        width: width / gcd,
                        height: height / gcd
                    });
                    im.resize({
                        srcPath: filePath,
                        dstPath: STATIC_DIR+'/gallery-files/' + dirName + "/thumbs/" + file.filename,
                        width: "144^", height: "144^"
                    }, (err) => {
                        if (err) throw err;

                        done();
                    });
                });

            });
        }, function allDone(err) {
            if (err)
                reject(err);

            resolve(photos);
        });
    });
};

module.exports = router;
