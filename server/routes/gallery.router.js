const Gallery = require('../models/gallery.model');

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs-extra');
const async = require('async');
const path = require('path');
const im = require('imagemagick');
const uniqid = require('uniqid');
const gcdMath = require('../utils/gcdMath');

const UPLOAD_DIR = "./public/gallery-files/";
const upload = multer({ storage: multer.diskStorage({
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
        const photos = [];

        async.eachSeries(files, (file, done) => {
            const filePath = file.destination + "/" + file.filename;
            im.resize({
                srcPath: filePath,
                dstPath: filePath,
                width: "1404", height: "1404"}, (err) => {
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
                        dstPath: './public/gallery-files/' + dirName + "/thumbs/" + file.filename,
                        width: "144^", height: "144^"
                    }, (err) => {
                        if (err) throw err;

                        done();
                    });
                });

            });
        }, function allDone(err) {
            Gallery.create({name, quantity: files.length, dirName:dirName+"/full", photos, date: Date.now()}).then((value) => {
                res.status(201).json(value);
            });
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
                const absolutePath = "./public" + filePath;
                fs.remove(absolutePath, err => {
                    if (err) throw err;
                    fs.remove(absolutePath.replace("full", "thumbs"), err => {
                        if (err) throw err;
                        done();
                    });
                });
            }, function allDone(err) {
                currentAlbum.save(() => {
                    res.status(200).send(currentAlbum);
                });
            });
        });
    });

module.exports = router;

/*
const fileFilter = function (req, file, cb) {
    if (!file.originalname.toLocaleLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};*/

/*
Gallery.findById(req.params.id).then((value) => {
    res.status(200).json(value);
    /!*const {name, quantity, pathDir} = value;
    const photos = [];
    const absolutePath = path.join(rootPath, UPLOAD_DIR, pathDir);
    fs.readdir(absolutePath, (err, files) => {
        if (files) {
            async.eachSeries(files, (file, done) => {
                const stream = fs.createReadStream(absolutePath + "\\" + file, {encoding: 'base64'});
                stream.on('data', data => {
                    photos.push(data);
                    stream.destroy();
                });
                stream.on('close', () => {
                    done();
                });
            }, function allDone(err) {
                res.status(201).json({name, quantity, photos:[]})
            });
        } else {
            res.status(201).json({name, quantity, photos:[]})
        }
    })*!/
});
*/
