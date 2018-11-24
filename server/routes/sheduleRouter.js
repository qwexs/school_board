const express = require('express');
const router = express.Router();

const Schedule = require('../models/schedule');

router.get('/', (req, res) => {
    Schedule.find({}).then((docs) => {
        res.send(docs);
    });
});

router.route('/:id')
    .get((req, res) => {
        //read
        const {id} = req.params;
        Schedule.findOne({"id": id}, (err, docs) => {
            res.send({data:docs});
        })
    })
    .post((req, res) => {
        //create
    })
    .put((req, res) => {
        //edit
    });

module.exports = router;
