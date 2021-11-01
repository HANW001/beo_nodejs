const express = require('express')

const { users } = require('../models');
let router = express.Router();

router.get('/test', (req, res) => {
    users.findAll({
        attributes: [ 'id', 'password']
    })
    .then(result => {
        // res.json({"data":result, test: "test", error: null})
        res.json(result)
    })
    .catch(err => {
        console.error(err);
        res.json({error: null}
    )});
})


module.exports = router;