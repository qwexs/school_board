const express = require('express');
const router = express.Router();
const app = require('../app');
const signature = {};
router.route('/')
    .get((req, res) => {
        res.status(200).json(signature);
    });

app
    .on('news', () => {
        signature['news'] = Date.now();
    })
    .on('schedule', () => {
        signature['schedule'] = Date.now();
    })
    .on('lessons', () => {
        signature['lessons'] = Date.now();
    })
    .on('announce', () => {
        signature['announce'] = Date.now();
    })
    .on('elective', () => {
        signature['elective'] = Date.now();
    })
    .on('gallery', () => {
        signature['gallery'] = Date.now();
    })
    .on('holidays', () => {
        signature['holidays'] = Date.now();
    });


module.exports = router;
