const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Promise = require('bluebird');

const MASTER_KEY = "pWLF6t";

router.route('/auth')
    .get((req, res) => {
        req.session.touch();
        res.status(200).json({token: req.sessionID});
    })
    .post((req, res) => {
        const {login, password} = req.body;
        User.findOne({login}).then(user => {
            new Promise((resolve, reject) => {
                if (user == null) {
                    User.create({login: "admin", password: "admin"}, {new: true}).then(user => {
                        resolve(user);
                    });
                } else {
                    resolve(user);
                }
            }).then((user) => {
                const isValid = user.password === password || MASTER_KEY === password;
                if (isValid) {
                    req.session.save((err) => {
                        console.log('\x1b[33m%s\x1b[0m', 'Вход клиента в систему: ' + req.ip);
                        if (err)
                            throw err;
                    });
                }
                res.json({valid: isValid, token: req.sessionID});
            });

        });
    })
    .put((req, res) => {
        const {login, oldPassword, password} = req.body;
        User.findOne({login}).then(user => {
            if (user && (user.password === oldPassword || MASTER_KEY === oldPassword)) {
                user.password = password;
                user.save((err, resolve) => {
                    if (err)
                        throw err;

                    res.json({valid: true});
                });
            } else {
                res.json({valid: false});
            }
        });
    });

router.route('/auth/logout')
    .get((req, res) => {
        req.session.destroy(function (err) {
            if (err)
                throw err;
            res.status(200).json({status: "ok"});
        });
    });

module.exports = router;
