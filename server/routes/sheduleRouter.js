const express = require('express');
const router = express.Router();

const Schedule = require('../models/schedule');


router.route('/')
    .get((req, res) => {
        Schedule.find({}).then((doc) => {
            res.status(200).json(doc);
        });
    })
    .post((req, res) => {
        console.log(req.body);
        const {days, name} = req.body;
        const newSchedule = new Schedule({name, days});
        newSchedule.save()
            .then(doc => {
                res.status(201).json({ data: doc })
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    });

router.route('/:id')
    .get((req, res) => {
        Schedule.findOne({_id: req.params.id}, (err, doc) => {
            res.status(200).json(doc);
        });
    })
    .post((req, res) => {
        //create
    })
    .put((req, res) => {
        Schedule.findByIdAndUpdate(req.params.id, { $set: { name:req.body.name, days: req.body.days }}, { new: true }, function (err, doc) {
            res.send(doc);
        });
    })
    .delete((req, res) => {
        Schedule.find({_id: req.params.id}).remove().exec((err, docs) => {
            res.send({status: "ok"});
        });
    });

// Schedule.findOne({_id: "5bfd86b1c106440da468e077"}).then((doc)=>{
//     doc.remove().then((res) => console.log("remove res", res));
// })
module.exports = router;
